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
  
  const loading = ref(false)
  const error = ref(null)
  
  // ========== CRUD OPERATIONS ==========
  const fetchProjects = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await projectService.getProjects()
      
      // Validate response structure
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response structure from server')
      }
      
      const data = response.data || response
      
      // Ensure we have an array
      if (!Array.isArray(data)) {
        console.warn('Projects response was not an array, converting to empty array')
        projects.value = []
        return { success: false, message: 'Invalid server response format' }
      }
      
      projects.value = data
      return { success: true, data: projects.value }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch projects'
      error.value = errorMessage
      console.error('Error fetching projects:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const addProject = async (projectData) => {
    try {
      // Validate before submission
      const validationErrors = validateProject(projectData)
      if (validationErrors.length > 0) {
        return { success: false, message: `Validation failed: ${validationErrors.join(', ')}` }
      }
      
      const response = await projectService.createProject(projectData)
      
      // Validate response
      if (!response?.data) {
        throw new Error('Invalid server response')
      }
      
      projects.value.unshift(response.data)
      return { success: true, data: response.data, message: 'Project added successfully!' }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to add project'
      console.error('Error adding project:', err)
      return { success: false, message }
    }
  }
  
  const updateProject = async (id, updatedData) => {
    const index = projects.value.findIndex(p => p?.id === id)
    try {
      // Validate before submission
      const validationErrors = validateProject(updatedData)
      if (validationErrors.length > 0) {
        return { success: false, message: `Validation failed: ${validationErrors.join(', ')}` }
      }
      
      const response = await projectService.updateProject(id, updatedData)
      
      // Validate response
      if (!response?.data) {
        throw new Error('Invalid server response')
      }
      
      if (index !== -1) projects.value[index] = response.data
      return { success: true, data: response.data, message: 'Project updated successfully!' }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update project'
      console.error('Error updating project:', err)
      return { success: false, message }
    }
  }
  
  const deleteProject = async (id) => {
    try {
      await projectService.deleteProject(id)
      projects.value = projects.value.filter(p => p?.id !== id)
      return { success: true, message: 'Project deleted!' }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete project'
      console.error('Error deleting project:', err)
      return { success: false, message }
    }
  }
  
  const deleteAllProjects = async () => ({ success: false, message: 'Bulk delete is disabled.' })
  const saveToLocalStorage = () => undefined
  const loadFromLocalStorage = () => undefined
  
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
