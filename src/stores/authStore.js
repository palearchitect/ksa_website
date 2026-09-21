import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/services/api'
import { captureEvent, identifyUser, resetUser } from '@/plugins/posthog'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const clerkToken = ref(null)

  const clearError = () => {
    error.value = null
  }

  let sessionPromise = null

  // Sync user state from Clerk SDK
  const syncClerkUser = (clerkUserInstance, token = null) => {
    if (clerkUserInstance) {
      clerkToken.value = token
      const meta = clerkUserInstance.publicMetadata || {}
      user.value = {
        id: clerkUserInstance.id,
        email: clerkUserInstance.primaryEmailAddress?.emailAddress || clerkUserInstance.emailAddresses?.[0]?.emailAddress || '',
        name: clerkUserInstance.fullName || clerkUserInstance.firstName || 'User',
        role: meta.role || 'admin',
        status: meta.status || 'active',
        imageUrl: clerkUserInstance.imageUrl
      }
      isAuthenticated.value = true
      identifyUser(clerkUserInstance.id, {
        email: user.value.email,
        name: user.value.name,
        role: user.value.role
      })
    } else {
      user.value = null
      isAuthenticated.value = false
      clerkToken.value = null
      resetUser()
    }
  }

  // Load from session API or Clerk SDK on init
  const loadSession = async (force = false) => {
    if (isAuthenticated.value && user.value && !force) {
      return user.value
    }

    // 1. Check if Clerk is available in browser window and wait for readiness
    if (typeof window !== 'undefined' && window.Clerk) {
      if (!window.Clerk.loaded) {
        await new Promise((resolve) => {
          const interval = setInterval(() => {
            if (window.Clerk?.loaded) {
              clearInterval(interval)
              resolve()
            }
          }, 25)
          setTimeout(() => { clearInterval(interval); resolve() }, 1800)
        })
      }

      if (window.Clerk?.user) {
        let token = null
        try {
          token = await window.Clerk.session?.getToken()
        } catch (e) {}
        syncClerkUser(window.Clerk.user, token)
        return user.value
      }
    }

    // 2. Fallback to Express backend cookie authentication (/api/v1/auth/me)
    if (!sessionPromise || force) {
      sessionPromise = authAPI.me()
        .then(response => {
          if (response?.data) {
            user.value = response.data
            isAuthenticated.value = true
            if (response.data?.id) {
              identifyUser(response.data.id, {
                email: response.data.email,
                name: response.data.name,
                role: response.data.role
              })
            }
          }
          return response?.data || null
        })
        .catch(() => {
          if (!user.value) {
            isAuthenticated.value = false
          }
          return null
        })
        .finally(() => {
          setTimeout(() => { sessionPromise = null }, 2000)
        })
    }
    return sessionPromise
  }

  // Login
  const login = async (email, password) => {
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
      const code = err.response?.data?.code
      return { 
        success: false, 
        error: error.value,
        code
      }
    } finally {
      loading.value = false
    }
  }

  // Google Login
  const googleLogin = async (credential, intent = 'signin') => {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.googleLogin({ credential, intent })
      if (response.data) {
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
      return { success: true, ...response }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      const code = err.response?.data?.code
      return { 
        success: false, 
        error: error.value,
        code
      }
    } finally {
      loading.value = false
    }
  }

  // Register
  const register = async (name, email, password, role = 'tenant') => {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.register({ name, email, password, role })
      return { success: true, ...response }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      const code = err.response?.data?.code
      return { success: false, error: error.value, code }
    } finally {
      loading.value = false
    }
  }

  // Verify OTP
  const verifyOTP = async (email, code) => {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.verifyOTP({ email, code })
      if (response?.user) {
        user.value = response.user
        isAuthenticated.value = true
      }
      return { success: true, ...response }
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
      return { success: true, ...response }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Forgot Password
  const forgotPassword = async (email) => {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.forgotPassword({ email })
      return { success: true, ...response }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Reset Password
  const resetPassword = async (email, code, newPassword) => {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.resetPassword({ email, code, newPassword })
      return { success: true, ...response }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async () => {
    loading.value = true
    try {
      await authAPI.logout().catch(() => {})
      user.value = null
      isAuthenticated.value = false
      clerkToken.value = null
      sessionPromise = null
      resetUser()
      return { success: true }
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const isAdmin = computed(() => ['admin', 'superadmin', 'webadmin'].includes(user.value?.role))
  const isManager = computed(() => ['manager', 'admin', 'superadmin'].includes(user.value?.role))
  const userRole = computed(() => user.value?.role || 'guest')

  return {
    user,
    isAuthenticated,
    loading,
    error,
    clerkToken,
    clearError,
    syncClerkUser,
    loadSession,
    login,
    googleLogin,
    register,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    logout,
    isAdmin,
    isManager,
    userRole
  }
})
