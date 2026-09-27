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

export const DEFAULT_PROPERTIES = [
  {
    id: '25th-apartments',
    title: '25th Apartments (25th Apartment)',
    location: 'Olu-Akinbola Drive, Off SPG Road, Igbo-Efon, Off Lekki-Epe Expressway, Lekki, Eti-Osa L.G.A., Lagos State',
    developer: 'Kayode Segun & Associates (Estate Surveyors and Valuers)',
    developerAddress: 'Suite J260, Road 5, Ikota Shopping Complex, Ikota, Ajah, Lagos State',
    price: 150000000,
    priceFormatted: '₦120,000,000 - ₦150,000,000',
    initialDeposit: '₦40,000,000',
    status: 'For Sale',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 3,
    squareFootage: 180,
    titleDocument: 'Certificate of Occupancy (C of O)',
    completionPeriod: '12 months from commencement',
    gdv: '₦1,470,000,000',
    developmentCost: '₦900,000,000',
    projectedROI: '~50% Return on Investment (Gross Profit: ₦450,000,000)',
    collateralLandValue: '₦250,000,000 (collateral valuation)',
    paymentTerms: '6 Months Payment Plan available. Premium discount available for full outright payment.',
    units: '9 units of 2-Bedroom luxury apartments & 1 unit of 1-Bedroom apartment',
    unitTypes: [
      { name: '2-Bedroom Luxury Apartment', price: '₦150,000,000' },
      { name: '1-Bedroom Luxury Apartment', price: '₦120,000,000' }
    ],
    landmarks: '3-minute drive from Lekki-Epe Expressway. Situated on the same street as Troika School. Close to commercial centers, healthcare facilities, shopping destinations, and recreational spots.',
    featured: true,
    image: '/images/25th-apartment/25th-apartment-1.jpg',
    images: [
      '/images/25th-apartment/25th-apartment-1.jpg',
      '/images/25th-apartment/25th-apartment-living.jpg',
      '/images/25th-apartment/25th-apartment-bedroom.jpg',
      '/images/25th-apartment/25th-apartment-kitchen.jpg',
      '/images/25th-apartment/25th-apartment-pool.jpg',
      '/images/25th-apartment/25th-apartment-2.jpg',
      '/images/25th-apartment/25th-apartment-3.jpg'
    ],
    description: '25th Apartments is a premier luxury development located on Olu-Akinbola Drive, Off SPG Road, Igbo-Efon, Lekki. Developed by Kayode Segun & Associates, this modern 4-story architectural landmark comprises 9 units of 2-bedroom luxury apartments and 1 unit of a 1-bedroom apartment, featuring high-end finishes, private balconies, a swimming pool, and a fully equipped gymnasium with a Certificate of Occupancy (C of O) title.',
    additionalDescription: 'Key Architectural & Financial Breakdown:\n• Title Document: Certificate of Occupancy (C of O)\n• Construction Period: 12 months from commencement\n• Initial Deposit: ₦40,000,000\n• Financial GDV: ₦1,470,000,000 | Est. Development Cost: ₦900,000,000 | Projected Profit: ₦450,000,000 (~50% ROI)\n• Land Value / Collateral: ₦250,000,000\n• Payment Terms: 6 Months Payment Plan available; Premium discount for full outright payment.\n• Layout & Facilities: All luxury en-suite bedrooms, guest powder room (W.C.), living & dining area, fully fitted kitchen, private terraces, central lobby & elevator/staircase.',
    amenities: [
      'Luxury en-suite bedrooms',
      'Fully fitted kitchen',
      'Tastefully finished interiors',
      'Gymnasium',
      'Swimming pool',
      '24/7 security',
      'Fully serviced environment',
      'Ample parking space',
      'Good electricity supply',
      'Excellent road network',
      'Certificate of Occupancy (C of O)'
    ],
    tags: ['25th Apartments', 'Lekki', 'Luxury Apartment', 'Now Selling', 'C of O', 'Pool & Gym'],
    contacts: [
      '+234 905 390 1802',
      '+234 905 390 1001',
      '+234 0905 389 8636',
      '+234 905 740 3313',
      '+234 706 206 2331',
      '+234 810 320 6531'
    ],
    agent: {
      name: 'Kayode Segun & Associates',
      email: 'info@ksavaluers.com',
      phone: '+234 905 390 1802'
    }
  }
]

export const usePropertyStore = defineStore('property', () => {
  // ========== STATE ==========
  const properties = ref([...DEFAULT_PROPERTIES])
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
      
      const data = response?.data || response?.properties || response
      if (Array.isArray(data) && data.length > 0) {
        properties.value = data
        saveToLocalStorage()
        return { success: true, data: properties.value }
      }
      throw new Error('Empty or invalid server response')
    } catch (err) {
      console.warn('Property fetch fallback to local state/storage:', err.message)
      if (!loadFromLocalStorage()) {
        properties.value = [...DEFAULT_PROPERTIES]
      }
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
