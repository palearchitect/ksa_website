// stores/projectStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectService } from '@/services/api'

export const useProjectStore = defineStore('project', () => {
  // ========== STATE ==========
  const projects = ref([])
  const searchQuery = ref('')
  const filters = ref({
    status: 'all',
    type: 'all'
  })
  
  // ========== CONSTANTS ==========
  const PROJECT_STATUS = [
    { value: 'Planning', label: 'Planning', color: 'blue' },
    { value: 'In Progress', label: 'In Progress', color: 'yellow' },
    { value: 'Completed', label: 'Completed', color: 'green' },
    { value: 'On Hold', label: 'On Hold', color: 'orange' }
  ]
  
  const PROJECT_TYPES = [
    'Residential',
    'Commercial',
    'Mixed-Use',
    'Infrastructure',
    'Renovation',
    'New Development'
  ]
  
  const NIGERIAN_LOCATIONS = [
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
  
  const loading = ref(false)
  
  // ========== CRUD OPERATIONS ==========
  const fetchProjects = async () => {
    loading.value = true
    try {
      const response = await projectService.getProjects()
      projects.value = response.data || []
      return { success: true, data: projects.value }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to fetch projects' }
    } finally {
      loading.value = false
    }
  }

  const addProject = async (projectData) => {
    try {
      const response = await projectService.createProject(projectData)
      projects.value.unshift(response.data)
      return { success: true, data: response.data, message: 'Project added successfully!' }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add project' }
    }
  }
  
  const updateProject = async (id, updatedData) => {
    const index = projects.value.findIndex(p => p.id === id)
    try {
      const response = await projectService.updateProject(id, updatedData)
      if (index !== -1) projects.value[index] = response.data
      return { success: true, data: response.data, message: 'Project updated successfully!' }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update project' }
    }
  }
  
  const deleteProject = async (id) => {
    try {
      await projectService.deleteProject(id)
      projects.value = projects.value.filter(p => p.id !== id)
      return { success: true, message: 'Project deleted!' }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete project' }
    }
  }
  
  const deleteAllProjects = async () => ({ success: false, message: 'Bulk delete is disabled.' })
  const saveToLocalStorage = () => undefined
  const loadFromLocalStorage = () => undefined
  
  // ========== GETTERS / COMPUTED ==========
  const totalProjects = computed(() => projects.value.length)
  
  const featuredProjects = computed(() => 
    projects.value.filter(p => p.featured)
  )
  
  const activeProjects = computed(() => 
    projects.value.filter(p => p.status === 'In Progress')
  )
  
  const completedProjects = computed(() => 
    projects.value.filter(p => p.status === 'Completed')
  )
  
  const filteredProjects = computed(() => {
    let filtered = [...projects.value]
    
    // Search filter
    if (searchQuery.value.trim()) {
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
    return projects.value.find(p => p.id === id)
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
      'Planning': 'blue',
      'In Progress': 'yellow',
      'Completed': 'green',
      'On Hold': 'orange'
    }
    return colors[status] || 'gray'
  }
  
  const validateProject = (data) => {
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
    
    return errors
  }
  
  // ========== INITIALIZE ==========
  fetchProjects()
  
  // ========== RETURN ==========
  return {
    // State
    projects,
    searchQuery,
    filters,
    
    // Constants
    PROJECT_STATUS,
    PROJECT_TYPES,
    NIGERIAN_LOCATIONS,
    
    // Actions
    addProject,
    updateProject,
    deleteProject,
    deleteAllProjects,
    loadFromLocalStorage,
    saveToLocalStorage,
    fetchProjects,
    loading,
    
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
