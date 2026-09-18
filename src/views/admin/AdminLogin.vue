<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 px-4 sm:px-6 lg:px-8">
    <div class="absolute inset-0 bg-black opacity-20"></div>
    
    <div class="relative max-w-md w-full my-8">
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
        <p class="text-blue-100">Sign in to access your dashboard or client portal</p>
      </div>

      <!-- Clerk Auth Container -->
      <div class="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
        <!-- Render Clerk SignIn component when Clerk publishable key is present -->
        <div v-if="hasClerkKey" class="flex justify-center">
          <SignIn v-if="activeTab === 'login'" routing="path" path="/admin/login" redirectUrl="/dashboard/admin" />
          <SignUp v-else routing="path" path="/admin/login" redirectUrl="/dashboard/admin" />
        </div>

        <!-- Fallback Custom Form if Clerk is initializing or in dev fallback -->
        <div v-else>
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
            <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
          </div>

          <!-- Login Form -->
          <form v-if="activeTab === 'login'" @submit.prevent="handleCustomLogin" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input id="email" v-model="loginForm.email" type="email" required placeholder="admin@ksavaluers.com" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition">
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input id="password" v-model="loginForm.password" type="password" required placeholder="Enter password" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition">
            </div>
            <button type="submit" :disabled="loading" class="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
              Sign In
            </button>
          </form>
        </div>

        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 leading-relaxed">
          <p class="font-semibold mb-1">Authorized Access Only</p>
          This portal is managed via Clerk authentication for KSA Valuers staff, property owners, and tenants.
        </div>
      </div>

      <!-- Back to Website -->
      <div class="text-center mt-6">
        <router-link to="/" class="text-white hover:text-blue-200 font-medium transition-colors inline-flex items-center">
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SignIn, SignUp } from '@clerk/vue'
import { useAuthStore } from '@/stores/authStore'
import { useSEO } from '@/hooks/useSEO'

useSEO({
  title: 'Portal Login | KSA Valuers',
  description: 'Sign in to access KSA Valuers dashboards via Clerk authentication.',
})

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('login')
const loading = ref(false)
const errorMessage = ref('')
const loginForm = ref({ email: '', password: '' })

const hasClerkKey = computed(() => {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  return key && key.startsWith('pk_')
})

const handleCustomLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await authStore.login(loginForm.value.email, loginForm.value.password)
    if (res.success) {
      router.push('/dashboard/admin')
    } else {
      errorMessage.value = res.error || 'Login failed.'
    }
  } catch (err) {
    errorMessage.value = 'An error occurred during sign in.'
  } finally {
    loading.value = false
  }
}
</script>
