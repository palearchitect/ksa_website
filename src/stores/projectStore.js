// stores/projectStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  
  // ========== INITIAL SAMPLE DATA ==========
  const initSampleData = () => {
    projects.value = [
      {
        id: 1,
        title: 'Luxury Waterfront Estate - Banana Island',
        location: 'Banana Island, Lagos',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop',
        description: 'Premium waterfront development featuring 50 luxury apartments with world-class amenities including infinity pool, gym, and private marina.',
        status: 'In Progress',
        type: 'Residential',
        totalUnits: 50,
        completionPercentage: 65,
        startDate: '2024-01-15',
        expectedCompletion: '2026-06-30',
        budget: 15000000000,
        featured: true,
        amenities: ['Swimming Pool', 'Gym', 'Marina', 'Security', '24/7 Power'],
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Modern Commercial Hub - Victoria Island',
        location: 'Victoria Island, Lagos',
        image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=500&fit=crop',
        description: 'State-of-the-art commercial complex with office spaces, retail outlets, and conference facilities.',
        status: 'In Progress',
        type: 'Commercial',
        totalUnits: 120,
        completionPercentage: 40,
        startDate: '2024-03-01',
        expectedCompletion: '2026-12-31',
        budget: 25000000000,
        featured: true,
        amenities: ['Conference Rooms', 'Parking', 'Security', 'High-speed Internet'],
        createdAt: new Date('2024-03-01').toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    saveToLocalStorage()
  }
  
  // ========== CRUD OPERATIONS ==========
  const addProject = (projectData) => {
    const newId = projects.value.length > 0 
      ? Math.max(...projects.value.map(p => p.id)) + 1 
      : 1
    
    const newProject = {
      id: newId,
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      featured: projectData.featured || false,
      amenities: projectData.amenities || [],
      completionPercentage: projectData.completionPercentage || 0
    }
    
    projects.value.unshift(newProject)
    saveToLocalStorage()
    
    return { 
      success: true, 
      data: newProject, 
      message: '✅ Project added successfully!' 
    }
  }
  
  const updateProject = (id, updatedData) => {
    const index = projects.value.findIndex(p => p.id === id)
    
    if (index === -1) {
      return { success: false, message: '❌ Project not found' }
    }
    
    projects.value[index] = {
      ...projects.value[index],
      ...updatedData,
      updatedAt: new Date().toISOString()
    }
    
    saveToLocalStorage()
    return { 
      success: true, 
      data: projects.value[index], 
      message: '✅ Project updated successfully!' 
    }
  }
  
  const deleteProject = (id) => {
    const initialLength = projects.value.length
    projects.value = projects.value.filter(p => p.id !== id)
    
    if (projects.value.length < initialLength) {
      saveToLocalStorage()
      return { success: true, message: '✅ Project deleted!' }
    }
    
    return { success: false, message: '❌ Project not found' }
  }
  
  const deleteAllProjects = () => {
    projects.value = []
    localStorage.removeItem('projectManager_projects')
    return { success: true, message: '✅ All projects cleared!' }
  }
  
  // ========== LOCAL STORAGE ==========
  const saveToLocalStorage = () => {
    localStorage.setItem('projectManager_projects', JSON.stringify(projects.value))
  }
  
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('projectManager_projects')
    if (saved) {
      try {
        projects.value = JSON.parse(saved)
      } catch (error) {
        console.error('Error loading projects from localStorage:', error)
        projects.value = []
      }
    }
  }
  
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
  loadFromLocalStorage()
  if (projects.value.length === 0) {
    initSampleData()
  }
  
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
    initSampleData,
    
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
