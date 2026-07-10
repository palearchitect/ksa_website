<template>
  <div class="pms-shell">
    <!-- ── Sidebar ── -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div class="brand-text" v-if="!sidebarCollapsed">
          <span class="brand-name">KSA Valuers</span>
          <span class="brand-sub">Management System</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: activeSection === item.id }"
          @click="activeSection = item.id"
          :title="sidebarCollapsed ? item.label : ''"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label" v-if="!sidebarCollapsed">{{ item.label }}</span>
        </button>
      </nav>

      <div class="sidebar-footer" v-if="!sidebarCollapsed">
        <div class="quick-actions-title">Quick Actions</div>
        <button class="quick-action" @click="openLeaseModal('create')">+ Lease</button>
        <button class="quick-action" @click="activeSection = 'tenants'">+ Tenant</button>
      </div>
    </aside>

    <!-- ── Main ── -->
    <div class="main-area">
      <!-- Top Bar -->
      <header class="topbar">
        <button class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <span class="topbar-org">Organization: KSA Valuers Management</span>
        <div class="topbar-right flex items-center">
          <div class="mr-4">
            <PropertySwitcher />
          </div>
          <div class="topbar-user">
            <div class="user-avatar">{{ initials }}</div>
            <div>
              <div class="user-name">{{ authStore.user?.name }}</div>
              <div class="user-role">{{ authStore.user?.role }}</div>
            </div>
          </div>
          <button class="logout-btn" @click="handleLogout" title="Logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Content -->
      <main class="content-area">

        <!-- ══ DASHBOARD ══ -->
        <section v-if="activeSection === 'dashboard'">
          <div class="page-header">
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your property overview for {{ currentMonth }}</p>
          </div>

          <!-- Primary KPI Row -->
          <div class="kpi-row">
            <div class="kpi-primary blue">
              <div class="kpi-inner">
                <div>
                  <div class="kpi-micro">Monthly Income</div>
                  <div class="kpi-big">{{ fmt(dashStats.monthlyIncome) }}</div>
                </div>
                <div class="kpi-icon-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
              </div>
            </div>
            <div class="kpi-primary grey">
              <div class="kpi-inner">
                <div>
                  <div class="kpi-micro">Monthly Expenses</div>
                  <div class="kpi-big">{{ fmt(dashStats.monthlyExpenses) }}</div>
                  <div class="kpi-sub">{{ dashStats.expenseCount }} charges</div>
                </div>
                <div class="kpi-icon-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </div>
              </div>
            </div>
            <div class="kpi-primary green">
              <div class="kpi-inner">
                <div>
                  <div class="kpi-micro">Net Operating Income</div>
                  <div class="kpi-big">{{ fmt(dashStats.netIncome) }}</div>
                </div>
                <div class="kpi-icon-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </div>
              </div>
            </div>
            <div class="kpi-primary orange" v-if="dashStats.overdueAmount > 0">
              <div class="kpi-inner">
                <div>
                  <div class="kpi-micro">Overdue Amount</div>
                  <div class="kpi-big">{{ fmt(dashStats.overdueAmount) }}</div>
                  <div class="kpi-sub">{{ dashStats.overdueCount }} charges</div>
                </div>
                <div class="kpi-icon-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Secondary Stats -->
          <div class="stat-row">
            <div class="stat-card" v-for="s in secondaryStats" :key="s.label">
              <div class="stat-icon" v-html="s.icon"></div>
              <div class="stat-value">{{ s.value }}</div>
              <div class="stat-label">{{ s.label }}</div>
              <div class="stat-sub" v-if="s.sub">{{ s.sub }}</div>
            </div>
          </div>

          <!-- Two-column panels -->
          <div class="panel-row">
            <!-- Leases Ending Soon -->
            <div class="panel">
              <div class="panel-head">
                <span>Leases Ending Soon</span>
                <button class="panel-link" @click="activeSection = 'leases'">View all →</button>
              </div>
              <div v-if="expiringLeases.length">
                <div class="lease-row" v-for="l in expiringLeases" :key="l.id">
                  <div>
                    <div class="lease-prop">{{ l.propertyTitle || 'Property' }} – Unit {{ l.unitDescription || '—' }}</div>
                    <div class="lease-tenant">Tenant #{{ l.tenantId }}</div>
                  </div>
                  <div class="lease-days" :class="{ urgent: daysLeft(l.endDate) <= 30 }">
                    {{ daysLeft(l.endDate) }} days left<br>
                    <small>Ends {{ fmtDate(l.endDate) }}</small>
                  </div>
                </div>
              </div>
              <div v-else class="empty-panel">No leases expiring soon.</div>
            </div>

            <!-- Maintenance Overview -->
            <div class="panel">
              <div class="panel-head">
                <span>Maintenance Overview</span>
                <button class="panel-link" @click="activeSection = 'maintenance'">View all →</button>
              </div>
              <div class="maint-counters">
                <div class="mc" v-for="(v, k) in ticketCounts" :key="k">
                  <span class="mc-value">{{ v }}</span>
                  <span class="mc-label">{{ k }}</span>
                </div>
              </div>
              <div class="ticket-preview" v-for="t in recentTickets" :key="t.id">
                <div>
                  <div class="tp-title">{{ t.title }}</div>
                  <div class="tp-unit">{{ t.propertyTitle || '—' }}</div>
                </div>
                <span class="priority-tag" :class="`priority-${t.priority}`">{{ t.priority }}</span>
              </div>
              <div v-if="!recentTickets.length" class="empty-panel">No open tickets.</div>
            </div>
          </div>

          <!-- Overdue Payments -->
          <div class="panel mt-1" v-if="overduePayments.length">
            <div class="panel-head">
              <span>Overdue Payments</span>
              <button class="panel-link" @click="activeSection = 'finance'">View all →</button>
            </div>
            <div class="overdue-row" v-for="p in overduePayments" :key="p.id">
              <div>
                <div class="od-tenant">Tenant #{{ p.tenantId }}</div>
                <div class="od-detail">{{ p.paymentType }} · Due {{ fmtDate(p.createdAt) }}</div>
              </div>
              <div class="od-amount">{{ fmt(p.amount) }}</div>
            </div>
          </div>
        </section>

        <!-- ══ PROPERTIES ══ -->
        <section v-if="activeSection === 'properties'">
          <div class="page-header">
            <h1>Properties</h1>
            <p>{{ pmsStore.leases.length }} active lease(s) across all properties</p>
          </div>
          <div class="table-card">
            <table class="data-table">
              <thead>
                <tr><th>Property</th><th>Unit</th><th>Tenant</th><th>Rent</th><th>Lease Status</th><th>End Date</th></tr>
              </thead>
              <tbody>
                <tr v-for="l in pmsStore.leases" :key="l.id">
                  <td><strong>{{ l.propertyTitle || '—' }}</strong></td>
                  <td>{{ l.unitDescription || '—' }}</td>
                  <td>Tenant #{{ l.tenantId }}</td>
                  <td>{{ fmt(l.rentAmount) }}/mo</td>
                  <td><span class="badge" :class="`badge-${l.status}`">{{ l.status }}</span></td>
                  <td>{{ fmtDate(l.endDate) }}</td>
                </tr>
                <tr v-if="!pmsStore.leases.length"><td colspan="6" class="empty-cell">No lease records.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ══ TENANTS ══ -->
        <section v-if="activeSection === 'tenants'">
          <div class="page-header">
            <h1>Tenants</h1>
            <p>{{ pmsStore.leases.length }} tenant(s) in directory</p>
            <div class="page-actions">
              <input class="search-input" v-model="tenantSearch" placeholder="Search tenants…" />
              <button class="btn-primary" @click="openLeaseModal('create')">+ Add Tenant Lease</button>
            </div>
          </div>

          <div class="table-card">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Active Leases</th>
                  <th>Monthly Rent</th>
                  <th>Balance Due</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in filteredTenantLeases" :key="t.id">
                  <td>
                    <div class="tenant-cell">
                      <div class="tenant-avatar">T{{ t.tenantId }}</div>
                      <div>
                        <div class="tenant-name">Tenant #{{ t.tenantId }}</div>
                        <div class="tenant-type">Individual</div>
                      </div>
                    </div>
                  </td>
                  <td>1</td>
                  <td>{{ fmt(t.rentAmount) }}</td>
                  <td :class="t.status === 'active' ? 'text-ok' : 'text-due'">{{ fmt(t.rentAmount) }}</td>
                  <td><span class="badge" :class="`badge-${t.status}`">{{ t.status }}</span></td>
                  <td>
                    <button class="icon-btn" @click="openLeaseModal('edit', t)" title="Edit">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="display: inline-block;">
                        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="!filteredTenantLeases.length">
                  <td colspan="6" class="empty-cell">No tenants found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ══ LEASES ══ -->
        <section v-if="activeSection === 'leases'">
          <div class="page-header">
            <h1>Leases</h1>
            <div class="page-actions">
              <button class="btn-primary" @click="openLeaseModal('create')">+ New Lease</button>
            </div>
          </div>
          <div class="table-card">
            <table class="data-table">
              <thead>
                <tr><th>Tenant</th><th>Property</th><th>Unit</th><th>Rent</th><th>Start</th><th>End</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                <tr v-for="l in pmsStore.leases" :key="l.id">
                  <td>Tenant #{{ l.tenantId }}</td>
                  <td>{{ l.propertyTitle || '—' }}</td>
                  <td>{{ l.unitDescription || '—' }}</td>
                  <td>{{ fmt(l.rentAmount) }}</td>
                  <td>{{ fmtDate(l.startDate) }}</td>
                  <td :class="daysLeft(l.endDate) <= 30 ? 'text-due' : ''">{{ fmtDate(l.endDate) }}</td>
                  <td><span class="badge" :class="`badge-${l.status}`">{{ l.status }}</span></td>
                  <td>
                    <button class="icon-btn" @click="openLeaseModal('edit', l)" title="Edit">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="display: inline-block;">
                        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="!pmsStore.leases.length"><td colspan="8" class="empty-cell">No leases yet.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ══ FINANCE ══ -->
        <section v-if="activeSection === 'finance'">
          <div class="page-header">
            <h1>Finance Center</h1>
            <p>Manage payments, charges, and track overdue accounts</p>
          </div>

          <!-- Finance KPIs -->
          <div class="kpi-row">
            <div class="kpi-primary green">
              <div class="kpi-inner">
                <div>
                  <div class="kpi-micro">Monthly Income</div>
                  <div class="kpi-big">{{ fmt(dashStats.monthlyIncome) }}</div>
                  <div class="kpi-sub">{{ currentMonth }}</div>
                </div>
                <div class="kpi-icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
              </div>
            </div>
            <div class="kpi-primary grey">
              <div class="kpi-inner">
                <div>
                  <div class="kpi-micro">Pending Charges</div>
                  <div class="kpi-big">{{ fmt(pendingPaymentsTotal) }}</div>
                  <div class="kpi-sub">{{ pendingPayments.length }} charges</div>
                </div>
                <div class="kpi-icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
              </div>
            </div>
            <div class="kpi-primary red" v-if="dashStats.overdueAmount > 0">
              <div class="kpi-inner">
                <div>
                  <div class="kpi-micro">Overdue Amount</div>
                  <div class="kpi-big">{{ fmt(dashStats.overdueAmount) }}</div>
                  <div class="kpi-sub">{{ dashStats.overdueCount }} charges</div>
                </div>
                <div class="kpi-icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div>
              </div>
            </div>
            <div class="kpi-primary blue">
              <div class="kpi-inner">
                <div>
                  <div class="kpi-micro">Total Payments</div>
                  <div class="kpi-big">{{ pmsStore.payments.length }}</div>
                  <div class="kpi-sub">All time</div>
                </div>
                <div class="kpi-icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg></div>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="finance-tabs">
            <button class="ftab" :class="{ active: financeTab === 'overdue' }" @click="financeTab = 'overdue'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="display: inline-block; vertical-align: text-bottom; margin-right: 4px; color: #dc2626;">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/>
              </svg>
              Overdue <span class="badge-count">{{ overduePayments.length }}</span>
            </button>
            <button class="ftab" :class="{ active: financeTab === 'all' }" @click="financeTab = 'all'">
              All Charges
            </button>
            <button class="ftab" :class="{ active: financeTab === 'payments' }" @click="financeTab = 'payments'">
              Payments
            </button>
          </div>

          <!-- Overdue tab -->
          <div v-if="financeTab === 'overdue'">
            <div class="finance-group" v-for="l in pmsStore.leases.filter(x => x.status !== 'active')" :key="l.id">
              <div class="fg-head">
                <div>
                  <div class="fg-name">Tenant #{{ l.tenantId }}</div>
                  <div class="fg-unit">{{ l.propertyTitle || '—' }} · Unit {{ l.unitDescription || '—' }}</div>
                </div>
                <div class="fg-amount text-due">{{ fmt(l.rentAmount) }}</div>
              </div>
              <div class="fg-row">
                <div>Rent<div class="fg-date">Due {{ fmtDate(l.startDate) }}</div></div>
                <div>{{ fmt(l.rentAmount) }}</div>
              </div>
              <div class="fg-actions">
                <button class="btn-outline">Send Reminder</button>
                <button class="btn-primary">+ Record Payment</button>
              </div>
            </div>
            <div class="empty-state" v-if="!pmsStore.leases.filter(x => x.status !== 'active').length">
              No overdue accounts.
            </div>
          </div>

          <!-- All charges tab -->
          <div v-if="financeTab === 'all'">
            <div class="table-card">
              <table class="data-table">
                <thead><tr><th>Reference</th><th>Amount</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  <tr v-for="p in pmsStore.payments" :key="p.id">
                    <td><code class="ref-code">{{ p.reference }}</code></td>
                    <td>{{ fmt(p.amount) }}</td>
                    <td>{{ p.paymentType }}</td>
                    <td><span class="badge" :class="`badge-${p.status}`">{{ p.status }}</span></td>
                    <td>{{ fmtDate(p.createdAt) }}</td>
                  </tr>
                  <tr v-if="!pmsStore.payments.length"><td colspan="5" class="empty-cell">No records.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Payments tab -->
          <div v-if="financeTab === 'payments'">
            <div class="table-card">
              <table class="data-table">
                <thead><tr><th>Reference</th><th>Amount</th><th>Type</th><th>Status</th><th>Provider</th><th>Paid At</th></tr></thead>
                <tbody>
                  <tr v-for="p in pmsStore.payments.filter(x => x.status === 'success')" :key="p.id">
                    <td><code class="ref-code">{{ p.reference }}</code></td>
                    <td>{{ fmt(p.amount) }}</td>
                    <td>{{ p.paymentType }}</td>
                    <td><span class="badge badge-active">{{ p.status }}</span></td>
                    <td>{{ p.provider }}</td>
                    <td>{{ fmtDate(p.paidAt) }}</td>
                  </tr>
                  <tr v-if="!pmsStore.payments.filter(x => x.status === 'success').length">
                    <td colspan="6" class="empty-cell">No completed payments.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ══ MAINTENANCE ══ -->
        <section v-if="activeSection === 'maintenance'">
          <div class="page-header">
            <h1>Maintenance</h1>
            <p>Track and resolve property maintenance tickets</p>
          </div>

          <!-- Priority counters -->
          <div class="maint-kpi-row">
            <div class="maint-kpi" v-for="(count, label) in ticketCounts" :key="label" :class="`maint-${label}`">
              <div class="maint-kpi-val">{{ count }}</div>
              <div class="maint-kpi-lbl">{{ label }}</div>
            </div>
          </div>

          <!-- Filter bar -->
          <div class="filter-bar">
            <button class="filter-btn" v-for="f in ticketFilters" :key="f.value"
              :class="{ active: ticketFilter === f.value }"
              @click="ticketFilter = f.value">
              {{ f.label }}
            </button>
          </div>

          <!-- Ticket list -->
          <div class="ticket-list">
            <div class="ticket-card" v-for="t in filteredTickets" :key="t.id">
              <div class="ticket-card-body">
                <div class="tc-head">
                  <span class="tc-title">{{ t.title }}</span>
                  <span class="priority-tag" :class="`priority-${t.priority}`">{{ t.priority }}</span>
                </div>
                <div class="tc-desc">{{ t.description }}</div>
                <div class="tc-meta">
                  <span>#{{ t.id }}</span>
                  <span>{{ t.category }}</span>
                  <span>{{ fmtDate(t.createdAt) }}</span>
                </div>
                <div class="tc-resolution" v-if="t.resolutionNotes">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="display: inline-block; vertical-align: text-bottom; margin-right: 4px; color: #059669;">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {{ t.resolutionNotes }}
                </div>
              </div>
              <div class="ticket-card-actions">
                <span class="badge" :class="`badge-ticket-${t.status}`">{{ t.status }}</span>
                <select class="inline-select" @change="changeTicketStatus(t.id, $event.target.value)" :value="t.status">
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div class="empty-state" v-if="!filteredTickets.length">No tickets match this filter.</div>
          </div>
        </section>

        <!-- ══ REPORTS ══ -->
        <section v-if="activeSection === 'reports'">
          <div class="page-header"><h1>Reports</h1><p>Summary analytics and export tools</p></div>
          <div class="report-grid">
            <div class="report-card">
              <div class="rc-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32" style="color: #2563eb; margin-bottom: 0.5rem;">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <h3>Occupancy Report</h3>
              <p>View occupancy rate across all properties</p>
              <div class="rc-stat">{{ pmsStore.leases.filter(l => l.status === 'active').length }} / {{ pmsStore.leases.length }} Active</div>
            </div>
            <div class="report-card">
              <div class="rc-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32" style="color: #10b981; margin-bottom: 0.5rem;">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
              </div>
              <h3>Revenue Report</h3>
              <p>Total collected vs outstanding rent</p>
              <div class="rc-stat">{{ fmt(dashStats.monthlyIncome) }}/month</div>
            </div>
            <div class="report-card">
              <div class="rc-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32" style="color: #f59e0b; margin-bottom: 0.5rem;">
                  <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <h3>Maintenance Report</h3>
              <p>Open vs resolved maintenance tickets</p>
              <div class="rc-stat">{{ ticketCounts.Urgent + ticketCounts.High }} urgent / high priority</div>
            </div>
          </div>
        </section>

        <!-- ══ SETTINGS ══ -->
        <section v-if="activeSection === 'settings'">
          <div class="page-header"><h1>Settings</h1></div>
          <div class="settings-card">
            <h3>Portal Settings</h3>
            <p class="settings-note">Additional configuration options will appear here as the system grows.</p>
          </div>
        </section>

      </main>
    </div>

    <!-- ══ Lease Modal ══ -->
    <Teleport to="body">
      <div v-if="showLeaseModal" class="modal-backdrop" @click.self="closeLeaseModal">
        <div class="modal-box">
          <h3 class="modal-title">{{ leaseModalMode === 'edit' ? 'Edit Lease' : 'Create Lease' }}</h3>
          <form @submit.prevent="submitLease" class="modal-form">
            <div class="form-row">
              <label>Tenant User ID <input v-model="leaseForm.tenantId" type="number" required /></label>
              <label>Owner User ID <input v-model="leaseForm.ownerId" type="number" /></label>
            </div>
            <div class="form-row">
              <label>Property ID <input v-model="leaseForm.propertyId" type="number" /></label>
              <label>Unit Description <input v-model="leaseForm.unitDescription" /></label>
            </div>
            <div class="form-row">
              <label>Rent Amount (₦) <input v-model="leaseForm.rentAmount" type="number" required /></label>
            </div>
            <div class="form-row">
              <label>Start Date <input v-model="leaseForm.startDate" type="date" required /></label>
              <label>End Date <input v-model="leaseForm.endDate" type="date" required /></label>
            </div>
            <label>Notes <textarea v-model="leaseForm.notes" rows="2" /></label>
            <div class="form-msg" :class="{ ok: submitMsg.ok }" v-if="submitMsg.text">{{ submitMsg.text }}</div>
            <div class="modal-actions">
              <button type="button" class="btn-outline" @click="closeLeaseModal">Cancel</button>
              <button type="submit" class="btn-primary" :disabled="pmsStore.loading">
                {{ pmsStore.loading ? 'Saving…' : 'Save Lease' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Global Floating Action Button (FAB) -->
    <div class="global-fab-wrapper">
      <button class="fab-main-btn" @click="showLeaseModal = true; leaseModalMode = 'create';" title="New Lease">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="24" height="24">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { usePmsStore } from '@/stores/pmsStore'
import PropertySwitcher from '@/components/properties/PropertySwitcher.vue'

const router    = useRouter()
const authStore = useAuthStore()
const pmsStore  = usePmsStore()

// ── Layout ────────────────────────────────────────────────────────────────────
const sidebarCollapsed = ref(false)
const activeSection    = ref('dashboard')
const financeTab       = ref('overdue')
const ticketFilter     = ref('')
const tenantSearch     = ref('')

const navItems = [
  { id: 'dashboard',   label: 'Dashboard',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
  { id: 'properties',  label: 'Properties',   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>' },
  { id: 'tenants',     label: 'Tenants',      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>' },
  { id: 'leases',      label: 'Leases',       icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' },
  { id: 'finance',     label: 'Finance',      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path stroke-linecap="round" d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>' },
  { id: 'maintenance', label: 'Maintenance',  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>' },
  { id: 'reports',     label: 'Reports',      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
  { id: 'settings',    label: 'Settings',     icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path stroke-linecap="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>' },
]

const ticketFilters = [
  { value: '',            label: 'All' },
  { value: 'open',        label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved',    label: 'Resolved' },
  { value: 'closed',      label: 'Closed' },
]

// ── Auth ──────────────────────────────────────────────────────────────────────
const initials = computed(() => {
  const name = authStore.user?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})
async function handleLogout() {
  await authStore.logout()
  router.push('/admin/login')
}

// ── Data & Computed ───────────────────────────────────────────────────────────
const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })

const activeLeases = computed(() => {
  const all = pmsStore.leases || []
  if (pmsStore.selectedPropertyId === 'all' || !pmsStore.selectedPropertyId) return all
  return all.filter(l => l.propertyId === pmsStore.selectedPropertyId)
})

const activeTickets = computed(() => {
  const all = pmsStore.tickets || []
  if (pmsStore.selectedPropertyId === 'all' || !pmsStore.selectedPropertyId) return all
  return all.filter(t => t.propertyId === pmsStore.selectedPropertyId)
})

const activePayments = computed(() => {
  const all = pmsStore.payments || []
  if (pmsStore.selectedPropertyId === 'all' || !pmsStore.selectedPropertyId) return all
  return all.filter(p => {
    if (p.propertyId === pmsStore.selectedPropertyId) return true
    const lease = pmsStore.leases.find(l => l.id === p.leaseId)
    return lease && lease.propertyId === pmsStore.selectedPropertyId
  })
})

const dashStats = computed(() => {
  const successPayments = activePayments.value.filter(p => p.status === 'success')
  const monthlyIncome   = successPayments.reduce((s, p) => s + Number(p.amount || 0), 0)
  const overdueLeases   = activeLeases.value.filter(l => l.status === 'expired' || l.status === 'overdue')
  return {
    monthlyIncome,
    monthlyExpenses: 0,
    expenseCount:    0,
    netIncome:       monthlyIncome,
    overdueAmount:   overdueLeases.reduce((s, l) => s + Number(l.rentAmount || 0), 0),
    overdueCount:    overdueLeases.length,
  }
})

const secondaryStats = computed(() => [
  {
    label: 'Properties', value: new Set(activeLeases.value.map(l => l.propertyId).filter(Boolean)).size || activeLeases.value.length,
    sub: `${activeLeases.value.filter(l => l.status === 'active').length} active`,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>'
  },
  {
    label: 'Units', value: activeLeases.value.length,
    sub: `${Math.round((activeLeases.value.filter(l => l.status === 'active').length / Math.max(activeLeases.value.length, 1)) * 100)}% occupied`,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>'
  },
  {
    label: 'Active Leases', value: activeLeases.value.filter(l => l.status === 'active').length,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
  },
  {
    label: 'Open Work Orders', value: activeTickets.value.filter(t => ['open','in_progress'].includes(t.status)).length,
    sub: activeTickets.value.filter(t => t.priority === 'high' && t.status === 'open').length > 0 ? `${activeTickets.value.filter(t => t.priority === 'high' && t.status === 'open').length} urgent` : 'No urgent issues',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>'
  },
])

const ticketCounts = computed(() => ({
  Urgent: activeTickets.value.filter(t => t.priority === 'high' && t.status === 'open').length,
  High:   activeTickets.value.filter(t => t.priority === 'high').length,
  Medium: activeTickets.value.filter(t => t.priority === 'medium').length,
  Low:    activeTickets.value.filter(t => t.priority === 'low').length,
}))

const expiringLeases   = computed(() => activeLeases.value.filter(l => daysLeft(l.endDate) <= 60 && daysLeft(l.endDate) > 0).slice(0, 3))
const recentTickets    = computed(() => activeTickets.value.filter(t => t.status === 'open').slice(0, 3))
const overduePayments  = computed(() => activePayments.value.filter(p => p.status === 'pending').slice(0, 5))
const pendingPayments  = computed(() => activePayments.value.filter(p => p.status === 'pending'))
const pendingPaymentsTotal = computed(() => pendingPayments.value.reduce((s, p) => s + Number(p.amount || 0), 0))
const filteredTickets  = computed(() => ticketFilter.value ? activeTickets.value.filter(t => t.status === ticketFilter.value) : activeTickets.value)
const filteredTenantLeases = computed(() => {
  if (!tenantSearch.value) return activeLeases.value
  const q = tenantSearch.value.toLowerCase()
  return activeLeases.value.filter(l => String(l.tenantId).includes(q) || (l.unitDescription || '').toLowerCase().includes(q))
})

// ── Lease Modal ───────────────────────────────────────────────────────────────
const showLeaseModal = ref(false)
const leaseModalMode = ref('create')
const editingLeaseId = ref(null)
const submitMsg      = ref({ text: '', ok: false })
const leaseForm      = ref({ tenantId: '', ownerId: '', propertyId: '', unitDescription: '', rentAmount: '', startDate: '', endDate: '', notes: '' })

function openLeaseModal(mode, lease = null) {
  leaseModalMode.value = mode
  if (mode === 'edit' && lease) {
    editingLeaseId.value = lease.id
    leaseForm.value = {
      tenantId:        lease.tenantId,
      ownerId:         lease.ownerId || '',
      propertyId:      lease.propertyId || '',
      unitDescription: lease.unitDescription || '',
      rentAmount:      lease.rentAmount,
      startDate:       (lease.startDate || '').split('T')[0],
      endDate:         (lease.endDate || '').split('T')[0],
      notes:           lease.notes || '',
    }
  } else {
    editingLeaseId.value = null
    leaseForm.value = { tenantId: '', ownerId: '', propertyId: '', unitDescription: '', rentAmount: '', startDate: '', endDate: '', notes: '' }
  }
  showLeaseModal.value = true
}

function closeLeaseModal() {
  showLeaseModal.value = false
  submitMsg.value      = { text: '', ok: false }
}

async function submitLease() {
  const payload = {
    tenantId:        Number(leaseForm.value.tenantId),
    ownerId:         leaseForm.value.ownerId ? Number(leaseForm.value.ownerId) : null,
    propertyId:      leaseForm.value.propertyId ? Number(leaseForm.value.propertyId) : null,
    unitDescription: leaseForm.value.unitDescription,
    rentAmount:      Number(leaseForm.value.rentAmount),
    startDate:       leaseForm.value.startDate,
    endDate:         leaseForm.value.endDate,
    notes:           leaseForm.value.notes,
  }
  const result = leaseModalMode.value === 'edit'
    ? await pmsStore.updateLease(editingLeaseId.value, payload)
    : await pmsStore.createLease(payload)

  if (result.success) {
    submitMsg.value = { text: 'Saved!', ok: true }
    setTimeout(closeLeaseModal, 800)
  } else {
    submitMsg.value = { text: result.error || 'Error saving.', ok: false }
  }
}

async function changeTicketStatus(id, status) {
  await pmsStore.updateTicketStatus(id, { status })
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt     = n => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n || 0)
const fmtDate = d => d ? new Date(d).toLocaleDateString('en-GB') : '—'
const daysLeft = d => d ? Math.ceil((new Date(d) - Date.now()) / 86400000) : 0

onMounted(async () => {
  await Promise.all([pmsStore.fetchLeases(), pmsStore.fetchTickets(), pmsStore.fetchPaymentHistory()])
})
</script>

<style scoped>
/* ══ Shell ══════════════════════════════════════════════════════════════════ */
.pms-shell {
  display: flex;
  min-height: 100vh;
  background: #f4f6fb;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: #1f2937;
}

/* ══ Sidebar ════════════════════════════════════════════════════════════════ */
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: #111827;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.25s ease;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}
.sidebar.collapsed { width: 60px; }

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid #1f2937;
  min-height: 64px;
}
.brand-icon {
  width: 36px; height: 36px;
  background: #2563eb;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.brand-icon svg { width: 18px; height: 18px; stroke: white; }
.brand-text { overflow: hidden; white-space: nowrap; }
.brand-name { display: block; color: #fff; font-weight: 700; font-size: 0.85rem; }
.brand-sub  { display: block; color: #6b7280; font-size: 0.68rem; }

.sidebar-nav {
  flex: 1;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-size: 0.82rem;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}
.nav-item:hover { background: #1f2937; color: #d1d5db; }
.nav-item.active { background: #2563eb; color: #fff; }
.nav-icon { width: 20px; height: 20px; flex-shrink: 0; display: flex; align-items: center; }
.nav-icon :deep(svg) { width: 18px; height: 18px; }

.sidebar-footer {
  border-top: 1px solid #1f2937;
  padding: 0.75rem;
}
.quick-actions-title { color: #6b7280; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
.quick-action {
  display: block; width: 100%;
  background: none; border: 1px solid #374151;
  color: #9ca3af; border-radius: 6px;
  padding: 5px 10px; font-size: 0.78rem;
  cursor: pointer; margin-bottom: 4px;
  text-align: left;
  transition: background 0.15s, color 0.15s;
}
.quick-action:hover { background: #1f2937; color: #d1d5db; }

/* ══ Main Area ══════════════════════════════════════════════════════════════ */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* ── Topbar ─────────────────────────────────────────────────────────────── */
.topbar {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 50;
}
.sidebar-toggle {
  background: none; border: none; cursor: pointer; color: #6b7280; padding: 4px;
  border-radius: 6px; display: flex; align-items: center;
}
.sidebar-toggle:hover { background: #f3f4f6; color: #111827; }
.topbar-org { color: #6b7280; font-size: 0.82rem; flex: 1; }
.topbar-right { display: flex; align-items: center; gap: 0.75rem; }
.topbar-user { display: flex; align-items: center; gap: 0.5rem; }
.user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: #2563eb; color: #fff;
  font-size: 0.72rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.user-name  { font-size: 0.82rem; font-weight: 600; color: #111827; }
.user-role  { font-size: 0.68rem; color: #6b7280; text-transform: capitalize; }
.logout-btn {
  background: none; border: none; cursor: pointer; color: #9ca3af;
  padding: 6px; border-radius: 6px;
  display: flex; align-items: center;
  transition: color 0.15s, background 0.15s;
}
.logout-btn:hover { background: #fee2e2; color: #ef4444; }

/* ── Content ─────────────────────────────────────────────────────────────── */
.content-area {
  padding: 2rem 1.75rem;
  flex: 1;
}

.page-header { margin-bottom: 1.5rem; }
.page-header h1 { font-size: 1.5rem; font-weight: 800; color: #111827; margin: 0 0 4px; }
.page-header p  { color: #6b7280; font-size: 0.85rem; margin: 0; }
.page-actions   { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.75rem; }

/* ══ KPI Cards ══════════════════════════════════════════════════════════════ */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.kpi-primary {
  border-radius: 12px;
  padding: 1.25rem;
  color: #fff;
}
.kpi-primary.blue   { background: #2563eb; }
.kpi-primary.grey   { background: #fff; color: #111827; border: 1px solid #e5e7eb; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.kpi-primary.green  { background: #059669; }
.kpi-primary.orange { background: #d97706; }
.kpi-primary.red    { background: #dc2626; }

.kpi-inner { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.kpi-micro { font-size: 0.72rem; font-weight: 600; opacity: 0.85; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.04em; }
.kpi-big   { font-size: 1.7rem; font-weight: 800; line-height: 1.1; }
.kpi-sub   { font-size: 0.72rem; opacity: 0.75; margin-top: 2px; }
.kpi-icon-circle {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.kpi-icon-circle svg { width: 20px; height: 20px; }
.kpi-primary.grey .kpi-icon-circle { background: #f3f4f6; }
.kpi-primary.grey .kpi-icon-circle svg { stroke: #6b7280; }

/* ══ Secondary Stats ════════════════════════════════════════════════════════ */
.stat-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.stat-icon { margin-bottom: 0.5rem; }
.stat-icon :deep(svg) { width: 20px; height: 20px; stroke: #9ca3af; }
.stat-value { font-size: 1.5rem; font-weight: 800; color: #111827; }
.stat-label { font-size: 0.75rem; color: #6b7280; font-weight: 500; }
.stat-sub   { font-size: 0.7rem; color: #9ca3af; margin-top: 2px; }

/* ══ Panels ═════════════════════════════════════════════════════════════════ */
.panel-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
.panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.panel-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem;
  font-weight: 600; font-size: 0.85rem; color: #111827;
}
.panel-link { background: none; border: none; color: #2563eb; font-size: 0.78rem; cursor: pointer; }
.panel-link:hover { text-decoration: underline; }
.empty-panel { text-align: center; color: #9ca3af; padding: 1.5rem 0; font-size: 0.82rem; }
.mt-1 { margin-top: 1rem; }

/* Lease rows */
.lease-row {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 0.6rem 0; border-bottom: 1px solid #f3f4f6;
}
.lease-row:last-child { border-bottom: none; }
.lease-prop   { font-weight: 600; font-size: 0.82rem; }
.lease-tenant { color: #6b7280; font-size: 0.75rem; }
.lease-days   { font-size: 0.75rem; text-align: right; color: #374151; }
.lease-days.urgent { color: #dc2626; font-weight: 700; }
.lease-days small { color: #9ca3af; }

/* Maintenance panel */
.maint-counters { display: flex; gap: 1.5rem; margin-bottom: 1rem; }
.mc { text-align: center; }
.mc-value { font-size: 1.4rem; font-weight: 800; color: #111827; display: block; }
.mc-label { font-size: 0.7rem; color: #6b7280; }
.ticket-preview {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6;
}
.ticket-preview:last-child { border-bottom: none; }
.tp-title { font-size: 0.82rem; font-weight: 600; }
.tp-unit  { font-size: 0.72rem; color: #9ca3af; }

/* Overdue rows */
.overdue-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.75rem 0; border-bottom: 1px solid #f3f4f6;
}
.overdue-row:last-child { border-bottom: none; }
.od-tenant { font-weight: 600; font-size: 0.85rem; }
.od-detail { font-size: 0.75rem; color: #9ca3af; }
.od-amount { font-weight: 700; color: #dc2626; font-size: 0.95rem; }

/* ══ Badges ═════════════════════════════════════════════════════════════════ */
.badge {
  display: inline-block; padding: 2px 10px;
  border-radius: 999px; font-size: 0.68rem; font-weight: 700; text-transform: capitalize;
}
.badge-active, .badge-ticket-resolved { background: #d1fae5; color: #065f46; }
.badge-pending, .badge-ticket-open   { background: #fef3c7; color: #92400e; }
.badge-expired, .badge-ticket-closed { background: #fee2e2; color: #991b1b; }
.badge-ticket-in_progress            { background: #dbeafe; color: #1d4ed8; }
.badge-count { display: inline-block; background: #dc2626; color: #fff; border-radius: 999px; padding: 0 6px; font-size: 0.65rem; margin-left: 4px; }
.priority-tag { padding: 2px 8px; border-radius: 4px; font-size: 0.68rem; font-weight: 700; }
.priority-high   { background: #fee2e2; color: #991b1b; }
.priority-medium { background: #fef3c7; color: #92400e; }
.priority-low    { background: #d1fae5; color: #065f46; }

/* ══ Tables ═════════════════════════════════════════════════════════════════ */
.table-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { background: #f9fafb; color: #6b7280; font-weight: 600; text-align: left; padding: 0.65rem 1rem; border-bottom: 1px solid #e5e7eb; font-size: 0.78rem; white-space: nowrap; }
.data-table td { padding: 0.65rem 1rem; border-bottom: 1px solid #f3f4f6; color: #374151; font-size: 0.82rem; }
.data-table tr:last-child td { border-bottom: none; }
.empty-cell { text-align: center; color: #9ca3af; padding: 2rem; }
.ref-code   { font-family: monospace; font-size: 0.75rem; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }

/* Tenant cell */
.tenant-cell { display: flex; align-items: center; gap: 0.75rem; }
.tenant-avatar { width: 32px; height: 32px; border-radius: 50%; background: #dbeafe; color: #1d4ed8; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.tenant-name   { font-weight: 600; font-size: 0.82rem; }
.tenant-type   { font-size: 0.7rem; color: #2563eb; }
.text-ok  { color: #059669; font-weight: 600; }
.text-due { color: #dc2626; font-weight: 600; }

/* ══ Finance ════════════════════════════════════════════════════════════════ */
.finance-tabs { display: flex; gap: 0.25rem; margin: 1.25rem 0 1rem; border-bottom: 1px solid #e5e7eb; }
.ftab { background: none; border: none; border-bottom: 2px solid transparent; padding: 0.5rem 1rem; font-size: 0.82rem; font-weight: 500; color: #6b7280; cursor: pointer; margin-bottom: -1px; }
.ftab.active { color: #2563eb; border-bottom-color: #2563eb; }
.finance-group { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; margin-bottom: 1rem; overflow: hidden; }
.fg-head { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
.fg-name { font-weight: 700; font-size: 0.9rem; }
.fg-unit { font-size: 0.75rem; color: #9ca3af; }
.fg-amount { font-weight: 700; font-size: 1rem; }
.fg-row { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; border-bottom: 1px solid #f3f4f6; font-size: 0.82rem; }
.fg-date { font-size: 0.72rem; color: #9ca3af; }
.fg-actions { display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem; padding: 0.75rem 1.25rem; }

/* ══ Maintenance ════════════════════════════════════════════════════════════ */
.maint-kpi-row { display: flex; gap: 1rem; margin-bottom: 1rem; }
.maint-kpi { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 1rem 1.5rem; text-align: center; min-width: 80px; }
.maint-kpi-val { font-size: 1.8rem; font-weight: 800; color: #111827; }
.maint-kpi-lbl { font-size: 0.72rem; color: #6b7280; }
.maint-Urgent  .maint-kpi-val { color: #dc2626; }
.maint-High    .maint-kpi-val { color: #d97706; }

.filter-bar { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.filter-btn { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.35rem 0.85rem; font-size: 0.78rem; cursor: pointer; color: #6b7280; }
.filter-btn.active { background: #2563eb; border-color: #2563eb; color: #fff; }

.ticket-list { display: flex; flex-direction: column; gap: 0.75rem; }
.ticket-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 1rem 1.25rem; display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.tc-head { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 4px; }
.tc-title { font-weight: 600; font-size: 0.88rem; }
.tc-desc  { color: #6b7280; font-size: 0.78rem; margin-bottom: 6px; }
.tc-meta  { display: flex; gap: 1rem; font-size: 0.72rem; color: #9ca3af; }
.tc-resolution { margin-top: 6px; font-size: 0.75rem; color: #059669; }
.ticket-card-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; flex-shrink: 0; }

/* ══ Reports ════════════════════════════════════════════════════════════════ */
.report-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
.report-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.rc-icon { font-size: 2rem; margin-bottom: 0.75rem; }
.report-card h3 { font-weight: 700; margin: 0 0 4px; }
.report-card p  { color: #6b7280; font-size: 0.82rem; margin: 0 0 0.75rem; }
.rc-stat { font-weight: 700; color: #2563eb; font-size: 0.9rem; }

/* ══ Settings ═══════════════════════════════════════════════════════════════ */
.settings-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; }
.settings-card h3 { font-weight: 700; margin: 0 0 0.5rem; }
.settings-note    { color: #6b7280; font-size: 0.85rem; }

/* ══ Misc ═══════════════════════════════════════════════════════════════════ */
.search-input { border: 1px solid #d1d5db; border-radius: 8px; padding: 0.4rem 0.75rem; font-size: 0.82rem; }
.inline-select { border: 1px solid #d1d5db; border-radius: 6px; padding: 3px 6px; font-size: 0.75rem; }
.icon-btn { background: none; border: none; cursor: pointer; font-size: 0.9rem; padding: 2px 6px; border-radius: 4px; }
.icon-btn:hover { background: #f3f4f6; }
.empty-state { text-align: center; color: #9ca3af; padding: 2.5rem; background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; }

/* Buttons */
.btn-primary { background: #111827; color: #fff; border: none; padding: 0.45rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.82rem; font-weight: 600; transition: background 0.15s; }
.btn-primary:hover { background: #2563eb; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-outline { background: #fff; color: #374151; border: 1px solid #d1d5db; padding: 0.45rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.82rem; font-weight: 600; }
.btn-outline:hover { background: #f9fafb; }

/* Modal */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-box      { background: #fff; border-radius: 16px; padding: 1.75rem; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
.modal-title    { font-size: 1rem; font-weight: 700; margin-bottom: 1.25rem; color: #111827; }
.modal-form     { display: flex; flex-direction: column; gap: 0.75rem; }
.form-row       { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.modal-form label { display: flex; flex-direction: column; gap: 4px; font-size: 0.78rem; font-weight: 600; color: #374151; }
.modal-form input, .modal-form textarea { border: 1px solid #d1d5db; border-radius: 8px; padding: 0.4rem 0.65rem; font-size: 0.82rem; }
.modal-form input:focus, .modal-form textarea:focus { outline: none; border-color: #2563eb; }
.modal-actions  { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.25rem; }
.form-msg { padding: 0.45rem 0.75rem; border-radius: 6px; font-size: 0.78rem; background: #fee2e2; color: #991b1b; }
.form-msg.ok { background: #d1fae5; color: #065f46; }

@media (max-width: 600px) {
  .sidebar { display: none; }
  .content-area { padding: 1rem; }
  .kpi-row  { grid-template-columns: 1fr; }
  .stat-row { grid-template-columns: 1fr 1fr; }
}

/* Floating Action Button (FAB) */
.global-fab-wrapper {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 999;
}
.fab-main-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #D4755B;
  color: white;
  border: none;
  box-shadow: 0 4px 14px rgba(212, 117, 91, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.fab-main-btn:hover {
  background-color: #B86851;
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(212, 117, 91, 0.6);
}
</style>
