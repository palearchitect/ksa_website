<template>
  <DashboardLayout>
    <!-- Nav Tabs -->
    <template #nav-links>
      <button
        v-for="tab in tabs" :key="tab.id"
        class="nav-tab" :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <span v-html="tab.icon" class="tab-icon"></span>
        <span>{{ tab.label }}</span>
      </button>
    </template>

    <div class="tenant-dashboard">

      <!-- ── Lease Summary Banner ── -->
      <div class="lease-banner" v-if="currentLease">
        <div class="lease-info">
          <div class="lease-prop">
            <svg class="w-4 h-4 inline-block mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px; display: inline-block; vertical-align: text-bottom; margin-right: 4px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            {{ currentLease.propertyTitle || 'Your Property' }}
          </div>
          <div class="lease-meta">
            Unit: <strong>{{ currentLease.unitDescription || '—' }}</strong>
            &nbsp;·&nbsp; Rent: <strong>{{ fmt(currentLease.rentAmount) }}/month</strong>
            &nbsp;·&nbsp; Lease until: <strong>{{ fmtDate(currentLease.endDate) }}</strong>
          </div>
        </div>
        <span class="status-badge" :class="`status-${currentLease.status}`">{{ currentLease.status }}</span>
      </div>
      <div v-else-if="!pmsStore.loading" class="no-lease-notice">
        No active lease found. Please contact Management if this is incorrect.
      </div>

      <!-- ── PAYMENTS TAB ── -->
      <section v-if="activeTab === 'payments'">
        <div class="section-header">
          <h2 class="section-title">Pay Rent</h2>
        </div>

        <!-- Payment Initiation Card -->
        <div class="pay-card">
          <div class="pay-card-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 24px; height: 24px; stroke: #1e3a5f; margin: 0 auto 0.5rem;">
              <rect x="2" y="5" width="20" height="14" rx="2" stroke-width="2" />
              <line x1="2" y1="10" x2="22" y2="10" stroke-width="2" />
            </svg>
          </div>
          <h3>Make a Payment</h3>
          <p>Payments are processed securely via Paystack. Your unique reference is generated per transaction.</p>

          <form @submit.prevent="initiatePayment" class="pay-form">
            <div class="pay-row">
              <label>
                Amount (₦)
                <input v-model.number="payForm.amount" type="number" min="1" required placeholder="Enter amount" />
              </label>
              <label>
                Payment Type
                <select v-model="payForm.paymentType">
                  <option value="rent">Rent</option>
                  <option value="deposit">Deposit</option>
                  <option value="service">Service Charge</option>
                </select>
              </label>
            </div>

            <div class="pay-status" v-if="payResult">
              <div v-if="payResult.error" class="pay-error">{{ payResult.error }}</div>
              <div v-else class="pay-success">
                <div class="pay-ref">Reference: <code>{{ payResult.reference }}</code></div>
                <div class="pay-msg">Payment initiated! Proceed to complete payment:</div>
                <a :href="payResult.authorizationUrl" target="_blank" rel="noopener" class="pay-link-btn">
                  Complete Payment →
                </a>
                <div class="pay-stub-note">
                  <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px; display: inline-block; vertical-align: text-bottom; margin-right: 4px;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  Currently in sandbox mode. Add your Paystack production keys to go live.
                </div>

                <!-- Webhook Simulation Tool for Admins & Local Dev -->
                <div v-if="showSimulatePanel" class="dev-sim-box">
                  <span class="sim-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="display: inline-block; vertical-align: text-bottom; margin-right: 4px; color: #be185d;">
                      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
                    </svg>
                    Webhook Simulator
                  </span>
                  <button type="button" @click="simulatePaymentSuccess(payResult.reference, payForm.amount)" class="btn-sim-pay">
                    Simulate Success Webhook
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" class="btn-pay" :disabled="pmsStore.loading || payForm.amount <= 0">
              <span v-if="pmsStore.loading">Processing…</span>
              <span v-else>Pay {{ payForm.amount > 0 ? fmt(payForm.amount) : '' }}</span>
            </button>
          </form>
        </div>

        <!-- Payment History -->
        <div class="table-section">
          <h2 class="section-title">Payment History</h2>
          <div class="table-card" v-if="pmsStore.payments.length">
            <table class="data-table">
              <thead>
                <tr><th>Reference</th><th>Amount</th><th>Type</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                <tr v-for="p in pmsStore.payments" :key="p.id">
                  <td><code class="ref-code">{{ p.reference }}</code></td>
                  <td>{{ fmt(p.amount) }}</td>
                  <td>{{ p.paymentType }}</td>
                  <td><span class="status-badge" :class="`status-${p.status}`">{{ p.status }}</span></td>
                  <td>{{ fmtDate(p.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="empty-state">No payment history yet.</div>
        </div>
      </section>

      <!-- ── TICKETS TAB ── -->
      <section v-if="activeTab === 'tickets'">
        <div class="section-header">
          <h2 class="section-title">Maintenance & Disputes</h2>
          <button class="btn-primary" @click="showTicketModal = true">+ New Ticket</button>
        </div>

        <div class="table-card" v-if="pmsStore.tickets.length">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th><th>Title</th><th>Category</th>
                <th>Priority</th><th>Status</th><th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in pmsStore.tickets" :key="t.id">
                <td>{{ t.id }}</td>
                <td>
                  <strong>{{ t.title }}</strong>
                  <div class="ticket-desc">{{ t.description }}</div>
                  <div v-if="t.resolutionNotes" class="ticket-resolution">
                    <svg class="w-4 h-4 inline-block mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px; display: inline-block; vertical-align: text-bottom; margin-right: 4px;">
                      <polyline points="20 6 9 17 4 12" stroke-width="2"/>
                    </svg>
                    {{ t.resolutionNotes }}
                  </div>
                </td>
                <td>{{ t.category }}</td>
                <td><span class="priority-badge" :class="`priority-${t.priority}`">{{ t.priority }}</span></td>
                <td><span class="status-badge" :class="`status-${t.status}`">{{ t.status }}</span></td>
                <td>{{ fmtDate(t.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-state">No tickets submitted yet.</div>
      </section>

    </div>

    <!-- Ticket Modal -->
    <Teleport to="body">
      <div v-if="showTicketModal" class="modal-backdrop" @click.self="showTicketModal = false">
        <div class="modal-box">
          <h3 class="modal-title">Submit a Ticket</h3>
          <form @submit.prevent="submitTicket" class="modal-form">
            <label>Title <input v-model="ticketForm.title" required /></label>
            <label>
              Category
              <select v-model="ticketForm.category">
                <option value="general">General</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="structural">Structural</option>
                <option value="security">Security</option>
                <option value="dispute">Dispute</option>
              </select>
            </label>
            <label>
              Priority
              <select v-model="ticketForm.priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label>Description <textarea v-model="ticketForm.description" rows="4" required /></label>
            <div class="form-status" :class="{ success: ticketMsg.ok }" v-if="ticketMsg.text">{{ ticketMsg.text }}</div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="showTicketModal = false">Cancel</button>
              <button type="submit" class="btn-primary" :disabled="pmsStore.loading">
                {{ pmsStore.loading ? 'Submitting…' : 'Submit Ticket' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from './DashboardLayout.vue'
import { usePmsStore } from '@/stores/pmsStore'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

const pmsStore = usePmsStore()
const authStore = useAuthStore()

// Strictly check developer panel eligibility
const showSimulatePanel = computed(() => {
  const isDev = import.meta.env.DEV
  const isAdmin = authStore.user?.role === 'admin'
  // In production builds, strictly restrict to admin role
  if (!isDev) {
    return isAdmin
  }
  return isDev || isAdmin
})

async function simulatePaymentSuccess(refCode, amt) {
  if (!confirm('Simulate success webhook response for this transaction?')) return
  try {
    pmsStore.loading = true
    const res = await axios.post('/api/pms/payments/webhook', {
      event: 'charge.success',
      data: {
        reference: refCode,
        amount: Number(amt) * 100, // in kobo
        status: 'success'
      }
    })
    if (res.data.success) {
      alert('Webhook success simulation triggered!')
      payResult.value = null // hide card
      await Promise.all([
        pmsStore.fetchPaymentHistory(),
        pmsStore.fetchLeases()
      ])
    }
  } catch (err) {
    alert('Simulation failed: ' + (err.response?.data?.message || err.message))
  } finally {
    pmsStore.loading = false
  }
}

const tabs = [
  { 
    id: 'payments', 
    label: 'Payments', 
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>' 
  },
  { 
    id: 'tickets',  
    label: 'Maintenance', 
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;display:inline-block;vertical-align:middle;"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>' 
  },
]
const activeTab = ref('payments')

// Lease
const currentLease = computed(() => pmsStore.leases.find(l => l.status === 'active') || pmsStore.leases[0] || null)

// Payment form
const payForm  = ref({ amount: 0, paymentType: 'rent' })
const payResult = ref(null)

async function initiatePayment() {
  payResult.value = null
  const res = await pmsStore.initiateRentPayment({
    amount:      payForm.value.amount,
    leaseId:     currentLease.value?.id || null,
    paymentType: payForm.value.paymentType,
  })
  if (res.success) {
    payResult.value = res.data
    await pmsStore.fetchPaymentHistory() // refresh history
  } else {
    payResult.value = { error: res.error }
  }
}

// Ticket form
const showTicketModal = ref(false)
const ticketMsg  = ref({ text: '', ok: false })
const ticketForm = ref({ title: '', description: '', category: 'general', priority: 'medium' })

async function submitTicket() {
  const res = await pmsStore.createTicket({
    ...ticketForm.value,
    leaseId:    currentLease.value?.id || null,
    propertyId: currentLease.value?.propertyId || null,
  })
  if (res.success) {
    ticketMsg.value = { text: 'Ticket submitted!', ok: true }
    ticketForm.value = { title: '', description: '', category: 'general', priority: 'medium' }
    setTimeout(() => { showTicketModal.value = false; ticketMsg.value = { text: '', ok: false } }, 1200)
  } else {
    ticketMsg.value = { text: res.error || 'Submission failed.', ok: false }
  }
}

onMounted(async () => {
  await Promise.all([pmsStore.fetchLeases(), pmsStore.fetchTickets(), pmsStore.fetchPaymentHistory()])
})

const fmt     = (n) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n || 0)
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB') : '—'
</script>

<style scoped>
/* Lease Banner */
.lease-banner {
  display: flex; align-items: center; justify-content: space-between;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5986 100%);
  color: #fff;
  padding: 1.25rem 1.5rem;
  border-radius: 14px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(30,58,95,0.2);
}
.lease-prop { font-size: 1rem; font-weight: 700; margin-bottom: 0.25rem; }
.lease-meta { font-size: 0.82rem; opacity: 0.85; }
.no-lease-notice {
  background: #fef3c7; color: #92400e;
  border-radius: 10px; padding: 1rem 1.25rem;
  font-size: 0.85rem; margin-bottom: 1.5rem;
}

/* Payment Card */
.pay-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}
.pay-card-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
.pay-card h3   { font-size: 1.2rem; font-weight: 700; color: #1e3a5f; margin-bottom: 0.5rem; }
.pay-card p    { color: #6b7280; font-size: 0.87rem; margin-bottom: 1.5rem; }
.pay-form { max-width: 480px; margin: 0 auto; text-align: left; }
.pay-row  {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;
}
.pay-row label {
  display: flex; flex-direction: column; gap: 4px;
  font-size: 0.82rem; font-weight: 600; color: #374151;
}
.pay-row input, .pay-row select {
  border: 1px solid #d1d5db; border-radius: 8px;
  padding: 0.5rem 0.75rem; font-size: 0.85rem;
}

.btn-pay {
  width: 100%;
  background: linear-gradient(135deg, #1e3a5f, #c8a96e);
  color: #fff;
  border: none; border-radius: 10px;
  padding: 0.85rem;
  font-size: 1rem; font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  margin-top: 0.5rem;
}
.btn-pay:hover:not(:disabled)  { opacity: 0.9; transform: translateY(-1px); }
.btn-pay:disabled               { opacity: 0.5; cursor: not-allowed; }

/* Payment Result */
.pay-status { margin-bottom: 1rem; }
.pay-error  { background: #fee2e2; color: #991b1b; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.84rem; }
.pay-success { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 1rem; }
.pay-ref    { font-size: 0.82rem; color: #374151; margin-bottom: 0.5rem; }
.pay-ref code { background: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; }
.pay-msg    { font-size: 0.85rem; color: #166534; font-weight: 600; margin-bottom: 0.75rem; }
.pay-link-btn {
  display: inline-block;
  background: #1e3a5f; color: #fff;
  padding: 0.5rem 1.25rem; border-radius: 8px;
  text-decoration: none; font-size: 0.85rem; font-weight: 600;
  transition: background 0.2s;
}
.pay-link-btn:hover { background: #c8a96e; }
.pay-stub-note { margin-top: 0.75rem; font-size: 0.75rem; color: #92400e; }

/* Table */
.table-section { margin-top: 1.5rem; }
.section-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem;
}
.section-title { font-size: 1.1rem; font-weight: 700; color: #1e3a5f; }
.table-card    { background:#fff; border-radius:12px; box-shadow:0 1px 6px rgba(0,0,0,0.07); overflow:hidden; }
.data-table    { width:100%; border-collapse:collapse; font-size:0.85rem; }
.data-table th { background:#f8fafc; color:#6b7280; font-weight:600; text-align:left; padding:0.75rem 1rem; border-bottom:1px solid #e5e7eb; }
.data-table td { padding:0.75rem 1rem; border-bottom:1px solid #f3f4f6; color:#374151; vertical-align:top; }
.data-table tr:last-child td { border-bottom:none; }
.ticket-desc       { font-size:0.78rem; color:#9ca3af; margin-top:2px; }
.ticket-resolution { font-size:0.78rem; color:#166534; margin-top:4px; }

/* Badges */
.status-badge, .priority-badge {
  display:inline-block; padding:2px 10px;
  border-radius:999px; font-size:0.72rem; font-weight:700; text-transform:capitalize;
}
.status-active, .status-success   { background:#d1fae5; color:#065f46; }
.status-pending, .status-open     { background:#fef3c7; color:#92400e; }
.status-failed, .status-closed    { background:#fee2e2; color:#991b1b; }
.status-in_progress, .status-resolved { background:#eff6ff; color:#1d4ed8; }
.priority-high   { background:#fee2e2; color:#991b1b; }
.priority-medium { background:#fef3c7; color:#92400e; }
.priority-low    { background:#d1fae5; color:#065f46; }

.ref-code { font-family:monospace; font-size:0.75rem; background:#f3f4f6; padding:2px 6px; border-radius:4px; }
.empty-state { text-align:center; color:#9ca3af; padding:3rem; background:#fff; border-radius:12px; }

/* Buttons */
.btn-primary { background:#1e3a5f; color:#fff; border:none; padding:0.5rem 1rem; border-radius:8px; cursor:pointer; font-size:0.85rem; font-weight:600; transition:background 0.2s; }
.btn-primary:hover { background:#c8a96e; }
.btn-secondary { background:#f3f4f6; color:#374151; border:1px solid #d1d5db; padding:0.5rem 1rem; border-radius:8px; cursor:pointer; font-size:0.85rem; font-weight:600; }

/* Nav tabs */
.nav-tab { display: inline-flex; align-items: center; gap: 0.5rem; background:none; border:none; color:rgba(255,255,255,0.6); padding:0.4rem 0.9rem; border-radius:6px; cursor:pointer; font-size:0.85rem; font-weight:500; transition:background 0.2s,color 0.2s; }
.nav-tab.active, .nav-tab:hover { background:rgba(255,255,255,0.12); color:#fff; }

/* Modal */
.modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000; }
.modal-box      { background:#fff; border-radius:16px; padding:2rem; width:100%; max-width:460px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.2); }
.modal-title    { font-size:1.1rem; font-weight:700; margin-bottom:1.25rem; color:#1e3a5f; }
.modal-form     { display:flex; flex-direction:column; gap:0.75rem; }
.modal-form label  { display:flex; flex-direction:column; gap:4px; font-size:0.82rem; font-weight:600; color:#374151; }
.modal-form input, .modal-form textarea, .modal-form select { border:1px solid #d1d5db; border-radius:8px; padding:0.45rem 0.75rem; font-size:0.85rem; }
.modal-actions  { display:flex; gap:0.75rem; justify-content:flex-end; margin-top:0.5rem; }
.form-status    { padding:0.5rem; border-radius:6px; font-size:0.82rem; background:#fee2e2; color:#991b1b; }
.form-status.success { background:#d1fae5; color:#065f46; }

/* Webhook Simulator Styling */
.dev-sim-box {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fdf2f8;
  border: 1px dashed #ec4899;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  text-align: center;
}
.sim-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #be185d;
}
.btn-sim-pay {
  background: #ec4899;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-sim-pay:hover {
  background: #db2777;
}
</style>
