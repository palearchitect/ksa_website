/**
 * Payment Service (Paystack Stub)
 *
 * This service wraps the payment initiation flow.
 * It calls the backend which generates a unique reference and returns the
 * Paystack authorization URL.
 *
 * PRODUCTION SWAP:
 *   1. Set PAYSTACK_SECRET_KEY and PAYSTACK_CALLBACK_URL in backend/.env
 *   2. Uncomment the real Paystack API calls in backend/server.js (marked with "PRODUCTION:")
 *   3. This service file requires no changes — it simply calls the backend API.
 */
import { paymentsAPI } from './pmsApi'

/**
 * Initiate a rent/service payment.
 * @param {Object} options
 * @param {number} options.amount       - Payment amount in NGN
 * @param {number} [options.leaseId]    - Optional lease ID to attach payment to
 * @param {string} [options.paymentType] - 'rent' | 'service' | 'deposit' (default: 'rent')
 * @returns {Promise<{ reference, authorizationUrl, accessCode }>}
 */
export async function initiatePayment({ amount, leaseId = null, paymentType = 'rent' }) {
  const response = await paymentsAPI.initiate({ amount, leaseId, paymentType })
  if (!response.success) throw new Error(response.message || 'Payment initiation failed')

  return {
    reference:        response.data.reference,
    authorizationUrl: response.data.authorizationUrl,
    accessCode:       response.data.accessCode,
    status:           response.data.status,
    amount:           response.data.amount,
  }
}

/**
 * Fetch payment history for the authenticated user.
 * @returns {Promise<Array>}
 */
export async function getPaymentHistory() {
  const response = await paymentsAPI.history()
  if (!response.success) throw new Error(response.message || 'Failed to load payment history')
  return response.data
}

/**
 * Format amount as Nigerian Naira.
 * @param {number} amount
 */
export function formatNaira(amount) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount)
}
