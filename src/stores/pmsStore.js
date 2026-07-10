import { defineStore } from 'pinia'
import { ref } from 'vue'
import { leasesAPI, ticketsAPI, ownerAPI } from '@/services/pmsApi'
import { initiatePayment, getPaymentHistory } from '@/services/paymentService'

export const usePmsStore = defineStore('pms', () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const leases             = ref([])
  const tickets            = ref([])
  const payments           = ref([])
  const ownerSummary       = ref(null)
  const loading            = ref(false)
  const error              = ref(null)
  const selectedPropertyId = ref('all')

  const clearError = () => { error.value = null }
  const setSelectedPropertyId = (id) => {
    selectedPropertyId.value = id
  }

  // ── Leases ────────────────────────────────────────────────────────────────
  const fetchLeases = async () => {
    loading.value = true
    error.value   = null
    try {
      const res    = await leasesAPI.getAll()
      leases.value = res.data || []
    } catch (err) {
      error.value = err.response?.data?.message || err.message
    } finally {
      loading.value = false
    }
  }

  const createLease = async (data) => {
    loading.value = true
    error.value   = null
    try {
      const res = await leasesAPI.create(data)
      leases.value.unshift(res.data)
      return { success: true, data: res.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateLease = async (id, data) => {
    loading.value = true
    error.value   = null
    try {
      const res = await leasesAPI.update(id, data)
      const idx = leases.value.findIndex(l => l.id === id)
      if (idx !== -1) leases.value[idx] = res.data
      return { success: true, data: res.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ── Tickets ───────────────────────────────────────────────────────────────
  const fetchTickets = async () => {
    loading.value = true
    error.value   = null
    try {
      const res     = await ticketsAPI.getAll()
      tickets.value = res.data || []
    } catch (err) {
      error.value = err.response?.data?.message || err.message
    } finally {
      loading.value = false
    }
  }

  const createTicket = async (data) => {
    loading.value = true
    error.value   = null
    try {
      const res = await ticketsAPI.create(data)
      tickets.value.unshift(res.data)
      return { success: true, data: res.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateTicketStatus = async (id, data) => {
    loading.value = true
    error.value   = null
    try {
      const res = await ticketsAPI.updateStatus(id, data)
      const idx = tickets.value.findIndex(t => t.id === id)
      if (idx !== -1) tickets.value[idx] = res.data
      return { success: true, data: res.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ── Owner Summary ─────────────────────────────────────────────────────────
  const fetchOwnerSummary = async () => {
    loading.value = true
    error.value   = null
    try {
      const res         = await ownerAPI.getSummary()
      ownerSummary.value = res.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
    } finally {
      loading.value = false
    }
  }

  // ── Payments ──────────────────────────────────────────────────────────────
  const fetchPaymentHistory = async () => {
    loading.value = true
    error.value   = null
    try {
      payments.value = await getPaymentHistory()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const initiateRentPayment = async ({ amount, leaseId, paymentType }) => {
    loading.value = true
    error.value   = null
    try {
      const result = await initiatePayment({ amount, leaseId, paymentType })
      return { success: true, data: result }
    } catch (err) {
      error.value = err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    leases, tickets, payments, ownerSummary, loading, error, selectedPropertyId,
    // Actions
    clearError,
    setSelectedPropertyId,
    fetchLeases, createLease, updateLease,
    fetchTickets, createTicket, updateTicketStatus,
    fetchOwnerSummary,
    fetchPaymentHistory, initiateRentPayment,
  }
})
