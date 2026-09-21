<template>
  <div class="admin-layout-wrapper min-h-screen bg-transparent text-slate-800 font-sans selection:bg-orange-500 selection:text-white relative">
    
    <!-- Impersonation Warning Bar -->
    <div v-if="user?.impersonatorId" class="impersonation-warning-bar bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 text-white px-6 py-2.5 flex items-center justify-between shadow-md relative z-50 text-xs font-semibold">
      <div class="iw-content flex items-center gap-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>
          <strong>Impersonation Mode Active:</strong> Viewing portal as <strong>{{ user.name }}</strong> ({{ user.role }}).
        </span>
      </div>
      <button class="iw-btn bg-white text-orange-600 px-3.5 py-1 rounded-full font-bold text-xs hover:bg-slate-100 transition shadow-sm" @click="handleStopImpersonation" :disabled="impersonationLoading">
        {{ impersonationLoading ? 'Restoring...' : 'Return to Admin Session' }}
      </button>
    </div>

    <!-- ── Top Header Navigation Bar (KSA Valuers Brand Preset) ─────────── -->
    <header class="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        <!-- Left: Brand Logo & Title -->
        <div class="flex items-center gap-3">
          <router-link to="/dashboard/admin" class="flex items-center gap-2.5 group">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-orange-600 transition-all flex items-center justify-center text-white shadow-md shadow-orange-500/25">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div class="flex flex-col">
              <span class="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1 group-hover:text-orange-500 transition-colors">
                KSA Valuers
              </span>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-0.5">Estate Management</span>
            </div>
          </router-link>
        </div>

        <!-- Center: Floating Pill Navigation Tabs (KSA Orange & Navy) -->
        <nav class="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/70 shadow-inner">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
            :class="isActive(item.match) ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'"
          >
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- Right: Actions & User Menu -->
        <div class="flex items-center gap-2.5 sm:gap-3.5">
          <!-- KSA Orange Action Button -->
          <router-link
            to="/dashboard/admin/properties/new"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-all shadow-md shadow-orange-500/25 hover:scale-105"
            title="Add New Listing"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </router-link>

          <!-- Search Button -->
          <button
            @click="showSearchModal = true"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center transition shadow-sm"
            title="Search"
          >
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          <!-- Notifications Bell -->
          <div class="relative">
            <button
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center transition shadow-sm relative"
              title="Notifications"
            >
              <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">7</span>
            </button>
          </div>

          <!-- User Profile & Dropdown -->
          <div class="relative group">
            <div class="flex items-center gap-2.5 p-1 pl-1.5 pr-2.5 bg-white border border-slate-200/80 rounded-full shadow-sm hover:border-orange-400 transition cursor-pointer">
              <img
                :src="userAvatar"
                class="w-8 h-8 rounded-full object-cover border-2 border-orange-500/30"
                alt="User Avatar"
              />
              <div class="hidden lg:flex flex-col text-left">
                <span class="text-xs font-bold text-slate-900 leading-tight">{{ user?.name || 'Anthony' }}</span>
                <span class="text-[10px] font-semibold text-slate-400 capitalize leading-none">{{ user?.role || 'Agent Sales' }}</span>
              </div>
              <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>

            <!-- Dropdown Menu -->
            <div class="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 hidden group-hover:block z-50 animation-fade-in">
              <router-link to="/dashboard/profile" class="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition">
                <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                My Profile Settings
              </router-link>
              <a href="/" target="_blank" class="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Visit Public Website
              </a>
              <div class="my-1 border-t border-slate-100"></div>
              <button @click="handleLogout" class="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition text-left">
                <svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Sign Out
              </button>
            </div>
          </div>

          <!-- Mobile Hamburger Toggle -->
          <button @click="mobileNavOpen = !mobileNavOpen" class="md:hidden w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div v-if="mobileNavOpen" class="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="block px-4 py-2.5 rounded-xl text-sm font-semibold transition"
          :class="isActive(item.match) ? 'bg-orange-500 text-white' : 'text-slate-700 hover:bg-slate-100'"
          @click="mobileNavOpen = false"
        >
          {{ item.label }}
        </router-link>
      </div>
    </header>

    <!-- ── Main Content Canvas ───────────────────────────────────────────── -->
    <main class="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <router-view />
    </main>

    <!-- Quick Search Modal Overlay -->
    <div v-if="showSearchModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
      <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="text-sm font-bold text-slate-900">Quick Portal Search</h3>
          <button @click="showSearchModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search properties, leads, projects, FAQs..."
            class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:border-orange-500 focus:bg-white transition"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <div class="text-xs text-slate-400">
          Press <kbd class="px-2 py-1 bg-slate-100 rounded text-[10px] font-mono">ESC</kbd> to close.
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { authAPI } from '@/services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const mobileNavOpen = ref(false)
const showSearchModal = ref(false)
const searchQuery = ref('')
const impersonationLoading = ref(false)

const user = computed(() => authStore.user)
const userAvatar = computed(() => {
  return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
})

onMounted(async () => {
  try {
    await authAPI.getCsrf()
  } catch (err) {
    console.error('CSRF token fetch exception:', err)
  }
})

const navItems = computed(() => {
  const role = user.value?.role || 'tenant'
  if (['admin', 'webadmin', 'manager'].includes(role)) {
    return [
      { to: '/dashboard/admin', label: 'Dashboard', match: 'AdminDashboard' },
      { to: '/dashboard/admin/properties', label: 'Property', match: 'AdminProperty' },
      { to: '/dashboard/admin/projects', label: 'Projects', match: 'AdminProject' },
      { to: '/dashboard/admin/team', label: 'Directory', match: 'AdminTeam' },
      { to: '/dashboard/admin/slides', label: 'Hero Slides', match: 'AdminSlide' }
    ]
  }
  return [
    { to: '/dashboard/admin', label: 'Dashboard', match: 'AdminDashboard' }
  ]
})

const isActive = (matchPrefix) => {
  const name = String(route.name || '')
  return name === matchPrefix || name.startsWith(matchPrefix)
}

async function handleLogout() {
  await authStore.logout()
  router.push('/admin/login')
}

async function handleStopImpersonation() {
  impersonationLoading.value = true
  try {
    const res = await authStore.stopImpersonation()
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
.animation-fade-in {
  animation: fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
