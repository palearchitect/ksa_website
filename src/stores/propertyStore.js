// stores/propertyStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { propertyService } from '@/services/api'

export const usePropertyStore = defineStore('property', () => {
  // ========== STATE ==========
  const properties = ref([])
  const searchQuery = ref('')
  const filters = ref({
    status: 'all',
    minPrice: null,
    maxPrice: null,
    type: 'all'
  })
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1
  })
  
  // ========== CONSTANTS ==========
  const PROPERTY_STATUS = [
    { value: 'For Sale', label: 'For Sale', color: 'success' },
    { value: 'For Rent', label: 'For Rent', color: 'info' },
    { value: 'Sold', label: 'Sold', color: 'warning' },
    { value: 'Rented', label: 'Rented', color: 'warning' }
  ]
  
  const PROPERTY_TYPES = [
    'Apartment', 'House', 'Villa', 'Duplex', 
    'Townhouse', 'Commercial', 'Land', 'Penthouse'
  ]
  
  const NIGERIAN_LOCATIONS = [
    'Ikoyi, Lagos', 'Lekki, Lagos', 'Victoria Island, Lagos', 
    'Banana Island, Lagos', 'Garki, Abuja', 'Wuse, Abuja', 
    'Maitama, Abuja', 'Port Harcourt', 'Ibadan'
  ]
  
  const loading = ref(false)
  const error = ref(null)
  
  // ========== CRUD OPERATIONS ==========
  const fetchProperties = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await propertyService.getProperties(params)
      properties.value = response.data || []
      pagination.value = response.pagination || {
        total: properties.value.length,
        page: 1,
        limit: 100000,
        pages: 1
      }
      return { success: true, data: properties.value }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch properties'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const addProperty = async (propertyData) => {
    try {
      const response = await propertyService.createProperty(propertyData)
      properties.value.unshift(response.data)
      return { success: true, data: response.data, message: 'Property published successfully!' }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create property' }
    }
  }
  
  const updateProperty = async (id, updatedData) => {
    const index = properties.value.findIndex(p => p.id === id)
    try {
      const response = await propertyService.updateProperty(id, updatedData)
      if (index !== -1) {
        properties.value[index] = response.data
      }
      return { success: true, data: response.data, message: 'Property updated successfully!' }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update property' }
    }
  }
  
  const deleteProperty = async (id) => {
    try {
      await propertyService.deleteProperty(id)
      properties.value = properties.value.filter(p => p.id !== id)
      return { success: true, message: 'Property deleted!' }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete property' }
    }
  }
  
  const deleteAllProperties = async () => ({ success: false, message: 'Bulk delete is disabled.' })
  const saveToLocalStorage = () => undefined
  const loadFromLocalStorage = () => undefined
  
  // ========== GETTERS / COMPUTED ==========
  const totalProperties = computed(() => properties.value.length)
  
  const featuredProperties = computed(() => 
    properties.value.filter(p => p.featured)
  )
  
  const propertiesForSale = computed(() => 
    properties.value.filter(p => ['For Sale', 'sale'].includes(p.status))
  )
  
  const propertiesForRent = computed(() => 
    properties.value.filter(p => ['For Rent', 'rent'].includes(p.status))
  )
  
  const filteredProperties = computed(() => {
    let filtered = [...properties.value]
    
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
    
    // Price filters
    if (filters.value.minPrice) {
      filtered = filtered.filter(p => p.price >= filters.value.minPrice)
    }
    
    if (filters.value.maxPrice) {
      filtered = filtered.filter(p => p.price <= filters.value.maxPrice)
    }
    
    return filtered
  })
  
  const getPropertyById = (id) => {
    return properties.value.find(p => p.id === id)
  }
  
  // ========== UTILITY FUNCTIONS ==========
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Price not set'
    if (price >= 1000000) return `₦${(price / 1000000).toFixed(1)}M`
    if (price >= 1000) return `₦${(price / 1000).toFixed(1)}K`
    return `₦${price.toLocaleString()}`
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
      'For Sale': 'green',
      'For Rent': 'blue',
      'Sold': 'purple',
      'Rented': 'orange'
    }
    return colors[status] || 'gray'
  }
  
  const validateProperty = (data) => {
    const errors = []
    
    if (!data.title || data.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters')
    }
    
    if (!data.location) {
      errors.push('Location is required')
    }
    
    if (!data.price || data.price <= 0) {
      errors.push('Price must be greater than 0')
    }
    
    if (!data.status) {
      errors.push('Status is required')
    }
    
    return errors
  }
  
  // ========== INITIALIZE ==========
  fetchProperties()
  
  // ========== RETURN ==========
  return {
    // State
    properties,
    searchQuery,
    filters,
    pagination,
    
    // Constants
    PROPERTY_STATUS,
    PROPERTY_TYPES,
    NIGERIAN_LOCATIONS,
    
    // Actions
    addProperty,
    updateProperty,
    deleteProperty,
    deleteAllProperties,
    loadFromLocalStorage,
    saveToLocalStorage,
    fetchProperties,
    loading,
    error,
    
    // Getters
    totalProperties,
    featuredProperties,
    propertiesForSale,
    propertiesForRent,
    filteredProperties,
    getPropertyById,
    
    // Utilities
    formatPrice,
    formatDate,
    getStatusColor,
    validateProperty
  }
})
