<template>
  <div class="space-y-8 p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Superadmin Control Portal</h1>
        <p class="text-gray-500 mt-1">Manage platform accounts, impersonate sessions, and audit system mutations.</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          ]"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- Alert Banner -->
    <div v-if="alertMsg" :class="['p-4 rounded-xl flex items-center border text-sm', alertIsError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700']">
      <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ alertMsg }}</span>
    </div>

    <!-- ── TAB 1: User Management ────────────────────────────────────────── -->
    <div v-if="activeTab === 'users'" class="space-y-6">
      
      <!-- Actions Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
        <h2 class="text-xl font-bold text-gray-900">Account Directory</h2>
        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md transition-colors"
        >
          + Create New Account
        </button>
      </div>

      <!-- Users Grid -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                <th class="p-4">Name & Email</th>
                <th class="p-4">Role</th>
                <th class="p-4">Status</th>
                <th class="p-4">Google SSO</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm">
              <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50/50 transition-colors">
                <td class="p-4">
                  <div class="font-semibold text-gray-900">{{ u.name }}</div>
                  <div class="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                    {{ u.email }}
                    <span v-if="u.isWhitelisted" class="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">Ghost Admin Whitelisted</span>
                  </div>
                </td>
                <td class="p-4">
                  <span class="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gray-100 text-gray-800">
                    {{ u.role }}
                  </span>
                </td>
                <td class="p-4">
                  <span :class="['px-2 py-0.5 rounded text-xs font-semibold', u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                    {{ u.status }}
                  </span>
                </td>
                <td class="p-4">
                  <span :class="['text-xs', u.googleLinked ? 'text-green-600 font-semibold' : 'text-gray-400']">
                    {{ u.googleLinked ? 'Linked' : 'Not Linked' }}
                  </span>
                </td>
                <td class="p-4 text-right space-x-2">
                  <!-- Impersonation button -->
                  <button
                    v-if="u.id !== user?.id && u.status === 'active'"
                    @click="handleImpersonate(u.id)"
                    class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold rounded"
                    title="Sign-in as this user"
                  >
                    Impersonate
                  </button>
                  <button
                    @click="openEditModal(u)"
                    class="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold rounded"
                  >
                    Edit
                  </button>
                  <button
                    v-if="u.id !== user?.id"
                    @click="handleDeleteUser(u.id)"
                    class="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold rounded"
                  >
                    Suspend
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── TAB 2: Cryptographic Audit Logs ───────────────────────────────── -->
    <div v-if="activeTab === 'logs'" class="space-y-6">
      
      <!-- Info Header -->
      <div class="bg-indigo-900 text-white p-6 rounded-2xl shadow-sm space-y-2">
        <h2 class="text-xl font-bold">Tamper-Proof Mutation Audit Logs</h2>
        <p class="text-indigo-200 text-sm">
          Every insert, update, or delete in key tables triggers an audit log. The system computes a cryptographic HMAC SHA-256 hash using the server JWT secret.
          Any modification directly in the database without matching HMAC signature is flagged instantly.
        </p>
      </div>

      <!-- Logs Directory -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                <th class="p-4">Timestamp</th>
                <th class="p-4">Operator (Email)</th>
                <th class="p-4">Action & Table</th>
                <th class="p-4">Record ID</th>
                <th class="p-4">Security Verification</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm">
              <tr
                v-for="log in logs"
                :key="log.id"
                :class="['hover:bg-gray-50/50 transition-colors', !log.verified ? 'bg-red-50/70 hover:bg-red-50 text-red-900' : '']"
              >
                <td class="p-4 text-xs font-mono text-gray-500">
                  {{ formatDate(log.created_at) }}
                </td>
                <td class="p-4 font-semibold text-gray-800">
                  {{ log.user_email }}
                </td>
                <td class="p-4">
                  <div class="font-semibold">{{ log.action }}</div>
                  <div class="text-xs text-gray-400 mt-0.5 font-mono">{{ log.table_name }}</div>
                </td>
                <td class="p-4 font-mono text-xs text-gray-500">
                  {{ log.record_id }}
                </td>
                <td class="p-4">
                  <span
                    v-if="log.verified"
                    class="inline-flex items-center text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded"
                  >
                    <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M2.166 11.37a1 1 0 011.203-.765l4.303 1.13 6.942-8.33a1 1 0 111.538 1.28l-7.72 9.262a1 1 0 01-1.442.029l-4.06-4.124a1 1 0 01-.765-1.203z" clip-rule="evenodd" />
                    </svg>
                    Signature Verified
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded animate-pulse"
                  >
                    <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    TAMPERED RECORD DETECTED
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── MODAL: Create / Edit User ────────────────────────────────────── -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100">
        <div class="bg-blue-900 text-white p-6">
          <h3 class="text-xl font-bold">{{ modalMode === 'create' ? 'Create Account' : 'Edit Account' }}</h3>
        </div>
        <form @submit.prevent="handleSaveUser" class="p-6 space-y-4">
          <div>
            <label for="mName" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="mName"
              v-model="modalForm.name"
              required
              class="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label for="mEmail" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="mEmail"
              v-model="modalForm.email"
              required
              :disabled="modalMode === 'edit'"
              class="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          <div v-if="modalMode === 'create'">
            <label for="mPassword" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="mPassword"
              v-model="modalForm.password"
              required
              class="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <span class="text-[10px] text-gray-400 mt-1 block">Must meet length and complex strength criteria.</span>
          </div>

          <div>
            <label for="mRole" class="block text-sm font-medium text-gray-700 mb-1">Account Role</label>
            <select
              id="mRole"
              v-model="modalForm.role"
              required
              class="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="admin">Superadmin</option>
              <option value="webadmin">Web Content Admin</option>
              <option value="manager">PMS Manager</option>
              <option value="management">PMS Management Staff</option>
              <option value="propertyowner">Property Owner</option>
              <option value="tenant">Tenant</option>
            </select>
          </div>

          <div>
            <label for="mStatus" class="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
            <select
              id="mStatus"
              v-model="modalForm.status"
              required
              class="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 bg-gray-50 hover:bg-gray-100 border text-gray-700 text-sm font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { adminService } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const tabs = [
  { id: 'users', name: 'Users Portal' },
  { id: 'logs', name: 'Security Audit Logs' }
]

const activeTab = ref('users')
const users = ref([])
const logs = ref([])

const alertMsg = ref('')
const alertIsError = ref(false)

const showModal = ref(false)
const modalMode = ref('create') // create | edit
const selectedUserId = ref(null)
const modalForm = ref({ name: '', email: '', password: '', role: 'tenant', status: 'active' })

const user = computed(() => authStore.user)

// Load data
onMounted(() => {
  fetchUsers()
})

watch(activeTab, (newTab) => {
  if (newTab === 'users') {
    fetchUsers()
  } else if (newTab === 'logs') {
    fetchLogs()
  }
})

async function fetchUsers() {
  try {
    const res = await adminService.getUsers()
    users.value = res.data
  } catch (err) {
    triggerAlert(err.response?.data?.message || err.message, true)
  }
}

async function fetchLogs() {
  try {
    const res = await adminService.getAuditLogs()
    logs.value = res.data
  } catch (err) {
    triggerAlert(err.response?.data?.message || err.message, true)
  }
}

function triggerAlert(msg, isError = false) {
  alertMsg.value = msg
  alertIsError.value = isError
  setTimeout(() => {
    alertMsg.value = ''
  }, 5000)
}

// User Actions
function openCreateModal() {
  modalMode.value = 'create'
  modalForm.value = { name: '', email: '', password: '', role: 'tenant', status: 'active' }
  showModal.value = true
}

function openEditModal(u) {
  modalMode.value = 'edit'
  selectedUserId.value = u.id
  modalForm.value = { name: u.name, email: u.email, password: '', role: u.role, status: u.status }
  showModal.value = true
}

async function handleSaveUser() {
  try {
    if (modalMode.value === 'create') {
      const res = await adminService.createUser(modalForm.value)
      if (res.success) {
        triggerAlert('User account created successfully!')
        showModal.value = false
        fetchUsers()
      }
    } else {
      const res = await adminService.updateUser(selectedUserId.value, {
        name: modalForm.value.name,
        role: modalForm.value.role,
        status: modalForm.value.status
      })
      if (res.success) {
        triggerAlert('User account updated successfully!')
        showModal.value = false
        fetchUsers()
      }
    }
  } catch (err) {
    triggerAlert(err.response?.data?.message || err.message, true)
  }
}

async function handleDeleteUser(id) {
  if (!confirm('Are you sure you want to suspend this user? They will be locked out immediately.')) return
  try {
    const res = await adminService.deleteUser(id)
    if (res.success) {
      triggerAlert('User account suspended (soft deleted) successfully!')
      fetchUsers()
    }
  } catch (err) {
    triggerAlert(err.response?.data?.message || err.message, true)
  }
}

async function handleImpersonate(userId) {
  if (!confirm('Are you sure you want to impersonate this user? You will temporarily view the platform through their identity.')) return
  try {
    const res = await authStore.startImpersonation(userId)
    if (!res.success) {
      triggerAlert(res.error, true)
    }
  } catch (err) {
    triggerAlert(err.message, true)
  }
}

// Utilities
function formatDate(d) {
  return new Date(d).toLocaleString()
}
</script>
