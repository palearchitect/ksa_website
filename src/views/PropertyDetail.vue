<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold mb-2">Property Details</h1>
            <p class="text-blue-100 text-lg">View detailed information about this property</p>
          </div>
          <button
            @click="router.back()"
            class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Properties
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="ml-4 text-gray-600">Loading property details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <h3 class="text-lg font-semibold text-red-800 mb-2">Error Loading Property</h3>
        <p class="text-red-700 mb-4">{{ error }}</p>
        <button
          @click="router.back()"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
        >
          Go Back to Properties
        </button>
      </div>

      <!-- Property Details -->
      <div v-else-if="property" class="space-y-8">
        <!-- Property Title and Actions -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-3xl font-bold text-gray-900">{{ property.title }}</h2>
              <p class="text-gray-600 mt-2">{{ property.location }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <span :class="[
                'px-4 py-2 text-sm font-semibold rounded-full',
                property.listingType === 'sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              ]">
                {{ property.listingType === 'sale' ? 'For Sale' : 'For Rent' }}
              </span>
              <span class="text-2xl font-bold text-gray-900">
                ₦{{ property.price?.toLocaleString('en-NG') || '0' }}
              </span>
            </div>
          </div>

          <!-- Property Images -->
          <div v-if="property.images && property.images.length > 0" class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(image, index) in property.images" :key="index" class="rounded-lg overflow-hidden">
                <img
                  :src="image.attributes?.url || image.url"
                  :alt="property.title"
                  class="w-full h-64 object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
          </div>

          <!-- Property Info Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <p class="text-2xl font-bold text-blue-600">{{ property.bedrooms || '0' }}</p>
              <p class="text-gray-600 text-sm">Bedrooms</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <p class="text-2xl font-bold text-blue-600">{{ property.bathrooms || '0' }}</p>
              <p class="text-gray-600 text-sm">Bathrooms</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <p class="text-2xl font-bold text-blue-600">{{ property.size || '0' }}</p>
              <p class="text-gray-600 text-sm">Sq Ft</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <p class="text-2xl font-bold text-blue-600">{{ property.yearBuilt || 'N/A' }}</p>
              <p class="text-gray-600 text-sm">Year Built</p>
            </div>
          </div>

          <!-- Property Description -->
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Description</h3>
            <p class="text-gray-700 leading-relaxed">{{ property.description }}</p>
          </div>

          <!-- Property Address -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Address</h3>
            <p class="text-gray-700">{{ property.address }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-4">
          <button
            @click="contactAgent"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Agent
          </button>
          <button
            @click="scheduleTour"
            class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule Tour
          </button>
          <button
            v-if="isAdmin"
            @click="editProperty"
            class="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Property
          </button>
        </div>
      </div>

      <!-- Property Not Found -->
      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h3>
        <p class="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <button
          @click="router.push('/all-properties')"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          Browse All Properties
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertiesStore } from '@/stores/properties'

const route = useRoute()
const router = useRouter()
const propertiesStore = usePropertiesStore()

const loading = ref(false)
const error = ref(null)
const property = ref(null)

// Check if user is admin
const isAdmin = computed(() => {
  return localStorage.getItem('adminToken') !== null
})

// Load property data
onMounted(async () => {
  await loadProperty()
})

const loadProperty = async () => {
  loading.value = true
  error.value = null
  
  try {
    const propertyId = route.params.id
    
    // First try to get from store cache
    const cachedProperty = propertiesStore.getProperty(propertyId)
    if (cachedProperty) {
      property.value = getPropertyData(cachedProperty)
      loading.value = false
      return
    }
    
    // If not in cache, fetch from API
    const fetchedProperty = await propertiesStore.fetchProperty(propertyId)
    if (fetchedProperty) {
      property.value = getPropertyData(fetchedProperty)
    } else {
      error.value = 'Property not found'
    }
  } catch (err) {
    error.value = err.message || 'Failed to load property details'
    console.error('Error loading property:', err)
  } finally {
    loading.value = false
  }
}

const getPropertyData = (propertyData) => {
  // Handle Strapi API response format
  if (propertyData.attributes) {
    return {
      id: propertyData.id,
      title: propertyData.attributes.title,
      location: propertyData.attributes.location,
      address: propertyData.attributes.address,
      city: propertyData.attributes.city,
      state: propertyData.attributes.state,
      price: propertyData.attributes.price,
      listingType: propertyData.attributes.listingType,
      propertyType: propertyData.attributes.propertyType,
      bedrooms: propertyData.attributes.bedrooms,
      bathrooms: propertyData.attributes.bathrooms,
      size: propertyData.attributes.size,
      yearBuilt: propertyData.attributes.yearBuilt,
      description: propertyData.attributes.description,
      status: propertyData.attributes.status,
      images: propertyData.attributes.images?.data || [],
      amenities: propertyData.attributes.amenities || []
    }
  }
  // Handle direct property object
  return propertyData
}

const contactAgent = () => {
  // Implement contact agent functionality
  alert('Contact agent functionality coming soon!')
}

const scheduleTour = () => {
  router.push({
    name: 'BookTour',
    query: { propertyId: property.value.id, propertyName: property.value.title }
  })
}

const editProperty = () => {
  router.push(`/admin/property/edit/${property.value.id}`)
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.transition-transform {
  transition-property: transform;
}
</style>