<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,#0f294a_0%,#071324_60%,#030810_100%)] text-slate-100 px-4 py-6 selection:bg-orange-500 selection:text-white relative overflow-hidden">
    
    <!-- Ambient Glow Effects -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Top Navigation (Back to Website) -->
    <div class="absolute top-6 right-6 z-10">
      <router-link 
        to="/" 
        class="text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 hover:border-orange-500/40 shadow-sm"
      >
        <svg class="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Website</span>
      </router-link>
    </div>

    <!-- Central Authentication Card -->
    <div class="w-full max-w-[380px] mx-auto my-auto flex flex-col items-center z-10">
      
      <!-- Clerk Authentication Component (Transparent Blue to Orange Glass Card) -->
      <div v-if="hasClerkKey" class="w-full flex justify-center clerk-orange-wrapper">
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

      <!-- Fallback Custom Transparent Blue-Orange Glass Tile -->
      <div v-else class="w-full bg-gradient-to-br from-blue-950/70 via-slate-950/80 to-orange-950/70 backdrop-blur-2xl rounded-2xl p-6 border border-white/15 shadow-[0_20px_50px_rgba(7,19,36,0.8),0_0_40px_rgba(37,99,235,0.2),0_0_30px_rgba(249,115,22,0.2)]">
        <div class="text-center mb-6">
          <h2 class="text-xl font-extrabold text-white tracking-tight bg-gradient-to-r from-blue-300 via-white to-orange-300 bg-clip-text text-transparent">
            {{ activeTab === 'signup' ? 'Create Account' : 'Portal Sign In' }}
          </h2>
          <p class="text-slate-300/80 text-xs mt-1 font-medium">
            {{ activeTab === 'signup' ? 'Join KSA Valuers management portal' : 'Enter your credentials to continue' }}
          </p>
        </div>

        <div v-if="noticeMessage" class="mb-4 p-3 bg-blue-950/80 border border-blue-500/40 rounded-lg text-xs text-blue-200 leading-relaxed font-medium">
          {{ noticeMessage }}
        </div>

        <div v-if="errorMessage" class="mb-4 p-3 bg-red-950/80 border border-red-800/80 rounded-lg text-xs text-red-200">
          {{ errorMessage }}
        </div>

        <!-- LOGIN FORM -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleCustomLogin" class="space-y-4">
          <div>
            <label for="login-email" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Email</label>
            <input 
              id="login-email" 
              v-model="loginForm.email" 
              type="email" 
              required 
              placeholder="admin@ksavaluers.com" 
              class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-500"
            >
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <label for="login-password" class="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Password</label>
              <router-link to="/forgot-password" class="text-[11px] text-orange-400 hover:text-orange-300 font-medium transition">
                Forgot password?
              </router-link>
            </div>
            <input 
              id="login-password" 
              v-model="loginForm.password" 
              type="password" 
              required 
              placeholder="••••••••••••" 
              class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-500"
            >
          </div>
          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white font-bold rounded-lg text-xs shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            <span v-if="!loading">Sign In</span>
            <span v-else>Signing in...</span>
          </button>
        </form>

        <!-- SIGNUP FORM -->
        <form v-else @submit.prevent="handleCustomRegister" class="space-y-4">
          <div>
            <label for="signup-name" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Full Name</label>
            <input 
              id="signup-name" 
              v-model="registerForm.name" 
              type="text" 
              required 
              placeholder="John Doe" 
              class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-500"
            >
          </div>
          <div>
            <label for="signup-email" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Email Address</label>
            <input 
              id="signup-email" 
              v-model="registerForm.email" 
              type="email" 
              required 
              placeholder="user@example.com" 
              class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-500"
            >
          </div>
          <div>
            <label for="signup-password" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Password</label>
            <input 
              id="signup-password" 
              v-model="registerForm.password" 
              type="password" 
              required 
              placeholder="Min 8 chars (letters + numbers)" 
              class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-500"
            >
          </div>
          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white font-bold rounded-lg text-xs shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            <span v-if="!loading">Create Account & Send OTP</span>
            <span v-else>Registering...</span>
          </button>
        </form>
      </div>

      <!-- Sign Up / Sign In Toggle Link below Card -->
      <div class="mt-4 text-center">
        <button 
          v-if="activeTab === 'login'" 
          @click="switchTab('signup')" 
          class="text-xs text-slate-300 hover:text-white font-medium transition inline-flex items-center gap-1.5"
        >
          <span>Don't have an account?</span>
          <span class="font-bold underline underline-offset-4 text-orange-400 hover:text-orange-300">Sign Up</span>
        </button>
        <button 
          v-else 
          @click="switchTab('login')" 
          class="text-xs text-slate-300 hover:text-white font-medium transition inline-flex items-center gap-1.5"
        >
          <span>Already have an account?</span>
          <span class="font-bold underline underline-offset-4 text-orange-400 hover:text-orange-300">Sign In</span>
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SignIn, SignUp } from '@clerk/vue'
import { useAuthStore } from '@/stores/authStore'
import { useSEO } from '@/hooks/useSEO'

useSEO({
  title: 'Portal Authentication | KSA Valuers',
  description: 'Sign in or register to access KSA Valuers management dashboards and client portals.',
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref(route.query.tab === 'signup' ? 'signup' : 'login')
const loading = ref(false)
const errorMessage = ref('')
const noticeMessage = ref('')
const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ name: '', email: '', password: '' })

onMounted(() => {
  if (route.query.notice === 'account_not_found' || route.query.error === 'user_not_found') {
    activeTab.value = 'signup'
    noticeMessage.value = 'No account found with this email. Please sign up to create a new account.'
  } else if (route.query.notice === 'account_exists' || route.query.error === 'user_exists') {
    activeTab.value = 'login'
    noticeMessage.value = 'An account already exists with this email. Please sign in instead.'
  }
})

watch(() => route.query.tab, (newTab) => {
  activeTab.value = newTab === 'signup' ? 'signup' : 'login'
})

const switchTab = (tab) => {
  activeTab.value = tab
  errorMessage.value = ''
  noticeMessage.value = ''
  router.replace({ query: { ...route.query, tab } })
}

const hasClerkKey = computed(() => {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  return key && key.startsWith('pk_')
})

// Transparent Blue-to-Orange Clerk appearance styling
const clerkAppearance = {
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'w-full max-w-[380px]',
    card: 'shadow-2xl rounded-2xl border border-white/15 bg-gradient-to-br from-blue-950/70 via-slate-950/80 to-orange-950/70 backdrop-blur-2xl text-white w-full max-w-[380px] p-5',
    headerTitle: 'text-white font-extrabold text-xl text-center tracking-tight',
    headerSubtitle: 'text-slate-300/80 text-xs text-center mt-1 font-normal',
    socialButtonsBlockButton: 'border border-white/10 bg-slate-900/60 hover:bg-slate-800/80 text-white rounded-lg font-medium text-xs py-2 transition',
    socialButtonsBlockButtonText: 'text-slate-100 font-medium text-xs',
    dividerRow: 'my-4',
    dividerText: 'text-slate-400/80 text-[10px] font-semibold uppercase tracking-widest',
    formFieldLabel: 'text-slate-300 text-[11px] font-semibold mb-1 uppercase tracking-wider',
    formFieldInput: 'bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs py-2 px-3 transition outline-none placeholder:text-slate-500',
    formButtonPrimary: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white font-bold text-xs py-2.5 rounded-lg shadow-md transition-all border-0',
    footer: 'hidden',
    footerAction: 'hidden',
    footerPages: 'hidden',
    devModeBadge: 'hidden'
  },
  variables: {
    colorPrimary: '#f97316',
    colorText: '#f8fafc',
    colorBackground: '#0b1329',
    colorInputBackground: '#020617',
    colorInputText: '#f8fafc',
    borderRadius: '0.5rem'
  }
}

const handleCustomLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  noticeMessage.value = ''
  try {
    const res = await authStore.login(loginForm.value.email, loginForm.value.password)
    if (res.success) {
      router.push('/dashboard/admin')
    } else if (res.code === 'USER_NOT_FOUND' || (res.error && res.error.toLowerCase().includes('not found'))) {
      switchTab('signup')
      registerForm.value.email = loginForm.value.email
      noticeMessage.value = 'No account found with this email. Please sign up to create an account.'
    } else {
      errorMessage.value = res.error || 'Login failed.'
    }
  } catch (err) {
    errorMessage.value = 'An error occurred during sign in.'
  } finally {
    loading.value = false
  }
}

const handleCustomRegister = async () => {
  loading.value = true
  errorMessage.value = ''
  noticeMessage.value = ''
  try {
    const res = await authStore.register(registerForm.value.name, registerForm.value.email, registerForm.value.password)
    if (res.success) {
      router.push(`/verify-email?email=${encodeURIComponent(registerForm.value.email)}`)
    } else if (res.code === 'USER_ALREADY_EXISTS' || (res.error && (res.error.toLowerCase().includes('already') || res.error.toLowerCase().includes('exist')))) {
      switchTab('login')
      loginForm.value.email = registerForm.value.email
      noticeMessage.value = 'An account already exists with this email. Please sign in instead.'
    } else {
      errorMessage.value = res.error || 'Registration failed.'
    }
  } catch (err) {
    errorMessage.value = 'An error occurred during registration.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Transparent Blue-to-Orange Gradient Glass Tile CSS overrides */
.clerk-orange-wrapper :deep(.cl-cardBox),
.clerk-orange-wrapper :deep(.cl-card) {
  background: linear-gradient(135deg, rgba(15, 41, 74, 0.75) 0%, rgba(15, 23, 42, 0.85) 50%, rgba(124, 45, 18, 0.7) 100%) !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  color: #f8fafc !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 20px 50px rgba(7, 19, 36, 0.8), 0 0 40px rgba(37, 99, 235, 0.2), 0 0 30px rgba(249, 115, 22, 0.2) !important;
  border-radius: 1rem !important;
  max-width: 380px !important;
}

.clerk-orange-wrapper :deep(.cl-headerTitle) {
  color: #ffffff !important;
}

.clerk-orange-wrapper :deep(.cl-headerSubtitle) {
  color: #cbd5e1 !important;
}

.clerk-orange-wrapper :deep(.cl-formFieldLabel) {
  color: #cbd5e1 !important;
}

.clerk-orange-wrapper :deep(.cl-formFieldInput) {
  background-color: rgba(2, 6, 23, 0.7) !important;
  color: #f8fafc !important;
  border-color: rgba(148, 163, 184, 0.3) !important;
}

.clerk-orange-wrapper :deep(.cl-formButtonPrimary) {
  background: linear-gradient(to right, #2563eb, #4f46e5, #ea580c) !important;
  color: #ffffff !important;
}

/* Hide split footer */
.clerk-orange-wrapper :deep(.cl-footer),
.clerk-orange-wrapper :deep(.cl-footerAction),
.clerk-orange-wrapper :deep(.cl-footerPages),
.clerk-orange-wrapper :deep(.cl-devModeBadge) {
  display: none !important;
}
</style>



