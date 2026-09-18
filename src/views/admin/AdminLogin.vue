<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,#1c0c03_0%,#071324_60%,#030810_100%)] text-slate-100 px-4 py-6 selection:bg-orange-500 selection:text-white relative">
    
    <!-- Top Navigation (Back to Website) -->
    <div class="absolute top-6 right-6 z-10">
      <router-link 
        to="/" 
        class="text-xs font-semibold text-orange-200/80 hover:text-white transition-all flex items-center gap-1.5 bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-orange-500/20 hover:border-orange-500/40 shadow-sm"
      >
        <svg class="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Website</span>
      </router-link>
    </div>

    <!-- Central Authentication Card -->
    <div class="w-full max-w-[380px] mx-auto my-auto flex flex-col items-center">
      
      <!-- Clerk Authentication Component (Frosted Orange Glass Card) -->
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

      <!-- Fallback Custom Frosted Orange Form -->
      <div v-else class="w-full bg-gradient-to-b from-amber-950/80 via-orange-950/85 to-slate-950/90 backdrop-blur-2xl rounded-2xl p-6 border border-orange-500/30 shadow-2xl shadow-orange-950/60">
        <div class="text-center mb-6">
          <h2 class="text-xl font-extrabold text-white tracking-tight">
            {{ activeTab === 'signup' ? 'Create Account' : 'Portal Sign In' }}
          </h2>
          <p class="text-orange-200/70 text-xs mt-1">
            {{ activeTab === 'signup' ? 'Join KSA Valuers management portal' : 'Enter your credentials to continue' }}
          </p>
        </div>

        <div v-if="noticeMessage" class="mb-4 p-3 bg-amber-950/80 border border-amber-600/80 rounded-lg text-xs text-amber-200 leading-relaxed font-medium">
          {{ noticeMessage }}
        </div>

        <div v-if="errorMessage" class="mb-4 p-3 bg-red-950/80 border border-red-800/80 rounded-lg text-xs text-red-200">
          {{ errorMessage }}
        </div>

        <!-- LOGIN FORM -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleCustomLogin" class="space-y-4">
          <div>
            <label for="login-email" class="block text-[11px] font-semibold text-orange-200/90 mb-1 uppercase tracking-wider">Email</label>
            <input 
              id="login-email" 
              v-model="loginForm.email" 
              type="email" 
              required 
              placeholder="admin@ksavaluers.com" 
              class="w-full px-3.5 py-2.5 bg-slate-950/90 border border-orange-900/60 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-600"
            >
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <label for="login-password" class="block text-[11px] font-semibold text-orange-200/90 uppercase tracking-wider">Password</label>
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
              class="w-full px-3.5 py-2.5 bg-slate-950/90 border border-orange-900/60 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-600"
            >
          </div>
          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-orange-600/30 transition-all disabled:opacity-50"
          >
            <span v-if="!loading">Sign In</span>
            <span v-else>Signing in...</span>
          </button>
        </form>

        <!-- SIGNUP FORM -->
        <form v-else @submit.prevent="handleCustomRegister" class="space-y-4">
          <div>
            <label for="signup-name" class="block text-[11px] font-semibold text-orange-200/90 mb-1 uppercase tracking-wider">Full Name</label>
            <input 
              id="signup-name" 
              v-model="registerForm.name" 
              type="text" 
              required 
              placeholder="John Doe" 
              class="w-full px-3.5 py-2.5 bg-slate-950/90 border border-orange-900/60 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-600"
            >
          </div>
          <div>
            <label for="signup-email" class="block text-[11px] font-semibold text-orange-200/90 mb-1 uppercase tracking-wider">Email Address</label>
            <input 
              id="signup-email" 
              v-model="registerForm.email" 
              type="email" 
              required 
              placeholder="user@example.com" 
              class="w-full px-3.5 py-2.5 bg-slate-950/90 border border-orange-900/60 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-600"
            >
          </div>
          <div>
            <label for="signup-password" class="block text-[11px] font-semibold text-orange-200/90 mb-1 uppercase tracking-wider">Password</label>
            <input 
              id="signup-password" 
              v-model="registerForm.password" 
              type="password" 
              required 
              placeholder="Min 8 chars (letters + numbers)" 
              class="w-full px-3.5 py-2.5 bg-slate-950/90 border border-orange-900/60 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-600"
            >
          </div>
          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-orange-600/30 transition-all disabled:opacity-50"
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
          class="text-xs text-orange-300/90 hover:text-white font-medium transition inline-flex items-center gap-1.5"
        >
          <span>Don't have an account?</span>
          <span class="font-bold underline underline-offset-4 text-orange-400 hover:text-orange-300">Sign Up</span>
        </button>
        <button 
          v-else 
          @click="switchTab('login')" 
          class="text-xs text-orange-300/90 hover:text-white font-medium transition inline-flex items-center gap-1.5"
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

// Frosted Orange Clerk appearance styling
const clerkAppearance = {
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'w-full max-w-[380px]',
    card: 'shadow-2xl shadow-orange-950/60 rounded-2xl border border-orange-500/30 bg-orange-950/70 backdrop-blur-2xl text-white w-full max-w-[380px] p-5',
    headerTitle: 'text-white font-extrabold text-xl text-center tracking-tight',
    headerSubtitle: 'text-orange-200/70 text-xs text-center mt-1 font-normal',
    socialButtonsBlockButton: 'border border-orange-500/30 bg-orange-900/40 hover:bg-orange-900/60 text-white rounded-lg font-medium text-xs py-2 transition',
    socialButtonsBlockButtonText: 'text-orange-100 font-medium text-xs',
    dividerRow: 'my-4',
    dividerText: 'text-orange-300/60 text-[10px] font-semibold uppercase tracking-widest',
    formFieldLabel: 'text-orange-200/90 text-[11px] font-semibold mb-1 uppercase tracking-wider',
    formFieldInput: 'bg-slate-950/90 border border-orange-900/60 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs py-2 px-3 transition outline-none placeholder:text-slate-500',
    formButtonPrimary: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs py-2.5 rounded-lg shadow-md transition-all border-0',
    footer: 'hidden',
    footerAction: 'hidden',
    footerPages: 'hidden',
    devModeBadge: 'hidden'
  },
  variables: {
    colorPrimary: '#ea580c',
    colorText: '#f8fafc',
    colorBackground: '#431407',
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
/* Scoped overrides to enforce Frosted Orange styling on Clerk internal elements */
.clerk-orange-wrapper :deep(.cl-cardBox),
.clerk-orange-wrapper :deep(.cl-card) {
  background: rgba(67, 20, 7, 0.8) !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  color: #f8fafc !important;
  border: 1px solid rgba(249, 115, 22, 0.35) !important;
  box-shadow: 0 25px 50px -12px rgba(234, 88, 12, 0.3), 0 10px 25px -5px rgba(0, 0, 0, 0.8) !important;
  border-radius: 1rem !important;
  max-width: 380px !important;
}

.clerk-orange-wrapper :deep(.cl-headerTitle) {
  color: #ffffff !important;
}

.clerk-orange-wrapper :deep(.cl-headerSubtitle) {
  color: #fed7aa !important;
}

.clerk-orange-wrapper :deep(.cl-formFieldLabel) {
  color: #ffedd5 !important;
}

.clerk-orange-wrapper :deep(.cl-formFieldInput) {
  background-color: #020617 !important;
  color: #f8fafc !important;
  border-color: rgba(194, 65, 12, 0.6) !important;
}

.clerk-orange-wrapper :deep(.cl-formButtonPrimary) {
  background: linear-gradient(to right, #ea580c, #d97706) !important;
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


