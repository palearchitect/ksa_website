// stores/admin.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  // ========== STATE ==========
  const isAdding = ref(false)
  const isEditing = ref(false)
  const currentProperty = ref(null)
  const formMode = ref('add') // 'add' or 'edit'
  
  // ========== ACTIONS ==========
  // These will be connected to propertyStore in components
  
  const startAdding = () => {
    formMode.value = 'add'
    currentProperty.value = null
  }
  
  const startEditing = (property) => {
    formMode.value = 'edit'
    currentProperty.value = { ...property }
  }
  
  const cancelEditing = () => {
    formMode.value = 'add'
    currentProperty.value = null
  }
  
  const getFormTitle = () => {
    return formMode.value === 'add' ? 'Publish New Property' : 'Edit Property'
  }
  
  const getSubmitButtonText = () => {
    return formMode.value === 'add' ? 'Publish Property' : 'Update Property'
  }
  
  // ========== DASHBOARD STATS ==========
  const getDashboardStats = (properties) => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const recentProperties = properties.filter(p => 
      new Date(p.createdAt) > sevenDaysAgo
    )
    
    return {
      total: properties.length,
      forSale: properties.filter(p => p.status === 'For Sale').length,
      forRent: properties.filter(p => p.status === 'For Rent').length,
      featured: properties.filter(p => p.featured).length,
      recent: recentProperties.length
    }
  }
  
  // ========== PROPERTY ACTIONS ==========
  // These are helper functions that components will use with propertyStore
  
  const publishProperty = async (propertyStore, propertyData) => {
    isAdding.value = true
    
    try {
      // Clean up data
      const cleanData = {
        ...propertyData,
        price: Number(propertyData.price) || 0,
        bedrooms: Number(propertyData.bedrooms) || 0,
        bathrooms: Number(propertyData.bathrooms) || 0,
        squareFootage: Number(propertyData.squareFootage) || 0
      }
      
      const result = propertyStore.addProperty(cleanData)
      isAdding.value = false
      return result
      
    } catch (error) {
      isAdding.value = false
      return { 
        success: false, 
        message: '❌ Failed to publish property' 
      }
    }
  }
  
  const editProperty = async (propertyStore, id, updates) => {
    isEditing.value = true
    
    try {
      const result = await propertyStore.updateProperty(id, updates)
      isEditing.value = false
      return result
      
    } catch (error) {
      isEditing.value = false
      return { 
        success: false, 
        message: '❌ Failed to update property' 
      }
    }
  }
  
  const deleteProperty = async (propertyStore, id) => {
    const confirm = window.confirm('Are you sure you want to delete this property?')
    if (!confirm) {
      return { success: false, message: 'Cancelled' }
    }
    
    try {
      const result = await propertyStore.deleteProperty(id)
      return result
      
    } catch (error) {
      return { 
        success: false, 
        message: '❌ Failed to delete property' 
      }
    }
  }
  
  const toggleFeatured = async (propertyStore, id) => {
    const property = propertyStore.getPropertyById(id)
    if (property) {
      return await propertyStore.updateProperty(id, { 
        featured: !property.featured 
      })
    }
    return { success: false, message: 'Property not found' }
  }
  
  const changeStatus = async (propertyStore, id, newStatus) => {
    return await propertyStore.updateProperty(id, { status: newStatus })
  }
  
  // ========== RETURN ==========
  return {
    // State
    isAdding,
    isEditing,
    currentProperty,
    formMode,
    
    // Actions
    startAdding,
    startEditing,
    cancelEditing,
    getFormTitle,
    getSubmitButtonText,
    getDashboardStats,
    
    // Property Actions (to be used with propertyStore)
    publishProperty,
    editProperty,
    deleteProperty,
    toggleFeatured,
    changeStatus
  }
})