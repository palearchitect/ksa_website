// stores/properties.js
// This is optional - you can keep everything in propertyStore.js
// But if you want separate constants/helpers, here they are:

// Property status options with colors
export const PROPERTY_STATUS = [
  { value: 'For Sale', label: 'For Sale', color: 'green', bgColor: '#e8f5e8' },
  { value: 'For Rent', label: 'For Rent', color: 'blue', bgColor: '#e3f2fd' },
  { value: 'Sold', label: 'Sold', color: 'purple', bgColor: '#f3e5f5' },
  { value: 'Rented', label: 'Rented', color: 'orange', bgColor: '#fff3e0' },
  { value: 'Pending', label: 'Pending', color: 'yellow', bgColor: '#fffde7' }
]

// Property types
export const PROPERTY_TYPES = [
  'Apartment',
  'House',
  'Villa',
  'Duplex',
  'Townhouse',
  'Commercial',
  'Land',
  'Penthouse',
  'Studio',
  'Bungalow'
]

// Nigerian locations
export const NIGERIAN_LOCATIONS = [
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
  'Kaduna',
  'Benin City'
]

// Property features/tags
export const PROPERTY_FEATURES = [
  'Swimming Pool',
  'Garden',
  'Security',
  'Parking',
  'Furnished',
  'Gym',
  'Elevator',
  'Waterfront',
  'Balcony',
  'Fireplace',
  'Pet Friendly',
  'Smart Home'
]

// Bedroom options
export const BEDROOM_OPTIONS = [
  { value: 1, label: '1 Bedroom' },
  { value: 2, label: '2 Bedrooms' },
  { value: 3, label: '3 Bedrooms' },
  { value: 4, label: '4 Bedrooms' },
  { value: 5, label: '5+ Bedrooms' }
]

// Price ranges (in millions)
export const PRICE_RANGES = [
  { min: 0, max: 50, label: 'Under ₦50M' },
  { min: 50, max: 100, label: '₦50M - ₦100M' },
  { min: 100, max: 200, label: '₦100M - ₦200M' },
  { min: 200, max: 500, label: '₦200M - ₦500M' },
  { min: 500, max: null, label: '₦500M+' }
]

// Format price in Nigerian Naira
export const formatPrice = (price) => {
  if (!price && price !== 0) return 'Price not set'
  
  if (price >= 1000000000) {
    return `₦${(price / 1000000000).toFixed(2)}B`
  } else if (price >= 1000000) {
    return `₦${(price / 1000000).toFixed(1)}M`
  } else if (price >= 1000) {
    return `₦${(price / 1000).toFixed(1)}K`
  }
  return `₦${price.toLocaleString()}`
}

// Format date nicely
export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`
  }
  
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Get status color class
export const getStatusColor = (status) => {
  const colors = {
    'For Sale': 'text-green-700 bg-green-100',
    'For Rent': 'text-blue-700 bg-blue-100',
    'Sold': 'text-purple-700 bg-purple-100',
    'Rented': 'text-orange-700 bg-orange-100',
    'Pending': 'text-yellow-700 bg-yellow-100'
  }
  return colors[status] || 'text-gray-700 bg-gray-100'
}

// Default property image if none provided
export const getDefaultPropertyImage = () => {
  const images = [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9e6e87b2d7d7?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=400&fit=crop'
  ]
  return images[Math.floor(Math.random() * images.length)]
}

// Validate property form data
export const validatePropertyForm = (data) => {
  const errors = {}
  
  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters'
  }
  
  if (!data.location) {
    errors.location = 'Location is required'
  }
  
  if (!data.price || data.price <= 0) {
    errors.price = 'Price must be greater than 0'
  }
  
  if (!data.status) {
    errors.status = 'Status is required'
  }
  
  if (data.bedrooms && data.bedrooms < 0) {
    errors.bedrooms = 'Bedrooms cannot be negative'
  }
  
  if (data.bathrooms && data.bathrooms < 0) {
    errors.bathrooms = 'Bathrooms cannot be negative'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Generate a unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Export everything
export default {
  PROPERTY_STATUS,
  PROPERTY_TYPES,
  NIGERIAN_LOCATIONS,
  PROPERTY_FEATURES,
  BEDROOM_OPTIONS,
  PRICE_RANGES,
  formatPrice,
  formatDate,
  getStatusColor,
  getDefaultPropertyImage,
  validatePropertyForm,
  generateId
}