import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookingStore = defineStore('bookings', () => {
  // State
  const bookings = ref([])
  const loading = ref(false)

  // Load bookings from localStorage on init
  const loadBookings = () => {
    const saved = localStorage.getItem('ksaBookings')
    if (saved) {
      try {
        bookings.value = JSON.parse(saved)
      } catch (e) {
        console.error('Error loading bookings:', e)
        bookings.value = []
      }
    }
  }

  // Save bookings to localStorage
  const saveBookings = () => {
    localStorage.setItem('ksaBookings', JSON.stringify(bookings.value))
  }

  // Create new booking
  const createBooking = (bookingData) => {
    const newBooking = {
      id: `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase(),
      ...bookingData,
      status: bookingData.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    bookings.value.unshift(newBooking)
    saveBookings()
    return newBooking
  }

  // Update booking status
  const updateBookingStatus = (id, status) => {
    const booking = bookings.value.find(b => b.id === id)
    if (booking) {
      booking.status = status
      booking.updatedAt = new Date().toISOString()
      saveBookings()
      return true
    }
    return false
  }

  // Update booking
  const updateBooking = (id, updates) => {
    const index = bookings.value.findIndex(b => b.id === id)
    if (index !== -1) {
      bookings.value[index] = {
        ...bookings.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveBookings()
      return bookings.value[index]
    }
    return null
  }

  // Delete booking
  const deleteBooking = (id) => {
    const index = bookings.value.findIndex(b => b.id === id)
    if (index !== -1) {
      bookings.value.splice(index, 1)
      saveBookings()
      return true
    }
    return false
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

  // Load sample data for demo
  const loadSampleData = () => {
    if (bookings.value.length === 0) {
      const sampleBookings = [
        {
          id: 'BOOK-001',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+234 803 123 4567',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '10:00 AM',
          guests: 2,
          notes: 'Interested in 3-bedroom apartments',
          status: 'pending',
          property: null,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'BOOK-002',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+234 805 987 6543',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '2:00 PM',
          guests: 1,
          notes: 'Looking for investment property',
          status: 'confirmed',
          property: null,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'BOOK-003',
          name: 'Michael Johnson',
          email: 'mjohnson@example.com',
          phone: '+234 807 456 7890',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '11:00 AM',
          guests: 3,
          notes: 'Family viewing',
          status: 'completed',
          property: null,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'BOOK-004',
          name: 'Sarah Williams',
          email: 'sarah.w@example.com',
          phone: '+234 809 234 5678',
          date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '3:00 PM',
          guests: 2,
          notes: '',
          status: 'confirmed',
          property: null,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'BOOK-005',
          name: 'David Brown',
          email: 'dbrown@example.com',
          phone: '+234 806 345 6789',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '9:00 AM',
          guests: 1,
          notes: 'Cancelled due to schedule conflict',
          status: 'cancelled',
          property: null,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]

      bookings.value = sampleBookings
      saveBookings()
    }
  }

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
    loadSampleData,
    loadBookings,
    saveBookings
  }
})
