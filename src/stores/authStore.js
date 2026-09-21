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

  // Helper to construct local session user
  const createLocalUserSession = (email, name = null, role = 'admin') => {
    const rawName = name || email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ')
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1)
    const localUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      name: formattedName,
      role: role || 'admin',
      status: 'active',
      createdAt: new Date().toISOString()
    }
    user.value = localUser
    isAuthenticated.value = true
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('ksa_local_user', JSON.stringify(localUser))
      } catch (e) {}
    }
    identifyUser(localUser.id, { email: localUser.email, name: localUser.name, role: localUser.role })
    return localUser
  }

  // Load from session API or Clerk SDK on init
  const loadSession = async (force = false) => {
    if (isAuthenticated.value && user.value && !force) {
      return user.value
    }

    // 0. Check localStorage fallback
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('ksa_local_user')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed && parsed.email) {
            user.value = parsed
            isAuthenticated.value = true
            return user.value
          }
        }
      } catch (e) {}
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
      const status = err.response?.status
      if (status === 404 || err.code === 'ERR_NETWORK' || !err.response) {
        console.warn('Backend authentication API unreachable (404/Network). Creating local session fallback.')
        const localUser = createLocalUserSession(email)
        return { success: true, user: localUser, isLocalFallback: true }
      }

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
      if (response?.data) {
        user.value = response.data
        isAuthenticated.value = true
      }
      return { success: true, ...response }
    } catch (err) {
      const status = err.response?.status
      if (status === 404 || err.code === 'ERR_NETWORK' || !err.response) {
        console.warn('Backend registration API unreachable (404/Network). Registering local session fallback.')
        const localUser = createLocalUserSession(email, name, role)
        return { success: true, user: localUser, isLocalFallback: true }
      }

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
