import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI, adminService } from '@/services/api'
import { identifyUser, resetUser } from '@/plugins/posthog'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref(null)

  const clearError = () => {
    error.value = null
  }

  let sessionPromise = null

  // Load from session API on init
  const loadSession = () => {
    if (!sessionPromise) {
      sessionPromise = authAPI.me()
        .then(response => {
          user.value = response.data
          isAuthenticated.value = true
          if (response.data?.id) {
            identifyUser(response.data.id, {
              email: response.data.email,
              name: response.data.name,
              role: response.data.role
            })
          }
          return response.data
        })
        .catch(err => {
          user.value = null
          isAuthenticated.value = false
          return null
        })
    }
    return sessionPromise
  }

  // Login
  const login = async (email, password, _remember = false) => {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.login({ email, password })
      user.value = response.data
      isAuthenticated.value = true
      sessionPromise = Promise.resolve(response.data)
      if (response.data?.id) {
        identifyUser(response.data.id, {
          email: response.data.email,
          name: response.data.name,
          role: response.data.role
        })
      }
      return { success: true, user: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { 
        success: false, 
        error: error.value, 
        pendingVerification: err.response?.data?.pendingVerification || false,
        email: err.response?.data?.email
      }
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
        if (response.data?.id) {
          identifyUser(response.data.id, {
            email: response.data.email,
            name: response.data.name,
            role: response.data.role
          })
        }
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
  const signup = async (name, email, password, role) => {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.register({ name, email, password, role })
      if (response.status === 'pending_verification') {
        return { success: true, status: 'pending_verification', email: response.email }
      }
      user.value = response.data
      isAuthenticated.value = true
      sessionPromise = Promise.resolve(response.data)
      if (response.data?.id) {
        identifyUser(response.data.id, {
          email: response.data.email,
          name: response.data.name,
          role: response.data.role
        })
      }
      return { success: true, user: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Verify OTP for Signup Email Verification
  const verifyOTP = async (email, code) => {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.verifyOTP({ email, code })
      user.value = response.data
      isAuthenticated.value = true
      sessionPromise = Promise.resolve(response.data)
      if (response.data?.id) {
        identifyUser(response.data.id, {
          email: response.data.email,
          name: response.data.name,
          role: response.data.role
        })
      }
      return { success: true, user: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Resend OTP
  const resendOTP = async (email) => {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.resendOTP({ email })
      return { success: true, message: response.message }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Login with Google
  const loginWithGoogle = async (credential) => {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.googleLogin({ credential })
      if (response.registered) {
        user.value = response.data
        isAuthenticated.value = true
        sessionPromise = Promise.resolve(response.data)
        if (response.data?.id) {
          identifyUser(response.data.id, {
            email: response.data.email,
            name: response.data.name,
            role: response.data.role
          })
        }
      }
      return response
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Onboard new social user (using secure signed onboardingToken)
  const onboardSocialUser = async (name, role, onboardingToken) => {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.onboard({ name, role, onboardingToken })
      user.value = response.data
      isAuthenticated.value = true
      sessionPromise = Promise.resolve(response.data)
      if (response.data?.id) {
        identifyUser(response.data.id, {
          email: response.data.email,
          name: response.data.name,
          role: response.data.role
        })
      }
      return { success: true, user: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Profile Management Actions
  const updateProfile = async (name) => {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.updateProfile({ name })
      user.value = { ...user.value, ...response.data }
      return { success: true, user: user.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    loading.value = true
    error.value = null
    try {
      await authAPI.changePassword({ currentPassword, newPassword })
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deactivateAccount = async (password) => {
    loading.value = true
    error.value = null
    try {
      await authAPI.deboard({ password })
      user.value = null
      isAuthenticated.value = false
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const linkGoogle = async (credential) => {
    loading.value = true
    error.value = null
    try {
      await authAPI.linkGoogle({ credential })
      if (user.value) user.value.googleLinked = true
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const unlinkGoogle = async () => {
    loading.value = true
    error.value = null
    try {
      await authAPI.unlinkGoogle()
      if (user.value) user.value.googleLinked = false
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Impersonation actions
  const startImpersonation = async (targetUserId) => {
    loading.value = true
    error.value = null
    try {
      const response = await adminService.impersonate(targetUserId)
      user.value = response.data
      isAuthenticated.value = true
      // Force reload page to apply impersonation route redirects
      window.location.reload()
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const stopImpersonation = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await adminService.stopImpersonate()
      user.value = response.data
      isAuthenticated.value = true
      // Force reload page to restore normal admin layout
      window.location.reload()
      return { success: true }
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
      // Full state reset & analytics identity reset
      user.value = null
      isAuthenticated.value = false
      error.value = null
      sessionPromise = null
      sessionStorage.clear()
      resetUser()
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
    verifyOTP,
    resendOTP,
    loginWithGoogle,
    onboardSocialUser,
    logout,
    loadSession,
    refreshAccessToken,
    hasRole,
    clearError,
    updateProfile,
    changePassword,
    deactivateAccount,
    linkGoogle,
    unlinkGoogle,
    startImpersonation,
    stopImpersonation
  }
})
