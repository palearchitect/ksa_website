<template>
  <div class="pms-layout-wrapper">
    <!-- Impersonation Warning Bar -->
    <div v-if="user?.impersonatorId" class="impersonation-warning-bar">
      <div class="iw-content">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>
          <strong>Impersonation Mode Active:</strong> You are currently viewing the portal as <strong>{{ user.name }}</strong> ({{ user.role }}). 
          Actions you take will be logged under your admin credentials ({{ user.impersonatorEmail }}).
        </span>
      </div>
      <button class="iw-btn" @click="handleStopImpersonation" :disabled="impersonationLoading">
        {{ impersonationLoading ? 'Restoring...' : 'Return to Admin Session' }}
      </button>
    </div>

    <div class="pms-shell">
    <!-- Top navbar -->
    <header class="pms-header">
      <div class="pms-header-inner">
        <div class="pms-brand">
          <span class="brand-dot"></span>
          <span class="brand-name">KSA Valuers</span>
          <span class="brand-sep">|</span>
          <span class="brand-portal">{{ portalLabel }}</span>
        </div>

        <nav class="pms-nav">
          <slot name="nav-links" />
        </nav>

        <!-- Property Switcher for Owners/Managers/Admins -->
        <div v-if="showSwitcher" class="pms-switcher-wrapper">
          <PropertySwitcher />
        </div>

        <div class="pms-user-block">
          <div class="pms-avatar">{{ initials }}</div>
          <div class="pms-user-info">
            <span class="pms-user-name">{{ user?.name }}</span>
            <span class="pms-role-badge" :class="`role-${user?.role}`">{{ user?.role }}</span>
          </div>
          <button class="pms-logout-btn" @click="handleLogout" title="Logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="pms-main">
      <slot />
    </main>
  </div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import PropertySwitcher from '@/components/properties/PropertySwitcher.vue'

const auth   = useAuthStore()
const router = useRouter()
const user   = computed(() => auth.user)
const impersonationLoading = ref(false)

const showSwitcher = computed(() => {
  return ['propertyowner', 'admin', 'manager', 'management'].includes(user.value?.role)
})

const portalLabels = {
  admin:         'Admin Portal',
  manager:       'Management Portal',
  management:    'Management Portal',
  propertyowner: 'Owner Portal',
  tenant:        'Tenant Portal',
}
const portalLabel = computed(() => portalLabels[user.value?.role] || 'Portal')

const initials = computed(() => {
  const name = user.value?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}

async function handleStopImpersonation() {
  impersonationLoading.value = true
  try {
    const res = await auth.stopImpersonation()
    if (res.success) {
      router.push('/dashboard/admin')
    }
  } catch (err) {
    console.error('Stop impersonation failed:', err)
  } finally {
    impersonationLoading.value = false
  }
}
</script>

<style scoped>
/* ── Impersonation Warning Bar ────────────────────────────────────────────── */
.impersonation-warning-bar {
  background: #ea580c;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.88rem;
  z-index: 9999;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.iw-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.iw-content svg {
  flex-shrink: 0;
}
.iw-btn {
  background: #ffffff;
  color: #ea580c;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.iw-btn:hover:not(:disabled) {
  background: #f3f4f6;
  transform: translateY(-1px);
}
.iw-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.pms-shell {
  min-height: 100vh;
  background: #f4f6fb;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* ── Header ───────────────────────────────────── */
.pms-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
  box-shadow: 0 2px 16px rgba(0,0,0,0.18);
  position: sticky;
  top: 0;
  z-index: 100;
}
.pms-header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.pms-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}
.brand-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #c8a96e;
  box-shadow: 0 0 8px #c8a96e;
}
.brand-name  { color: #fff; font-weight: 700; font-size: 1rem; }
.brand-sep   { color: #4b5563; }
.brand-portal { color: #c8a96e; font-size: 0.85rem; font-weight: 500; }

.pms-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
}

.pms-user-block {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}
.pms-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c8a96e, #e8c88d);
  color: #1e3a5f;
  font-weight: 700;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pms-user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.pms-user-name  { color: #fff; font-size: 0.85rem; font-weight: 600; }
.pms-role-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1px 6px;
  border-radius: 4px;
}
.role-admin         { background: #fef2f2; color: #dc2626; }
.role-manager,
.role-management    { background: #eff6ff; color: #2563eb; }
.role-propertyowner { background: #fefce8; color: #b45309; }
.role-tenant        { background: #f0fdf4; color: #16a34a; }

.pms-logout-btn {
  width: 36px; height: 36px;
  border: none;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.pms-logout-btn:hover { background: rgba(220,38,38,0.2); color: #ef4444; }
.pms-logout-btn svg   { width: 18px; height: 18px; }

/* ── Main ─────────────────────────────────────── */
.pms-main {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}
</style>
