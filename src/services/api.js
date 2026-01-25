import axios from 'axios'

// Get the base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337/api'

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('authToken')
      localStorage.removeItem('isAuthenticated')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

/**
 * API Service for properties
 */
export const propertyService = {
  /**
   * Fetch all properties with optional filters and pagination
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (1-indexed)
   * @param {number} options.pageSize - Items per page
   * @param {string} options.sort - Sort field (e.g., 'createdAt:desc')
   * @param {Object} options.filters - Filters object for Strapi
   * @returns {Promise} Response with data and pagination metadata
   */
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

      // Add filters if provided
      if (options.filters) {
        params.filters = options.filters
      }

      const response = await apiClient.get('/properties', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching properties:', error)
      throw error
    }
  },

  /**
   * Fetch a single property by ID
   * @param {number} id - Property ID
   * @returns {Promise} Property data
   */
  async getPropertyById(id) {
    try {
      const response = await apiClient.get(`/properties/${id}`, {
        params: {
          populate: ['images', 'amenities', 'location', 'documents']
        }
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error)
      throw error
    }
  },

  /**
   * Create a new property
   * @param {Object} propertyData - Property data
   * @returns {Promise} Created property data
   */
  async createProperty(propertyData) {
    try {
      const response = await apiClient.post('/properties', {
        data: propertyData
      })
      return response.data
    } catch (error) {
      console.error('Error creating property:', error)
      throw error
    }
  },

  /**
   * Update an existing property
   * @param {number} id - Property ID
   * @param {Object} propertyData - Updated property data
   * @returns {Promise} Updated property data
   */
  async updateProperty(id, propertyData) {
    try {
      const response = await apiClient.put(`/properties/${id}`, {
        data: propertyData
      })
      return response.data
    } catch (error) {
      console.error(`Error updating property ${id}:`, error)
      throw error
    }
  },

  /**
   * Delete a property
   * @param {number} id - Property ID
   * @returns {Promise} Delete response
   */
  async deleteProperty(id) {
    try {
      const response = await apiClient.delete(`/properties/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error)
      throw error
    }
  },

  /**
   * Upload multiple files/images
   * @param {File[]} files - Files to upload
   * @returns {Promise} Upload response with file data
   */
  async uploadFiles(files) {
    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })

      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error uploading files:', error)
      throw error
    }
  },

  /**
   * Search properties with advanced filters
   * @param {Object} filters - Search filters
   * @returns {Promise} Search results
   */
  async searchProperties(filters = {}) {
    try {
      const params = {
        populate: ['images'],
        filters: this.buildSearchFilters(filters)
      }

      const response = await apiClient.get('/properties', { params })
      return response.data
    } catch (error) {
      console.error('Error searching properties:', error)
      throw error
    }
  },

  /**
   * Build search filters object
   * @param {Object} filters - Raw filters
   * @returns {Object} Structured filters for Strapi
   */
  buildSearchFilters(filters) {
    const strapiFilters = {}

    if (filters.type) {
      strapiFilters.type = { $eq: filters.type }
    }

    if (filters.minPrice || filters.maxPrice) {
      strapiFilters.price = {}
      if (filters.minPrice) strapiFilters.price.$gte = filters.minPrice
      if (filters.maxPrice) strapiFilters.price.$lte = filters.maxPrice
    }

    if (filters.bedrooms) {
      strapiFilters.bedrooms = { $gte: filters.bedrooms }
    }

    if (filters.bathrooms) {
      strapiFilters.bathrooms = { $gte: filters.bathrooms }
    }

    if (filters.location) {
      strapiFilters.location = { $containsi: filters.location }
    }

    if (filters.status) {
      strapiFilters.status = { $eq: filters.status }
    }

    return strapiFilters
  }
}

/**
 * API Service for bookings
 */
export const bookingService = {
  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise} Created booking data
   */
  async createBooking(bookingData) {
    try {
      const response = await apiClient.post('/bookings', {
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

  /**
   * Fetch all bookings (admin only)
   * @param {Object} options - Query options
   * @returns {Promise} Response with bookings data
   */
  async getBookings(options = {}) {
    try {
      const params = {
        pagination: {
          page: options.page || 1,
          pageSize: options.pageSize || 20
        },
        sort: options.sort || 'createdAt:desc',
        populate: ['property']
      }

      if (options.filters) {
        params.filters = options.filters
      }

      const response = await apiClient.get('/bookings', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching bookings:', error)
      throw error
    }
  },

  /**
   * Fetch a single booking by ID
   * @param {number} id - Booking ID
   * @returns {Promise} Booking data
   */
  async getBookingById(id) {
    try {
      const response = await apiClient.get(`/bookings/${id}`, {
        params: {
          populate: ['property']
        }
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error)
      throw error
    }
  },

  /**
   * Update booking status
   * @param {number} id - Booking ID
   * @param {string} status - New status
   * @param {string} notes - Admin notes (optional)
   * @returns {Promise} Updated booking data
   */
  async updateBookingStatus(id, status, notes = '') {
    try {
      const response = await apiClient.put(`/bookings/${id}`, {
        data: {
          status,
          adminNotes: notes,
          statusUpdatedAt: new Date().toISOString()
        }
      })
      return response.data
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error)
      throw error
    }
  },

  /**
   * Cancel a booking
   * @param {number} id - Booking ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise} Updated booking data
   */
  async cancelBooking(id, reason = '') {
    try {
      const response = await apiClient.put(`/bookings/${id}`, {
        data: {
          status: 'cancelled',
          cancellationReason: reason,
          cancelledAt: new Date().toISOString()
        }
      })
      return response.data
    } catch (error) {
      console.error(`Error cancelling booking ${id}:`, error)
      throw error
    }
  },

  /**
   * Check available time slots for a date
   * @param {string} date - Date string (YYYY-MM-DD)
   * @param {number} propertyId - Property ID (optional)
   * @returns {Promise} Available time slots
   */
  async getAvailableSlots(date, propertyId = null) {
    try {
      const params = { date }
      if (propertyId) {
        params.propertyId = propertyId
      }

      const response = await apiClient.get('/bookings/available-slots', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching available slots:', error)
      throw error
    }
  },

  /**
   * Get booking statistics
   * @param {string} period - Time period (day, week, month, year)
   * @returns {Promise} Booking statistics
   */
  async getBookingStats(period = 'month') {
    try {
      const response = await apiClient.get('/bookings/stats', {
        params: { period }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching booking stats:', error)
      throw error
    }
  },

  /**
   * Get user's bookings
   * @param {string} email - User email
   * @returns {Promise} User's bookings
   */
  async getUserBookings(email) {
    try {
      const response = await apiClient.get('/bookings/user', {
        params: { email }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      throw error
    }
  },

  /**
   * Generate unique booking ID
   * @returns {string} Booking ID
   */
  generateBookingId() {
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `BOOK-${timestamp}-${random}`
  }
}

/**
 * Email service for notifications
 */
export const emailService = {
  /**
   * Send booking confirmation
   * @param {Object} bookingData - Booking data
   * @returns {Promise} Email response
   */
  async sendBookingConfirmation(bookingData) {
    try {
      const response = await apiClient.post('/email/booking-confirmation', {
        booking: bookingData
      })
      return response.data
    } catch (error) {
      console.error('Error sending booking confirmation email:', error)
      throw error
    }
  },

  /**
   * Send admin notification
   * @param {Object} bookingData - Booking data
   * @returns {Promise} Email response
   */
  async sendAdminNotification(bookingData) {
    try {
      const response = await apiClient.post('/email/admin-notification', {
        booking: bookingData
      })
      return response.data
    } catch (error) {
      console.error('Error sending admin notification:', error)
      throw error
    }
  },

  /**
   * Send booking reminder
   * @param {number} bookingId - Booking ID
   * @returns {Promise} Email response
   */
  async sendReminder(bookingId) {
    try {
      const response = await apiClient.post('/email/send-reminder', {
        bookingId
      })
      return response.data
    } catch (error) {
      console.error('Error sending reminder email:', error)
      throw error
    }
  },

  /**
   * Send contact form submission
   * @param {Object} contactData - Contact form data
   * @returns {Promise} Email response
   */
  async sendContactForm(contactData) {
    try {
      const response = await apiClient.post('/email/contact-form', {
        contact: contactData
      })
      return response.data
    } catch (error) {
      console.error('Error sending contact form:', error)
      throw error
    }
  }
}

/**
 * API Service for authentication
 */
export const authService = {
  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} username - User username
   * @returns {Promise} Auth response with JWT token
   */
  async register(email, password, username) {
    try {
      const response = await apiClient.post('/auth/local/register', {
        email,
        password,
        username
      })
      return response.data
    } catch (error) {
      console.error('Error registering user:', error)
      throw error
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Auth response with JWT token
   */
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/local', {
        identifier: email,
        password
      })
      return response.data
    } catch (error) {
      console.error('Error logging in:', error)
      throw error
    }
  },

  /**
   * Forgot password
   * @param {string} email - User email
   * @returns {Promise} Reset password response
   */
  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', {
        email
      })
      return response.data
    } catch (error) {
      console.error('Error in forgot password:', error)
      throw error
    }
  },

  /**
   * Reset password
   * @param {string} code - Reset code
   * @param {string} password - New password
   * @param {string} passwordConfirmation - Password confirmation
   * @returns {Promise} Reset response
   */
  async resetPassword(code, password, passwordConfirmation) {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        code,
        password,
        passwordConfirmation
      })
      return response.data
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} User data
   */
  async getProfile() {
    try {
      const response = await apiClient.get('/users/me')
      return response.data
    } catch (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} Updated user data
   */
  async updateProfile(userData) {
    try {
      const response = await apiClient.put('/users/me', userData)
      return response.data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }
}

/**
 * API Service for contact/submissions
 */
export const contactService = {
  /**
   * Submit contact form
   * @param {Object} contactData - Contact form data
   * @returns {Promise} Submission response
   */
  async submitContactForm(contactData) {
    try {
      const response = await apiClient.post('/contacts', {
        data: contactData
      })
      return response.data
    } catch (error) {
      console.error('Error submitting contact form:', error)
      throw error
    }
  },

  /**
   * Get all contact submissions (admin only)
   * @param {Object} options - Query options
   * @returns {Promise} Contact submissions
   */
  async getContactSubmissions(options = {}) {
    try {
      const params = {
        pagination: {
          page: options.page || 1,
          pageSize: options.pageSize || 20
        },
        sort: options.sort || 'createdAt:desc'
      }

      const response = await apiClient.get('/contacts', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching contact submissions:', error)
      throw error
    }
  },

  /**
   * Update contact submission status
   * @param {number} id - Contact ID
   * @param {string} status - New status
   * @param {string} notes - Admin notes
   * @returns {Promise} Updated contact
   */
  async updateContactStatus(id, status, notes = '') {
    try {
      const response = await apiClient.put(`/contacts/${id}`, {
        data: {
          status,
          adminNotes: notes,
          respondedAt: new Date().toISOString()
        }
      })
      return response.data
    } catch (error) {
      console.error(`Error updating contact ${id}:`, error)
      throw error
    }
  }
}

/**
 * API Service for blog/articles
 */
export const blogService = {
  /**
   * Fetch all blog posts
   * @param {Object} options - Query options
   * @returns {Promise} Blog posts
   */
  async getPosts(options = {}) {
    try {
      const params = {
        pagination: {
          page: options.page || 1,
          pageSize: options.pageSize || 10
        },
        sort: options.sort || 'createdAt:desc',
        populate: ['author', 'category', 'coverImage']
      }

      if (options.filters) {
        params.filters = options.filters
      }

      const response = await apiClient.get('/posts', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      throw error
    }
  },

  /**
   * Fetch a single blog post by ID
   * @param {number} id - Post ID
   * @returns {Promise} Post data
   */
  async getPostById(id) {
    try {
      const response = await apiClient.get(`/posts/${id}`, {
        params: {
          populate: ['author', 'category', 'coverImage', 'content']
        }
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error)
      throw error
    }
  },

  /**
   * Create a new blog post
   * @param {Object} postData - Post data
   * @returns {Promise} Created post
   */
  async createPost(postData) {
    try {
      const response = await apiClient.post('/posts', {
        data: postData
      })
      return response.data
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }
}

/**
 * API Service for testimonials
 */
export const testimonialService = {
  /**
   * Fetch all testimonials
   * @param {Object} options - Query options
   * @returns {Promise} Testimonials
   */
  async getTestimonials(options = {}) {
    try {
      const params = {
        pagination: {
          page: options.page || 1,
          pageSize: options.pageSize || 20
        },
        sort: options.sort || 'createdAt:desc',
        populate: ['avatar']
      }

      if (options.filters) {
        params.filters = options.filters
      }

      const response = await apiClient.get('/testimonials', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      throw error
    }
  },

  /**
   * Create a new testimonial
   * @param {Object} testimonialData - Testimonial data
   * @returns {Promise} Created testimonial
   */
  async createTestimonial(testimonialData) {
    try {
      const response = await apiClient.post('/testimonials', {
        data: testimonialData
      })
      return response.data
    } catch (error) {
      console.error('Error creating testimonial:', error)
      throw error
    }
  },

  /**
   * Approve a testimonial
   * @param {number} id - Testimonial ID
   * @returns {Promise} Updated testimonial
   */
  async approveTestimonial(id) {
    try {
      const response = await apiClient.put(`/testimonials/${id}`, {
        data: {
          approved: true,
          approvedAt: new Date().toISOString()
        }
      })
      return response.data
    } catch (error) {
      console.error(`Error approving testimonial ${id}:`, error)
      throw error
    }
  }
}

/**
 * API Service for analytics
 */
export const analyticsService = {
  /**
   * Track page view
   * @param {string} page - Page URL
   * @param {string} referrer - Referrer URL
   * @returns {Promise} Analytics response
   */
  async trackPageView(page, referrer = '') {
    try {
      const response = await apiClient.post('/analytics/pageview', {
        page,
        referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      console.error('Error tracking page view:', error)
      // Don't throw error for analytics failures
    }
  },

  /**
   * Track booking conversion
   * @param {string} bookingId - Booking ID
   * @param {string} source - Conversion source
   * @returns {Promise} Analytics response
   */
  async trackBookingConversion(bookingId, source = 'website') {
    try {
      const response = await apiClient.post('/analytics/conversion', {
        bookingId,
        source,
        timestamp: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      console.error('Error tracking conversion:', error)
    }
  },

  /**
   * Get dashboard statistics
   * @returns {Promise} Dashboard stats
   */
  async getDashboardStats() {
    try {
      const response = await apiClient.get('/analytics/dashboard-stats')
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }
}

/**
 * API Service for settings
 */
export const settingsService = {
  /**
   * Get site settings
   * @returns {Promise} Site settings
   */
  async getSiteSettings() {
    try {
      const response = await apiClient.get('/site-settings')
      return response.data
    } catch (error) {
      console.error('Error fetching site settings:', error)
      throw error
    }
  },

  /**
   * Update site settings (admin only)
   * @param {Object} settings - New settings
   * @returns {Promise} Updated settings
   */
  async updateSiteSettings(settings) {
    try {
      const response = await apiClient.put('/site-settings', {
        data: settings
      })
      return response.data
    } catch (error) {
      console.error('Error updating site settings:', error)
      throw error
    }
  }
}

/**
 * Helper function to format API errors
 */
export const formatError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response
    
    if (data?.error?.message) {
      return data.error.message
    }
    
    if (data?.message) {
      return data.message
    }
    
    switch (status) {
      case 400:
        return 'Bad request. Please check your input.'
      case 401:
        return 'Unauthorized. Please login again.'
      case 403:
        return 'Forbidden. You do not have permission.'
      case 404:
        return 'Resource not found.'
      case 422:
        return 'Validation error. Please check your input.'
      case 429:
        return 'Too many requests. Please try again later.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return `Error: ${status}`
    }
  } else if (error.request) {
    // The request was made but no response was received
    return 'Network error. Please check your connection.'
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || 'An unexpected error occurred.'
  }
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken')
  const isAuth = localStorage.getItem('isAuthenticated')
  return !!(token && isAuth === 'true')
}

/**
 * Clear authentication
 */
export const clearAuth = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('isAuthenticated')
}

/**
 * Set authentication
 */
export const setAuth = (token) => {
  localStorage.setItem('authToken', token)
  localStorage.setItem('isAuthenticated', 'true')
}

export default apiClient