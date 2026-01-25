<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Header with Search and Add Button -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1">
          <input
            v-model="adminStore.searchQuery"
            type="text"
            placeholder="Search properties by title or location..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            @input="handleSearch"
          />
        </div>
        <button
          @click="handleAddProperty"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Property
        </button>
      </div>
      <p class="text-sm text-gray-600 mt-2">
        Showing <span class="font-semibold">{{ filteredProperties.length }}</span>
        of <span class="font-semibold">{{ adminStore.properties.length }}</span>
        properties
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="adminStore.loading" class="p-12 text-center">
      <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Loading properties...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="adminStore.error" class="p-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-red-800 mb-2">Error Loading Properties</h3>
        <p class="text-red-700 mb-4">{{ adminStore.error }}</p>
        <button
          @click="loadProperties"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="adminStore.success" class="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="text-green-700">{{ adminStore.success }}</span>
        <button @click="adminStore.clearMessages()" class="ml-auto text-green-600 hover:text-green-800">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div v-else-if="adminStore.properties.length > 0" class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Image</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Location</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr 
            v-for="property in filteredProperties" 
            :key="property.id" 
            class="hover:bg-gray-50 transition-colors"
          >
            <!-- Image -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  v-if="getPropertyImage(property)"
                  :src="getPropertyImage(property)"
                  :alt="getPropertyTitle(property)"
                  class="w-full h-full object-cover"
                />
                <div v-else class="text-gray-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </td>

            <!-- Title -->
            <td class="px-6 py-4">
              <p class="font-semibold text-gray-900">{{ getPropertyTitle(property) }}</p>
              <p class="text-sm text-gray-600">
                {{ getPropertyBedrooms(property) }} bed • {{ getPropertyBathrooms(property) }} bath
                <span v-if="getPropertySize(property)" class="ml-2">• {{ getPropertySize(property) }} sq ft</span>
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ getPropertyType(property) }} • {{ getListingType(property) === 'sale' ? 'For Sale' : 'For Rent' }}
              </p>
            </td>

            <!-- Location -->
            <td class="px-6 py-4 text-gray-600">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p>{{ getPropertyAddress(property) }}</p>
                  <p class="text-sm text-gray-500">{{ getPropertyCity(property) }}, {{ getPropertyState(property) }}</p>
                </div>
              </div>
            </td>

            <!-- Price -->
            <td class="px-6 py-4 whitespace-nowrap">
              <p class="font-bold text-blue-600">{{ formatPrice(getPropertyPrice(property)) }}</p>
            </td>

            <!-- Status -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-col space-y-2">
                <span :class="[
                  'px-3 py-1 text-xs font-semibold rounded-full inline-block w-min',
                  getPropertyStatus(property) === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]">
                  {{ getPropertyStatus(property) === 'published' ? 'Published' : 'Draft' }}
                </span>
                <button
                  @click="togglePropertyStatus(property)"
                  :class="[
                    'px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 inline-block w-min',
                    getPropertyStatus(property) === 'published' 
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' 
                      : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                  ]"
                >
                  {{ getPropertyStatus(property) === 'published' ? 'Set to Draft' : 'Publish' }}
                </button>
              </div>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="handleEditProperty(property.id)"
                  class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg transition-colors duration-200 flex items-center"
                  title="Edit Property"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  @click="handleDeleteProperty(property.id)"
                  class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors duration-200 flex items-center"
                  title="Delete Property"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
                <button
                  @click="handleViewDetails(property.id)"
                  class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200 flex items-center"
                  title="View Details"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="px-6 py-12 text-center">
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
      <p class="text-gray-600 mb-4">
        {{ adminStore.searchQuery ? 'Try adjusting your search filters' : 'Get started by adding your first property' }}
      </p>
      <button
        v-if="!adminStore.searchQuery"
        @click="handleAddProperty"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
      >
        Add Property
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

// Computed property for filtered properties
const filteredProperties = computed(() => {
  if (!adminStore.searchQuery.trim()) {
    return adminStore.properties
  }
  
  const query = adminStore.searchQuery.toLowerCase().trim()
  return adminStore.properties.filter(property => {
    const title = getPropertyTitle(property).toLowerCase()
    const address = getPropertyAddress(property).toLowerCase()
    const city = getPropertyCity(property).toLowerCase()
    const state = getPropertyState(property).toLowerCase()
    
    return title.includes(query) || 
           address.includes(query) || 
           city.includes(query) ||
           state.includes(query)
  })
})

// Load properties on component mount
onMounted(() => {
  loadProperties()
})

const loadProperties = async () => {
  try {
    await adminStore.fetchProperties()
  } catch (error) {
    console.error('Failed to load properties:', error)
  }
}

// Helper functions to get property data
const getPropertyTitle = (property) => {
  return property.attributes?.title || property.title || 'Untitled Property'
}

const getPropertyLocation = (property) => {
  return property.attributes?.location || property.location || 'Location not specified'
}

const getPropertyAddress = (property) => {
  return property.attributes?.address || property.address || 'Address not specified'
}

const getPropertyCity = (property) => {
  return property.attributes?.city || property.city || 'City not specified'
}

const getPropertyState = (property) => {
  return property.attributes?.state || property.state || 'State not specified'
}

const getPropertyPrice = (property) => {
  return property.attributes?.price || property.price || 0
}

const getPropertyStatus = (property) => {
  return property.attributes?.status || property.status || 'draft'
}

const getPropertyType = (property) => {
  return property.attributes?.propertyType || property.propertyType || 'Unknown'
}

const getListingType = (property) => {
  return property.attributes?.listingType || property.listingType || 'sale'
}

const getPropertyBedrooms = (property) => {
  return property.attributes?.bedrooms || property.bedrooms || 'N/A'
}

const getPropertyBathrooms = (property) => {
  return property.attributes?.bathrooms || property.bathrooms || 'N/A'
}

const getPropertySize = (property) => {
  return property.attributes?.size || property.size || null
}

const getPropertyImage = (property) => {
  // Handle API response with nested structure
  if (property.attributes?.images?.data?.[0]?.attributes?.url) {
    return property.attributes.images.data[0].attributes.url
  }
  // Handle API response without nested structure
  if (property.attributes?.images?.[0]?.url) {
    return property.attributes.images[0].url
  }
  // Handle old mock data
  if (property.image) {
    return property.image
  }
  return null
}

const formatPrice = (price) => {
  if (!price) return 'Price not set'
  return '₦' + price.toLocaleString('en-NG')
}

const handleSearch = () => {
  // Search is handled reactively by computed property
}

const handleAddProperty = () => {
  // Clear form data and navigate to add form
  adminStore.resetForm()
  router.push('/admin/property/add')
}

const handleEditProperty = async (propertyId) => {
  try {
    // Load property data into the store first
    await adminStore.openForm(propertyId)
    // Then navigate to edit form
    router.push(`/admin/property/edit/${propertyId}`)
  } catch (error) {
    console.error('Failed to open property for editing:', error)
  }
}

const handleViewDetails = (propertyId) => {
  router.push(`/property/${propertyId}`)
}

const handleDeleteProperty = async (propertyId) => {
  if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
    try {
      await adminStore.deleteProperty(propertyId)
    } catch (error) {
      console.error('Failed to delete property:', error)
    }
  }
}

const togglePropertyStatus = async (property) => {
  const newStatus = getPropertyStatus(property) === 'published' ? 'draft' : 'published'
  const confirmMessage = newStatus === 'published' 
    ? 'Are you sure you want to publish this property? It will be visible on the website.' 
    : 'Are you sure you want to set this property to draft? It will be hidden from the website.'
  
  if (confirm(confirmMessage)) {
    try {
      await adminStore.updatePropertyStatus(property.id, newStatus)
    } catch (error) {
      console.error('Failed to update property status:', error)
    }
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