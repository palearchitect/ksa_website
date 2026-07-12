<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto mb-4">
      <button @click="router.back()" class="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none font-semibold transition text-sm">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
    </div>

    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-900 to-indigo-800 px-6 py-8 sm:px-10 text-white">
        <h1 class="text-3xl font-bold">Account Settings</h1>
        <p class="mt-2 text-blue-100">Manage your profile, login credentials, and account security preferences.</p>
      </div>

      <!-- Tabs Navigation -->
      <div class="border-b border-gray-200 bg-gray-50 flex">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 py-4 px-6 text-center font-semibold text-sm border-b-2 transition-all duration-200',
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="p-6 sm:p-10">
        <!-- Error & Success Alerts -->
        <div v-if="successMsg" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center text-green-700 text-sm">
          <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ successMsg }}
        </div>
        <div v-if="errorMsg || authStore.error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700 text-sm">
          <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {{ errorMsg || authStore.error }}
        </div>

        <!-- ── TAB 1: General Settings ────────────────────────────────────── -->
        <div v-if="activeTab === 'general'" class="space-y-8">
          <form @submit.prevent="handleUpdateProfile" class="space-y-6">
            <h3 class="text-xl font-bold text-gray-900 border-b pb-2">Profile Information</h3>
            
            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  :value="user?.email"
                  disabled
                  class="w-full px-4 py-3 bg-gray-100 text-gray-500 rounded-lg border border-gray-200 cursor-not-allowed text-sm"
                />
                <span class="text-xs text-gray-400 mt-1 block">Your email address cannot be changed.</span>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Account Role</label>
                <input
                  type="text"
                  :value="user?.role?.toUpperCase()"
                  disabled
                  class="w-full px-4 py-3 bg-gray-100 text-gray-500 rounded-lg border border-gray-200 cursor-not-allowed text-sm font-semibold"
                />
              </div>

              <div class="sm:col-span-2">
                <label for="profileName" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="profileName"
                  v-model="profileName"
                  required
                  placeholder="Enter your name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg text-sm shadow-md transition-all duration-200"
              >
                {{ loading ? 'Saving...' : 'Update Name' }}
              </button>
            </div>
          </form>

          <!-- Google SSO Link section -->
          <div class="space-y-4 pt-6 border-t border-gray-200">
            <h3 class="text-xl font-bold text-gray-900">Google Authentication</h3>
            <p class="text-sm text-gray-500">Enable one-click login by linking your Google account credentials.</p>
            
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 gap-4">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4 text-red-600">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3 0.6 4.6 1.8l2.4-2.4C17.3 1.6 14.9 0.8 12.24 0.8c-5.97 0-10.8 4.83-10.8 10.8s4.83 10.8 10.8 10.8c6.26 0 10.4-4.4 10.4-10.6 0-0.7-.1-1.3-.2-1.8H12.24z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 text-sm">Google Sign-in Link</h4>
                  <p class="text-xs text-gray-500">{{ user?.googleLinked ? 'Linked to your Google account' : 'Not linked yet' }}</p>
                </div>
              </div>

              <div>
                <button
                  v-if="user?.googleLinked"
                  @click="handleUnlinkGoogle"
                  :disabled="loading"
                  class="w-full sm:w-auto px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg text-sm border border-red-200 transition-colors"
                >
                  Unlink Account
                </button>
                <div v-else class="flex justify-center">
                  <div id="google-link-btn"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── TAB 2: Change Password ─────────────────────────────────────── -->
        <div v-if="activeTab === 'password'">
          <form @submit.prevent="handleChangePassword" class="space-y-6">
            <h3 class="text-xl font-bold text-gray-900 border-b pb-2">Update Password</h3>
            
            <div class="space-y-4">
              <div>
                <label for="currPass" class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  id="currPass"
                  v-model="passwordForm.current"
                  required
                  placeholder="••••••••••••"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label for="newPass" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  id="newPass"
                  v-model="passwordForm.new"
                  required
                  placeholder="••••••••••••"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span class="text-xs text-gray-400 mt-1 block">Password must be at least 12 characters, with uppercase, lowercase, numbers, and special symbols.</span>
              </div>

              <div>
                <label for="confirmPass" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPass"
                  v-model="passwordForm.confirm"
                  required
                  placeholder="••••••••••••"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg text-sm shadow-md transition-all duration-200"
              >
                {{ loading ? 'Updating...' : 'Change Password' }}
              </button>
            </div>
          </form>
        </div>

        <!-- ── TAB 3: Danger Zone ─────────────────────────────────────────── -->
        <div v-if="activeTab === 'danger'" class="space-y-6">
          <div class="p-6 border border-red-200 rounded-2xl bg-red-50/50">
            <h3 class="text-xl font-bold text-red-800">Deactivate Account</h3>
            <p class="mt-2 text-sm text-red-700">
              Deactivating your account will instantly lock you out and terminate your access to the KSA Valuers management portal.
              This is a soft delete: your profile is hidden from the directories, but database integrity remains.
            </p>
            
            <form @submit.prevent="handleDeactivate" class="mt-6 space-y-4">
              <div>
                <label for="deactConfirm" class="block text-sm font-bold text-red-900 mb-1">Confirm Your Password</label>
                <p class="text-xs text-red-600 mb-2">Please enter your active account password to authorize this action.</p>
                <input
                  type="password"
                  id="deactConfirm"
                  v-model="deactivatePassword"
                  required
                  placeholder="••••••••••••"
                  class="w-full px-4 py-3 border border-red-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                />
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="loading || !deactivatePassword"
                  class="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg text-sm shadow-md transition-colors"
                >
                  {{ loading ? 'Deactivating...' : 'Permanently Deactivate Account' }}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const tabs = [
  { id: 'general', name: 'General Information' },
  { id: 'password', name: 'Security & Password' },
  { id: 'danger', name: 'Danger Zone' }
]

const activeTab = ref('general')
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const profileName = ref('')
const passwordForm = ref({ current: '', new: '', confirm: '' })
const deactivatePassword = ref('')

const user = computed(() => authStore.user)

onMounted(() => {
  if (user.value) {
    profileName.value = user.value.name || ''
  }
  
  // Render Google Login link button if script is available
  nextTick(() => {
    initGoogleLinkButton()
  })
})

function initGoogleLinkButton() {
  if (user.value?.googleLinked) return
  
  if (typeof window !== 'undefined' && window.google) {
    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleLinkSuccess
      })
      
      const container = document.getElementById('google-link-btn')
      if (container) {
        window.google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with'
        })
      }
    } catch (err) {
      console.error('Google link button initialization failed:', err)
    }
  } else {
    // Retry in 1 second if Google script hasn't finished loading yet
    setTimeout(initGoogleLinkButton, 1000)
  }
}

async function handleGoogleLinkSuccess(response) {
  loading.value = true
  successMsg.value = ''
  errorMsg.value = ''
  try {
    const res = await authStore.linkGoogle(response.credential)
    if (res.success) {
      successMsg.value = 'Successfully linked Google account!'
    } else {
      errorMsg.value = res.error || 'Failed to link Google account.'
    }
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
}

async function handleUnlinkGoogle() {
  if (!confirm('Are you sure you want to unlink your Google account? You will have to use your email and password to log in.')) return
  loading.value = true
  successMsg.value = ''
  errorMsg.value = ''
  try {
    const res = await authStore.unlinkGoogle()
    if (res.success) {
      successMsg.value = 'Successfully unlinked Google account!'
      // Re-initialize button after Vue rerender
      setTimeout(initGoogleLinkButton, 500)
    } else {
      errorMsg.value = res.error || 'Failed to unlink Google account.'
    }
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
}

async function handleUpdateProfile() {
  loading.value = true
  successMsg.value = ''
  errorMsg.value = ''
  try {
    const res = await authStore.updateProfile(profileName.value)
    if (res.success) {
      successMsg.value = 'Profile updated successfully!'
    } else {
      errorMsg.value = res.error || 'Failed to update profile.'
    }
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
}

async function handleChangePassword() {
  successMsg.value = ''
  errorMsg.value = ''
  
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    errorMsg.value = 'New passwords do not match.'
    return
  }
  
  loading.value = true
  try {
    const res = await authStore.changePassword(
      passwordForm.value.current,
      passwordForm.value.new
    )
    if (res.success) {
      successMsg.value = 'Password changed successfully!'
      passwordForm.value = { current: '', new: '', confirm: '' }
    } else {
      errorMsg.value = res.error || 'Failed to change password.'
    }
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
}

async function handleDeactivate() {
  if (!confirm('🚨 WARNING: Deactivating your account will instantly lock you out. This action cannot be undone by yourself. Proceed?')) return
  
  loading.value = true
  successMsg.value = ''
  errorMsg.value = ''
  try {
    const res = await authStore.deactivateAccount(deactivatePassword.value)
    if (res.success) {
      alert('Your account has been deactivated. You will now be redirected to the home page.')
      router.push('/')
    } else {
      errorMsg.value = res.error || 'Failed to deactivate account. Verify your password.'
    }
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
