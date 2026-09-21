<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <span>Tour Bookings Management</span>
          <span class="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Site Inspections
          </span>
        </h1>
        <p class="mt-1 text-sm text-slate-400">Manage client site viewing appointments, status transitions, and schedule confirmations.</p>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
      <div class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 flex items-center justify-between shadow-xl">
        <div>
          <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">Pending</p>
          <p class="text-3xl font-extrabold text-amber-400 mt-1.5">{{ bookingStore.stats.pending }}</p>
        </div>
        <div class="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 flex items-center justify-between shadow-xl">
        <div>
          <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">Confirmed</p>
          <p class="text-3xl font-extrabold text-blue-400 mt-1.5">{{ bookingStore.stats.confirmed }}</p>
        </div>
        <div class="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 flex items-center justify-between shadow-xl">
        <div>
          <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">Completed</p>
          <p class="text-3xl font-extrabold text-emerald-400 mt-1.5">{{ bookingStore.stats.completed }}</p>
        </div>
        <div class="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 flex items-center justify-between shadow-xl">
        <div>
          <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">Total</p>
          <p class="text-3xl font-extrabold text-white mt-1.5">{{ bookingStore.stats.total }}</p>
        </div>
        <div class="p-3.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-slate-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Filters & Tabs -->
    <div class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 shadow-xl">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <!-- Tab Buttons -->
        <div class="flex border-b border-slate-800/80 overflow-x-auto no-scrollbar">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'px-4 py-2.5 font-medium text-xs tracking-wider transition-colors whitespace-nowrap',
              activeTab === tab.value
                ? 'text-orange-400 border-b-2 border-orange-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
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
            class="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
          >
        </div>
      </div>
    </div>

    <!-- Bookings Table -->
    <div class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-950/80 border-b border-slate-800/80">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-mono text-slate-400 uppercase tracking-wider">Booking ID</th>
              <th class="px-6 py-4 text-left text-xs font-mono text-slate-400 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-4 text-left text-xs font-mono text-slate-400 uppercase tracking-wider">Date & Time</th>
              <th class="px-6 py-4 text-left text-xs font-mono text-slate-400 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-4 text-left text-xs font-mono text-slate-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-mono text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr v-if="filteredBookings.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-slate-400">
                <svg class="w-12 h-12 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p class="text-lg font-medium text-white mb-1">No bookings found</p>
                <p class="text-sm text-slate-400">{{ searchQuery ? 'Try adjusting your search query' : 'No bookings in this schedule filter' }}</p>
              </td>
            </tr>
            <tr v-for="booking in filteredBookings" :key="booking.id" class="hover:bg-slate-800/40 transition duration-150">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-mono text-xs font-semibold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">{{ booking.id }}</span>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="font-bold text-white text-sm">{{ booking.name }}</p>
                  <p class="text-xs text-slate-400 font-mono">{{ booking.guests }} {{ booking.guests === 1 ? 'guest' : 'guests' }}</p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <p class="text-slate-200 text-xs font-medium">{{ formatDate(booking.date) }}</p>
                  <p class="text-xs text-slate-400 font-mono">{{ booking.time }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <a :href="`mailto:${booking.email}`" class="text-xs text-blue-400 hover:text-blue-300 block font-mono">
                    {{ booking.email }}
                  </a>
                  <a :href="`tel:${booking.phone}`" class="text-xs text-slate-400 hover:text-white block font-mono">
                    {{ booking.phone }}
                  </a>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(booking.status)" class="px-2.5 py-1 text-xxs font-mono font-semibold rounded-full border">
                  {{ getStatusLabel(booking.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-xs">
                <div class="flex items-center gap-2.5">
                  <button 
                    @click="viewBooking(booking)"
                    class="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    View
                  </button>
                  <button 
                    v-if="booking.status === 'pending'"
                    @click="confirmBooking(booking.id)"
                    class="text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    Confirm
                  </button>
                  <button 
                    v-if="booking.status === 'confirmed'"
                    @click="completeBooking(booking.id)"
                    class="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Complete
                  </button>
                  <button 
                    v-if="booking.status !== 'cancelled' && booking.status !== 'completed'"
                    @click="cancelBooking(booking.id)"
                    class="text-amber-400 hover:text-amber-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    @click="deleteBookingConfirm(booking.id)"
                    class="text-rose-400 hover:text-rose-300 font-medium"
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
      <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-md" @click="selectedBooking = null"></div>
      <div class="relative min-h-screen flex items-center justify-center p-4">
        <div class="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full">
          <div class="p-8">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h3 class="text-2xl font-bold text-white flex items-center gap-3">
                <span>Booking Details</span>
                <span class="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  {{ selectedBooking.id }}
                </span>
              </h3>
              <button 
                @click="selectedBooking = null"
                class="text-slate-400 hover:text-white transition-colors"
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
                  <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Booking ID</label>
                  <p class="font-mono font-semibold text-orange-400 text-sm">{{ selectedBooking.id }}</p>
                </div>
                <div>
                  <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Status</label>
                  <span :class="getStatusClass(selectedBooking.status)" class="inline-block px-3 py-1 text-xs font-mono font-semibold rounded-full border">
                    {{ getStatusLabel(selectedBooking.status) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Customer Name</label>
                  <p class="font-bold text-white text-sm">{{ selectedBooking.name }}</p>
                </div>
                <div>
                  <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Number of Guests</label>
                  <p class="font-medium text-slate-200 text-sm">{{ selectedBooking.guests }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Email</label>
                  <a :href="`mailto:${selectedBooking.email}`" class="text-blue-400 hover:text-blue-300 text-sm font-mono">
                    {{ selectedBooking.email }}
                  </a>
                </div>
                <div>
                  <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Phone</label>
                  <a :href="`tel:${selectedBooking.phone}`" class="text-blue-400 hover:text-blue-300 text-sm font-mono">
                    {{ selectedBooking.phone }}
                  </a>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Date</label>
                  <p class="font-medium text-slate-200 text-sm">{{ formatDate(selectedBooking.date) }}</p>
                </div>
                <div>
                  <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Time</label>
                  <p class="font-medium text-slate-200 text-sm font-mono">{{ selectedBooking.time }}</p>
                </div>
              </div>

              <div v-if="selectedBooking.notes">
                <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Notes</label>
                <p class="text-slate-300 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs leading-relaxed">{{ selectedBooking.notes }}</p>
              </div>

              <div class="grid grid-cols-2 gap-6 text-xs">
                <div>
                  <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Created</label>
                  <p class="text-slate-300 font-mono">{{ formatDateTime(selectedBooking.createdAt) }}</p>
                </div>
                <div>
                  <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Last Updated</label>
                  <p class="text-slate-300 font-mono">{{ formatDateTime(selectedBooking.updatedAt) }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-8 flex gap-4 pt-4 border-t border-slate-800">
              <button
                v-if="selectedBooking.status === 'pending'"
                @click="confirmBooking(selectedBooking.id); selectedBooking = null"
                class="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition text-sm shadow-lg shadow-emerald-500/20"
              >
                Confirm Booking
              </button>
              <button
                v-if="selectedBooking.status === 'confirmed'"
                @click="completeBooking(selectedBooking.id); selectedBooking = null"
                class="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition text-sm shadow-lg shadow-purple-500/20"
              >
                Mark as Completed
              </button>
              <button
                @click="selectedBooking = null"
                class="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition text-sm border border-slate-700"
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
