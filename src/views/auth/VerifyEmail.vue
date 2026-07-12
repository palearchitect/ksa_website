<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 px-4 sm:px-6 lg:px-8">
    <div class="absolute inset-0 bg-black opacity-20"></div>

    <div class="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      
      <!-- Top banner styling matching KSA Premium -->
      <div class="bg-blue-950 p-8 text-center text-white relative">
        <div class="absolute top-4 left-4">
          <router-link to="/" class="text-blue-200 hover:text-white flex items-center gap-1 text-sm font-semibold transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </router-link>
        </div>
        
        <div class="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-800 shadow-md">
          <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold tracking-tight">Verify Your Email</h2>
        <p class="text-blue-200 text-sm mt-2">Enter the 6-digit verification code sent to:</p>
        <p class="text-amber-400 font-semibold text-sm mt-1 truncate">{{ email }}</p>
      </div>

      <div class="p-8 space-y-6">
        
        <!-- Alerts -->
        <div v-if="alertMsg" :class="['p-4 rounded-xl border text-sm', alertIsError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700']">
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
              class="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 uppercase"
              @input="handleInput($event, idx)"
              @keydown.delete="handleBackspace($event, idx)"
              @paste="handlePaste"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="auth.loading || isSubmitting"
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <span v-if="!(auth.loading || isSubmitting)">Verify & Proceed</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          </button>
        </form>

        <!-- Resend OTP timer -->
        <div class="text-center text-sm text-gray-500">
          Didn't receive the email?
          <div class="mt-2">
            <button
              v-if="countdown === 0"
              @click="handleResend"
              :disabled="resending"
              class="text-blue-600 hover:text-blue-800 font-bold transition disabled:opacity-50"
            >
              {{ resending ? 'Sending...' : 'Resend verification code' }}
            </button>
            <span v-else class="text-gray-400 font-medium">
              Resend code in <strong class="text-gray-600 font-mono">{{ countdown }}s</strong>
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
