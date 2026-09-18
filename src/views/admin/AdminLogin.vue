<template>
  <div class="min-h-screen flex flex-col justify-between bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,#0f294a_0%,#071324_60%,#030810_100%)] text-slate-100 px-4 py-8 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white">
    
    <!-- Top Header Navigation -->
    <div class="max-w-6xl w-full mx-auto flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-3 group">
        <div class="p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg group-hover:border-white/20 transition">
          <img 
            src="@/assets/images/logo.png" 
            alt="KSA Valuers" 
            class="h-8 w-auto object-contain bg-white px-2 py-1 rounded-lg"
          >
        </div>
        <div class="flex flex-col">
          <span class="text-white font-extrabold text-base tracking-tight group-hover:text-blue-300 transition-colors">KSA Valuers</span>
          <span class="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Client & Staff Portal</span>
        </div>
      </router-link>

      <router-link 
        to="/" 
        class="text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-2 bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 shadow-sm"
      >
        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Website</span>
      </router-link>
    </div>

    <!-- Central Authentication Section -->
    <div class="my-auto py-10 max-w-md w-full mx-auto flex flex-col items-center">
      
      <!-- Clerk Authentication Component (Luxury Dark Card Appearance) -->
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

      <!-- Fallback Custom Dark Form -->
      <div v-else class="w-full bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 border border-slate-800/80 shadow-2xl shadow-blue-950/40">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-extrabold text-white tracking-tight">Portal Authentication</h2>
          <p class="text-slate-400 text-xs mt-1.5">Enter your credentials to access your portal</p>
        </div>

        <div v-if="errorMessage" class="mb-5 p-4 bg-red-950/60 border border-red-800/60 rounded-xl text-xs font-medium text-red-200">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleCustomLogin" class="space-y-5">
          <div>
            <label for="email" class="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input 
              id="email" 
              v-model="loginForm.email" 
              type="email" 
              required 
              placeholder="admin@ksavaluers.com" 
              class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white text-sm outline-none transition placeholder:text-slate-600"
            >
          </div>
          <div>
            <label for="password" class="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Password</label>
            <input 
              id="password" 
              v-model="loginForm.password" 
              type="password" 
              required 
              placeholder="••••••••••••" 
              class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white text-sm outline-none transition placeholder:text-slate-600"
            >
          </div>
          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50"
          >
            Sign In to Dashboard
          </button>
        </form>
      </div>

    </div>

    <!-- Footer Privacy & Security Note -->
    <div class="text-center text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed">
      Secured by enterprise encryption & Clerk identity protocol.<br>
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

// Custom Clerk appearance styling matching KSA Valuers Editorial Luxury Dark aesthetics
const clerkAppearance = {
  elements: {
    rootBox: 'w-full flex justify-center',
    card: 'shadow-2xl shadow-blue-950/40 rounded-3xl border border-slate-800/80 bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 w-full max-w-md text-white',
    headerTitle: 'text-white font-extrabold text-2xl text-center tracking-tight',
    headerSubtitle: 'text-slate-400 text-xs text-center mt-1.5 font-medium',
    socialButtonsBlockButton: 'border border-slate-700/70 hover:border-slate-500 bg-slate-800/70 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm shadow-sm py-2.5 transition',
    socialButtonsBlockButtonText: 'text-slate-200 font-semibold text-sm',
    dividerRow: 'my-6',
    dividerText: 'text-slate-500 text-[11px] font-bold uppercase tracking-widest',
    formFieldLabel: 'text-slate-300 text-xs font-bold mb-1.5 uppercase tracking-wider',
    formFieldInput: 'bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white text-sm py-2.5 px-4 transition outline-none placeholder:text-slate-600',
    formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all border-0',
    footerActionLink: 'text-blue-400 hover:text-blue-300 font-bold text-xs',
    footer: 'border-t border-slate-800/60 pt-4 mt-6 text-slate-400 text-xs',
    footerActionText: 'text-slate-400 text-xs',
    identityPreviewText: 'text-white text-sm font-semibold',
    identityPreviewEditButton: 'text-blue-400 hover:text-blue-300 font-bold text-xs'
  },
  variables: {
    colorPrimary: '#2563eb',
    colorText: '#f8fafc',
    colorBackground: '#0f172a',
    colorInputBackground: '#020617',
    colorInputText: '#f8fafc',
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
