const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const contactService = {
  async submitContactForm(formData) {
    try {
      // Validate form data before submission
      const validationErrors = validateContactForm(formData)
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`)
      }

      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      // Check response status before parsing JSON
      if (!response.ok) {
        const contentType = response.headers.get('content-type')
        let errorData
        
        try {
          if (contentType?.includes('application/json')) {
            errorData = await response.json()
          } else {
            errorData = { message: `HTTP ${response.status}: ${response.statusText}` }
          }
        } catch (parseError) {
          errorData = { message: `HTTP ${response.status}: Failed to parse error response` }
        }
        
        throw new Error(errorData.message || 'Failed to submit form')
      }

      // Safe JSON parsing with error handling
      let data
      try {
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          data = await response.json()
        } else {
          throw new Error('Server returned non-JSON response')
        }
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError)
        throw new Error('Failed to parse server response')
      }

      return data
    } catch (error) {
      console.error('Contact form submission error:', error)
      
      // Return structured error object instead of throwing
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error
      }
    }
  },

  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        timeout: 5000
      })
      
      if (!response.ok) {
        return { status: 'error', message: `Health check failed: HTTP ${response.status}` }
      }

      try {
        return await response.json()
      } catch (parseError) {
        return { status: 'error', message: 'Failed to parse health check response' }
      }
    } catch (error) {
      console.error('Health check error:', error)
      return { status: 'error', message: 'Backend not reachable' }
    }
  }
}

/**
 * Validate contact form data
 */
function validateContactForm(data) {
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
  
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters')
  }
  
  return errors
}

/**
 * Simple email validation
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}