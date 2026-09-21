// stores/projectStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectService } from '@/services/api'

// ========== CONSTANTS (Centralized) ==========
export const PROJECT_STATUS_ENUM = {
  PLANNING: 'Planning',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold'
}

export const PROJECT_TYPES_ENUM = {
  RESIDENTIAL: 'Residential',
  COMMERCIAL: 'Commercial',
  MIXED_USE: 'Mixed-Use',
  INFRASTRUCTURE: 'Infrastructure',
  RENOVATION: 'Renovation',
  NEW_DEVELOPMENT: 'New Development'
}

export const PROJECT_LOCATIONS_LIST = [
  'Ikoyi, Lagos',
  'Lekki, Lagos',
  'Victoria Island, Lagos',
  'Banana Island, Lagos',
  'Ajah, Lagos',
  'Garki, Abuja',
  'Wuse, Abuja',
  'Maitama, Abuja',
  'Asokoro, Abuja',
  'Port Harcourt',
  'Ibadan',
  'Enugu',
  'Kano',
  'Kaduna'
]

export const useProjectStore = defineStore('project', () => {
  // ========== STATE ==========
  const projects = ref([])
  const searchQuery = ref('')
  const filters = ref({
    status: 'all',
    type: 'all'
  })
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1
  })
  
  const saveToLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('ksa_local_projects', JSON.stringify(projects.value))
      } catch (e) {}
    }
  }

  const loadFromLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('ksa_local_projects')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            projects.value = parsed
            return true
          }
        }
      } catch (e) {}
    }
    return false
  }

  // ========== CRUD OPERATIONS ==========
  const fetchProjects = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await projectService.getProjects(params)
      const data = response?.data || response
      if (Array.isArray(data) && data.length > 0) {
        projects.value = data
        saveToLocalStorage()
        return { success: true, data: projects.value }
      }
      throw new Error('Empty or invalid server response')
    } catch (err) {
      console.warn('Project fetch fallback to local state/storage:', err.message)
      loadFromLocalStorage()
      return { success: true, data: projects.value }
    } finally {
      loading.value = false
    }
  }

  const addProject = async (projectData) => {
    // Validate before submission
    const validationErrors = validateProject(projectData)
    if (validationErrors.length > 0) {
      return { success: false, message: `Validation failed: ${validationErrors.join(', ')}` }
    }

    try {
      const response = await projectService.createProject(projectData)
      const newProj = response?.data || response
      if (newProj && typeof newProj === 'object') {
        projects.value.unshift(newProj)
        saveToLocalStorage()
        return { success: true, data: newProj, message: 'Project added successfully!' }
      }
      throw new Error('Invalid server response')
    } catch (err) {
      const status = err.response?.status
      if (status === 404 || err.code === 'ERR_NETWORK' || !err.response) {
        console.warn('Backend API endpoint unreachable (404/Network). Creating local project fallback.')
        const localProj = {
          id: Date.now(),
          ...projectData,
          budget: Number(projectData.budget) || 0,
          completionPercentage: Number(projectData.completionPercentage) || 0,
          createdAt: new Date().toISOString()
        }
        projects.value.unshift(localProj)
        saveToLocalStorage()
        return { success: true, data: localProj, message: 'Project added successfully!' }
      }

      const message = err.response?.data?.message || err.message || 'Failed to add project'
      console.error('Error adding project:', err)
      return { success: false, message }
    }
  }
  
  const updateProject = async (id, updatedData) => {
    const index = projects.value.findIndex(p => p?.id === id)
    // Validate before submission
    const validationErrors = validateProject(updatedData)
    if (validationErrors.length > 0) {
      return { success: false, message: `Validation failed: ${validationErrors.join(', ')}` }
    }

    try {
      const response = await projectService.updateProject(id, updatedData)
      const updatedProj = response?.data || response
      if (updatedProj && typeof updatedProj === 'object') {
        if (index !== -1) projects.value[index] = updatedProj
        saveToLocalStorage()
        return { success: true, data: updatedProj, message: 'Project updated successfully!' }
      }
      throw new Error('Invalid server response')
    } catch (err) {
      const status = err.response?.status
      if (status === 404 || err.code === 'ERR_NETWORK' || !err.response) {
        console.warn('Backend API endpoint unreachable (404/Network). Updating local project fallback.')
        const mergedProj = { ...(projects.value[index] || {}), ...updatedData, id }
        if (index !== -1) {
          projects.value[index] = mergedProj
        } else {
          projects.value.unshift(mergedProj)
        }
        saveToLocalStorage()
        return { success: true, data: mergedProj, message: 'Project updated successfully!' }
      }

      const message = err.response?.data?.message || err.message || 'Failed to update project'
      console.error('Error updating project:', err)
      return { success: false, message }
    }
  }
  
  const deleteProject = async (id) => {
    try {
      await projectService.deleteProject(id)
    } catch (err) {
      console.warn('Backend delete project API unreachable. Removing locally.')
    } finally {
      projects.value = projects.value.filter(p => p?.id !== id)
      saveToLocalStorage()
      return { success: true, message: 'Project deleted!' }
    }
  }
  
  const deleteAllProjects = async () => ({ success: false, message: 'Bulk delete is disabled.' })
  
  // ========== GETTERS / COMPUTED ==========
  const totalProjects = computed(() => projects.value.length)
  
  const featuredProjects = computed(() => 
    projects.value.filter(p => p && p.featured === true)
  )
  
  const activeProjects = computed(() => 
    projects.value.filter(p => p && p.status === PROJECT_STATUS_ENUM.IN_PROGRESS)
  )
  
  const completedProjects = computed(() => 
    projects.value.filter(p => p && p.status === PROJECT_STATUS_ENUM.COMPLETED)
  )
  
  const filteredProjects = computed(() => {
    let filtered = [...projects.value].filter(p => p) // Filter out null/undefined
    
    // Search filter
    if (searchQuery.value?.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(query) ||
        p.location?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      )
    }
    
    // Status filter
    if (filters.value.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.value.status)
    }
    
    // Type filter
    if (filters.value.type !== 'all') {
      filtered = filtered.filter(p => p.type === filters.value.type)
    }
    
    return filtered
  })
  
  const getProjectById = (id) => {
    return projects.value.find(p => p?.id === id) || null
  }
  
  // ========== UTILITY FUNCTIONS ==========
  const formatBudget = (budget) => {
    if (!budget && budget !== 0) return 'Budget not set'
    if (budget >= 1000000000) return `₦${(budget / 1000000000).toFixed(2)}B`
    if (budget >= 1000000) return `₦${(budget / 1000000).toFixed(1)}M`
    if (budget >= 1000) return `₦${(budget / 1000).toFixed(1)}K`
    return `₦${budget.toLocaleString()}`
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const getStatusColor = (status) => {
    const colors = {
      [PROJECT_STATUS_ENUM.PLANNING]: 'blue',
      [PROJECT_STATUS_ENUM.IN_PROGRESS]: 'yellow',
      [PROJECT_STATUS_ENUM.COMPLETED]: 'green',
      [PROJECT_STATUS_ENUM.ON_HOLD]: 'orange'
    }
    return colors[status] || 'gray'
  }
  
  const validateProject = (data) => {
    if (!data) return ['Project data is required']
    
    const errors = []
    
    if (!data.title || data.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters')
    }
    
    if (!data.location) {
      errors.push('Location is required')
    }
    
    if (!data.status) {
      errors.push('Status is required')
    }
    
    if (!data.type) {
      errors.push('Project type is required')
    }
    
    if (typeof data.completionPercentage !== 'undefined') {
      if (data.completionPercentage < 0 || data.completionPercentage > 100) {
        errors.push('Completion percentage must be between 0 and 100')
      }
    }
    
    return errors
  }
  
  // ========== INITIALIZE (with error handling) ==========
  const initializeStore = async () => {
    try {
      await fetchProjects()
    } catch (err) {
      console.error('Failed to initialize project store:', err)
      error.value = 'Failed to load projects on startup'
    }
  }
  
  // Initialize async
  initializeStore()
  
  // ========== RETURN ==========
  return {
    // State
    projects,
    searchQuery,
    filters,
    pagination,
    loading,
    error,
    
    // Constants
    PROJECT_STATUS: Object.values(PROJECT_STATUS_ENUM).map((value) => ({
      value,
      label: value,
      color: getStatusColor(value)
    })),
    PROJECT_TYPES: Object.values(PROJECT_TYPES_ENUM),
    NIGERIAN_LOCATIONS: PROJECT_LOCATIONS_LIST,
    
    // Actions
    addProject,
    createProject: addProject,
    updateProject,
    deleteProject,
    deleteAllProjects,
    loadFromLocalStorage,
    saveToLocalStorage,
    fetchProjects,
    
    // Getters
    totalProjects,
    featuredProjects,
    activeProjects,
    completedProjects,
    filteredProjects,
    getProjectById,
    
    // Utilities
    formatBudget,
    formatDate,
    getStatusColor,
    validateProject
  }
})
