import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)

  // Load from localStorage on init
  const loadSession = () => {
    const savedUser = localStorage.getItem('ksaAdmin')
    const savedToken = localStorage.getItem('ksaToken')
    
    if (savedUser && savedToken) {
      user.value = JSON.parse(savedUser)
      token.value = savedToken
      isAuthenticated.value = true
    }
  }

  // Login
  const login = async (email, password) => {
    try {
      // Demo credentials - in production, this would call your backend API
      const validCredentials = [
        { email: 'admin@ksavaluers.com', password: 'admin123', name: 'Admin User', role: 'admin' },
        { email: 'markson@ksavaluers.com', password: 'markson123', name: 'ESV. Markson Ajiboye', role: 'manager' },
        { email: 'abiodun@ksavaluers.com', password: 'abiodun123', name: 'Akinyele Abiodun', role: 'valuer' }
      ]

      const userCredential = validCredentials.find(
        cred => cred.email === email && cred.password === password
      )

      if (!userCredential) {
        throw new Error('Invalid email or password')
      }

      // Set user data
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        name: userCredential.name,
        email: userCredential.email,
        role: userCredential.role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userCredential.name)}&background=3b82f6&color=fff`
      }

      const sessionToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      user.value = userData
      token.value = sessionToken
      isAuthenticated.value = true

      // Save to localStorage
      localStorage.setItem('ksaAdmin', JSON.stringify(userData))
      localStorage.setItem('ksaToken', sessionToken)

      return { success: true, user: userData }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Signup/Register
  const signup = async (name, email, password, department) => {
    try {
      // In production, this would call your backend API to create account
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: 'pending',
        department,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
        status: 'pending_approval'
      }

      // For demo - auto-approve and log in
      const sessionToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      user.value = userData
      token.value = sessionToken
      isAuthenticated.value = true

      localStorage.setItem('ksaAdmin', JSON.stringify(userData))
      localStorage.setItem('ksaToken', sessionToken)

      return { success: true, user: userData, message: 'Account created successfully!' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    
    localStorage.removeItem('ksaAdmin')
    localStorage.removeItem('ksaToken')
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
    token,
    isAuthenticated,
    
    // Actions
    login,
    signup,
    logout,
    loadSession,
    hasRole
  }
})
