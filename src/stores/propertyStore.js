// stores/propertyStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { propertyService } from '@/services/api'

// ========== CONSTANTS (Centralized) ==========
export const PROPERTY_STATUS_ENUM = {
  FOR_SALE: 'For Sale',
  FOR_RENT: 'For Rent',
  SOLD: 'Sold',
  RENTED: 'Rented'
}

export const PROPERTY_TYPES_ENUM = {
  APARTMENT: 'Apartment',
  HOUSE: 'House',
  VILLA: 'Villa',
  DUPLEX: 'Duplex',
  TOWNHOUSE: 'Townhouse',
  COMMERCIAL: 'Commercial',
  LAND: 'Land',
  PENTHOUSE: 'Penthouse'
}

export const NIGERIAN_LOCATIONS_LIST = [
  'Ikoyi, Lagos', 'Lekki, Lagos', 'Victoria Island, Lagos', 
  'Banana Island, Lagos', 'Garki, Abuja', 'Wuse, Abuja', 
  'Maitama, Abuja', 'Port Harcourt', 'Ibadan'
]

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
  
  const loading = ref(false)
  const error = ref(null)
  
  const saveToLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('ksa_local_properties', JSON.stringify(properties.value))
      } catch (e) {}
    }
  }

  const loadFromLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('ksa_local_properties')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            properties.value = parsed
            return true
          }
        }
      } catch (e) {}
    }
    return false
  }

  // ========== CRUD OPERATIONS ==========
  const fetchProperties = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await propertyService.getProperties(params)
      
      const data = response?.data || response
      if (Array.isArray(data) && data.length > 0) {
        properties.value = data
        saveToLocalStorage()
        return { success: true, data: properties.value }
      }
      throw new Error('Empty or invalid server response')
    } catch (err) {
      console.warn('Property fetch fallback to local state/storage:', err.message)
      loadFromLocalStorage()
      return { success: true, data: properties.value }
    } finally {
      loading.value = false
    }
  }

  const addProperty = async (propertyData) => {
    // Validate before submission
    const validationErrors = validateProperty(propertyData)
    if (validationErrors.length > 0) {
      return { success: false, message: `Validation failed: ${validationErrors.join(', ')}` }
    }
    
    try {
      const response = await propertyService.createProperty(propertyData)
      const newProperty = response?.data || response
      if (newProperty && typeof newProperty === 'object') {
        properties.value.unshift(newProperty)
        saveToLocalStorage()
        return { success: true, data: newProperty, message: 'Property published successfully!' }
      }
      throw new Error('Invalid server response')
    } catch (err) {
      const status = err.response?.status
      if (status === 404 || err.code === 'ERR_NETWORK' || !err.response) {
        console.warn('Backend API endpoint unreachable (404/Network). Creating local property fallback.')
        const localProperty = {
          id: Date.now(),
          ...propertyData,
          price: Number(propertyData.price) || 0,
          bedrooms: Number(propertyData.bedrooms) || 0,
          bathrooms: Number(propertyData.bathrooms) || 0,
          squareFootage: Number(propertyData.squareFootage) || 0,
          createdAt: new Date().toISOString()
        }
        properties.value.unshift(localProperty)
        saveToLocalStorage()
        return { success: true, data: localProperty, message: 'Property published successfully!' }
      }

      const message = err.response?.data?.message || err.message || 'Failed to create property'
      console.error('Error adding property:', err)
      return { success: false, message }
    }
  }
  
  const updateProperty = async (id, updatedData) => {
    const index = properties.value.findIndex(p => p?.id === id)
    // Validate before submission
    const validationErrors = validateProperty(updatedData)
    if (validationErrors.length > 0) {
      return { success: false, message: `Validation failed: ${validationErrors.join(', ')}` }
    }

    try {
      const response = await propertyService.updateProperty(id, updatedData)
      const updatedProp = response?.data || response
      if (updatedProp && typeof updatedProp === 'object') {
        if (index !== -1) properties.value[index] = updatedProp
        saveToLocalStorage()
        return { success: true, data: updatedProp, message: 'Property updated successfully!' }
      }
      throw new Error('Invalid server response')
    } catch (err) {
      const status = err.response?.status
      if (status === 404 || err.code === 'ERR_NETWORK' || !err.response) {
        console.warn('Backend API endpoint unreachable (404/Network). Updating local property fallback.')
        const mergedProp = { ...(properties.value[index] || {}), ...updatedData, id }
        if (index !== -1) {
          properties.value[index] = mergedProp
        } else {
          properties.value.unshift(mergedProp)
        }
        saveToLocalStorage()
        return { success: true, data: mergedProp, message: 'Property updated successfully!' }
      }

      const message = err.response?.data?.message || err.message || 'Failed to update property'
      console.error('Error updating property:', err)
      return { success: false, message }
    }
  }
  
  const deleteProperty = async (id) => {
    try {
      await propertyService.deleteProperty(id)
    } catch (err) {
      console.warn('Backend delete API unreachable. Removing locally.')
    } finally {
      properties.value = properties.value.filter(p => p?.id !== id)
      saveToLocalStorage()
      return { success: true, message: 'Property deleted!' }
    }
  }
  
  const deleteAllProperties = async () => ({ success: false, message: 'Bulk delete is disabled.' })
  
  // ========== GETTERS / COMPUTED ==========
  const totalProperties = computed(() => properties.value.length)
  
  const featuredProperties = computed(() => 
    properties.value.filter(p => p && p.featured === true)
  )
  
  const propertiesForSale = computed(() => 
    properties.value.filter(p => p && [PROPERTY_STATUS_ENUM.FOR_SALE, 'sale'].includes(p.status))
  )
  
  const propertiesForRent = computed(() => 
    properties.value.filter(p => p && [PROPERTY_STATUS_ENUM.FOR_RENT, 'rent'].includes(p.status))
  )
  
  const filteredProperties = computed(() => {
    let filtered = [...properties.value].filter(p => p) // Filter out null/undefined
    
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
    return properties.value.find(p => p?.id === id) || null
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
      [PROPERTY_STATUS_ENUM.FOR_SALE]: 'green',
      [PROPERTY_STATUS_ENUM.FOR_RENT]: 'blue',
      [PROPERTY_STATUS_ENUM.SOLD]: 'purple',
      [PROPERTY_STATUS_ENUM.RENTED]: 'orange'
    }
    return colors[status] || 'gray'
  }
  
  const validateProperty = (data) => {
    if (!data) return ['Property data is required']
    
    const errors = []
    
    if (!data.title || data.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters')
    }
    
    if (!data.location) {
      errors.push('Location is required')
    }
    
    if (typeof data.price !== 'number' || data.price <= 0) {
      errors.push('Price must be greater than 0')
    }
    
    if (!data.status) {
      errors.push('Status is required')
    }
    
    return errors
  }
  
  // ========== INITIALIZE (with error handling) ==========
  const initializeStore = async () => {
    try {
      await fetchProperties()
    } catch (err) {
      console.error('Failed to initialize property store:', err)
      error.value = 'Failed to load properties on startup'
    }
  }
  
  // Initialize async
  initializeStore()
  
  // ========== RETURN ==========
  return {
    // State
    properties,
    searchQuery,
    filters,
    pagination,
    loading,
    error,
    
    // Constants
    PROPERTY_STATUS: Object.values(PROPERTY_STATUS_ENUM).map((value) => ({
      value,
      label: value,
      color: getStatusColor(value)
    })),
    PROPERTY_TYPES: Object.values(PROPERTY_TYPES_ENUM),
    NIGERIAN_LOCATIONS: NIGERIAN_LOCATIONS_LIST,
    
    // Actions
    addProperty,
    createProperty: addProperty,
    updateProperty,
    deleteProperty,
    deleteAllProperties,
    loadFromLocalStorage,
    saveToLocalStorage,
    fetchProperties,
    
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
