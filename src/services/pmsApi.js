/**
 * PMS API Service
 * Centralised Axios wrappers for the Property Management System endpoints.
 * All requests are forwarded through the Vite dev-proxy to backend port 3000.
 */
import axios from 'axios'

const api = axios.create({
  baseURL: '',
  withCredentials: true,
})

// ── Leases ───────────────────────────────────────────────────────────────────
export const leasesAPI = {
  getAll:  ()         => api.get('/api/pms/leases').then(r => r.data),
  getById: (id)       => api.get(`/api/pms/leases/${id}`).then(r => r.data),
  create:  (data)     => api.post('/api/pms/leases', data).then(r => r.data),
  update:  (id, data) => api.put(`/api/pms/leases/${id}`, data).then(r => r.data),
}

// ── Maintenance Tickets ───────────────────────────────────────────────────────
export const ticketsAPI = {
  getAll:       ()         => api.get('/api/pms/tickets').then(r => r.data),
  create:       (data)     => api.post('/api/pms/tickets', data).then(r => r.data),
  updateStatus: (id, data) => api.put(`/api/pms/tickets/${id}/status`, data).then(r => r.data),
}

// ── Owner Summary ─────────────────────────────────────────────────────────────
export const ownerAPI = {
  getSummary: () => api.get('/api/pms/owner/summary').then(r => r.data),
}

// ── Payments ──────────────────────────────────────────────────────────────────
export const paymentsAPI = {
  initiate: (data) => api.post('/api/pms/payments/initiate', data).then(r => r.data),
  history:  ()     => api.get('/api/pms/payments/history').then(r => r.data),
}
