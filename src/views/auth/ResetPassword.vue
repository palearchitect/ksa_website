<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-slate-950 bg-[radial-gradient(ellipse_at_top_left,rgba(234,88,12,0.35)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(37,99,235,0.4)_0%,transparent_50%),linear-gradient(to_right,#000000_0%,#030712_15%,#071324_50%,#030712_85%,#000000_100%)] text-slate-100 px-4 py-6 selection:bg-orange-500 selection:text-white relative overflow-hidden">
    
    <!-- Ambient Glow Orbs -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Top Navigation -->
    <div class="absolute top-6 right-6 z-10">
      <router-link 
        to="/admin/login" 
        class="text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 bg-slate-900/70 hover:bg-slate-800/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 hover:border-orange-500/40 shadow-sm"
      >
        <svg class="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Sign In</span>
      </router-link>
    </div>

    <!-- Central Authentication Card -->
    <div class="w-full max-w-[380px] mx-auto my-auto flex flex-col items-center z-10">
      
      <div class="w-full bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-2xl p-6 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(37,99,235,0.2),0_0_40px_rgba(249,115,22,0.2)]">
        <div class="text-center mb-6">
          <h2 class="text-xl font-extrabold text-white tracking-tight bg-gradient-to-r from-blue-300 via-white to-orange-300 bg-clip-text text-transparent">Set New Password</h2>
          <p class="text-slate-300/80 text-xs mt-1 font-medium">Enter your reset code and choose a new password</p>
        </div>

        <div v-if="successMsg" class="mb-4 p-3.5 bg-emerald-950/80 border border-emerald-800/80 rounded-lg text-xs text-emerald-200 leading-relaxed">
          {{ successMsg }}
        </div>

        <div v-if="errorMsg" class="mb-4 p-3 bg-red-950/80 border border-red-800/80 rounded-lg text-xs text-red-200">
          {{ errorMsg }}
        </div>

        <form v-if="!successMsg" @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="reset-email" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Email Address</label>
            <input 
              id="reset-email" 
              v-model="email" 
              type="email" 
              required 
              placeholder="user@example.com" 
              class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-500"
            >
          </div>

          <div>
            <label for="reset-code" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">6-Digit Reset Code</label>
            <input 
              id="reset-code" 
              v-model="code" 
              type="text" 
              required 
              maxlength="6"
              placeholder="123456" 
              class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-500 tracking-widest font-mono"
            >
          </div>

          <div>
            <label for="reset-password" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">New Password</label>
            <div class="relative">
              <input 
                id="reset-password" 
                v-model="newPassword" 
                :type="showPassword ? 'text' : 'password'" 
                required 
                placeholder="••••••••••••" 
                class="w-full px-3.5 py-2.5 pr-10 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition placeholder:text-slate-500"
              >
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none p-1"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <!-- Sleek fine-lined Eye icon when visible -->
                <svg v-if="showPassword" class="w-4 h-4 text-slate-400 hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
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
            <span v-if="!loading">Reset Password</span>
            <span v-else>Updating...</span>
          </button>
        </form>

        <div v-else class="mt-4">
          <router-link 
            to="/admin/login" 
            class="w-full py-2.5 bg-slate-800/90 hover:bg-[linear-gradient(to_right,#f97316,#3b82f6)] border border-slate-700 hover:border-white/40 text-white font-bold rounded-lg text-xs shadow-md hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all duration-300 text-center block"
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
const showPassword = ref(false)
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
