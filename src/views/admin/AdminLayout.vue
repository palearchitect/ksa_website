<template>
  <div class="admin-shell">

    <!-- ── Sidebar ──────────────────────────────────────────────────────── -->
    <aside class="admin-sidebar" :class="{ 'is-collapsed': collapsed }">

      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="brand-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1
                 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011
                 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <transition name="fade-label">
          <div class="brand-text" v-if="!collapsed">
            <span class="brand-name">KSA Valuers</span>
            <span class="brand-sub">Admin Panel</span>
          </div>
        </transition>
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <div class="nav-group-label" v-if="!collapsed">Content</div>
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ active: isActive(item.match) }"
          :title="collapsed ? item.label : ''"
          @click="mobileOpen = false"
        >
          <span class="nav-icon" v-html="item.icon" />
          <span class="nav-label" v-if="!collapsed">{{ item.label }}</span>
          <span
            v-if="!collapsed && item.badge"
            class="nav-badge"
          >{{ item.badge }}</span>
        </router-link>

        <div class="nav-divider" />
        <div class="nav-group-label" v-if="!collapsed">Property Management</div>
        <router-link
          to="/dashboard/management"
          class="nav-link"
          :class="{ active: isActive('ManagementDashboard') }"
          :title="collapsed ? 'PMS Gateway' : ''"
          @click="mobileOpen = false"
        >
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </span>
          <span class="nav-label" v-if="!collapsed">PMS Gateway</span>
        </router-link>

        <div class="nav-divider" />
        <div class="nav-group-label" v-if="!collapsed">Account</div>

        <button class="nav-link nav-link-btn" @click="handleLogout">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0
                   01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </span>
          <span class="nav-label" v-if="!collapsed">Logout</span>
        </button>
      </nav>

      <!-- User strip at bottom -->
      <div class="sidebar-user" v-if="!collapsed">
        <div class="su-avatar">{{ initials }}</div>
        <div class="su-info">
          <span class="su-name">{{ user?.name || 'Admin' }}</span>
          <span class="su-role">{{ user?.role || 'administrator' }}</span>
        </div>
      </div>
      <div class="sidebar-user-collapsed" v-else>
        <div class="su-avatar">{{ initials }}</div>
      </div>
    </aside>

    <!-- ── Mobile overlay ──────────────────────────────────────────────── -->
    <div
      v-if="mobileOpen"
      class="mobile-overlay"
      @click="mobileOpen = false"
    />

    <!-- ── Main area ───────────────────────────────────────────────────── -->
    <div class="admin-main">

      <!-- Topbar -->
      <header class="admin-topbar">
        <!-- Collapse toggle (desktop) + Hamburger (mobile) -->
        <button class="topbar-btn" @click="toggleSidebar" aria-label="Toggle sidebar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <!-- Breadcrumb -->
        <div class="topbar-breadcrumb">
          <router-link to="/admin" class="breadcrumb-home">Admin</router-link>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">{{ pageTitle }}</span>
        </div>

        <div class="topbar-right">
          <!-- Property Switcher for Admin/Managers -->
          <div class="mr-2">
            <PropertySwitcher />
          </div>
          <!-- Visit site -->
          <a href="/" target="_blank" class="topbar-site-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0
                   002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Visit Site</span>
          </a>
          <!-- User pill -->
          <div class="topbar-user-pill">
            <div class="pill-avatar">{{ initials }}</div>
            <span class="pill-name">{{ user?.name || 'Admin' }}</span>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import PropertySwitcher from '@/components/properties/PropertySwitcher.vue'

const route     = useRoute()
const router    = useRouter()
const authStore = useAuthStore()

const collapsed   = ref(false)
const mobileOpen  = ref(false)

const user     = computed(() => authStore.user)
const initials = computed(() => {
  const name = user.value?.name || 'A'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

function toggleSidebar() {
  // On mobile (<768px) show overlay; on desktop collapse
  if (window.innerWidth < 768) {
    mobileOpen.value = !mobileOpen.value
  } else {
    collapsed.value = !collapsed.value
  }
}

const navItems = [
  {
    to: '/admin', label: 'Dashboard', match: 'AdminDashboard',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'
  },
  {
    to: '/admin/properties', label: 'Properties', match: 'AdminProperty',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>'
  },
  {
    to: '/admin/projects', label: 'Projects', match: 'AdminProject',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>'
  },
  {
    to: '/admin/bookings', label: 'Bookings', match: 'AdminBooking',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
  },
  {
    to: '/admin/appointments', label: 'Appointments', match: 'AdminAppointment',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  },
  {
    to: '/admin/slides', label: 'Hero Slides', match: 'AdminSlide',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
  },
  {
    to: '/admin/team', label: 'Team', match: 'AdminTeam',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
  },
]

const isActive = (matchPrefix) => {
  const name = String(route.name || '')
  return name === matchPrefix || name.startsWith(matchPrefix)
}

const pageTitle = computed(() => {
  const name = String(route.name || '')
  if (name.includes('Property')) return 'Properties'
  if (name.includes('Project'))  return 'Projects'
  if (name.includes('Booking'))  return 'Bookings'
  if (name.includes('Appointment')) return 'Appointments'
  if (name.includes('Slide'))    return 'Hero Slides'
  if (name.includes('Team'))     return 'Team'
  return 'Dashboard'
})

async function handleLogout() {
  await authStore.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
/* ── Reset & shell ─────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }

.admin-shell {
  display: flex;
  min-height: 100vh;
  background: #f4f6fb;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
  color: #111827;
}

/* ── Sidebar ───────────────────────────────────────────────────────────────── */
.admin-sidebar {
  width: 230px;
  min-height: 100vh;
  background: #111827;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.22s ease;
  z-index: 200;
  scrollbar-width: none;
}
.admin-sidebar::-webkit-scrollbar { display: none; }
.admin-sidebar.is-collapsed { width: 62px; }

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.75rem;
  height: 60px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
}
.brand-logo {
  width: 36px; height: 36px; flex-shrink: 0;
  background: #1d4ed8;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
}
.brand-logo svg { width: 18px; height: 18px; stroke: #fff; }
.brand-text { overflow: hidden; white-space: nowrap; }
.brand-name { display: block; color: #f9fafb; font-weight: 700; font-size: 0.88rem; line-height: 1.2; }
.brand-sub  { display: block; color: #6b7280; font-size: 0.68rem; }

/* Nav */
.sidebar-nav {
  flex: 1;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.nav-group-label {
  color: #4b5563;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.5rem 0.75rem 0.25rem;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
  border: none;
  background: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}
.nav-link:hover    { background: #1f2937; color: #d1d5db; }
.nav-link.active   { background: #1d4ed8; color: #fff; }
.nav-link.nav-link-btn:hover { background: rgba(239,68,68,0.15); color: #f87171; }
.nav-icon { width: 18px; height: 18px; flex-shrink: 0; display: flex; align-items: center; }
.nav-icon :deep(svg) { width: 18px; height: 18px; }
.nav-badge {
  margin-left: auto;
  background: #dc2626; color: #fff;
  border-radius: 999px; padding: 1px 7px;
  font-size: 0.65rem; font-weight: 700;
}
.nav-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 0.5rem 0; }

/* User strip */
.sidebar-user {
  padding: 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
}
.sidebar-user-collapsed {
  padding: 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.07);
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}
.su-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: #1d4ed8;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.su-info { overflow: hidden; }
.su-name { display: block; color: #f9fafb; font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.su-role { display: block; color: #6b7280; font-size: 0.68rem; text-transform: capitalize; }

/* ── Mobile overlay ────────────────────────────────────────────────────────── */
.mobile-overlay {
  display: none;
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 199;
}

/* ── Main area ─────────────────────────────────────────────────────────────── */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

/* Topbar */
.admin-topbar {
  height: 58px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  gap: 0.75rem;
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
}
.topbar-btn {
  background: none; border: none;
  cursor: pointer; color: #6b7280;
  padding: 6px; border-radius: 8px;
  display: flex; align-items: center;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}
.topbar-btn:hover { background: #f3f4f6; color: #111827; }

.topbar-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  font-size: 0.82rem;
  overflow: hidden;
}
.breadcrumb-home { color: #6b7280; text-decoration: none; }
.breadcrumb-home:hover { color: #111827; }
.breadcrumb-sep { color: #d1d5db; }
.breadcrumb-current { color: #111827; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.topbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}
.topbar-site-link {
  display: flex; align-items: center; gap: 0.35rem;
  color: #6b7280; text-decoration: none;
  font-size: 0.78rem; font-weight: 500;
  padding: 0.35rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;
}
.topbar-site-link:hover { background: #f9fafb; color: #111827; }
.topbar-user-pill {
  display: flex; align-items: center; gap: 0.5rem;
  background: #f3f4f6; border-radius: 8px;
  padding: 0.3rem 0.75rem 0.3rem 0.35rem;
}
.pill-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: #1d4ed8; color: #fff;
  font-size: 0.65rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.pill-name { font-size: 0.8rem; font-weight: 600; color: #374151; }

/* Content */
.admin-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  min-height: 0;
}

/* Fade transition */
.fade-label-enter-active,
.fade-label-leave-active { transition: opacity 0.15s; }
.fade-label-enter-from,
.fade-label-leave-to { opacity: 0; }

/* ── Responsive ────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .admin-sidebar {
    position: fixed;
    left: -230px;
    height: 100vh;
    transition: left 0.25s ease, width 0.22s ease;
  }
  /* When mobile menu is open, the sidebar slides in via a class on the parent;
     we can't target parent from scoped child, so we use a global trick:
     the mobile-overlay click hides it and the topbar button toggles mobileOpen */
  .admin-shell:has(.mobile-overlay) .admin-sidebar { left: 0; }

  .mobile-overlay { display: block; }
  .admin-main { width: 100%; }
  .admin-content { padding: 1rem; }
  .topbar-site-link span { display: none; }
}

@media (max-width: 480px) {
  .pill-name { display: none; }
  .topbar-breadcrumb { font-size: 0.75rem; }
}
</style>
