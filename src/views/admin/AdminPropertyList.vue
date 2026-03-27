<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Properties</h1>
        <p class="text-gray-600">{{ propertyStore.totalProperties }} total properties</p>
      </div>
      <router-link
        to="/admin/properties/new"
        class="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Property
      </router-link>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
        <p class="text-sm text-gray-600">Total</p>
        <p class="text-2xl font-bold">{{ propertyStore.totalProperties }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
        <p class="text-sm text-gray-600">For Sale</p>
        <p class="text-2xl font-bold">{{ propertyStore.propertiesForSale.length }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-indigo-500">
        <p class="text-sm text-gray-600">For Rent</p>
        <p class="text-2xl font-bold">{{ propertyStore.propertiesForRent.length }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
        <p class="text-sm text-gray-600">Featured</p>
        <p class="text-2xl font-bold">{{ propertyStore.featuredProperties.length }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="propertyStore.searchQuery"
          type="text"
          placeholder="Search properties..."
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
        <select v-model="propertyStore.filters.status" class="px-4 py-2 border border-gray-300 rounded-lg bg-white">
          <option value="all">All Status</option>
          <option v-for="s in propertyStore.PROPERTY_STATUS" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
        <select v-model="propertyStore.filters.type" class="px-4 py-2 border border-gray-300 rounded-lg bg-white">
          <option value="all">All Types</option>
          <option v-for="t in propertyStore.PROPERTY_TYPES" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
    </div>

    <!-- Properties Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="propertyStore.filteredProperties.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <p class="text-lg font-medium mb-1">No properties found</p>
                <p class="text-sm">Try adjusting your filters or add a new property.</p>
              </td>
            </tr>
            <tr v-for="property in propertyStore.filteredProperties" :key="property.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="property.image || 'https://via.placeholder.com/60x40?text=No+Image'"
                    :alt="property.title"
                    class="w-16 h-10 object-cover rounded"
                  >
                  <div>
                    <p class="font-medium text-gray-900">{{ property.title }}</p>
                    <p class="text-sm text-gray-500">{{ property.bedrooms }} bed &middot; {{ property.bathrooms }} bath</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ property.location }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ propertyStore.formatPrice(property.price) }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(property.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ property.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ property.type }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <router-link
                    :to="`/admin/properties/${property.id}`"
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="toggleFeatured(property.id)"
                    :class="property.featured ? 'text-yellow-600' : 'text-gray-400'"
                    class="hover:text-yellow-700 text-sm font-medium"
                    :title="property.featured ? 'Remove from featured' : 'Mark as featured'"
                  >
                    {{ property.featured ? '★' : '☆' }}
                  </button>
                  <button
                    @click="deleteProperty(property.id)"
                    class="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePropertyStore } from '@/stores/propertyStore'

const propertyStore = usePropertyStore()

const getStatusClass = (status) => {
  const classes = {
    'For Sale': 'bg-green-100 text-green-800',
    'For Rent': 'bg-blue-100 text-blue-800',
    'Sold': 'bg-gray-100 text-gray-800',
    'Rented': 'bg-purple-100 text-purple-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const toggleFeatured = (id) => {
  const property = propertyStore.getPropertyById(id)
  if (property) {
    propertyStore.updateProperty(id, { featured: !property.featured })
  }
}

const deleteProperty = (id) => {
  if (confirm('Are you sure you want to delete this property?')) {
    propertyStore.deleteProperty(id)
  }
}
</script>
