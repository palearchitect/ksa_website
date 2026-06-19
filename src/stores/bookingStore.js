import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { bookingService } from '@/services/api'

// ========== CONSTANTS ==========
export const BOOKING_STATUS_ENUM = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

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
      
      // Validate response structure
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response structure from server')
      }
      
      const data = response.data || response
      
      // Ensure we have an array
      if (!Array.isArray(data)) {
        console.warn('Bookings response was not an array, converting to empty array')
        bookings.value = []
        return
      }
      
      bookings.value = data
    } catch (e) {
      bookings.value = []
      error.value = e.response?.data?.message || e.message || 'Failed to load bookings'
      console.error('Error loading bookings:', e)
    } finally {
      loading.value = false
    }
  }

  const saveBookings = () => undefined

  // Create new booking
  const createBooking = async (bookingData) => {
    try {
      // Validate before submission
      const validationErrors = validateBooking(bookingData)
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`)
      }
      
      const response = await bookingService.createBooking(bookingData)
      
      if (response?.data) {
        bookings.value.unshift(response.data)
      }
      
      return response?.data || null
    } catch (err) {
      console.error('Error creating booking:', err)
      error.value = err.message || 'Failed to create booking'
      throw err
    }
  }

  // Update booking status
  const updateBookingStatus = async (id, status) => {
    try {
      if (!Object.values(BOOKING_STATUS_ENUM).includes(status)) {
        throw new Error(`Invalid status: ${status}`)
      }
      
      const response = await bookingService.updateBookingStatus(id, status)
      const updated = response?.data
      
      if (!updated) return false
      
      const booking = bookings.value.find(b => b?.id === id)
      if (booking) Object.assign(booking, updated)
      
      return true
    } catch (err) {
      console.error('Error updating booking status:', err)
      error.value = err.message || 'Failed to update booking'
      throw err
    }
  }

  // Update booking
  const updateBooking = async (id, updates) => {
    try {
      const validationErrors = validateBooking(updates)
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`)
      }
      
      const response = await bookingService.updateBookingStatus(
        id,
        updates.status || BOOKING_STATUS_ENUM.PENDING,
        updates.notes || ''
      )
      
      return response?.data || null
    } catch (err) {
      console.error('Error updating booking:', err)
      error.value = err.message || 'Failed to update booking'
      throw err
    }
  }

  // Delete booking
  const deleteBooking = async (id) => {
    try {
      await bookingService.deleteBooking(id)
      const index = bookings.value.findIndex(b => b?.id === id)
      if (index !== -1) bookings.value.splice(index, 1)
      return true
    } catch (err) {
      console.error('Error deleting booking:', err)
      error.value = err.message || 'Failed to delete booking'
      throw err
    }
  }

  // Get booking by ID
  const getBookingById = (id) => {
    return bookings.value.find(b => b?.id === id) || null
  }

  // Validate booking data
  const validateBooking = (data) => {
    if (!data) return ['Booking data is required']
    
    const errors = []
    
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters')
    }
    
    if (!data.email || !isValidEmail(data.email)) {
      errors.push('Valid email address is required')
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
      errors.push('Valid phone number is required')
    }
    
    if (!data.date) {
      errors.push('Booking date is required')
    }
    
    if (!data.time) {
      errors.push('Booking time is required')
    }
    
    return errors
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Computed - Filter bookings by status
  const pendingBookings = computed(() => {
    return bookings.value.filter(b => b && b.status === BOOKING_STATUS_ENUM.PENDING)
  })

  const confirmedBookings = computed(() => {
    return bookings.value.filter(b => b && b.status === BOOKING_STATUS_ENUM.CONFIRMED)
  })

  const completedBookings = computed(() => {
    return bookings.value.filter(b => b && b.status === BOOKING_STATUS_ENUM.COMPLETED)
  })

  const cancelledBookings = computed(() => {
    return bookings.value.filter(b => b && b.status === BOOKING_STATUS_ENUM.CANCELLED)
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
      if (!b?.date) return false
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
        if (!b?.date) return false
        const bookingDate = new Date(b.date)
        return bookingDate >= today && [BOOKING_STATUS_ENUM.PENDING, BOOKING_STATUS_ENUM.CONFIRMED].includes(b.status)
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  })

  // Get past bookings
  const pastBookings = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return bookings.value
      .filter(b => {
        if (!b?.date) return false
        const bookingDate = new Date(b.date)
        return bookingDate < today
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  const loadSampleData = () => undefined

  // Initialize (with error handling)
  const initializeStore = async () => {
    try {
      await loadBookings()
    } catch (err) {
      console.error('Failed to initialize booking store:', err)
      error.value = 'Failed to load bookings on startup'
    }
  }

  initializeStore()

  return {
    // State
    bookings,
    loading,
    error,
    
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
    loadBookings,
    saveBookings
  }
})
