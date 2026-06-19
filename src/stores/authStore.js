import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)

  // Load from localStorage on init
  const loadSession = async () => {
    try {
      const response = await authAPI.me()
      user.value = response.data
      isAuthenticated.value = true
    } catch {
      user.value = null
      isAuthenticated.value = false
    }
  }

  // Login
  const login = async (email, password, _remember = false) => {
    loading.value = true
    try {
      const response = await authAPI.login({ email, password })
      user.value = response.data
      isAuthenticated.value = true
      return { success: true, user: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message }
    } finally {
      loading.value = false
    }
  }

  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      const response = await authAPI.refresh()
      if (response.data) {
        user.value = response.data
        isAuthenticated.value = true
        return { success: true, user: response.data }
      }
      return { success: false, error: 'Invalid refresh response' }
    } catch (error) {
      // Token refresh failed - logout user
      user.value = null
      isAuthenticated.value = false
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  // Signup/Register
  const signup = async () => ({ success: false, error: 'Self-service signup is disabled. Contact an administrator.' })

  // Logout
  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout failed:', error)
      // Continue with local logout even if API call fails
    } finally {
      user.value = null
      isAuthenticated.value = false
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
    
    // Actions
    login,
    signup,
    logout,
    loadSession,
    refreshAccessToken,
    hasRole
  }
})
