<template>
  <div class="space-y-8 p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
    
    <!-- Header -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h1 class="text-3xl font-bold text-gray-900">Web Content Management</h1>
      <p class="text-gray-500 mt-1">Configure banner slides, team directory staff, and the interactive FAQ database.</p>
    </div>

    <!-- Alert -->
    <div v-if="alertMsg" :class="['p-4 rounded-xl border text-sm', alertIsError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700']">
      {{ alertMsg }}
    </div>

    <!-- Overview Cards -->
    <div class="grid md:grid-cols-3 gap-6">
      
      <!-- Slide Card -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Hero Carousel Banners</h3>
          <p class="text-gray-500 text-sm mt-1">Update website main landing banner images, titles, and call-to-actions.</p>
        </div>
        <div class="mt-6 pt-4 border-t border-gray-50">
          <router-link
            to="/dashboard/webadmin/slides"
            class="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-55 hover:bg-blue-50 text-blue-600 font-semibold rounded-lg text-sm border border-blue-200 transition-colors"
          >
            Manage Carousel Slides
          </router-link>
        </div>
      </div>

      <!-- Team Card -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Staff & Team Directory</h3>
          <p class="text-gray-500 text-sm mt-1">Manage partner details, agent profile photos, roles, and contacts.</p>
        </div>
        <div class="mt-6 pt-4 border-t border-gray-50">
          <router-link
            to="/dashboard/webadmin/team"
            class="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-55 hover:bg-indigo-50 text-indigo-600 font-semibold rounded-lg text-sm border border-indigo-200 transition-colors"
          >
            Manage Team Members
          </router-link>
        </div>
      </div>

      <!-- FAQ Card -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900">FAQ Database</h3>
          <p class="text-gray-500 text-sm mt-1">Configure questions and answers served on the public support page.</p>
        </div>
        <div class="mt-6 pt-4 border-t border-gray-50">
          <a
            href="#faq-section"
            class="w-full inline-flex justify-center items-center px-4 py-2 bg-green-55 hover:bg-green-50 text-green-600 font-semibold rounded-lg text-sm border border-green-200 transition-colors"
          >
            Jump to FAQ Panel
          </a>
        </div>
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
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
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
                  class="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold rounded"
                >
                  Edit
                </button>
                <button
                  @click="handleDeleteFAQ(f.id)"
                  class="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold rounded"
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
              class="px-4 py-2 bg-gray-50 hover:bg-gray-100 border text-gray-700 text-sm font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
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
import { ref, onMounted } from 'vue'
import { useFaqStore } from '@/stores/faqStore'

const faqStore = useFaqStore()

const faqs = ref([])
const alertMsg = ref('')
const alertIsError = ref(false)

const showModal = ref(false)
const modalMode = ref('create')
const selectedFaqId = ref(null)
const modalForm = ref({ question: '', answer: '', sort_order: 0 })

onMounted(async () => {
  await fetchFAQs()
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
</script>
