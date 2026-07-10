<template>
  <div class="min-h-screen bg-[#F8F9FA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold font-manrope text-gray-900 mb-2">Complete Profile</h2>
        <p class="text-gray-500 text-sm">Please finalize your account setup to enter the portal.</p>
      </div>

      <form @submit.prevent="handleOnboarding" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#D4755B] text-gray-950 font-medium"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <input
            v-model="form.email"
            type="email"
            disabled
            class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed font-medium"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Account Role</label>
          <select
            v-model="form.role"
            required
            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#D4755B] text-gray-950 font-medium"
          >
            <option value="" disabled>Select your role...</option>
            <option value="tenant">Tenant (Renting a property)</option>
            <option value="propertyowner">Property Owner (Asset Owner)</option>
          </select>
        </div>

        <div v-if="error" class="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-3 bg-[#D4755B] hover:bg-[#B86851] text-white font-bold rounded-lg transition-colors flex items-center justify-center shadow-lg hover:shadow-xl"
        >
          <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ authStore.loading ? 'Setting up...' : 'Complete Setup & Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = ref({
  name: '',
  email: '',
  role: '',
  googleId: ''
})

const error = ref(null)

onMounted(() => {
  form.value.name = route.query.name || ''
  form.value.email = route.query.email || ''
  form.value.googleId = route.query.googleId || ''
  
  if (!form.value.email || !form.value.googleId) {
    router.push('/login')
  }
})

async function handleOnboarding() {
  error.value = null
  const result = await authStore.onboardSocialUser(
    form.value.name,
    form.value.email,
    form.value.role,
    form.value.googleId
  )
  if (result.success) {
    const roleDashboardMap = {
      propertyowner: '/dashboard/owner',
      tenant: '/dashboard/tenant'
    }
    router.push(roleDashboardMap[form.value.role] || '/')
  } else {
    error.value = result.error || 'Failed to complete profile registration.'
  }
}
</script>
