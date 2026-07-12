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
        <h2 class="text-3xl font-bold text-white mb-2">KSA Portal</h2>
        <p class="text-blue-100">Sign in to access your dashboard or portal</p>
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
            :class="[
              'flex-1 py-3 px-4 text-center font-semibold transition-colors',
              activeTab === 'signup' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            Sign Up
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
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-6">
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

        <!-- Signup Form -->
        <form v-if="activeTab === 'signup'" @submit.prevent="handleSignup" class="space-y-6">
          <div>
            <label for="signup-name" class="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="signup-name"
              v-model="signupForm.name"
              type="text"
              required
              placeholder="Segun Kayode"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
          </div>

          <div>
            <label for="signup-email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="signup-email"
              v-model="signupForm.email"
              type="email"
              required
              placeholder="segun@ksavaluers.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
          </div>

          <div>
            <label for="signup-password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="signup-password"
              v-model="signupForm.password"
              type="password"
              required
              placeholder="Minimum 12 chars, Mixed Case, Symbols"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
            <p class="text-xs text-gray-500 mt-1">Must be >= 12 chars, mixed case, numbers & special chars.</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Sign Up</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          </button>
        </form>

        <!-- Social Login Section -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-300"></div></div>
          <div class="relative flex justify-center text-sm"><span class="px-2 bg-white text-gray-500">Or continue with</span></div>
        </div>

        <div class="flex flex-col items-center gap-3">
          <div id="google-signin-btn" class="w-full flex justify-center"></div>
        </div>

        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <p class="font-semibold mb-2">Authorized Access Only</p>
          <p class="text-xs leading-relaxed">
            This portal is for KSA Valuers clients, tenants, owners, and authorized staff. Use your credentials to sign in.
            If you are a new user, you can register for an account using the Sign Up tab.
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useSEO } from '@/hooks/useSEO'

useSEO({
  title: 'Portal Login | KSA Valuers',
  description: 'Sign in to access the KSA Valuers dashboards and client portals.',
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
  role: 'tenant'
})

// Role → home dashboard mapping
const roleDashboardMap = {
  admin:         '/dashboard/admin',
  webadmin:      '/dashboard/admin',
  manager:       '/',
  management:    '/',
  propertyowner: '/',
  tenant:        '/',
}

// If already authenticated, redirect to the appropriate dashboard
if (authStore.isAuthenticated) {
  const dest = roleDashboardMap[authStore.user?.role] || '/admin'
  router.push(dest)
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
      const role = result.user?.role
      setTimeout(() => {
        const rawRedirect = router.currentRoute.value.query.redirect
        const redirect = rawRedirect ? decodeURIComponent(rawRedirect) : null
        const dest = redirect || roleDashboardMap[role] || '/admin'
        router.push(dest)
      }, 800)
    } else {
      if (result.pendingVerification) {
        successMessage.value = 'Email verification required. Redirecting...'
        setTimeout(() => {
          router.push({
            path: '/verify-email',
            query: { email: result.email }
          })
        }, 1000)
      } else {
        errorMessage.value = result.error || 'Login failed. Please check your credentials and try again.'
        // Auto-clear error after 6 seconds
        setTimeout(() => {
          errorMessage.value = ''
        }, 6000)
      }
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
      signupForm.value.role
    )
    
    if (result.success) {
      if (result.status === 'pending_verification') {
        successMessage.value = 'Account created! Verification OTP code sent to your email. Redirecting...'
        setTimeout(() => {
          router.push({
            path: '/verify-email',
            query: { email: result.email }
          })
        }, 1500)
      } else {
        successMessage.value = 'Account created successfully! Redirecting...'
        const role = result.user?.role
        setTimeout(() => {
          const dest = roleDashboardMap[role] || '/admin'
          router.push(dest)
        }, 800)
      }
    } else {
      errorMessage.value = result.error || 'Failed to create account. Please try again.'
    }
  } catch (error) {
    errorMessage.value = 'An error occurred during sign up. Please try again.'
  } finally {
    loading.value = false
  }
}

// Google Sign-In setup
onMounted(() => {
  if (typeof window !== 'undefined' && window.google) {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id';
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCallback
    })
    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      { theme: 'outline', size: 'large', width: 280 }
    )
  }
})

const handleGoogleCallback = async (response) => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const res = await authStore.loginWithGoogle(response.credential)
    if (res.registered) {
      successMessage.value = 'Google login successful! Redirecting...'
      const role = res.data.role
      setTimeout(() => {
        const dest = roleDashboardMap[role] || '/admin'
        router.push(dest)
      }, 800)
    } else {
      successMessage.value = 'Authenticating with Google... Redirecting to complete profile...'
      setTimeout(() => {
        router.push({
          path: '/onboarding',
          query: {
            name: res.tempUser.name,
            email: res.tempUser.email,
            googleId: res.tempUser.googleId
          }
        })
      }, 800)
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || err.message || 'Google Sign-In failed.'
  } finally {
    loading.value = false
  }
}
</script>
