<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,#1c0c03_0%,#071324_60%,#030810_100%)] text-slate-100 px-4 py-6 selection:bg-orange-500 selection:text-white relative">
    
    <!-- Top Navigation -->
    <div class="absolute top-6 right-6 z-10">
      <router-link 
        to="/admin/login" 
        class="text-xs font-semibold text-orange-200/80 hover:text-white transition-all flex items-center gap-1.5 bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-orange-500/20 hover:border-orange-500/40 shadow-sm"
      >
        <svg class="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Sign In</span>
      </router-link>
    </div>

    <!-- Central Authentication Card -->
    <div class="w-full max-w-[380px] mx-auto my-auto flex flex-col items-center">
      
      <div class="w-full bg-gradient-to-b from-amber-950/80 via-orange-950/85 to-slate-950/90 backdrop-blur-2xl rounded-2xl p-6 border border-orange-500/30 shadow-2xl shadow-orange-950/60">
        <div class="text-center mb-6">
          <div class="w-12 h-12 bg-orange-900/40 rounded-full flex items-center justify-center mx-auto mb-3 border border-orange-500/30">
            <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 class="text-xl font-extrabold text-white tracking-tight">Reset Password</h2>
          <p class="text-orange-200/70 text-xs mt-1">Enter your email to receive a password reset code</p>
        </div>

        <div v-if="successMsg" class="mb-4 p-3.5 bg-emerald-950/80 border border-emerald-800/80 rounded-lg text-xs text-emerald-200 leading-relaxed">
          {{ successMsg }}
        </div>

        <div v-if="errorMsg" class="mb-4 p-3 bg-red-950/80 border border-red-800/80 rounded-lg text-xs text-red-200">
          {{ errorMsg }}
        </div>

        <form v-if="!successMsg" @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="forgot-email" class="block text-[11px] font-semibold text-orange-200/90 mb-1 uppercase tracking-wider">Email Address</label>
            <input 
              id="forgot-email" 
              v-model="email" 
              type="email" 
              required 
              placeholder="user@example.com" 
              class="w-full px-3.5 py-2.5 bg-slate-950/90 border border-orange-900/60 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-600"
            >
          </div>
          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-orange-600/30 transition-all disabled:opacity-50"
          >
            <span v-if="!loading">Send Reset Code via Resend</span>
            <span v-else>Sending Email...</span>
          </button>
        </form>

        <div v-else class="mt-4">
          <router-link 
            :to="`/reset-password?email=${encodeURIComponent(email)}`" 
            class="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-orange-600/30 transition-all text-center block"
          >
            Proceed to Enter Code
          </router-link>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useSEO } from '@/hooks/useSEO'

useSEO({
  title: 'Forgot Password | KSA Valuers',
  description: 'Request a password reset link or OTP code via email.',
})

const authStore = useAuthStore()
const email = ref('')
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const handleSubmit = async () => {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const res = await authStore.forgotPassword(email.value)
    if (res.success) {
      successMsg.value = res.message || 'If an account exists with that email, a password reset code has been sent via Resend.'
    } else {
      errorMsg.value = res.error || 'Failed to request password reset.'
    }
  } catch (err) {
    errorMsg.value = 'An unexpected error occurred.'
  } finally {
    loading.value = false
  }
}
</script>
