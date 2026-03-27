const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
// In src/services/contactService.js
//const API_BASE_URL = import.meta.env.PROD 
 // ? (import.meta.env.VITE_API_URL || 'https://your-backend-domain.com/api')
  //\: '/api'; // Uses vite proxy in development
export const contactService = {
  async submitContactForm(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit form');
      }

      return data;
    } catch (error) {
      console.error('Contact service error:', error);
      throw error;
    }
  },

  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: 'Backend not reachable' };
    }
  }
};