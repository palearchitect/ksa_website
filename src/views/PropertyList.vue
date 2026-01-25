<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl md:text-5xl font-bold mb-2">All Properties</h1>
        <p class="text-blue-100 text-lg">Discover exceptional properties across Nigeria</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading State -->
      <div v-if="propertiesStore.loading" class="mb-12">
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="inline-block">
            <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-gray-600 mt-4">Loading properties...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="propertiesStore.error" class="mb-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-red-800 mb-2">Error Loading Properties</h3>
          <p class="text-red-700 mb-4">{{ propertiesStore.error }}</p>
          <button
            @click="loadProperties"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Search Section -->
      <div v-else class="mb-12">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center gap-4">
            <svg class="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="propertiesStore.searchQuery"
              type="text"
              placeholder="Search by property title or location..."
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="handleSearch"
            />
            <button
              v-if="propertiesStore.searchQuery"
              @click="clearSearch"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200"
            >
              Clear
            </button>
          </div>
          <p v-if="propertiesStore.filteredProperties.length > 0 && propertiesStore.searchQuery" class="text-sm text-gray-600 mt-3">
            Found <span class="font-semibold">{{ propertiesStore.filteredProperties.length }}</span>
            property/properties matching your search
          </p>
        </div>
      </div>

      <!-- Properties Grid -->
      <div v-if="!propertiesStore.loading && displayProperties.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PropertyListingCard
          v-for="property in displayProperties"
          :key="property.id"
          :property="getPropertyData(property)"
          @view-details="handleViewDetails"
        />
      </div>

      <!-- No Results Message -->
      <div v-else-if="!propertiesStore.loading && propertiesStore.properties.length === 0" class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No properties available</h3>
        <p class="text-gray-600 mb-6">Check back soon for new property listings.</p>
      </div>

      <!-- No Search Results -->
      <div v-else-if="!propertiesStore.loading && propertiesStore.filteredProperties.length === 0 && propertiesStore.searchQuery" class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No properties found</h3>
        <p class="text-gray-600 mb-6">
          We couldn't find any properties matching "<span class="font-semibold">{{ propertiesStore.searchQuery }}</span>". Try adjusting your search.
        </p>
        <button
          @click="clearSearch"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          View All Properties
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="!propertiesStore.loading && propertiesStore.totalPages > 1" class="mt-12 flex justify-center items-center space-x-4">
        <button
          @click="goToPreviousPage"
          :disabled="!propertiesStore.hasPreviousPage"
          :class="[
            'px-4 py-2 rounded-lg transition-colors duration-200',
            propertiesStore.hasPreviousPage 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          ]"
        >
          Previous
        </button>
        
        <div class="flex items-center space-x-2">
          <span class="text-gray-700">Page</span>
          <span class="font-semibold">{{ propertiesStore.currentPage }}</span>
          <span class="text-gray-700">of</span>
          <span class="font-semibold">{{ propertiesStore.totalPages }}</span>
        </div>
        
        <button
          @click="goToNextPage"
          :disabled="!propertiesStore.hasNextPage"
          :class="[
            'px-4 py-2 rounded-lg transition-colors duration-200',
            propertiesStore.hasNextPage 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          ]"
        >
          Next
        </button>
      </div>

      <!-- Statistics Section -->
      <div v-if="!propertiesStore.loading && propertiesStore.properties.length > 0" class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <p class="text-4xl font-bold text-blue-600 mb-2">{{ propertiesStore.totalCount }}</p>
          <p class="text-gray-600">Total Properties</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <p class="text-4xl font-bold text-green-600 mb-2">{{ forSaleCount }}</p>
          <p class="text-gray-600">For Sale</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <p class="text-4xl font-bold text-blue-500 mb-2">{{ forRentCount }}</p>
          <p class="text-gray-600">For Rent</p>
        </div>
      </div>

      <!-- Admin Access Button -->
      <div v-if="isAdmin" class="mt-8 text-center">
        <router-link
          to="/admin/properties"
          class="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Manage Properties in Admin
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePropertiesStore } from '@/stores/properties'
import PropertyListingCard from '@/components/sections/PropertyListingCard.vue'

const router = useRouter()
const propertiesStore = usePropertiesStore()

// Check if user is admin
const isAdmin = computed(() => {
  return localStorage.getItem('adminToken') !== null
})

// Get properties to display (filtered or all)
const displayProperties = computed(() => {
  return propertiesStore.searchQuery 
    ? propertiesStore.filteredProperties 
    : propertiesStore.properties
})

// Calculate statistics
const forSaleCount = computed(() => {
  return propertiesStore.properties.filter(p => {
    const status = getPropertyStatus(p)
    return status === 'sale' || status === 'For Sale'
  }).length
})

const forRentCount = computed(() => {
  return propertiesStore.properties.filter(p => {
    const status = getPropertyStatus(p)
    return status === 'rent' || status === 'For Rent'
  }).length
})

// Helper function to extract property data
const getPropertyData = (property) => {
  // Handle Strapi API response format
  if (property.attributes) {
    return {
      id: property.id,
      title: property.attributes.title,
      location: property.attributes.location,
      address: property.attributes.address,
      price: property.attributes.price,
      status: property.attributes.status,
      listingType: property.attributes.listingType,
      bedrooms: property.attributes.bedrooms,
      bathrooms: property.attributes.bathrooms,
      size: property.attributes.size,
      description: property.attributes.description,
      images: property.attributes.images?.data || []
    }
  }
  // Handle direct property object
  return property
}

const getPropertyStatus = (property) => {
  if (property.attributes) {
    return property.attributes.listingType || property.attributes.status
  }
  return property.listingType || property.status
}

// Load properties on component mount
onMounted(() => {
  loadProperties()
})

const loadProperties = async () => {
  try {
    await propertiesStore.fetchProperties()
  } catch (error) {
    console.error('Failed to load properties:', error)
  }
}

const handleSearch = () => {
  // Search is handled reactively by the store
}

const clearSearch = () => {
  propertiesStore.setSearchQuery('')
}

const handleViewDetails = (propertyId) => {
  router.push({ 
    name: 'PropertyDetail', 
    params: { id: propertyId } 
  })
}

const goToNextPage = async () => {
  if (propertiesStore.hasNextPage) {
    await propertiesStore.nextPage()
  }
}

const goToPreviousPage = async () => {
  if (propertiesStore.hasPreviousPage) {
    await propertiesStore.previousPage()
  }
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
</style>