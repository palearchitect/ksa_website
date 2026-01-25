// stores/propertyStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  
  // ========== INITIAL SAMPLE DATA ==========
  const initSampleData = () => {
    properties.value = [
      {
        id: 1,
        title: 'Luxury Modern Apartment in Ikoyi',
        location: 'Ikoyi, Lagos',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
        price: 450000000,
        status: 'For Sale',
        type: 'Apartment',
        bedrooms: 4,
        bathrooms: 3,
        squareFootage: 5500,
        description: 'Premium waterfront apartment with modern amenities. Spacious living area with panoramic views.',
        featured: true,
        tags: ['luxury', 'waterfront', 'modern'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Beautiful Family House in Lekki',
        location: 'Lekki, Lagos',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
        price: 85000000,
        status: 'For Rent',
        type: 'House',
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 4200,
        description: 'Spacious family home in prestigious Lekki estate. Perfect for family living.',
        featured: false,
        tags: ['family', 'spacious', 'estate'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    saveToLocalStorage()
  }
  
  // ========== CRUD OPERATIONS ==========
  const addProperty = (propertyData) => {
    const newId = properties.value.length > 0 
      ? Math.max(...properties.value.map(p => p.id)) + 1 
      : 1
    
    const newProperty = {
      id: newId,
      ...propertyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      featured: propertyData.featured || false,
      tags: propertyData.tags || [],
      type: propertyData.type || 'House'
    }
    
    properties.value.unshift(newProperty) // Add to beginning
    saveToLocalStorage()
    
    return { 
      success: true, 
      data: newProperty, 
      message: '✅ Property published successfully!' 
    }
  }
  
  const updateProperty = (id, updatedData) => {
    const index = properties.value.findIndex(p => p.id === id)
    
    if (index === -1) {
      return { success: false, message: '❌ Property not found' }
    }
    
    properties.value[index] = {
      ...properties.value[index],
      ...updatedData,
      updatedAt: new Date().toISOString()
    }
    
    saveToLocalStorage()
    return { 
      success: true, 
      data: properties.value[index], 
      message: '✅ Property updated successfully!' 
    }
  }
  
  const deleteProperty = (id) => {
    const initialLength = properties.value.length
    properties.value = properties.value.filter(p => p.id !== id)
    
    if (properties.value.length < initialLength) {
      saveToLocalStorage()
      return { success: true, message: '✅ Property deleted!' }
    }
    
    return { success: false, message: '❌ Property not found' }
  }
  
  const deleteAllProperties = () => {
    properties.value = []
    localStorage.removeItem('propertyManager_properties')
    return { success: true, message: '✅ All properties cleared!' }
  }
  
  // ========== LOCAL STORAGE ==========
  const saveToLocalStorage = () => {
    localStorage.setItem('propertyManager_properties', JSON.stringify(properties.value))
  }
  
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('propertyManager_properties')
    if (saved) {
      try {
        properties.value = JSON.parse(saved)
      } catch (error) {
        console.error('Error loading from localStorage:', error)
        properties.value = []
      }
    }
  }
  
  // ========== GETTERS / COMPUTED ==========
  const totalProperties = computed(() => properties.value.length)
  
  const featuredProperties = computed(() => 
    properties.value.filter(p => p.featured)
  )
  
  const propertiesForSale = computed(() => 
    properties.value.filter(p => p.status === 'For Sale')
  )
  
  const propertiesForRent = computed(() => 
    properties.value.filter(p => p.status === 'For Rent')
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
  loadFromLocalStorage()
  if (properties.value.length === 0) {
    initSampleData()
  }
  
  // ========== RETURN ==========
  return {
    // State
    properties,
    searchQuery,
    filters,
    
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
    initSampleData,
    
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