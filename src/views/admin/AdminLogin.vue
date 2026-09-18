<template>
  <div class="min-h-screen flex flex-col justify-between bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(27,77,132,0.35),rgba(255,255,255,0))] px-4 py-8 sm:px-6 lg:px-8">
    
    <!-- Top Header Navigation -->
    <div class="max-w-6xl w-full mx-auto flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-3 group">
        <img 
          src="@/assets/images/logo.png" 
          alt="KSA Valuers" 
          class="h-10 bg-white px-3 py-1.5 rounded-xl shadow-md border border-slate-800 transition-transform group-hover:scale-105"
        >
        <span class="text-white font-bold text-lg tracking-wide hidden sm:inline">KSA Valuers</span>
      </router-link>

      <router-link 
        to="/" 
        class="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-lg border border-slate-800 hover:border-slate-700"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Site
      </router-link>
    </div>

    <!-- Central Authentication Section -->
    <div class="my-auto py-8 max-w-md w-full mx-auto flex flex-col items-center">
      
      <!-- Clerk Authentication Component (No double white box wrapper) -->
      <div v-if="hasClerkKey" class="w-full flex justify-center">
        <SignIn 
          v-if="activeTab === 'login'" 
          routing="path" 
          path="/admin/login" 
          signUpUrl="/admin/login?tab=signup"
          redirectUrl="/dashboard/admin"
          :appearance="clerkAppearance"
        />
        <SignUp 
          v-else 
          routing="path" 
          path="/admin/login" 
          signInUrl="/admin/login"
          redirectUrl="/dashboard/admin"
          :appearance="clerkAppearance"
        />
      </div>

      <!-- Fallback Custom Authentication Form -->
      <div v-else class="w-full bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-slate-900">Portal Login</h2>
          <p class="text-slate-500 text-xs mt-1">Sign in with your email and password</p>
        </div>

        <div v-if="errorMessage" class="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-800">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleCustomLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
            <input 
              id="email" 
              v-model="loginForm.email" 
              type="email" 
              required 
              placeholder="admin@ksavaluers.com" 
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
            >
          </div>
          <div>
            <label for="password" class="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
            <input 
              id="password" 
              v-model="loginForm.password" 
              type="password" 
              required 
              placeholder="••••••••••••" 
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
            >
          </div>
          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all disabled:opacity-50"
          >
            Sign In to Dashboard
          </button>
        </form>
      </div>

    </div>

    <!-- Footer Privacy & Security Note -->
    <div class="text-center text-xs text-slate-500 max-w-md mx-auto">
      Protected by enterprise encryption & Clerk identity safeguards.<br>
      © {{ new Date().getFullYear() }} KSA Valuers. All rights reserved.
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SignIn, SignUp } from '@clerk/vue'
import { useAuthStore } from '@/stores/authStore'
import { useSEO } from '@/hooks/useSEO'

useSEO({
  title: 'Portal Authentication | KSA Valuers',
  description: 'Sign in to access KSA Valuers management dashboards and client portals.',
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref(route.query.tab === 'signup' ? 'signup' : 'login')
const loading = ref(false)
const errorMessage = ref('')
const loginForm = ref({ email: '', password: '' })

watch(() => route.query.tab, (newTab) => {
  activeTab.value = newTab === 'signup' ? 'signup' : 'login'
})

const hasClerkKey = computed(() => {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  return key && key.startsWith('pk_')
})

// Custom Clerk styling to match KSA Valuers brand palette perfectly
const clerkAppearance = {
  elements: {
    rootBox: 'w-full flex justify-center',
    card: 'shadow-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 w-full max-w-md',
    headerTitle: 'text-slate-900 font-extrabold text-2xl text-center',
    headerSubtitle: 'text-slate-500 text-xs text-center mt-1',
    socialButtonsBlockButton: 'border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 rounded-xl font-semibold text-slate-700 text-sm shadow-sm py-2.5 transition',
    dividerRow: 'my-5',
    dividerText: 'text-slate-400 text-xs font-medium uppercase tracking-wider',
    formFieldLabel: 'text-slate-700 text-xs font-bold mb-1',
    formFieldInput: 'bg-slate-50 border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600 rounded-xl text-slate-900 text-sm py-2.5 px-3.5 transition outline-none',
    formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all border-0',
    footerActionLink: 'text-blue-600 hover:text-blue-700 font-bold text-xs',
    footer: 'border-t border-slate-100 pt-4 mt-6 text-slate-500 text-xs'
  },
  variables: {
    colorPrimary: '#1b4d84',
    colorText: '#0f172a',
    colorBackground: '#ffffff',
    colorInputBackground: '#f8fafc',
    colorInputText: '#0f172a',
    borderRadius: '0.75rem'
  }
}

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
