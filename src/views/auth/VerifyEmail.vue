<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,#1c0c03_0%,#071324_60%,#030810_100%)] text-slate-100 px-4 py-6 selection:bg-orange-500 selection:text-white relative">
    
    <!-- Top Navigation -->
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
    <div class="w-full max-w-[420px] mx-auto my-auto flex flex-col items-center">
      
      <div class="w-full bg-gradient-to-b from-amber-950/80 via-orange-950/85 to-slate-950/90 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 border border-orange-500/30 shadow-2xl shadow-orange-950/60">
        
        <div class="text-center mb-6">
          <div class="w-12 h-12 bg-orange-900/40 rounded-full flex items-center justify-center mx-auto mb-3 border border-orange-500/30">
            <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
            </svg>
          </div>
          <h2 class="text-xl font-extrabold text-white tracking-tight">Verify Your Email</h2>
          <p class="text-orange-200/70 text-xs mt-1">Enter the 6-digit verification code sent via Resend to:</p>
          <p class="text-orange-400 font-semibold text-xs mt-1 truncate">{{ email }}</p>
        </div>

        <!-- Alerts -->
        <div v-if="alertMsg" :class="['p-3 rounded-lg border text-xs mb-4', alertIsError ? 'bg-red-950/80 border-red-800 text-red-200' : 'bg-emerald-950/80 border-emerald-800 text-emerald-200']">
          {{ alertMsg }}
        </div>

        <form @submit.prevent="handleVerify" class="space-y-6">
          
          <!-- Digit Box Inputs -->
          <div class="flex justify-between gap-2 max-w-xs mx-auto">
            <input
              v-for="(digit, idx) in 6"
              :key="idx"
              :ref="el => { if (el) inputRefs[idx] = el }"
              v-model="digits[idx]"
              type="text"
              maxlength="1"
              class="w-10 h-12 text-center text-lg font-bold border border-orange-900/60 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-slate-950 text-white uppercase"
              @input="handleInput($event, idx)"
              @keydown.delete="handleBackspace($event, idx)"
              @paste="handlePaste"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="auth.loading || isSubmitting"
            class="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-orange-600/30 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            <span v-if="!(auth.loading || isSubmitting)">Verify & Proceed</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          </button>
        </form>

        <!-- Resend OTP timer -->
        <div class="text-center text-xs text-orange-200/70 mt-6">
          Didn't receive the email?
          <div class="mt-1.5">
            <button
              v-if="countdown === 0"
              @click="handleResend"
              :disabled="resending"
              class="text-orange-400 hover:text-orange-300 font-bold transition disabled:opacity-50 underline underline-offset-4"
            >
              {{ resending ? 'Sending...' : 'Resend verification code' }}
            </button>
            <span v-else class="text-slate-400 font-medium">
              Resend code in <strong class="text-orange-400 font-mono">{{ countdown }}s</strong>
            </span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const digits = ref(['', '', '', '', '', ''])
const inputRefs = ref([])
const isSubmitting = ref(false)
const resending = ref(false)

const alertMsg = ref('')
const alertIsError = ref(false)

// Timer
const countdown = ref(59)
let timerId = null

onMounted(() => {
  email.value = route.query.email || ''
  if (!email.value) {
    router.push('/login')
  }
  startTimer()
  // Focus first input box
  setTimeout(() => {
    if (inputRefs.value[0]) {
      inputRefs.value[0].focus()
    }
  }, 100)
})

onBeforeUnmount(() => {
  stopTimer()
})

function startTimer() {
  stopTimer()
  countdown.value = 59
  timerId = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      stopTimer()
    }
  }, 1000)
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

function triggerAlert(msg, isErr = false) {
  alertMsg.value = msg
  alertIsError.value = isErr
  setTimeout(() => {
    alertMsg.value = ''
  }, 6000)
}

// Digit input handlers
function handleInput(e, idx) {
  const val = e.target.value
  if (!/^[0-9]$/.test(val)) {
    digits.value[idx] = ''
    return
  }
  // Focus next box if value inserted
  if (val && idx < 5) {
    inputRefs.value[idx + 1].focus()
  }
}

function handleBackspace(e, idx) {
  // Focus previous box on backspace if current is empty
  if (!digits.value[idx] && idx > 0) {
    inputRefs.value[idx - 1].focus()
  }
}

function handlePaste(e) {
  e.preventDefault()
  const data = e.clipboardData.getData('text').trim().slice(0, 6)
  if (!/^[0-9]{6}$/.test(data)) return
  for (let i = 0; i < 6; i++) {
    digits.value[i] = data[i]
  }
  inputRefs.value[5].focus()
}

// Actions
async function handleVerify() {
  const code = digits.value.join('')
  if (code.length < 6) {
    triggerAlert('Please enter the full 6-digit code.', true)
    return
  }

  isSubmitting.value = true
  const res = await auth.verifyOTP(email.value, code)
  isSubmitting.value = false

  if (res.success) {
    triggerAlert('Email verified successfully! Redirecting...', false)
    setTimeout(() => {
      // Route based on role
      const roleMap = {
        admin: '/dashboard/admin',
        webadmin: '/dashboard/admin',
        manager: '/',
        management: '/',
        propertyowner: '/',
        tenant: '/'
      }
      router.push(roleMap[res.user?.role] || '/')
    }, 1500)
  } else {
    triggerAlert(res.error || 'Failed to verify OTP. Please try again.', true)
  }
}

async function handleResend() {
  resending.value = true
  const res = await auth.resendOTP(email.value)
  resending.value = false

  if (res.success) {
    triggerAlert('Verification OTP code resent successfully!', false)
    startTimer()
  } else {
    triggerAlert(res.error || 'Failed to resend code.', true)
  }
}
</script>
