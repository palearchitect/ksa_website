<template>
  <div class="space-y-6 text-slate-800 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
          <span>Tour Bookings Management</span>
          <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            Site Inspections
          </span>
        </h1>
        <p class="text-xs text-slate-500 font-normal">Manage client site viewing appointments, status transitions, and schedule confirmations.</p>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center justify-between shadow-2xs">
        <div>
          <p class="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Pending</p>
          <p class="text-2xl font-bold text-amber-600 mt-1">{{ bookingStore.stats.pending }}</p>
        </div>
        <div class="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center justify-between shadow-2xs">
        <div>
          <p class="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Confirmed</p>
          <p class="text-2xl font-bold text-blue-600 mt-1">{{ bookingStore.stats.confirmed }}</p>
        </div>
        <div class="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center justify-between shadow-2xs">
        <div>
          <p class="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Completed</p>
          <p class="text-2xl font-bold text-emerald-600 mt-1">{{ bookingStore.stats.completed }}</p>
        </div>
        <div class="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center justify-between shadow-2xs">
        <div>
          <p class="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">{{ bookingStore.stats.total }}</p>
        </div>
        <div class="p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Filters & Tabs -->
    <div class="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <!-- Tab Buttons -->
        <div class="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'px-3.5 py-2 font-medium text-xs transition-colors whitespace-nowrap',
              activeTab === tab.value
                ? 'text-slate-900 border-b-2 border-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
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
            class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition"
          >
        </div>
      </div>
    </div>

    <!-- Bookings Table -->
    <div class="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <tr>
              <th class="px-5 py-3">Booking ID</th>
              <th class="px-5 py-3">Customer</th>
              <th class="px-5 py-3">Date & Time</th>
              <th class="px-5 py-3">Contact</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr v-if="filteredBookings.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-slate-500">
                <svg class="w-10 h-10 mx-auto mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p class="text-sm font-semibold text-slate-800 mb-1">No bookings found</p>
                <p class="text-xs text-slate-500">{{ searchQuery ? 'Try adjusting your search query' : 'No bookings in this schedule filter' }}</p>
              </td>
            </tr>
            <tr v-for="booking in filteredBookings" :key="booking.id" class="hover:bg-slate-50/60 transition duration-150">
              <td class="px-5 py-3.5 whitespace-nowrap">
                <span class="font-mono text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">{{ booking.id }}</span>
              </td>
              <td class="px-5 py-3.5">
                <div>
                  <p class="font-semibold text-slate-900 text-xs">{{ booking.name }}</p>
                  <p class="text-[11px] text-slate-500 font-mono">{{ booking.guests }} {{ booking.guests === 1 ? 'guest' : 'guests' }}</p>
                </div>
              </td>
              <td class="px-5 py-3.5 whitespace-nowrap">
                <div>
                  <p class="text-slate-800 text-xs font-medium">{{ formatDate(booking.date) }}</p>
                  <p class="text-[11px] text-slate-500 font-mono">{{ booking.time }}</p>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <div class="space-y-0.5">
                  <a :href="`mailto:${booking.email}`" class="text-xs text-slate-700 hover:text-slate-900 block font-mono">
                    {{ booking.email }}
                  </a>
                  <a :href="`tel:${booking.phone}`" class="text-[11px] text-slate-500 hover:text-slate-800 block font-mono">
                    {{ booking.phone }}
                  </a>
                </div>
              </td>
              <td class="px-5 py-3.5 whitespace-nowrap">
                <span :class="getStatusClass(booking.status)" class="px-2.5 py-0.5 text-[10px] font-mono font-semibold rounded-full border">
                  {{ getStatusLabel(booking.status) }}
                </span>
              </td>
              <td class="px-5 py-3.5 whitespace-nowrap text-xs">
                <div class="flex items-center gap-2.5">
                  <button 
                    @click="viewBooking(booking)"
                    class="text-slate-700 hover:text-slate-900 font-medium"
                  >
                    View
                  </button>
                  <button 
                    v-if="booking.status === 'pending'"
                    @click="confirmBooking(booking.id)"
                    class="text-emerald-700 hover:text-emerald-900 font-medium"
                  >
                    Confirm
                  </button>
                  <button 
                    v-if="booking.status === 'confirmed'"
                    @click="completeBooking(booking.id)"
                    class="text-blue-700 hover:text-blue-900 font-medium"
                  >
                    Complete
                  </button>
                  <button 
                    v-if="booking.status !== 'cancelled' && booking.status !== 'completed'"
                    @click="cancelBooking(booking.id)"
                    class="text-amber-700 hover:text-amber-900 font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    @click="deleteBookingConfirm(booking.id)"
                    class="text-rose-600 hover:text-rose-800 font-medium"
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
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" @click="selectedBooking = null"></div>
      <div class="relative min-h-screen flex items-center justify-center p-4">
        <div class="relative bg-white border border-slate-200/80 rounded-2xl shadow-xl max-w-xl w-full text-slate-800">
          <div class="p-6 sm:p-8">
            <!-- Header -->
            <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                <span>Booking Details</span>
                <span class="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  {{ selectedBooking.id }}
                </span>
              </h3>
              <button 
                @click="selectedBooking = null"
                class="text-slate-400 hover:text-slate-700 transition-colors p-1"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="space-y-4 text-xs">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Booking ID</label>
                  <p class="font-mono font-semibold text-slate-900 text-xs">{{ selectedBooking.id }}</p>
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                  <span :class="getStatusClass(selectedBooking.status)" class="inline-block px-2.5 py-0.5 text-[10px] font-mono font-semibold rounded-full border">
                    {{ getStatusLabel(selectedBooking.status) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Customer Name</label>
                  <p class="font-bold text-slate-900 text-xs">{{ selectedBooking.name }}</p>
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Number of Guests</label>
                  <p class="font-medium text-slate-700 text-xs">{{ selectedBooking.guests }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</label>
                  <a :href="`mailto:${selectedBooking.email}`" class="text-slate-800 hover:text-slate-900 text-xs font-mono underline">
                    {{ selectedBooking.email }}
                  </a>
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Phone</label>
                  <a :href="`tel:${selectedBooking.phone}`" class="text-slate-800 hover:text-slate-900 text-xs font-mono underline">
                    {{ selectedBooking.phone }}
                  </a>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Date</label>
                  <p class="font-medium text-slate-800 text-xs">{{ formatDate(selectedBooking.date) }}</p>
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Time</label>
                  <p class="font-medium text-slate-800 text-xs font-mono">{{ selectedBooking.time }}</p>
                </div>
              </div>

              <div v-if="selectedBooking.notes">
                <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Notes</label>
                <p class="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs leading-relaxed">{{ selectedBooking.notes }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Created</label>
                  <p class="text-slate-600 font-mono text-[11px]">{{ formatDateTime(selectedBooking.createdAt) }}</p>
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Last Updated</label>
                  <p class="text-slate-600 font-mono text-[11px]">{{ formatDateTime(selectedBooking.updatedAt) }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex gap-3 pt-4 border-t border-slate-100">
              <button
                v-if="selectedBooking.status === 'pending'"
                @click="confirmBooking(selectedBooking.id); selectedBooking = null"
                class="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition text-xs shadow-2xs"
              >
                Confirm Booking
              </button>
              <button
                v-if="selectedBooking.status === 'confirmed'"
                @click="completeBooking(selectedBooking.id); selectedBooking = null"
                class="flex-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition text-xs shadow-2xs"
              >
                Mark as Completed
              </button>
              <button
                @click="selectedBooking = null"
                class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition text-xs border border-slate-200"
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
import { ref, computed, onMounted } from 'vue'
import { useBookingStore } from '@/stores/bookingStore'

const bookingStore = useBookingStore()

onMounted(() => {
  bookingStore.loadBookings()
})

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
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  }
  return classes[status] || 'bg-slate-800 text-slate-300 border-slate-700'
}

const getStatusLabel = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const viewBooking = (booking) => {
  selectedBooking.value = booking
}

const confirmBooking = async (id) => {
  if (confirm('Confirm this booking?')) {
    await bookingStore.updateBookingStatus(id, 'confirmed')
  }
}

const completeBooking = async (id) => {
  if (confirm('Mark this booking as completed?')) {
    await bookingStore.updateBookingStatus(id, 'completed')
  }
}

const cancelBooking = async (id) => {
  if (confirm('Cancel this booking?')) {
    await bookingStore.updateBookingStatus(id, 'cancelled')
  }
}

const deleteBookingConfirm = async (id) => {
  if (confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
    await bookingStore.deleteBooking(id)
  }
}
</script>
