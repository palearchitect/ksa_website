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
          <h2 class="text-xl font-extrabold text-white tracking-tight">Set New Password</h2>
          <p class="text-orange-200/70 text-xs mt-1">Enter your reset code and choose a new password</p>
        </div>

        <div v-if="successMsg" class="mb-4 p-3.5 bg-emerald-950/80 border border-emerald-800/80 rounded-lg text-xs text-emerald-200 leading-relaxed">
          {{ successMsg }}
        </div>

        <div v-if="errorMsg" class="mb-4 p-3 bg-red-950/80 border border-red-800/80 rounded-lg text-xs text-red-200">
          {{ errorMsg }}
        </div>

        <form v-if="!successMsg" @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="reset-email" class="block text-[11px] font-semibold text-orange-200/90 mb-1 uppercase tracking-wider">Email Address</label>
            <input 
              id="reset-email" 
              v-model="email" 
              type="email" 
              required 
              placeholder="user@example.com" 
              class="w-full px-3.5 py-2.5 bg-slate-950/90 border border-orange-900/60 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-600"
            >
          </div>

          <div>
            <label for="reset-code" class="block text-[11px] font-semibold text-orange-200/90 mb-1 uppercase tracking-wider">6-Digit Reset Code</label>
            <input 
              id="reset-code" 
              v-model="code" 
              type="text" 
              required 
              maxlength="6"
              placeholder="123456" 
              class="w-full px-3.5 py-2.5 bg-slate-950/90 border border-orange-900/60 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-600 tracking-widest font-mono"
            >
          </div>

          <div>
            <label for="reset-password" class="block text-[11px] font-semibold text-orange-200/90 mb-1 uppercase tracking-wider">New Password</label>
            <input 
              id="reset-password" 
              v-model="newPassword" 
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
            <span v-if="!loading">Reset Password</span>
            <span v-else>Updating...</span>
          </button>
        </form>

        <div v-else class="mt-4">
          <router-link 
            to="/admin/login" 
            class="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-orange-600/30 transition-all text-center block"
          >
            Back to Sign In
          </router-link>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useSEO } from '@/hooks/useSEO'

useSEO({
  title: 'Set New Password | KSA Valuers',
  description: 'Enter your reset code to update your password.',
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const code = ref('')
const newPassword = ref('')
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

onMounted(() => {
  email.value = route.query.email || ''
  code.value = route.query.code || ''
})

const handleSubmit = async () => {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const res = await authStore.resetPassword(email.value, code.value, newPassword.value)
    if (res.success) {
      successMsg.value = res.message || 'Password reset successfully! You can now log in.'
      setTimeout(() => {
        router.push('/admin/login')
      }, 2000)
    } else {
      errorMsg.value = res.error || 'Failed to reset password.'
    }
  } catch (err) {
    errorMsg.value = 'An unexpected error occurred.'
  } finally {
    loading.value = false
  }
}
</script>
