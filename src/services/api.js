// ============================================
// FILE: src/services/api.js - COMPLETE WITH ALL SERVICES
// ============================================

import axios from 'axios'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor: Attach auth token if present
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor: Handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('authToken')
      localStorage.removeItem('isAuthenticated')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============================================
// PROPERTY SERVICE (for BookTour.vue)
// ============================================

export const propertyService = {
  // Get all properties
  async getProperties(options = {}) {
    try {
      const params = {
        pagination: {
          page: options.page || 1,
          pageSize: options.pageSize || 10
        },
        sort: options.sort || 'createdAt:desc',
        populate: ['images', 'amenities', 'location']
      }
      if (options.filters) params.filters = options.filters
      const response = await api.get('/properties', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching properties:', error)
      throw error
    }
  },

  // Get single property by ID
  async getPropertyById(id) {
    try {
      const response = await api.get(`/properties/${id}`, {
        params: { populate: ['images', 'amenities', 'location'] }
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error)
      throw error
    }
  },

  // Search properties with filters
  async searchProperties(filters = {}) {
    try {
      const params = {
        populate: ['images'],
        filters: this.buildSearchFilters(filters)
      }
      const response = await api.get('/properties', { params })
      return response.data
    } catch (error) {
      console.error('Error searching properties:', error)
      throw error
    }
  },

  // Build search filters
  buildSearchFilters(filters) {
    const strapiFilters = {}
    if (filters.type) strapiFilters.type = { $eq: filters.type }
    if (filters.minPrice) strapiFilters.price = { ...strapiFilters.price, $gte: filters.minPrice }
    if (filters.maxPrice) strapiFilters.price = { ...strapiFilters.price, $lte: filters.maxPrice }
    if (filters.bedrooms) strapiFilters.bedrooms = { $gte: filters.bedrooms }
    if (filters.bathrooms) strapiFilters.bathrooms = { $gte: filters.bathrooms }
    if (filters.location) strapiFilters.location = { $containsi: filters.location }
    return strapiFilters
  }
}

// ============================================
// BOOKING SERVICE (for BookTour.vue)
// ============================================

export const bookingService = {
  // Create a new booking
  async createBooking(bookingData) {
    try {
      const response = await api.post('/bookings', {
        data: {
          ...bookingData,
          bookingId: this.generateBookingId(),
          status: 'pending'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  },

  // Get all bookings (admin)
  async getBookings(options = {}) {
    try {
      const params = {
        pagination: { page: options.page || 1, pageSize: options.pageSize || 20 },
        sort: options.sort || 'createdAt:desc',
        populate: ['property']
      }
      if (options.filters) params.filters = options.filters
      const response = await api.get('/bookings', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching bookings:', error)
      throw error
    }
  },

  // Get booking by ID
  async getBookingById(id) {
    try {
      const response = await api.get(`/bookings/${id}`, {
        params: { populate: ['property'] }
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error)
      throw error
    }
  },

  // Update booking status
  async updateBookingStatus(id, status, notes = '') {
    try {
      const response = await api.put(`/bookings/${id}`, {
        data: { status, adminNotes: notes, statusUpdatedAt: new Date().toISOString() }
      })
      return response.data
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error)
      throw error
    }
  },

  // Cancel booking
  async cancelBooking(id, reason = '') {
    try {
      const response = await api.put(`/bookings/${id}`, {
        data: { status: 'cancelled', cancellationReason: reason, cancelledAt: new Date().toISOString() }
      })
      return response.data
    } catch (error) {
      console.error(`Error cancelling booking ${id}:`, error)
      throw error
    }
  },

  // Get available time slots
  async getAvailableSlots(date, propertyId = null) {
    try {
      const params = { date }
      if (propertyId) params.propertyId = propertyId
      const response = await api.get('/bookings/available-slots', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching available slots:', error)
      throw error
    }
  },

  // Get booking statistics
  async getBookingStats(period = 'month') {
    try {
      const response = await api.get('/bookings/stats', { params: { period } })
      return response.data
    } catch (error) {
      console.error('Error fetching booking stats:', error)
      throw error
    }
  },

  // Get user's bookings
  async getUserBookings(email) {
    try {
      const response = await api.get('/bookings/user', { params: { email } })
      return response.data
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      throw error
    }
  },

  // Generate unique booking ID
  generateBookingId() {
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `BOOK-${timestamp}-${random}`
  }
}

// ============================================
// EMAIL SERVICE (for BookTour.vue)
// ============================================

export const emailService = {
  // Send booking confirmation
  async sendBookingConfirmation(bookingData) {
    try {
      const response = await api.post('/email/booking-confirmation', { booking: bookingData })
      return response.data
    } catch (error) {
      console.error('Error sending booking confirmation email:', error)
      throw error
    }
  },

  // Send admin notification
  async sendAdminNotification(bookingData) {
    try {
      const response = await api.post('/email/admin-notification', { booking: bookingData })
      return response.data
    } catch (error) {
      console.error('Error sending admin notification:', error)
      throw error
    }
  },

  // Send booking reminder
  async sendReminder(bookingId) {
    try {
      const response = await api.post('/email/send-reminder', { bookingId })
      return response.data
    } catch (error) {
      console.error('Error sending reminder email:', error)
      throw error
    }
  },

  // Send contact form
  async sendContactForm(contactData) {
    try {
      const response = await api.post('/email/contact-form', { contact: contactData })
      return response.data
    } catch (error) {
      console.error('Error sending contact form:', error)
      throw error
    }
  }
}

// ============================================
// AUTHENTICATION API
// ============================================

export const authAPI = {
  register: (userData) => api.post('/api/users/register', userData),
  login: (credentials) => api.post('/api/users/login', credentials),
  adminLogin: (credentials) => api.post('/api/users/admin', credentials),
  getMe: () => api.get('/api/users/me'),
  forgotPassword: (email) => api.post('/api/users/forgot', { email }),
  resetPassword: (token, password) => api.post(`/api/users/reset/${token}`, { password })
}

// ============================================
// PROPERTIES API (alternative - keep both for compatibility)
// ============================================

export const propertiesAPI = {
  getAll: (params) => api.get('/api/products/list', { params }),
  getById: (id) => api.get(`/api/products/single/${id}`),
  create: (propertyData) => api.post('/api/products/add', propertyData),
  update: (propertyData) => api.post('/api/products/update', propertyData),
  delete: (id) => api.post('/api/products/remove', { id }),
  uploadFiles: (files) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

// ============================================
// APPOINTMENTS API
// ============================================

export const appointmentsAPI = {
  schedule: (data) => api.post('/api/appointments/schedule', data),
  scheduleAuth: (data) => api.post('/api/appointments/schedule/auth', data),
  getUserAppointments: (email) => api.get('/api/appointments/user', { params: { email } }),
  cancel: (id) => api.put(`/api/appointments/cancel/${id}`),
  getAll: () => api.get('/api/appointments/all'),
  updateStatus: (id, status) => api.put('/api/appointments/status', { id, status }),
  updateMeetingLink: (id, meetingLink) => api.put('/api/appointments/update-meeting', { id, meetingLink })
}

// ============================================
// ADMIN API
// ============================================

export const adminAPI = {
  getStats: () => api.get('/api/admin/stats'),
  getAllAppointments: () => api.get('/api/appointments/all')
}

// ============================================
// FORMS API
// ============================================

export const formsAPI = {
  submitContact: (formData) => api.post('/api/forms/submit', formData)
}

// ============================================
// AI API
// ============================================

export const aiAPI = {
  search: (query) => api.post('/api/ai/search', { query }),
  getLocationTrends: (city) => api.get(`/api/locations/${city}/trends`)
}

// ============================================
// BLOG API
// ============================================

export const blogAPI = {
  getAll: (options = {}) => {
    const params = {
      pagination: { page: options.page || 1, pageSize: options.pageSize || 10 },
      sort: options.sort || 'createdAt:desc',
      populate: ['author', 'category', 'coverImage']
    }
    return api.get('/posts', { params })
  },
  getById: (id) => api.get(`/posts/${id}`, { params: { populate: ['author', 'category', 'coverImage'] } }),
  create: (postData) => api.post('/posts', { data: postData })
}

// ============================================
// TESTIMONIAL API
// ============================================

export const testimonialAPI = {
  getAll: (options = {}) => {
    const params = {
      pagination: { page: options.page || 1, pageSize: options.pageSize || 20 },
      sort: options.sort || 'createdAt:desc',
      populate: ['avatar']
    }
    return api.get('/testimonials', { params })
  },
  create: (data) => api.post('/testimonials', { data }),
  approve: (id) => api.put(`/testimonials/${id}`, { data: { approved: true, approvedAt: new Date().toISOString() } })
}

// ============================================
// SETTINGS API
// ============================================

export const settingsAPI = {
  get: () => api.get('/site-settings'),
  update: (settings) => api.put('/site-settings', { data: settings })
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const isAuthenticated = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken')
  const isAuth = localStorage.getItem('isAuthenticated')
  return !!(token || isAuth === 'true')
}

export const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('authToken')
  localStorage.removeItem('isAuthenticated')
}

export const setAuth = (token) => {
  localStorage.setItem('token', token)
  localStorage.setItem('authToken', token)
  localStorage.setItem('isAuthenticated', 'true')
}

export const formatError = (error) => {
  if (error.response) {
    const { status, data } = error.response
    if (data?.error?.message) return data.error.message
    if (data?.message) return data.message
    switch (status) {
      case 400: return 'Bad request. Please check your input.'
      case 401: return 'Unauthorized. Please login again.'
      case 403: return 'Forbidden. You do not have permission.'
      case 404: return 'Resource not found.'
      case 422: return 'Validation error. Please check your input.'
      case 429: return 'Too many requests. Please try again later.'
      case 500: return 'Server error. Please try again later.'
      default: return `Error: ${status}`
    }
  } else if (error.request) {
    return 'Network error. Please check your connection.'
  } else {
    return error.message || 'An unexpected error occurred.'
  }
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default api