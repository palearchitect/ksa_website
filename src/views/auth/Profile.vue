<template>
  <div class="min-h-screen py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
    <!-- Back button -->
    <div class="mb-4">
      <button @click="router.back()" class="flex items-center text-slate-400 hover:text-white focus:outline-none font-semibold transition text-xs bg-slate-900/60 border border-white/10 hover:border-orange-500/40 px-3.5 py-2 rounded-xl backdrop-blur-md">
        <svg class="w-4 h-4 mr-1.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>
    </div>

    <div class="bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/15">
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-orange-600/80 via-slate-950/90 to-blue-600/80 px-6 py-8 sm:px-10 text-white border-b border-white/15">
        <h1 class="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 via-white to-orange-300 bg-clip-text text-transparent">User Profile & Account Settings</h1>
        <p class="mt-1 text-slate-300 text-xs font-medium">Manage your personal profile, Clerk credentials, security preferences, and active sessions.</p>
      </div>

      <!-- Tabs Navigation -->
      <div class="border-b border-white/10 bg-slate-950/60 flex flex-wrap">
        <button
          v-if="hasClerkKey"
          @click="activeTab = 'clerk'"
          :class="[
            'py-3.5 px-6 font-semibold text-xs border-b-2 transition-all duration-200 flex items-center gap-2',
            activeTab === 'clerk'
              ? 'border-orange-400 text-white bg-slate-900/80 shadow-inner'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          ]"
        >
          <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Account & Security (Clerk)</span>
        </button>
        <button
          v-for="tab in availableTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-3.5 px-6 font-semibold text-xs border-b-2 transition-all duration-200',
            activeTab === tab.id
              ? 'border-blue-400 text-white bg-slate-900/80 shadow-inner'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          ]"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="p-6 sm:p-8">
        <!-- Error & Success Alerts -->
        <div v-if="successMsg" class="mb-6 p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl flex items-center text-emerald-200 text-xs font-medium backdrop-blur-md">
          <svg class="w-4 h-4 mr-2.5 flex-shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ successMsg }}
        </div>
        <div v-if="errorMsg || authStore.error" class="mb-6 p-4 bg-red-950/80 border border-red-800 rounded-xl flex items-center text-red-200 text-xs font-medium backdrop-blur-md">
          <svg class="w-4 h-4 mr-2.5 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {{ errorMsg || authStore.error }}
        </div>

        <!-- ── TAB 0: Clerk Customization Pane ────────────────────────────── -->
        <div v-if="activeTab === 'clerk' && hasClerkKey" class="w-full flex justify-center clerk-profile-wrapper">
          <UserProfile :appearance="clerkAppearance" />
        </div>

        <!-- ── TAB 1: General Settings ────────────────────────────────────── -->
        <div v-if="activeTab === 'general'" class="space-y-8">
          <form @submit.prevent="handleUpdateProfile" class="space-y-6">
            <h3 class="text-base font-bold text-white border-b border-white/10 pb-2">Profile Information</h3>
            
            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <label class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  :value="user?.email"
                  disabled
                  class="w-full px-3.5 py-2.5 bg-slate-900/60 text-slate-400 rounded-lg border border-slate-700/60 cursor-not-allowed text-xs font-medium"
                />
                <span class="text-[10px] text-slate-400 mt-1 block">Your email address cannot be changed.</span>
              </div>
              
              <div>
                <label class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Account Role</label>
                <input
                  type="text"
                  :value="user?.role?.toUpperCase()"
                  disabled
                  class="w-full px-3.5 py-2.5 bg-slate-900/60 text-orange-400 rounded-lg border border-slate-700/60 cursor-not-allowed text-xs font-bold"
                />
              </div>

              <div class="sm:col-span-2">
                <label for="profileName" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  id="profileName"
                  v-model="profileName"
                  required
                  placeholder="Enter your name"
                  class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-2.5 bg-slate-800/90 hover:bg-gradient-to-r hover:from-orange-500 hover:to-blue-500 border border-slate-700 hover:border-white/40 text-white font-bold rounded-lg text-xs shadow-md transition-all duration-300 disabled:opacity-50"
              >
                {{ loading ? 'Saving...' : 'Update Name' }}
              </button>
            </div>
          </form>

          <!-- Google SSO Link section -->
          <div class="space-y-4 pt-6 border-t border-white/10">
            <h3 class="text-base font-bold text-white">Google Authentication</h3>
            <p class="text-xs text-slate-300">Enable one-click login by linking your Google account credentials.</p>
            
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-950/70 rounded-xl border border-white/10 gap-4">
              <div class="flex items-center">
                <div class="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mr-3 text-red-400 flex-shrink-0">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3 0.6 4.6 1.8l2.4-2.4C17.3 1.6 14.9 0.8 12.24 0.8c-5.97 0-10.8 4.83-10.8 10.8s4.83 10.8 10.8 10.8c6.26 0 10.4-4.4 10.4-10.6 0-0.7-.1-1.3-.2-1.8H12.24z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-white text-xs">Google Sign-in Link</h4>
                  <p class="text-[10px] text-slate-400">{{ user?.googleLinked ? 'Linked to your Google account' : 'Not linked yet' }}</p>
                </div>
              </div>

              <div>
                <button
                  v-if="user?.googleLinked"
                  @click="handleUnlinkGoogle"
                  :disabled="loading"
                  class="w-full sm:w-auto px-4 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 font-semibold rounded-lg text-xs border border-red-800/60 transition-colors"
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
            <h3 class="text-base font-bold text-white border-b border-white/10 pb-2">Update Password</h3>
            
            <div class="space-y-4">
              <div>
                <label for="currPass" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Current Password</label>
                <input
                  type="password"
                  id="currPass"
                  v-model="passwordForm.current"
                  required
                  placeholder="••••••••••••"
                  class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition"
                />
              </div>

              <div>
                <label for="newPass" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  id="newPass"
                  v-model="passwordForm.new"
                  required
                  placeholder="••••••••••••"
                  class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition"
                />
                <span class="text-[10px] text-slate-400 mt-1 block">Password must be at least 12 characters, with uppercase, lowercase, numbers, and special symbols.</span>
              </div>

              <div>
                <label for="confirmPass" class="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPass"
                  v-model="passwordForm.confirm"
                  required
                  placeholder="••••••••••••"
                  class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/60 focus:border-orange-400 focus:ring-1 focus:ring-orange-500/30 rounded-lg text-white text-xs outline-none transition"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-2.5 bg-slate-800/90 hover:bg-gradient-to-r hover:from-orange-500 hover:to-blue-500 border border-slate-700 hover:border-white/40 text-white font-bold rounded-lg text-xs shadow-md transition-all duration-300 disabled:opacity-50"
              >
                {{ loading ? 'Updating...' : 'Change Password' }}
              </button>
            </div>
          </form>
        </div>

        <!-- ── TAB 3: Danger Zone ─────────────────────────────────────────── -->
        <div v-if="activeTab === 'danger'" class="space-y-6">
          <div class="p-6 border border-red-800/60 rounded-2xl bg-red-950/40 backdrop-blur-md">
            <h3 class="text-base font-bold text-red-300">Deactivate Account</h3>
            <p class="mt-2 text-xs text-red-200/80 leading-relaxed">
              Deactivating your account will instantly lock you out and terminate your access to the KSA Valuers management portal.
              This is a soft delete: your profile is hidden from the directories, but database integrity remains.
            </p>
            
            <form @submit.prevent="handleDeactivate" class="mt-6 space-y-4">
              <div>
                <label for="deactConfirm" class="block text-[11px] font-bold text-red-200 mb-1 uppercase tracking-wider">Confirm Your Password</label>
                <p class="text-[10px] text-red-300 mb-2">Please enter your active account password to authorize this action.</p>
                <input
                  type="password"
                  id="deactConfirm"
                  v-model="deactivatePassword"
                  required
                  placeholder="••••••••••••"
                  class="w-full px-3.5 py-2.5 bg-slate-950 border border-red-800/80 rounded-lg text-white text-xs outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="loading || !deactivatePassword"
                  class="px-6 py-2.5 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-lg text-xs shadow-md transition-colors"
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
import { UserProfile } from '@clerk/vue'
import { useAuthStore } from '@/stores/authStore'
import { useSEO } from '@/hooks/useSEO'

useSEO({
  title: 'Profile & Account Settings | KSA Valuers',
  description: 'Manage your KSA Valuers user profile, login credentials, and Clerk security preferences.',
})

const router = useRouter()
const authStore = useAuthStore()

const hasClerkKey = computed(() => {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  return key && key.startsWith('pk_')
})

const availableTabs = [
  { id: 'general', name: 'General Information' },
  { id: 'password', name: 'Security & Password' },
  { id: 'danger', name: 'Danger Zone' }
]

const activeTab = ref(hasClerkKey.value ? 'clerk' : 'general')
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const profileName = ref('')
const passwordForm = ref({ current: '', new: '', confirm: '' })
const deactivatePassword = ref('')

const user = computed(() => authStore.user)

const clerkAppearance = {
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'w-full shadow-2xl rounded-2xl border border-white/15 bg-gradient-to-br from-orange-950/70 via-slate-950/85 to-blue-950/75 backdrop-blur-2xl text-white',
    card: 'bg-transparent text-white border-0 shadow-none p-4',
    headerTitle: 'text-white font-extrabold text-xl tracking-tight',
    headerSubtitle: 'text-slate-200 text-xs mt-1 font-normal',
    navbarButton: 'text-slate-300 hover:text-white font-medium text-xs py-2',
    navbarButton__active: 'text-white font-bold bg-slate-900/80 rounded-lg border border-white/10',
    profileSectionTitleText: 'text-white font-bold text-sm border-b border-white/10 pb-1',
    profileSectionPrimaryButton: 'text-blue-400 hover:text-blue-300 font-semibold text-xs',
    formFieldLabel: 'text-slate-200 text-[11px] font-semibold mb-1 uppercase tracking-wider',
    formFieldInput: 'bg-slate-950/70 border border-slate-700/60 text-white text-xs py-2 px-3 rounded-lg outline-none focus:border-orange-400',
    formButtonPrimary: 'bg-slate-800/90 hover:bg-gradient-to-r hover:from-orange-500 hover:to-blue-500 text-white font-bold text-xs py-2 rounded-lg transition-all',
    footer: 'hidden'
  },
  variables: {
    colorPrimary: '#60a5fa',
    colorText: '#ffffff',
    colorTextSecondary: '#e2e8f0',
    colorBackground: '#0b1329',
    colorInputBackground: '#020617',
    colorInputText: '#ffffff'
  }
}

onMounted(() => {
  if (user.value) {
    profileName.value = user.value.name || ''
  }
  
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

<style scoped>
.clerk-profile-wrapper :deep(.cl-cardBox),
.clerk-profile-wrapper :deep(.cl-card) {
  background: linear-gradient(135deg, rgba(15, 41, 74, 0.75) 0%, rgba(15, 23, 42, 0.85) 50%, rgba(124, 45, 18, 0.75) 100%) !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  color: #f8fafc !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 1rem !important;
  width: 100% !important;
}

.clerk-profile-wrapper :deep(p),
.clerk-profile-wrapper :deep(span),
.clerk-profile-wrapper :deep(h1),
.clerk-profile-wrapper :deep(h2),
.clerk-profile-wrapper :deep(h3),
.clerk-profile-wrapper :deep(div) {
  color: #ffffff !important;
}

.clerk-profile-wrapper :deep(.cl-navbarButton) {
  color: #cbd5e1 !important;
}

.clerk-profile-wrapper :deep(.cl-navbarButton:hover) {
  color: #ffffff !important;
  background-color: rgba(30, 41, 59, 0.7) !important;
}
</style>
