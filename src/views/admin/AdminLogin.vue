<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-slate-950 bg-[radial-gradient(ellipse_at_top_left,rgba(234,88,12,0.35)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(37,99,235,0.4)_0%,transparent_50%),linear-gradient(to_right,#000000_0%,#030712_15%,#071324_50%,#030712_85%,#000000_100%)] text-slate-100 px-4 py-6 selection:bg-orange-500 selection:text-white relative overflow-hidden">
    
    <!-- Ambient Glow Orbs (Orange Top-Left, Blue Bottom-Right) -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Top Navigation (Back to Website) -->
    <div class="absolute top-6 right-6 z-10">
      <router-link 
        to="/" 
        class="text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 bg-slate-900/70 hover:bg-slate-800/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 hover:border-orange-500/40 shadow-sm"
      >
        <svg class="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Website</span>
      </router-link>
    </div>

    <!-- Central Authentication Card -->
    <div class="w-full max-w-[380px] mx-auto my-auto flex flex-col items-center z-10">
      
      <!-- Clerk Authentication Component -->
      <div v-if="hasClerkKey && !useDirectDatabaseLogin" class="w-full flex flex-col items-center clerk-orange-wrapper">
        <AuthenticateWithRedirectCallback 
          v-if="isSsoCallback" 
          signUpForceRedirectUrl="/dashboard/admin"
          signInForceRedirectUrl="/dashboard/admin"
        />
        <SignIn 
          v-else-if="activeTab === 'login'" 
          routing="path" 
          path="/admin/login" 
          signUpUrl="/admin/login?tab=signup"
          forceRedirectUrl="/dashboard/admin"
          fallbackRedirectUrl="/dashboard/admin"
          :appearance="clerkAppearance"
        />
        <SignUp 
          v-else 
          routing="path" 
          path="/admin/login" 
          signInUrl="/admin/login"
          forceRedirectUrl="/dashboard/admin"
          fallbackRedirectUrl="/dashboard/admin"
          :appearance="clerkAppearance"
        />

        <button 
          type="button" 
          @click="useDirectDatabaseLogin = true" 
          class="mt-3 text-[11px] text-slate-400 hover:text-orange-400 transition underline underline-offset-4"
        >
          Sign in with Database Credentials →
        </button>
      </div>

      <!-- Fallback Custom Transparent Blue-to-Orange Glass Tile -->
      <div v-else class="w-full bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-2xl p-6 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(37,99,235,0.2),0_0_40px_rgba(249,115,22,0.2)]">
        <div v-if="hasClerkKey" class="mb-4 text-left">
          <button 
            type="button" 
            @click="useDirectDatabaseLogin = false" 
            class="text-[11px] text-blue-400 hover:text-blue-300 transition inline-flex items-center gap-1 font-medium"
          >
            ← Back to Clerk SSO Sign In
          </button>
        </div>
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
              <router-link to="/forgot-password" class="text-[11px] text-blue-400 hover:text-blue-300 font-medium transition">
                Forgot password?
              </router-link>
            </div>
            <div class="relative">
              <input 
                id="login-password" 
                v-model="loginForm.password" 
                :type="showLoginPassword ? 'text' : 'password'" 
                required 
                placeholder="••••••••••••" 
                class="w-full px-3.5 py-2.5 pr-10 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-500"
              >
              <button 
                type="button" 
                @click="showLoginPassword = !showLoginPassword" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none p-1"
                :aria-label="showLoginPassword ? 'Hide password' : 'Show password'"
              >
                <!-- Sleek fine-lined Eye icon when visible -->
                <svg v-if="showLoginPassword" class="w-4 h-4 text-slate-400 hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <!-- Sleek fine-lined EyeOff icon when hidden -->
                <svg v-else class="w-4 h-4 text-slate-400 hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full py-2.5 bg-slate-800/90 hover:bg-[linear-gradient(to_right,#f97316,#3b82f6)] border border-slate-700 hover:border-white/40 text-white font-bold rounded-lg text-xs shadow-md hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all duration-300 disabled:opacity-50"
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
            <label for="signup-role" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Account Role</label>
            <select 
              id="signup-role" 
              v-model="registerForm.role" 
              class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition cursor-pointer"
            >
              <option value="tenant" class="bg-slate-900 text-white">Tenant / Resident</option>
              <option value="propertyowner" class="bg-slate-900 text-white">Property Owner / Investor</option>
              <option value="admin" class="bg-slate-900 text-white">Administrator / Staff</option>
            </select>
          </div>
          <div>
            <label for="signup-password" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Password</label>
            <div class="relative">
              <input 
                id="signup-password" 
                v-model="registerForm.password" 
                :type="showRegisterPassword ? 'text' : 'password'" 
                required 
                placeholder="Min 12 chars (Upper, lower, number, special)" 
                class="w-full px-3.5 py-2.5 pr-10 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-500"
              >
              <button 
                type="button" 
                @click="showRegisterPassword = !showRegisterPassword" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none p-1"
                :aria-label="showRegisterPassword ? 'Hide password' : 'Show password'"
              >
                <!-- Sleek fine-lined Eye icon when visible -->
                <svg v-if="showRegisterPassword" class="w-4 h-4 text-slate-400 hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <!-- Sleek fine-lined EyeOff icon when hidden -->
                <svg v-else class="w-4 h-4 text-slate-400 hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full py-2.5 bg-slate-800/90 hover:bg-[linear-gradient(to_right,#f97316,#3b82f6)] border border-slate-700 hover:border-white/40 text-white font-bold rounded-lg text-xs shadow-md hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all duration-300 disabled:opacity-50"
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
import { SignIn, SignUp, AuthenticateWithRedirectCallback } from '@clerk/vue'
import { useAuthStore } from '@/stores/authStore'
import { useSEO } from '@/hooks/useSEO'

useSEO({
  title: 'Portal Authentication | KSA Valuers',
  description: 'Sign in or register to access KSA Valuers management dashboards and client portals.',
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isSsoCallback = computed(() => {
  return route.path.includes('sso-callback') || route.query.sso === 'true' || !!route.query.code
})

const activeTab = ref(route.query.tab === 'signup' ? 'signup' : 'login')
const loading = ref(false)
const errorMessage = ref('')
const noticeMessage = ref('')
const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ name: '', email: '', password: '' })
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)
const useDirectDatabaseLogin = ref(route.query.direct === 'true')


const checkAndRedirect = () => {
  if (authStore.isAuthenticated) {
    const rawTarget = route.query.redirect ? decodeURIComponent(String(route.query.redirect)) : null
    const target = rawTarget && !rawTarget.startsWith('/admin/login') && !rawTarget.startsWith('/login')
      ? rawTarget
      : '/dashboard/admin'
    router.replace(target)
  }
}

onMounted(async () => {
  // If user is already authenticated, don't display login card
  await authStore.loadSession()
  checkAndRedirect()

  if (route.query.notice === 'account_not_found' || route.query.error === 'user_not_found') {
    activeTab.value = 'signup'
    noticeMessage.value = 'No account found with this email. Please sign up to create a new account.'
  } else if (route.query.notice === 'account_exists' || route.query.error === 'user_exists') {
    activeTab.value = 'login'
    noticeMessage.value = 'An account already exists with this email. Please sign in instead.'
  } else if (route.query.notice === 'email_verified') {
    activeTab.value = 'login'
    noticeMessage.value = 'Your email has been verified successfully! Please enter your credentials to sign in.'
  }
})

watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth) checkAndRedirect()
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

// Transparent Orange-to-Blue Clerk appearance styling
const clerkAppearance = {
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'w-full max-w-[380px]',
    card: 'shadow-2xl rounded-2xl border border-white/15 bg-gradient-to-br from-orange-950/70 via-slate-950/85 to-blue-950/75 backdrop-blur-2xl text-white w-full max-w-[380px] p-5',
    headerTitle: 'text-white font-extrabold text-xl text-center tracking-tight',
    headerSubtitle: 'text-slate-200 text-xs text-center mt-1 font-normal',
    socialButtonsBlockButton: 'border border-white/10 bg-slate-900/60 hover:bg-slate-800/80 text-white rounded-lg font-medium text-xs py-2 transition',
    socialButtonsBlockButtonText: 'text-slate-100 font-medium text-xs',
    dividerRow: 'my-4',
    dividerText: 'text-slate-200 text-[10px] font-semibold uppercase tracking-widest',
    formFieldLabel: 'text-slate-200 text-[11px] font-semibold mb-1 uppercase tracking-wider',
    formFieldHintText: 'text-slate-200 font-medium text-[11px]',
    formFieldSuccessText: 'text-emerald-300 font-medium text-[11px]',
    formFieldErrorText: 'text-red-300 font-medium text-[11px]',
    formFieldInputShowPasswordButton: 'text-slate-100 hover:text-white',
    formFieldInputShowPasswordIcon: 'text-slate-100 hover:text-white w-4 h-4',
    formFieldForgotPasswordLink: 'text-blue-400 hover:text-blue-300 font-medium text-[11px]',
    formFieldInput: 'bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs py-2 px-3 transition outline-none placeholder:text-slate-400',
    formButtonPrimary: 'bg-slate-800/90 hover:bg-gradient-to-r hover:from-orange-500 hover:to-blue-500 text-white font-bold text-xs py-2.5 rounded-lg shadow-md transition-all duration-300 border border-slate-700 hover:border-white/40',
    organizationPreviewMainIdentifier: 'text-white font-bold',
    organizationPreviewSecondaryIdentifier: 'text-slate-200 font-medium',
    organizationPreviewTextContainer: 'text-white',
    organizationSwitcherTriggerText: 'text-white font-medium',
    organizationListCard: 'bg-slate-900/90 text-white border border-white/15',
    organizationListHeaderTitle: 'text-white font-bold',
    organizationListHeaderSubtitle: 'text-slate-200',
    organizationListCreateOrganizationButton: 'hidden !important',
    organizationSwitcherPopoverCard: 'bg-slate-950 text-white border border-white/15',
    organizationSwitcherPopoverActionButton: 'text-white hover:bg-slate-800',
    organizationSwitcherPopoverActionButtonText: 'text-white font-medium',
    footer: 'hidden',
    footerAction: 'hidden',
    footerPages: 'hidden',
    devModeBadge: 'hidden'
  },
  variables: {
    colorPrimary: '#60a5fa',
    colorText: '#ffffff',
    colorTextSecondary: '#e2e8f0',
    colorBackground: '#0b1329',
    colorInputBackground: '#020617',
    colorInputText: '#ffffff',
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
    const res = await authStore.register(
      registerForm.value.name, 
      registerForm.value.email, 
      registerForm.value.password, 
      registerForm.value.role || 'tenant'
    )
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
  background: linear-gradient(135deg, rgba(15, 41, 74, 0.75) 0%, rgba(15, 23, 42, 0.85) 50%, rgba(124, 45, 18, 0.75) 100%) !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  color: #f8fafc !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(37, 99, 235, 0.2), 0 0 40px rgba(249, 115, 22, 0.2) !important;
  border-radius: 1rem !important;
  max-width: 380px !important;
}

.clerk-orange-wrapper :deep(.cl-headerTitle) {
  color: #ffffff !important;
}

.clerk-orange-wrapper :deep(.cl-headerSubtitle),
.clerk-orange-wrapper :deep(.cl-formFieldHintText),
.clerk-orange-wrapper :deep(.cl-identityPreviewText),
.clerk-orange-wrapper :deep(.cl-formFieldLabel),
.clerk-orange-wrapper :deep(.cl-dividerText) {
  color: #e2e8f0 !important;
}

/* Ensure Organization text and titles are bright white and legible */
.clerk-orange-wrapper :deep(.cl-organizationPreviewMainIdentifier),
.clerk-orange-wrapper :deep(.cl-organizationPreviewTextContainer),
.clerk-orange-wrapper :deep(.cl-organizationSwitcherTriggerText),
.clerk-orange-wrapper :deep(.cl-organizationListHeaderTitle),
.clerk-orange-wrapper :deep(.cl-organizationPreviewTitle),
.clerk-orange-wrapper :deep(.cl-organizationListCardTitle),
.clerk-orange-wrapper :deep(.cl-userPreviewMainIdentifier),
.clerk-orange-wrapper :deep(.cl-userPreviewSecondaryIdentifier),
.clerk-orange-wrapper :deep(.cl-navbarButton),
.clerk-orange-wrapper :deep(.cl-breadcrumbsItem),
.clerk-orange-wrapper :deep(.cl-menuButton),
.clerk-orange-wrapper :deep(.cl-menuItem),
.clerk-orange-wrapper :deep(p),
.clerk-orange-wrapper :deep(span),
.clerk-orange-wrapper :deep(h1),
.clerk-orange-wrapper :deep(h2),
.clerk-orange-wrapper :deep(h3) {
  color: #ffffff !important;
}

.clerk-orange-wrapper :deep(.cl-organizationPreviewSecondaryIdentifier),
.clerk-orange-wrapper :deep(.cl-organizationListHeaderSubtitle) {
  color: #cbd5e1 !important;
}

/* Completely hide Create Organization button & creation UI */
.clerk-orange-wrapper :deep(.cl-organizationListCreateOrganizationButton),
.clerk-orange-wrapper :deep(button[class*="CreateOrganization"]),
.clerk-orange-wrapper :deep(button[class*="createOrganization"]),
.clerk-orange-wrapper :deep(.cl-organizationSwitcherPopoverActionButton__createOrganization),
.clerk-orange-wrapper :deep(div[class*="createOrganization"]) {
  display: none !important;
}

/* Crisp 1.5px stroke outline for Clerk's password show/hide eye icon */
.clerk-orange-wrapper :deep(.cl-formFieldInputShowPasswordButton),
.clerk-orange-wrapper :deep(button[class*="ShowPassword"]),
.clerk-orange-wrapper :deep(button[class*="showPassword"]) {
  color: #cbd5e1 !important;
  opacity: 1 !important;
  background: transparent !important;
}

.clerk-orange-wrapper :deep(.cl-formFieldInputShowPasswordIcon),
.clerk-orange-wrapper :deep(svg[class*="ShowPassword"]),
.clerk-orange-wrapper :deep(svg[class*="showPassword"]) {
  color: #cbd5e1 !important;
  fill: none !important;
  stroke: currentColor !important;
  stroke-width: 1.5px !important;
  opacity: 1 !important;
}

/* Forgot password link set to blue */
.clerk-orange-wrapper :deep(.cl-formFieldForgotPasswordLink) {
  color: #60a5fa !important;
}

.clerk-orange-wrapper :deep(.cl-formFieldForgotPasswordLink:hover) {
  color: #93c5fd !important;
}

.clerk-orange-wrapper :deep(.cl-formFieldInput) {
  background-color: rgba(2, 6, 23, 0.7) !important;
  color: #f8fafc !important;
  border-color: rgba(148, 163, 184, 0.3) !important;
}

/* Neutral default button that transitions to bright orange-to-blue gradient on hover */
.clerk-orange-wrapper :deep(.cl-formButtonPrimary) {
  background: rgba(30, 41, 59, 0.9) !important;
  border: 1px solid rgba(148, 163, 184, 0.3) !important;
  color: #ffffff !important;
  transition: all 0.3s ease !important;
}

.clerk-orange-wrapper :deep(.cl-formButtonPrimary:hover) {
  background: linear-gradient(to right, #f97316, #3b82f6) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 0 25px rgba(249, 115, 22, 0.4) !important;
}

/* Hide split footer */
.clerk-orange-wrapper :deep(.cl-footer),
.clerk-orange-wrapper :deep(.cl-footerAction),
.clerk-orange-wrapper :deep(.cl-footerPages),
.clerk-orange-wrapper :deep(.cl-devModeBadge) {
  display: none !important;
}
</style>




