<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-20">
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl md:text-6xl font-bold mb-4">Browse All Properties</h1>
        <p class="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Find your perfect property from our exclusive collection across Nigeria.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Filters Section -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search Box -->
          <div class="md:col-span-2">
            <input
              v-model="propertyStore.searchQuery"
              type="text"
              placeholder="Search properties by name, location..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
          </div>

          <!-- Status Filter -->
          <div>
            <select v-model="propertyStore.filters.status" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
              <option value="all">All Status</option>
              <option v-for="status in propertyStore.PROPERTY_STATUS" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>

          <!-- Type Filter -->
          <div>
            <select v-model="propertyStore.filters.type" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
              <option value="all">All Types</option>
              <option v-for="type in propertyStore.PROPERTY_TYPES" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Results Info -->
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Available Properties</h2>
          <p class="text-gray-600">{{ propertyStore.filteredProperties.length }} properties found</p>
        </div>
      </div>

      <!-- Properties Grid -->
      <div v-if="propertyStore.filteredProperties.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="property in propertyStore.filteredProperties" 
          :key="property.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          @click="viewProperty(property.id)"
        >
          <!-- Property Image -->
          <div class="relative h-48">
            <img 
              :src="property.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'" 
              :alt="property.title"
              class="w-full h-full object-cover"
            >
            <div class="absolute top-3 left-3">
              <span :class="getStatusBadgeClass(property.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                {{ property.status }}
              </span>
            </div>
            <div v-if="property.featured" class="absolute top-3 right-3">
              <span class="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold inline-flex items-center gap-1">
                <svg class="w-3 h-3 text-yellow-300 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Featured
              </span>
            </div>
          </div>

          <!-- Property Details -->
          <div class="p-6">
            <div class="mb-2">
              <h3 class="text-xl font-bold text-gray-900 mb-1">{{ property.title }}</h3>
              <p class="text-gray-600 flex items-center gap-1 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ property.location }}
              </p>
            </div>

            <p class="text-gray-700 mb-4 line-clamp-2 text-sm">{{ property.description }}</p>

            <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <div class="flex gap-4 text-sm text-gray-600">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {{ property.bedrooms }} beds
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ property.bathrooms }} baths
                </span>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <div>
                <p class="text-2xl font-bold text-blue-600">{{ propertyStore.formatPrice(property.price) }}</p>
              </div>
              <button
                @click.stop="viewProperty(property.id)"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="inline-block p-8 bg-blue-50 rounded-full mb-6">
          <svg class="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No Properties Found</h3>
        <p class="text-gray-600 mb-6">Try adjusting your search filters or check back later for new listings.</p>
        <button @click="resetFilters" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
          Reset All Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/propertyStore'
import { useSEO } from '../hooks/useSEO'

useSEO({
  title: 'All Properties | KSA Valuers',
  description: 'Browse all properties from KSA Valuers. Find your dream home or investment property in Nigeria.',
})

const router = useRouter()
const propertyStore = usePropertyStore()

// Load sample properties if empty
if (propertyStore.properties.length === 0) {
  propertyStore.loadSampleData()
}

const viewProperty = (id) => {
  router.push(`/properties/${id}`)
}

const resetFilters = () => {
  propertyStore.searchQuery = ''
  propertyStore.filters.status = 'all'
  propertyStore.filters.type = 'all'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'For Sale': 'bg-green-500 text-white',
    'For Rent': 'bg-blue-500 text-white',
    'Sold': 'bg-gray-500 text-white',
    'Rented': 'bg-purple-500 text-white'
  }
  return classes[status] || 'bg-gray-500 text-white'
}
</script>
