<template>
  <div class="admin-dashboard space-y-8 p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="dash-header bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-500 mt-1">Welcome back, {{ adminName }}! Manage homepage hero slides, team directory staff, and FAQs.</p>
      </div>
    </div>

    <!-- Alert Message -->
    <div v-if="alertMsg" :class="['p-4 rounded-xl border text-sm flex items-center', alertIsError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700']">
      <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ alertMsg }}</span>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      <!-- Carousel Slides Card -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ heroSlideStore.slides.length }}</p>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Hero Carousel Banners</h3>
          <p class="text-gray-500 text-sm mt-1">Update website main landing banner images, slogans, and action buttons.</p>
        </div>
        <div class="mt-6 pt-4 border-t border-gray-100 flex gap-2">
          <router-link
            to="/dashboard/admin/slides"
            class="flex-1 text-center inline-flex justify-center items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg text-sm transition"
          >
            Manage Carousel
          </router-link>
        </div>
      </div>

      <!-- Team Members Card -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ teamStore.teamMembers.length }}</p>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Staff & Team Directory</h3>
          <p class="text-gray-500 text-sm mt-1">Manage partner details, staff photos, roles, biographies, and contacts.</p>
        </div>
        <div class="mt-6 pt-4 border-t border-gray-100 flex gap-2">
          <router-link
            to="/dashboard/admin/team"
            class="flex-1 text-center inline-flex justify-center items-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold rounded-lg text-sm transition"
          >
            Manage Staff
          </router-link>
        </div>
      </div>

      <!-- Properties Card -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ propertyStore.properties.length }}</p>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Property Listings</h3>
          <p class="text-gray-500 text-sm mt-1">Manage real estate listings, pricing, locations, and photo gallery.</p>
        </div>
        <div class="mt-6 pt-4 border-t border-gray-100 flex gap-2">
          <router-link
            to="/dashboard/admin/properties"
            class="flex-1 text-center inline-flex justify-center items-center px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-semibold rounded-lg text-sm transition"
          >
            Manage Properties
          </router-link>
        </div>
      </div>

      <!-- Ongoing Projects Card -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-red-100 text-red-600 rounded-xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ projectStore.projects.length }}</p>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Ongoing Projects</h3>
          <p class="text-gray-500 text-sm mt-1">Manage real estate development projects, completion rates, and budgets.</p>
        </div>
        <div class="mt-6 pt-4 border-t border-gray-100 flex gap-2">
          <router-link
            to="/dashboard/admin/projects"
            class="flex-grow text-center inline-flex justify-center items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg text-sm transition"
          >
            Manage Projects
          </router-link>
        </div>
      </div>

      <!-- FAQ Entries Card -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-green-100 text-green-600 rounded-xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ faqs.length }}</p>
          </div>
          <h3 class="text-lg font-bold text-gray-900">FAQ Database</h3>
          <p class="text-gray-500 text-sm mt-1">Manage questions and answers rendered on the public support page.</p>
        </div>
        <div class="mt-6 pt-4 border-t border-gray-100 flex gap-2">
          <a
            href="#faq-section"
            class="flex-1 text-center inline-flex justify-center items-center px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 font-semibold rounded-lg text-sm transition"
          >
            Jump to FAQs
          </a>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <!-- Add Hero Slide -->
        <router-link
          to="/dashboard/admin/slides/new"
          class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md border border-gray-150 transition cursor-pointer flex items-center"
        >
          <div class="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 text-sm">Add Hero Slide</h4>
            <p class="text-xs text-gray-500 mt-0.5">Create banner slide</p>
          </div>
        </router-link>

        <!-- Add Property -->
        <router-link
          to="/dashboard/admin/properties/new"
          class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md border border-gray-150 transition cursor-pointer flex items-center"
        >
          <div class="p-3 bg-yellow-100 text-yellow-600 rounded-full mr-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 text-sm">Add Property</h4>
            <p class="text-xs text-gray-500 mt-0.5">Create property listing</p>
          </div>
        </router-link>

        <!-- Add Project -->
        <router-link
          to="/dashboard/admin/projects/new"
          class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md border border-gray-150 transition cursor-pointer flex items-center"
        >
          <div class="p-3 bg-red-100 text-red-600 rounded-full mr-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 text-sm">Add Project</h4>
            <p class="text-xs text-gray-500 mt-0.5">Create development</p>
          </div>
        </router-link>

        <!-- Add Team Member -->
        <router-link
          to="/dashboard/admin/team/new"
          class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md border border-gray-150 transition cursor-pointer flex items-center"
        >
          <div class="p-3 bg-indigo-100 text-indigo-600 rounded-full mr-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 text-sm">Add Team Profile</h4>
            <p class="text-xs text-gray-500 mt-0.5">Create staff profile</p>
          </div>
        </router-link>

        <!-- Jump to FAQs -->
        <a
          href="#faq-section"
          class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md border border-gray-150 transition cursor-pointer flex items-center"
        >
          <div class="p-3 bg-green-100 text-green-600 rounded-full mr-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 text-sm">Manage FAQs</h4>
            <p class="text-xs text-gray-500 mt-0.5">Edit question database</p>
          </div>
        </a>

        <!-- Logout -->
        <button
          @click="logout"
          class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md border border-gray-150 transition cursor-pointer text-left w-full flex items-center"
        >
          <div class="p-3 bg-gray-100 text-gray-600 rounded-full mr-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 text-sm">Logout</h4>
            <p class="text-xs text-gray-500 mt-0.5">Sign out of admin panel</p>
          </div>
        </button>
      </div>
    </div>

    <!-- FAQ CRUD Section -->
    <div id="faq-section" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden space-y-6 p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4">
        <div>
          <h2 class="text-xl font-bold text-gray-900">FAQ Directory Management</h2>
          <p class="text-sm text-gray-500">Add, edit, or remove entries in the database.</p>
        </div>
        <button
          @click="openFAQModal()"
          class="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          + Add FAQ Entry
        </button>
      </div>

      <!-- FAQ Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
              <th class="p-4 w-16">Sort</th>
              <th class="p-4">Question</th>
              <th class="p-4">Answer Summary</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-for="f in faqs" :key="f.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="p-4 font-mono font-bold text-gray-500">
                {{ f.sort_order || 0 }}
              </td>
              <td class="p-4 font-semibold text-gray-900">
                {{ f.question }}
              </td>
              <td class="p-4 text-gray-500 max-w-md truncate">
                {{ f.answer }}
              </td>
              <td class="p-4 text-right space-x-2">
                <button
                  @click="openFAQModal(f)"
                  class="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  @click="handleDeleteFAQ(f.id)"
                  class="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold rounded-lg transition"
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="faqs.length === 0">
              <td colspan="4" class="p-8 text-center text-gray-400">
                No FAQ records found in the database.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- FAQ Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-100">
        <div class="bg-green-950 text-white p-6">
          <h3 class="text-xl font-bold">{{ modalMode === 'create' ? 'Create FAQ' : 'Edit FAQ' }}</h3>
        </div>
        <form @submit.prevent="handleSaveFAQ" class="p-6 space-y-4">
          <div>
            <label for="faqQ" class="block text-sm font-medium text-gray-700 mb-1">Question</label>
            <input
              type="text"
              id="faqQ"
              v-model="modalForm.question"
              required
              placeholder="e.g., How do I contact customer care?"
              class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label for="faqA" class="block text-sm font-medium text-gray-700 mb-1">Answer</label>
            <textarea
              id="faqA"
              v-model="modalForm.answer"
              required
              rows="5"
              placeholder="Enter detailed answer here..."
              class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none"
            ></textarea>
          </div>

          <div>
            <label for="faqOrder" class="block text-sm font-medium text-gray-700 mb-1">Sort Index Hierarchy (Lower numbers show first)</label>
            <input
              type="number"
              id="faqOrder"
              v-model="modalForm.sort_order"
              required
              min="0"
              class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 bg-gray-50 hover:bg-gray-100 border text-gray-700 text-sm font-semibold rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition"
            >
              Save FAQ
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHeroSlideStore } from '@/stores/heroSlideStore'
import { useTeamStore } from '@/stores/teamStore'
import { useFaqStore } from '@/stores/faqStore'
import { useAuthStore } from '@/stores/authStore'
import { usePropertyStore } from '@/stores/propertyStore'
import { useProjectStore } from '@/stores/projectStore'

const router = useRouter()
const heroSlideStore = useHeroSlideStore()
const teamStore = useTeamStore()
const faqStore = useFaqStore()
const authStore = useAuthStore()
const propertyStore = usePropertyStore()
const projectStore = useProjectStore()

const faqs = ref([])
const alertMsg = ref('')
const alertIsError = ref(false)

const showModal = ref(false)
const modalMode = ref('create')
const selectedFaqId = ref(null)
const modalForm = ref({ question: '', answer: '', sort_order: 0 })

const adminName = computed(() => authStore.user?.name || 'Admin')

onMounted(async () => {
  await Promise.all([
    heroSlideStore.fetchSlides(),
    teamStore.fetchTeamMembers(),
    propertyStore.fetchProperties(),
    projectStore.fetchProjects(),
    fetchFAQs()
  ])
})

async function fetchFAQs() {
  const res = await faqStore.fetchFAQs()
  if (res.success) {
    faqs.value = res.data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  } else {
    triggerAlert(res.message, true)
  }
}

function triggerAlert(msg, isError = false) {
  alertMsg.value = msg
  alertIsError.value = isError
  setTimeout(() => {
    alertMsg.value = ''
  }, 5000)
}

function openFAQModal(f = null) {
  if (f) {
    modalMode.value = 'edit'
    selectedFaqId.value = f.id
    modalForm.value = { question: f.question, answer: f.answer, sort_order: f.sort_order || 0 }
  } else {
    modalMode.value = 'create'
    modalForm.value = { question: '', answer: '', sort_order: 0 }
  }
  showModal.value = true
}

async function handleSaveFAQ() {
  try {
    if (modalMode.value === 'create') {
      const res = await faqStore.addFAQ(modalForm.value)
      if (res.success) {
        triggerAlert('FAQ entry created successfully!')
        showModal.value = false
        fetchFAQs()
      }
    } else {
      const res = await faqStore.updateFAQ(selectedFaqId.value, modalForm.value)
      if (res.success) {
        triggerAlert('FAQ entry updated successfully!')
        showModal.value = false
        fetchFAQs()
      }
    }
  } catch (err) {
    triggerAlert(err.message, true)
  }
}

async function handleDeleteFAQ(id) {
  if (!confirm('Are you sure you want to delete this FAQ entry?')) return
  try {
    const res = await faqStore.deleteFAQ(id)
    if (res.success) {
      triggerAlert('FAQ entry deleted successfully!')
      fetchFAQs()
    }
  } catch (err) {
    triggerAlert(err.message, true)
  }
}

const logout = () => {
  if (confirm('Are you sure you want to logout?')) {
    authStore.logout()
    router.push('/admin/login')
  }
}
</script>

<style scoped>
.admin-dashboard {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
}
.dash-header h1 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #111827;
}
</style>
