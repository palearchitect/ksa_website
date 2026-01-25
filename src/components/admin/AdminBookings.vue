<template>
  <div class="p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Booking Management</h1>
      <p class="text-gray-600">View and manage all property tour bookings</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-red-700">{{ error }}</span>
        <button @click="error = null" class="ml-auto text-red-600 hover:text-red-800">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="text-green-700">{{ success }}</span>
        <button @click="success = null" class="ml-auto text-green-600 hover:text-green-800">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, email, or phone..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @input="debouncedSearch"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div class="flex space-x-2">
          <select 
            v-model="statusFilter"
            class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            @change="fetchBookings"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <!-- Date Range -->
          <select 
            v-model="dateRangeFilter"
            class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            @change="fetchBookings"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>

        <!-- Export Button -->
        <button 
          @click="exportBookings"
          class="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Bookings Table -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div v-if="bookings.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-500 text-lg mb-2">No bookings found</p>
        <p class="text-gray-400">When customers book tours, they'll appear here.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date & Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Property</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr 
              v-for="booking in bookings" 
              :key="booking.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Customer -->
              <td class="px-6 py-4">
                <div>
                  <p class="font-semibold text-gray-900">{{ booking.name }}</p>
                  <p class="text-sm text-gray-500">Booking #{{ booking.bookingId || booking.id }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ formatDate(booking.createdAt) }}</p>
                </div>
              </td>

              <!-- Date & Time -->
              <td class="px-6 py-4">
                <div>
                  <p class="font-semibold text-gray-900">{{ formatBookingDate(booking.date) }}</p>
                  <p class="text-sm text-gray-600">{{ booking.time }}</p>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ getTimeRemaining(booking.date, booking.time) }}
                  </p>
                </div>
              </td>

              <!-- Property -->
              <td class="px-6 py-4">
                <div v-if="booking.property" class="flex items-center">
                  <div class="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                    <img
                      v-if="getPropertyImage(booking.property)"
                      :src="getPropertyImage(booking.property)"
                      :alt="getPropertyTitle(booking.property)"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="text-gray-400">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 truncate max-w-xs">
                      {{ getPropertyTitle(booking.property) || 'Property not specified' }}
                    </p>
                    <p class="text-sm text-gray-500">Guests: {{ booking.guests || 1 }}</p>
                  </div>
                </div>
                <div v-else class="text-gray-500 italic">
                  No property specified
                </div>
              </td>

              <!-- Contact -->
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <a :href="`mailto:${booking.email}`" class="flex items-center text-blue-600 hover:text-blue-800">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ booking.email }}
                  </a>
                  <a :href="`tel:${booking.phone}`" class="flex items-center text-green-600 hover:text-green-800">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {{ booking.phone }}
                  </a>
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4">
                <div class="flex flex-col space-y-2">
                  <span :class="[
                    'px-3 py-1 text-xs font-semibold rounded-full inline-block w-min',
                    getStatusClass(booking.status)
                  ]">
                    {{ formatStatus(booking.status) }}
                  </span>
                  
                  <!-- Status Actions -->
                  <div v-if="booking.status === 'pending'" class="flex space-x-1">
                    <button 
                      @click="updateBookingStatus(booking.id, 'confirmed')"
                      class="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-800 rounded transition-colors"
                    >
                      Confirm
                    </button>
                    <button 
                      @click="updateBookingStatus(booking.id, 'cancelled')"
                      class="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                  <div v-else-if="booking.status === 'confirmed'" class="flex space-x-1">
                    <button 
                      @click="updateBookingStatus(booking.id, 'completed')"
                      class="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex space-x-2">
                  <!-- View Details -->
                  <button 
                    @click="viewBookingDetails(booking)"
                    class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <!-- Send Reminder -->
                  <button 
                    v-if="booking.status === 'confirmed' || booking.status === 'pending'"
                    @click="sendReminder(booking.id)"
                    class="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                    title="Send Reminder"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>

                  <!-- Notes -->
                  <button 
                    @click="openNotesModal(booking)"
                    class="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Add Notes"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <!-- Delete -->
                  <button 
                    @click="confirmDeleteBooking(booking.id)"
                    class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Booking"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="bookings.length > 0" class="px-6 py-4 border-t border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div class="text-sm text-gray-500">
            Showing {{ bookings.length }} of {{ totalBookings }} bookings
          </div>
          <div class="flex space-x-2 mt-4 md:mt-0">
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
              :class="[
                'px-4 py-2 border border-gray-300 rounded-lg',
                currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              Previous
            </button>
            <button 
              @click="nextPage"
              :disabled="bookings.length < pageSize"
              :class="[
                'px-4 py-2 border border-gray-300 rounded-lg',
                bookings.length < pageSize 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900">Booking Details</h3>
          <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="selectedBooking" class="space-y-6">
          <!-- Customer Info -->
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Customer Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Name</p>
                <p class="font-medium">{{ selectedBooking.name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Email</p>
                <p class="font-medium">{{ selectedBooking.email }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Phone</p>
                <p class="font-medium">{{ selectedBooking.phone }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Guests</p>
                <p class="font-medium">{{ selectedBooking.guests || 1 }} person(s)</p>
              </div>
            </div>
          </div>

          <!-- Booking Details -->
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Booking Details</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Booking ID</p>
                <p class="font-medium">{{ selectedBooking.bookingId || selectedBooking.id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Status</p>
                <span :class="[
                  'px-3 py-1 text-xs font-semibold rounded-full',
                  getStatusClass(selectedBooking.status)
                ]">
                  {{ formatStatus(selectedBooking.status) }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-600">Date</p>
                <p class="font-medium">{{ formatBookingDate(selectedBooking.date) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Time</p>
                <p class="font-medium">{{ selectedBooking.time }}</p>
              </div>
            </div>
          </div>

          <!-- Property Info -->
          <div v-if="selectedBooking.property">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Property Information</h4>
            <div class="flex items-center p-4 bg-gray-50 rounded-lg">
              <div class="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
                <img
                  v-if="getPropertyImage(selectedBooking.property)"
                  :src="getPropertyImage(selectedBooking.property)"
                  :alt="getPropertyTitle(selectedBooking.property)"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <p class="font-semibold text-gray-900">{{ getPropertyTitle(selectedBooking.property) }}</p>
                <p class="text-sm text-gray-600">
                  {{ getPropertyAddress(selectedBooking.property) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Notes</h4>
            <p v-if="selectedBooking.notes" class="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {{ selectedBooking.notes }}
            </p>
            <p v-else class="text-gray-500 italic">No additional notes provided</p>
          </div>

          <!-- Admin Notes -->
          <div v-if="selectedBooking.adminNotes">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Admin Notes</h4>
            <p class="text-gray-700 bg-blue-50 p-4 rounded-lg">
              {{ selectedBooking.adminNotes }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button 
              @click="showDetailsModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button 
              v-if="selectedBooking.status === 'pending'"
              @click="updateBookingStatus(selectedBooking.id, 'confirmed')"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Confirm Booking
            </button>
            <a 
              :href="`mailto:${selectedBooking.email}?subject=Booking Confirmation - ${selectedBooking.bookingId}&body=Dear ${selectedBooking.name},%0D%0A%0D%0AYour booking has been confirmed...`"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Email Customer
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes Modal -->
    <div v-if="showNotesModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900">Add Admin Notes</h3>
          <button @click="showNotesModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="notesBooking">
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">Booking ID: {{ notesBooking.bookingId || notesBooking.id }}</p>
            <p class="font-medium">{{ notesBooking.name }} - {{ formatBookingDate(notesBooking.date) }} at {{ notesBooking.time }}</p>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes
            </label>
            <textarea
              v-model="adminNotes"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add internal notes about this booking..."
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              @click="showNotesModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="saveAdminNotes"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { bookingService, emailService } from '@/services/api'
import { formatError } from '@/services/api'

// State
const loading = ref(false)
const error = ref(null)
const success = ref(null)
const bookings = ref([])
const totalBookings = ref(0)

// Filters
const searchQuery = ref('')
const statusFilter = ref('all')
const dateRangeFilter = ref('all')
const currentPage = ref(1)
const pageSize = ref(20)

// Modals
const showDetailsModal = ref(false)
const showNotesModal = ref(false)
const selectedBooking = ref(null)
const notesBooking = ref(null)
const adminNotes = ref('')

// Fetch bookings
const fetchBookings = async () => {
  loading.value = true
  error.value = null
  
  try {
    const filters = {}
    
    if (statusFilter.value !== 'all') {
      filters.status = statusFilter.value
    }
    
    if (searchQuery.value) {
      filters.search = searchQuery.value
    }

    const response = await bookingService.getBookings({
      page: currentPage.value,
      pageSize: pageSize.value,
      filters,
      sort: 'date:asc'
    })

    bookings.value = response.data || []
    totalBookings.value = response.meta?.pagination?.total || bookings.value.length
    
  } catch (err) {
    error.value = formatError(err)
    console.error('Error fetching bookings:', err)
  } finally {
    loading.value = false
  }
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatBookingDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Get time remaining
const getTimeRemaining = (dateString, timeString) => {
  if (!dateString || !timeString) return ''
  
  const bookingDate = new Date(dateString)
  const [time, modifier] = timeString.split(' ')
  let [hours, minutes] = time.split(':').map(Number)
  
  if (modifier === 'PM' && hours < 12) hours += 12
  if (modifier === 'AM' && hours === 12) hours = 0
  
  bookingDate.setHours(hours, minutes, 0, 0)
  const now = new Date()
  const diffMs = bookingDate - now
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} from now`
  } else if (diffDays === 0) {
    return 'Today'
  } else {
    return 'Past'
  }
}

// Get status class
const getStatusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-green-100 text-green-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

// Property helpers
const getPropertyTitle = (property) => {
  if (!property) return ''
  return property.attributes?.title || property.title || 'Untitled Property'
}

const getPropertyAddress = (property) => {
  if (!property) return ''
  return property.attributes?.address || property.address || 'Address not specified'
}

const getPropertyImage = (property) => {
  if (!property) return null
  if (property.attributes?.images?.data?.[0]?.attributes?.url) {
    return property.attributes.images.data[0].attributes.url
  }
  if (property.attributes?.images?.[0]?.url) {
    return property.attributes.images[0].url
  }
  if (property.image) {
    return property.image
  }
  return null
}

// Update booking status
const updateBookingStatus = async (bookingId, status) => {
  if (!confirm(`Are you sure you want to ${status} this booking?`)) return
  
  loading.value = true
  error.value = null
  
  try {
    await bookingService.updateBookingStatus(bookingId, status)
    success.value = `Booking ${status} successfully!`
    
    // Refresh bookings
    await fetchBookings()
    
    // Close modal if open
    if (showDetailsModal.value) {
      showDetailsModal.value = false
    }
    
  } catch (err) {
    error.value = formatError(err)
  } finally {
    loading.value = false
  }
}

// Send reminder
const sendReminder = async (bookingId) => {
  if (!confirm('Send booking reminder email to customer?')) return
  
  loading.value = true
  error.value = null
  
  try {
    await emailService.sendReminder(bookingId)
    success.value = 'Reminder email sent successfully!'
  } catch (err) {
    error.value = formatError(err)
  } finally {
    loading.value = false
  }
}

// View booking details
const viewBookingDetails = (booking) => {
  selectedBooking.value = booking
  showDetailsModal.value = true
}

// Open notes modal
const openNotesModal = (booking) => {
  notesBooking.value = booking
  adminNotes.value = booking.adminNotes || ''
  showNotesModal.value = true
}

// Save admin notes
const saveAdminNotes = async () => {
  if (!notesBooking.value) return
  
  loading.value = true
  error.value = null
  
  try {
    await bookingService.updateBookingStatus(
      notesBooking.value.id, 
      notesBooking.value.status,
      adminNotes.value
    )
    
    success.value = 'Notes saved successfully!'
    showNotesModal.value = false
    
    // Refresh bookings
    await fetchBookings()
    
  } catch (err) {
    error.value = formatError(err)
  } finally {
    loading.value = false
  }
}

// Delete booking
const confirmDeleteBooking = async (bookingId) => {
  if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return
  
  loading.value = true
  error.value = null
  
  try {
    await bookingService.cancelBooking(bookingId, 'Deleted by admin')
    success.value = 'Booking deleted successfully!'
    
    // Refresh bookings
    await fetchBookings()
    
  } catch (err) {
    error.value = formatError(err)
  } finally {
    loading.value = false
  }
}

// Export bookings
const exportBookings = () => {
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Booking ID,Name,Email,Phone,Date,Time,Status,Guests,Property,Notes\n"
    + bookings.value.map(b => [
        b.bookingId || b.id,
        `"${b.name}"`,
        b.email,
        b.phone,
        b.date,
        b.time,
        b.status,
        b.guests || 1,
        `"${getPropertyTitle(b.property) || ''}"`,
        `"${(b.notes || '').replace(/"/g, '""')}"`
      ].join(',')).join('\n')
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `bookings-${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Pagination
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchBookings()
  }
}

const nextPage = () => {
  if (bookings.value.length === pageSize.value) {
    currentPage.value++
    fetchBookings()
  }
}

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchBookings()
  }, 500)
}

// Initialize
onMounted(() => {
  fetchBookings()
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

button, div[class*="cursor-pointer"] {
  transition: all 0.2s ease-in-out;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>