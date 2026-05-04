import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { bookingService } from '@/services/api'

export const useBookingStore = defineStore('bookings', () => {
  // State
  const bookings = ref([])
  const loading = ref(false)

  const error = ref(null)
  const loadBookings = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await bookingService.getBookings()
      bookings.value = response.data || []
    } catch (e) {
      bookings.value = []
      error.value = e.response?.data?.message || 'Failed to load bookings'
    } finally {
      loading.value = false
    }
  }
  const saveBookings = () => undefined

  // Create new booking
  const createBooking = async (bookingData) => {
    const response = await bookingService.createBooking(bookingData)
    if (response?.data) bookings.value.unshift(response.data)
    return response.data
  }

  // Update booking status
  const updateBookingStatus = async (id, status) => {
    const response = await bookingService.updateBookingStatus(id, status)
    const updated = response?.data
    if (!updated) return false
    const booking = bookings.value.find(b => b.id === id)
    if (booking) Object.assign(booking, updated)
    return true
  }

  // Update booking
  const updateBooking = async (id, updates) => {
    const response = await bookingService.updateBookingStatus(id, updates.status || 'pending', updates.notes || '')
    return response?.data || null
  }

  // Delete booking
  const deleteBooking = async (id) => {
    await bookingService.deleteBooking(id)
    const index = bookings.value.findIndex(b => b.id === id)
    if (index !== -1) bookings.value.splice(index, 1)
    return true
  }

  // Get booking by ID
  const getBookingById = (id) => {
    return bookings.value.find(b => b.id === id)
  }

  // Computed - Filter bookings by status
  const pendingBookings = computed(() => {
    return bookings.value.filter(b => b.status === 'pending')
  })

  const confirmedBookings = computed(() => {
    return bookings.value.filter(b => b.status === 'confirmed')
  })

  const completedBookings = computed(() => {
    return bookings.value.filter(b => b.status === 'completed')
  })

  const cancelledBookings = computed(() => {
    return bookings.value.filter(b => b.status === 'cancelled')
  })

  // Computed - Statistics
  const stats = computed(() => {
    return {
      total: bookings.value.length,
      pending: pendingBookings.value.length,
      confirmed: confirmedBookings.value.length,
      completed: completedBookings.value.length,
      cancelled: cancelledBookings.value.length
    }
  })

  // Get bookings by date range
  const getBookingsByDateRange = (startDate, endDate) => {
    return bookings.value.filter(b => {
      const bookingDate = new Date(b.date)
      return bookingDate >= startDate && bookingDate <= endDate
    })
  }

  // Get upcoming bookings
  const upcomingBookings = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return bookings.value
      .filter(b => {
        const bookingDate = new Date(b.date)
        return bookingDate >= today && (b.status === 'pending' || b.status === 'confirmed')
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  })

  // Get past bookings
  const pastBookings = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return bookings.value
      .filter(b => {
        const bookingDate = new Date(b.date)
        return bookingDate < today
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  const loadSampleData = () => undefined

  // Initialize
  loadBookings()

  return {
    // State
    bookings,
    loading,
    
    // Computed
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    upcomingBookings,
    pastBookings,
    stats,
    
    // Actions
    createBooking,
    updateBooking,
    updateBookingStatus,
    deleteBooking,
    getBookingById,
    getBookingsByDateRange,
    error,
    loadBookings,
    saveBookings
  }
})
