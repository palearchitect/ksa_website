<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Tour Bookings</h1>
      <p class="text-gray-600">Manage property tour bookings and appointments</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Pending</p>
            <p class="text-3xl font-bold text-gray-900">{{ bookingStore.stats.pending }}</p>
          </div>
          <div class="p-3 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Confirmed</p>
            <p class="text-3xl font-bold text-gray-900">{{ bookingStore.stats.confirmed }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Completed</p>
            <p class="text-3xl font-bold text-gray-900">{{ bookingStore.stats.completed }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-gray-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total</p>
            <p class="text-3xl font-bold text-gray-900">{{ bookingStore.stats.total }}</p>
          </div>
          <div class="p-3 bg-gray-100 rounded-lg">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters & Tabs -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <!-- Tab Buttons -->
        <div class="flex border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'px-4 py-2 font-medium transition-colors',
              activeTab === tab.value
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            {{ tab.label }} ({{ getTabCount(tab.value) }})
          </button>
        </div>

        <!-- Search -->
        <div class="flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, or booking ID..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
        </div>
      </div>
    </div>

    <!-- Bookings Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredBookings.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p class="text-lg font-medium mb-1">No bookings found</p>
                <p class="text-sm">{{ searchQuery ? 'Try adjusting your search' : 'No bookings in this category yet' }}</p>
              </td>
            </tr>
            <tr v-for="booking in filteredBookings" :key="booking.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-mono text-sm font-medium text-gray-900">{{ booking.id }}</span>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900">{{ booking.name }}</p>
                  <p class="text-sm text-gray-500">{{ booking.guests }} {{ booking.guests === 1 ? 'guest' : 'guests' }}</p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <p class="text-gray-900">{{ formatDate(booking.date) }}</p>
                  <p class="text-sm text-gray-500">{{ booking.time }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <a :href="`mailto:${booking.email}`" class="text-sm text-blue-600 hover:text-blue-800 block">
                    {{ booking.email }}
                  </a>
                  <a :href="`tel:${booking.phone}`" class="text-sm text-gray-600 hover:text-gray-900 block">
                    {{ booking.phone }}
                  </a>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(booking.status)" class="px-3 py-1 text-xs font-semibold rounded-full">
                  {{ getStatusLabel(booking.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center gap-2">
                  <button 
                    @click="viewBooking(booking)"
                    class="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    View
                  </button>
                  <button 
                    v-if="booking.status === 'pending'"
                    @click="confirmBooking(booking.id)"
                    class="text-green-600 hover:text-green-900 font-medium"
                  >
                    Confirm
                  </button>
                  <button 
                    v-if="booking.status === 'confirmed'"
                    @click="completeBooking(booking.id)"
                    class="text-purple-600 hover:text-purple-900 font-medium"
                  >
                    Complete
                  </button>
                  <button 
                    v-if="booking.status !== 'cancelled' && booking.status !== 'completed'"
                    @click="cancelBooking(booking.id)"
                    class="text-orange-600 hover:text-orange-900 font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    @click="deleteBookingConfirm(booking.id)"
                    class="text-red-600 hover:text-red-900 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View Booking Modal -->
    <div v-if="selectedBooking" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="selectedBooking = null"></div>
      <div class="relative min-h-screen flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
          <div class="p-8">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-2xl font-bold text-gray-900">Booking Details</h3>
              <button 
                @click="selectedBooking = null"
                class="text-gray-500 hover:text-gray-700"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Booking ID</label>
                  <p class="font-mono font-medium text-gray-900">{{ selectedBooking.id }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span :class="getStatusClass(selectedBooking.status)" class="inline-block px-3 py-1 text-xs font-semibold rounded-full">
                    {{ getStatusLabel(selectedBooking.status) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Customer Name</label>
                  <p class="font-medium text-gray-900">{{ selectedBooking.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Number of Guests</label>
                  <p class="font-medium text-gray-900">{{ selectedBooking.guests }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <a :href="`mailto:${selectedBooking.email}`" class="text-blue-600 hover:text-blue-800">
                    {{ selectedBooking.email }}
                  </a>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <a :href="`tel:${selectedBooking.phone}`" class="text-blue-600 hover:text-blue-800">
                    {{ selectedBooking.phone }}
                  </a>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Date</label>
                  <p class="font-medium text-gray-900">{{ formatDate(selectedBooking.date) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Time</label>
                  <p class="font-medium text-gray-900">{{ selectedBooking.time }}</p>
                </div>
              </div>

              <div v-if="selectedBooking.notes">
                <label class="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                <p class="text-gray-900 bg-gray-50 p-4 rounded-lg">{{ selectedBooking.notes }}</p>
              </div>

              <div class="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Created</label>
                  <p class="text-gray-900">{{ formatDateTime(selectedBooking.createdAt) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                  <p class="text-gray-900">{{ formatDateTime(selectedBooking.updatedAt) }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-8 flex gap-4">
              <button
                v-if="selectedBooking.status === 'pending'"
                @click="confirmBooking(selectedBooking.id); selectedBooking = null"
                class="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                Confirm Booking
              </button>
              <button
                v-if="selectedBooking.status === 'confirmed'"
                @click="completeBooking(selectedBooking.id); selectedBooking = null"
                class="flex-1 px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
              >
                Mark as Completed
              </button>
              <button
                @click="selectedBooking = null"
                class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBookingStore } from '@/stores/bookingStore'

const bookingStore = useBookingStore()

// Load sample data if empty
if (bookingStore.bookings.length === 0) {
  bookingStore.loadSampleData()
}

// State
const activeTab = ref('all')
const searchQuery = ref('')
const selectedBooking = ref(null)

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
]

// Computed
const filteredBookings = computed(() => {
  let bookings = bookingStore.bookings

  // Filter by tab
  if (activeTab.value !== 'all') {
    bookings = bookings.filter(b => b.status === activeTab.value)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    bookings = bookings.filter(b =>
      b.id.toLowerCase().includes(query) ||
      b.name.toLowerCase().includes(query) ||
      b.email.toLowerCase().includes(query) ||
      b.phone.includes(query)
    )
  }

  return bookings
})

const getTabCount = (tab) => {
  if (tab === 'all') return bookingStore.stats.total
  return bookingStore.stats[tab] || 0
}

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const viewBooking = (booking) => {
  selectedBooking.value = booking
}

const confirmBooking = (id) => {
  if (confirm('Confirm this booking?')) {
    bookingStore.updateBookingStatus(id, 'confirmed')
  }
}

const completeBooking = (id) => {
  if (confirm('Mark this booking as completed?')) {
    bookingStore.updateBookingStatus(id, 'completed')
  }
}

const cancelBooking = (id) => {
  if (confirm('Cancel this booking?')) {
    bookingStore.updateBookingStatus(id, 'cancelled')
  }
}

const deleteBookingConfirm = (id) => {
  if (confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
    bookingStore.deleteBooking(id)
  }
}
</script>
