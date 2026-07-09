<template>
  <div class="admin-dashboard min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p class="text-gray-600">Welcome back, {{ adminName }}!</p>
      </div>

      <!-- Stats Overview --> 
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Properties -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-500 text-sm font-medium">Total Properties</h3>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ propertyStore.totalProperties }}</p>
        </div>

        <!-- Projects -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-500 text-sm font-medium">Total Projects</h3>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ projectStore.totalProjects }}</p>
        </div>

        <!-- Bookings -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-500 text-sm font-medium">Pending Bookings</h3>
            <div class="p-3 bg-orange-100 rounded-full">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ bookingStore.stats.pending }}</p>
        </div>

        <!-- Hero Carousel Slides -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-500 text-sm font-medium">Hero Slides</h3>
            <div class="p-3 bg-purple-100 rounded-full">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ heroSlideStore.slides.length }}</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Properties -->
          <router-link
            to="/admin/properties"
            class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-full mr-4">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Manage Properties</h3>
                <p class="text-sm text-gray-500">View and edit properties</p>
              </div>
            </div>
          </router-link>

          <!-- Projects -->
          <router-link
            to="/admin/projects"
            class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-full mr-4">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Manage Projects</h3>
                <p class="text-sm text-gray-500">View and edit ongoing projects</p>
              </div>
            </div>
          </router-link>

          <!-- Hero slides -->
          <router-link
            to="/admin/slides"
            class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div class="flex items-center">
              <div class="p-3 bg-purple-100 rounded-full mr-4">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Manage Carousel</h3>
                <p class="text-sm text-gray-500">View/edit homepage hero banner slides</p>
              </div>
            </div>
          </router-link>

          <!-- Add New Property -->
          <router-link
            to="/admin/properties/new"
            class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-full mr-4">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Add Property</h3>
                <p class="text-sm text-gray-500">Create property listing</p>
              </div>
            </div>
          </router-link>

          <!-- Add New Project -->
          <router-link
            to="/admin/projects/new"
            class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-full mr-4">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Add Project</h3>
                <p class="text-sm text-gray-500">Create new ongoing project</p>
              </div>
            </div>
          </router-link>

          <!-- Add New Hero Slide -->
          <router-link
            to="/admin/slides/new"
            class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div class="flex items-center">
              <div class="p-3 bg-purple-100 rounded-full mr-4">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Add Hero Slide</h3>
                <p class="text-sm text-gray-500">Create new banner slide</p>
              </div>
            </div>
          </router-link>

          <!-- Tour Bookings -->
          <router-link
            to="/admin/bookings"
            class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div class="flex items-center">
              <div class="p-3 bg-orange-100 rounded-full mr-4">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Tour Bookings</h3>
                <p class="text-sm text-gray-500">Manage property tours</p>
              </div>
            </div>
          </router-link>

          <!-- Logout -->
          <button
            @click="logout"
            class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer text-left w-full"
          >
            <div class="flex items-center">
              <div class="p-3 bg-gray-100 rounded-full mr-4">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Logout</h3>
                <p class="text-sm text-gray-500">Sign out of admin panel</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/propertyStore'
import { useProjectStore } from '@/stores/projectStore'
import { useBookingStore } from '@/stores/bookingStore'
import { useHeroSlideStore } from '@/stores/heroSlideStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const propertyStore = usePropertyStore()
const projectStore = useProjectStore()
const bookingStore = useBookingStore()
const heroSlideStore = useHeroSlideStore()
const authStore = useAuthStore()

onMounted(async () => {
  await Promise.all([
    propertyStore.fetchProperties(),
    projectStore.fetchProjects(),
    bookingStore.loadBookings(),
    heroSlideStore.fetchSlides()
  ])
})

const adminName = computed(() => authStore.user?.name || 'Admin')

const logout = () => {
  if (confirm('Are you sure you want to logout?')) {
    authStore.logout()
    router.push('/admin/login')
  }
}
</script>
