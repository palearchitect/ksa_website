<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 px-4 sm:px-6 lg:px-8">
    <div class="absolute inset-0 bg-black opacity-20"></div>
    
    <div class="relative max-w-md w-full">
      <!-- Logo & Header -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-block mb-4">
          <img 
            src="@/assets/images/logo.png" 
            alt="KSA Valuers" 
            class="h-16 mx-auto bg-white px-4 py-2 rounded-lg shadow-lg"
          >
        </router-link>
        <h2 class="text-3xl font-bold text-white mb-2">Admin Portal</h2>
        <p class="text-blue-100">Sign in to access your dashboard</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <!-- Tab Switcher -->
        <div class="flex border-b border-gray-200 mb-6">
          <button
            @click="activeTab = 'login'"
            :class="[
              'flex-1 py-3 px-4 text-center font-semibold transition-colors',
              activeTab === 'login' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            Sign In
          </button>
          <button
            @click="activeTab = 'signup'"
            disabled
            :class="[
              'flex-1 py-3 px-4 text-center font-semibold transition-colors cursor-not-allowed opacity-50',
              activeTab === 'signup' 
                ? 'text-gray-400 border-b-2 border-gray-300' 
                : 'text-gray-400 hover:text-gray-500'
            ]"
            title="Self-service signup is disabled"
          >
            Sign Up (Disabled)
          </button>
        </div>

        <!-- Error/Success Messages -->
        <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start">
            <svg class="w-5 h-5 mr-3 mt-0.5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
              <p class="text-xs text-red-600 mt-1">Please check your email and password and try again.</p>
            </div>
          </div>
        </div>

        <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-start">
            <svg class="w-5 h-5 mr-3 mt-0.5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              required
              placeholder="admin@ksavaluers.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Enter your password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="loginForm.remember"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="remember" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <button type="button" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Sign In</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          </button>
        </form>

        <!-- Signup Form (Disabled) -->
        <div v-if="activeTab === 'signup'" class="space-y-6 text-center py-8">
          <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Sign Up is Disabled</h3>
            <p class="text-gray-600 mb-4">Self-service registration is not currently available.</p>
            <p class="text-sm text-gray-500">Please contact your administrator if you need an account.</p>
          </div>
        </div>

        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <p class="font-semibold mb-2">Admin Access Only</p>
          <p class="text-xs leading-relaxed">
            This is the admin portal for KSA Valuers staff. Use your assigned credentials to sign in.
            If you don't have an account or have forgotten your password, please contact your administrator.
          </p>
        </div>
      </div>

      <!-- Back to Website -->
      <div class="text-center mt-6">
        <router-link 
          to="/" 
          class="text-white hover:text-blue-200 font-medium transition-colors inline-flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Website
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useSEO } from '@/hooks/useSEO'

useSEO({
  title: 'Admin Login | KSA Valuers',
  description: 'Sign in to access the KSA Valuers admin dashboard.',
})

const router = useRouter()
const authStore = useAuthStore()

// State
const activeTab = ref('login')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)

const loginForm = ref({
  email: '',
  password: '',
  remember: false
})

const signupForm = ref({
  name: '',
  email: '',
  password: '',
  department: ''
})

// If already authenticated, redirect to admin
if (authStore.isAuthenticated) {
  router.push('/admin')
}

// Methods
const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await authStore.login(loginForm.value.email, loginForm.value.password, loginForm.value.remember)
    
    if (result.success) {
      successMessage.value = 'Login successful! Redirecting...'
      setTimeout(() => {
        const redirect = router.currentRoute.value.query.redirect || '/admin'
        router.push(redirect)
      }, 1000)
    } else {
      errorMessage.value = result.error || 'Login failed. Please check your credentials and try again.'
      // Auto-clear error after 6 seconds
      setTimeout(() => {
        errorMessage.value = ''
      }, 6000)
    }
  } catch (error) {
    errorMessage.value = 'An unexpected error occurred. Please try again.'
    // Auto-clear error after 6 seconds
    setTimeout(() => {
      errorMessage.value = ''
    }, 6000)
  } finally {
    loading.value = false
  }
}
const handleSignup = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await authStore.signup(
      signupForm.value.name,
      signupForm.value.email,
      signupForm.value.password,
      signupForm.value.department
    )
    
    if (result.success) {
      successMessage.value = 'Account created successfully! Redirecting...'
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    } else {
      errorMessage.value = result.error || 'Failed to create account. Please try again.'
    }
  } catch (error) {
    errorMessage.value = 'An error occurred during sign up. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
