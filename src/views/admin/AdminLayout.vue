<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/admin" class="flex items-center space-x-3">
              <span class="inline-block w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-semibold">A</span>
              <span class="text-lg font-semibold text-gray-900">Admin Dashboard</span>
            </router-link>
          </div>

          <div class="hidden md:flex items-center space-x-2">
            <router-link
              to="/admin/properties"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="isActive('properties') ? activeClass : inactiveClass"
            >
              Properties
            </router-link>

            <router-link
              to="/admin/projects"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="isActive('projects') ? activeClass : inactiveClass"
            >
              Projects
            </router-link>

            <router-link
              to="/admin/bookings"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="isActive('bookings') ? activeClass : inactiveClass"
            >
              Bookings
            </router-link>

            <router-link
              to="/admin/appointments"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="isActive('appointments') ? activeClass : inactiveClass"
            >
              Appointments
            </router-link>

            <button
              @click="logout"
              class="ml-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Logout
            </button>
          </div>

          <div class="md:hidden">
            <button @click="mobileOpen = !mobileOpen" class="p-2 rounded-md text-gray-600 hover:bg-gray-100">
              <span v-if="!mobileOpen" aria-hidden="true">☰</span>
              <span v-else aria-hidden="true">✕</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="mobileOpen" class="md:hidden border-t border-gray-100 bg-white">
        <div class="px-4 py-3 space-y-1">
          <router-link
            to="/admin/properties"
            class="block px-3 py-2 rounded-md text-base font-medium"
            :class="isActive('properties') ? activeMobileClass : inactiveMobileClass"
          >
            Properties
          </router-link>

          <router-link
            to="/admin/projects"
            class="block px-3 py-2 rounded-md text-base font-medium"
            :class="isActive('projects') ? activeMobileClass : inactiveMobileClass"
          >
            Projects
          </router-link>

          <router-link
            to="/admin/bookings"
            class="block px-3 py-2 rounded-md text-base font-medium"
            :class="isActive('bookings') ? activeMobileClass : inactiveMobileClass"
          >
            Bookings
          </router-link>

          <router-link
            to="/admin/appointments"
            class="block px-3 py-2 rounded-md text-base font-medium"
            :class="isActive('appointments') ? activeMobileClass : inactiveMobileClass"
          >
            Appointments
          </router-link>

          <button @click="logout" class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const mobileOpen = ref(false)

const activeClass = 'bg-blue-600 text-white'
const inactiveClass = 'text-gray-700 hover:bg-gray-100'
const activeMobileClass = 'bg-blue-50 text-blue-700 block'
const inactiveMobileClass = 'text-gray-700 hover:bg-gray-50 block'

const routeName = computed(() => (route.name ? String(route.name) : route.path))

const isActive = (name) => {
  if (!routeName.value) return false
  return routeName.value === name || routeName.value === `/admin/${name}` || route.path.includes(`/admin/${name}`)
}

const logout = async () => {
  await authStore.logout()
  mobileOpen.value = false
  router.push('/admin/login')
}
</script>
