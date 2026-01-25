<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/admin" class="text-xl font-bold text-gray-800">
                Admin Panel
              </router-link>
            </div>
            
            <!-- Navigation Links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/admin"
                :class="[
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                  $route.name === 'AdminDashboard' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                Dashboard
              </router-link>
              <router-link
                to="/admin/properties"
                :class="[
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                  $route.name === 'AdminProperties' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                Properties
              </router-link>
              <router-link
                to="/admin/bookings"
                :class="[
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                  $route.name === 'AdminBookings' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                Bookings
              </router-link>
            </div>
          </div>
          
          <div class="flex items-center">
            <!-- View Public Site -->
            <router-link
              to="/"
              class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Site
            </router-link>
            
            <!-- User Menu -->
            <div class="ml-3 relative">
              <button
                @click="toggleUserMenu"
                class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span class="text-white font-semibold">A</span>
                </div>
              </button>
              
              <!-- Dropdown Menu -->
              <div
                v-if="userMenuOpen"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              >
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm text-gray-900 font-medium">Admin User</p>
                  <p class="text-xs text-gray-500">admin@example.com</p>
                </div>
                <router-link
                  to="/admin"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="userMenuOpen = false"
                >
                  Dashboard
                </router-link>
                <router-link
                  to="/admin/properties"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="userMenuOpen = false"
                >
                  Properties
                </router-link>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Navigation -->
    <div class="sm:hidden">
      <div v-if="mobileMenuOpen" class="pt-2 pb-3 space-y-1 bg-white border-b border-gray-200">
        <router-link
          to="/admin"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="$route.name === 'AdminDashboard' 
            ? 'bg-blue-50 border-blue-500 text-blue-700' 
            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
          @click="mobileMenuOpen = false"
        >
          Dashboard
        </router-link>
        <router-link
          to="/admin/properties"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="$route.name === 'AdminProperties' 
            ? 'bg-blue-50 border-blue-500 text-blue-700' 
            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
          @click="mobileMenuOpen = false"
        >
          Properties
        </router-link>
        <router-link
          to="/admin/bookings"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="$route.name === 'AdminBookings' 
            ? 'bg-blue-50 border-blue-500 text-blue-700' 
            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
          @click="mobileMenuOpen = false"
        >
          Bookings
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <main class="py-6">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userMenuOpen = ref(false)
const mobileMenuOpen = ref(false)

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const logout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminTokenExpiry')
  localStorage.removeItem('isAuthenticated')
  userMenuOpen.value = false
  router.push('/admin/login')
}
</script>

<style scoped>
.router-link-active {
  font-weight: 600;
}
</style>