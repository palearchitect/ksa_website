import axios from 'axios'

// ============================================
// API CONFIGURATION & CONSTANTS
// ============================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const REFRESH_ENDPOINT = '/api/v1/auth/refresh'
const LOGIN_ENDPOINT = '/api/v1/auth/login'

// HTTP Status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500
}

// ============================================
// TOKEN REFRESH STATE (Atomic-safe)
// ============================================
let refreshPromise = null

const createRefreshPromise = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${REFRESH_ENDPOINT}`,
      {},
      {
        withCredentials: true,
        timeout: 5000
      }
    )
    return response.data
  } catch (error) {
    // Redirect to login on refresh failure
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login'
    }
    throw error
  } finally {
    refreshPromise = null
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ============================================
// RESPONSE INTERCEPTOR (Token Refresh + Error Handling)
// ============================================
api.interceptors.response.use(
  response => response,
  async error => {
    const { config } = error
    
    // Handle 401 (Unauthorized) - attempt token refresh
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      if (typeof window === 'undefined') {
        // Server-side rendering: can't access window
        return Promise.reject(error)
      }
      
      const onAdminRoute = window.location.pathname.startsWith('/admin')
      
      if (onAdminRoute && window.location.pathname !== '/admin/login') {
        // Don't retry login endpoint itself
        if (config.url.includes(LOGIN_ENDPOINT)) {
          window.location.href = '/admin/login'
          return Promise.reject(error)
        }

        // Use Promise-based refresh (atomic-safe, no race condition)
        try {
          if (!refreshPromise) {
            refreshPromise = createRefreshPromise()
          }
          
          await refreshPromise
          // Token refreshed - retry original request
          return api(config)
        } catch (refreshError) {
          // Refresh failed - redirect to login
          return Promise.reject(refreshError)
        }
      } else if (!onAdminRoute) {
        // Not on admin route, just reject
        return Promise.reject(error)
      }
    }
    
    // Add CSRF token to state-changing requests
    if (['POST', 'PUT', 'DELETE'].includes(config.method?.toUpperCase())) {
      const csrfToken = localStorage.getItem('csrf_token')
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken
      }
    }
    
    return Promise.reject(error)
  }
)

export const propertyService = {
  getProperties: () => api.get('/api/properties').then((r) => r.data),
  getPropertyById: (id) => api.get(`/api/properties/${id}`).then((r) => r.data),
  createProperty: (payload) => api.post('/api/properties', payload).then((r) => r.data),
  updateProperty: (id, payload) => api.put(`/api/properties/${id}`, payload).then((r) => r.data),
  deleteProperty: (id) => api.delete(`/api/properties/${id}`).then((r) => r.data)
}

export const projectService = {
  getProjects: () => api.get('/api/projects').then((r) => r.data),
  getProjectById: (id) => api.get(`/api/projects/${id}`).then((r) => r.data),
  createProject: (payload) => api.post('/api/projects', payload).then((r) => r.data),
  updateProject: (id, payload) => api.put(`/api/projects/${id}`, payload).then((r) => r.data),
  deleteProject: (id) => api.delete(`/api/projects/${id}`).then((r) => r.data)
}

export const bookingService = {
  createBooking: (payload) => api.post('/api/bookings', payload).then((r) => r.data),
  getBookings: () => api.get('/api/bookings').then((r) => r.data),
  getBookingById: (id) => api.get(`/api/bookings/${id}`).then((r) => r.data),
  updateBookingStatus: (id, status, notes = '') => api.put(`/api/bookings/${id}`, { status, notes }).then((r) => r.data),
  deleteBooking: (id) => api.delete(`/api/bookings/${id}`).then((r) => r.data),
  getAvailableSlots: (date, propertyId = null) => api.get('/api/bookings/available-slots', { params: { date, propertyId } }).then((r) => r.data)
}

export const emailService = {
  sendBookingConfirmation: (bookingData) => api.post('/email/booking-confirmation', { booking: bookingData }).then((r) => r.data),
  sendAdminNotification: (bookingData) => api.post('/email/admin-notification', { booking: bookingData }).then((r) => r.data),
  sendContactForm: (contactData) => api.post('/api/contact', contactData).then((r) => r.data)
}

export const authAPI = {
  login: (credentials) => api.post('/api/v1/auth/login', credentials).then((r) => r.data),
  me: () => api.get('/api/v1/auth/me').then((r) => r.data),
  logout: () => api.post('/api/v1/auth/logout').then((r) => r.data),
  refresh: () => api.post('/api/v1/auth/refresh').then((r) => r.data)
}

export const isAuthenticated = () => {
  return authAPI.me().then(() => true).catch(() => false)
}

export const clearAuth = () => {
  return authAPI.logout()
}

export const setAuth = () => {
  return undefined
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