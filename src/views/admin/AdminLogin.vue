<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,#0f294a_0%,#071324_60%,#030810_100%)] text-slate-100 px-4 py-6 selection:bg-blue-500 selection:text-white relative">
    
    <!-- Top Navigation (Back to Website only, no top-left banner) -->
    <div class="absolute top-6 right-6 z-10">
      <router-link 
        to="/" 
        class="text-xs font-semibold text-slate-400 hover:text-white transition-all flex items-center gap-1.5 bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700 shadow-sm"
      >
        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Website</span>
      </router-link>
    </div>

    <!-- Central Authentication Card -->
    <div class="w-full max-w-[380px] mx-auto my-auto flex flex-col items-center">
      
      <!-- Clerk Authentication Component (Compact Dark Card) -->
      <div v-if="hasClerkKey" class="w-full flex justify-center clerk-dark-wrapper">
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
      <div v-else class="w-full bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 shadow-2xl shadow-blue-950/40">
        <div class="text-center mb-6">
          <h2 class="text-xl font-bold text-white tracking-tight">Portal Sign In</h2>
          <p class="text-slate-400 text-xs mt-1">Enter your credentials to continue</p>
        </div>

        <div v-if="errorMessage" class="mb-4 p-3 bg-red-950/60 border border-red-800/60 rounded-lg text-xs text-red-200">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleCustomLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Email</label>
            <input 
              id="email" 
              v-model="loginForm.email" 
              type="email" 
              required 
              placeholder="admin@ksavaluers.com" 
              class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-600"
            >
          </div>
          <div>
            <label for="password" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Password</label>
            <input 
              id="password" 
              v-model="loginForm.password" 
              type="password" 
              required 
              placeholder="••••••••••••" 
              class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-600"
            >
          </div>
          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg text-xs shadow-md transition-all disabled:opacity-50"
          >
            Sign In
          </button>
        </form>
      </div>

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

// Compact Clerk appearance styling matching dark aesthetic
const clerkAppearance = {
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'w-full max-w-[380px]',
    card: 'shadow-2xl rounded-2xl border border-slate-800 bg-slate-900 text-white w-full max-w-[380px] p-5',
    headerTitle: 'text-white font-bold text-xl text-center tracking-tight',
    headerSubtitle: 'text-slate-400 text-xs text-center mt-1 font-normal',
    socialButtonsBlockButton: 'border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white rounded-lg font-medium text-xs py-2 transition',
    socialButtonsBlockButtonText: 'text-slate-200 font-medium text-xs',
    dividerRow: 'my-4',
    dividerText: 'text-slate-500 text-[10px] font-semibold uppercase tracking-widest',
    formFieldLabel: 'text-slate-300 text-[11px] font-semibold mb-1 uppercase tracking-wider',
    formFieldInput: 'bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg text-white text-xs py-2 px-3 transition outline-none placeholder:text-slate-600',
    formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-2.5 rounded-lg shadow-md transition-all border-0',
    footer: 'hidden',
    footerAction: 'hidden',
    footerPages: 'hidden',
    devModeBadge: 'hidden'
  },
  variables: {
    colorPrimary: '#2563eb',
    colorText: '#f8fafc',
    colorBackground: '#0f172a',
    colorInputBackground: '#020617',
    colorInputText: '#f8fafc',
    borderRadius: '0.5rem'
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

<style scoped>
/* Scoped overrides to enforce dark styling on Clerk internal elements & hide split footer */
.clerk-dark-wrapper :deep(.cl-cardBox),
.clerk-dark-wrapper :deep(.cl-card) {
  background-color: #0f172a !important;
  color: #f8fafc !important;
  border: 1px solid rgba(51, 65, 85, 0.8) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
  border-radius: 1rem !important;
  max-width: 380px !important;
}

.clerk-dark-wrapper :deep(.cl-headerTitle) {
  color: #ffffff !important;
}

.clerk-dark-wrapper :deep(.cl-headerSubtitle) {
  color: #94a3b8 !important;
}

.clerk-dark-wrapper :deep(.cl-formFieldLabel) {
  color: #cbd5e1 !important;
}

.clerk-dark-wrapper :deep(.cl-formFieldInput) {
  background-color: #020617 !important;
  color: #f8fafc !important;
  border-color: #1e293b !important;
}

.clerk-dark-wrapper :deep(.cl-formButtonPrimary) {
  background: linear-gradient(to right, #2563eb, #4f46e5) !important;
  color: #ffffff !important;
}

/* Hide the split bottom footer section from Clerk */
.clerk-dark-wrapper :deep(.cl-footer),
.clerk-dark-wrapper :deep(.cl-footerAction),
.clerk-dark-wrapper :deep(.cl-footerPages),
.clerk-dark-wrapper :deep(.cl-devModeBadge) {
  display: none !important;
}
</style>

