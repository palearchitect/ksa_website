<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-slate-950 bg-[radial-gradient(ellipse_at_top_left,rgba(234,88,12,0.35)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(37,99,235,0.4)_0%,transparent_50%),linear-gradient(to_right,#000000_0%,#030712_15%,#071324_50%,#030712_85%,#000000_100%)] text-slate-100 px-4 py-6 selection:bg-orange-500 selection:text-white relative overflow-hidden">
    
    <!-- Ambient Glow Orbs (Orange Top-Left, Blue Bottom-Right) -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Top Navigation -->
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
      
      <div class="w-full bg-gradient-to-br from-orange-950/70 via-slate-950/85 to-blue-950/75 backdrop-blur-2xl rounded-2xl p-6 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(249,115,22,0.2),0_0_40px_rgba(37,99,235,0.2)]">
        <div class="text-center mb-6">
          <h2 class="text-xl font-extrabold text-white tracking-tight bg-gradient-to-r from-orange-300 via-white to-blue-300 bg-clip-text text-transparent">Create Account</h2>
          <p class="text-slate-300/80 text-xs mt-1 font-medium">Join KSA Valuers management portal</p>
        </div>

        <div v-if="errorMsg" class="mb-4 p-3 bg-red-950/80 border border-red-800/80 rounded-lg text-xs text-red-200">
          {{ errorMsg }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="reg-name" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Full Name</label>
            <input 
              id="reg-name" 
              v-model="name" 
              type="text" 
              required 
              placeholder="John Doe" 
              class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-500"
            >
          </div>
          <div>
            <label for="reg-email" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Email Address</label>
            <input 
              id="reg-email" 
              v-model="email" 
              type="email" 
              required 
              placeholder="user@example.com" 
              class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-500"
            >
          </div>
          <div>
            <label for="reg-password" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Password</label>
            <div class="relative">
              <input 
                id="reg-password" 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                required 
                placeholder="Min 8 chars (letters + numbers)" 
                class="w-full px-3.5 py-2.5 pr-10 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-500"
              >
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none p-1"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.007 10.007 0 014.122-.963c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
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

      <!-- Toggle Link -->
      <div class="mt-4 text-center">
        <router-link 
          to="/admin/login" 
          class="text-xs text-slate-300 hover:text-white font-medium transition inline-flex items-center gap-1.5"
        >
          <span>Already have an account?</span>
          <span class="font-bold underline underline-offset-4 text-orange-400 hover:text-orange-300">Sign In</span>
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
  title: 'Register | KSA Valuers',
  description: 'Create your KSA Valuers portal account.',
})

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const handleRegister = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await authStore.register(name.value, email.value, password.value)
    if (res.success) {
      router.push(`/verify-email?email=${encodeURIComponent(email.value)}`)
    } else if (res.code === 'USER_ALREADY_EXISTS' || (res.error && (res.error.toLowerCase().includes('already') || res.error.toLowerCase().includes('exist')))) {
      router.push('/admin/login?tab=login&notice=account_exists')
    } else {
      errorMsg.value = res.error || 'Registration failed.'
    }
  } catch (err) {
    errorMsg.value = 'An unexpected error occurred.'
  } finally {
    loading.value = false
  }
}
</script>
