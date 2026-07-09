import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref(null)

  const clearError = () => {
    error.value = null
  }

  // Load from localStorage on init
  const loadSession = async () => {
    try {
      const response = await authAPI.me()
      user.value = response.data
      isAuthenticated.value = true
    } catch (err) {
      user.value = null
      isAuthenticated.value = false
    }
  }

  // Login
  const login = async (email, password, _remember = false) => {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.login({ email, password })
      user.value = response.data
      isAuthenticated.value = true
      return { success: true, user: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Refresh access token
  const refreshAccessToken = async () => {
    error.value = null
    try {
      const response = await authAPI.refresh()
      if (response.data) {
        user.value = response.data
        isAuthenticated.value = true
        return { success: true, user: response.data }
      }
      error.value = 'Invalid refresh response'
      return { success: false, error: 'Invalid refresh response' }
    } catch (err) {
      // Token refresh failed - logout user
      user.value = null
      isAuthenticated.value = false
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    }
  }

  // Signup/Register
  const signup = async (name, email, password, department) => {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.register({ name, email, password, department })
      user.value = response.data
      isAuthenticated.value = true
      return { success: true, user: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      user.value = null
      isAuthenticated.value = false
      error.value = null
      localStorage.removeItem('csrf_token')
    }
  }

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user.value) return false
    if (Array.isArray(role)) {
      return role.includes(user.value.role)
    }
    return user.value.role === role
  }

  // Initialize session on store creation
  loadSession()

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    
    // Actions
    login,
    signup,
    logout,
    loadSession,
    refreshAccessToken,
    hasRole,
    clearError
  }
})
