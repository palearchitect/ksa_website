<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Property Listings</h1>
        <p class="text-xs text-slate-500 font-normal">{{ propertyStore.totalProperties }} total properties registered</p>
      </div>
      <router-link
        to="/dashboard/admin/properties/new"
        class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors shadow-2xs"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Property Listing</span>
      </router-link>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
        <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Properties</p>
        <p class="text-2xl font-bold text-slate-900 mt-1">{{ propertyStore.totalProperties }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
        <p class="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">For Sale</p>
        <p class="text-2xl font-bold text-slate-900 mt-1">{{ propertyStore.propertiesForSale.length }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
        <p class="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">For Rent</p>
        <p class="text-2xl font-bold text-slate-900 mt-1">{{ propertyStore.propertiesForRent.length }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
        <p class="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">Featured</p>
        <p class="text-2xl font-bold text-slate-900 mt-1">{{ propertyStore.featuredProperties.length }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <input
          v-model="propertyStore.searchQuery"
          type="text"
          placeholder="Search properties by title or location..."
          class="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-slate-300 focus:bg-white transition"
        >
        <select v-model="propertyStore.filters.status" class="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-slate-300 focus:bg-white transition cursor-pointer">
          <option value="all">All Statuses</option>
          <option v-for="s in propertyStore.PROPERTY_STATUS" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
        <select v-model="propertyStore.filters.type" class="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-slate-300 focus:bg-white transition cursor-pointer">
          <option value="all">All Property Types</option>
          <option v-for="t in propertyStore.PROPERTY_TYPES" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
    </div>

    <!-- Properties Table -->
    <div class="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-medium uppercase tracking-wider text-slate-400">
              <th class="px-5 py-3">Property</th>
              <th class="px-5 py-3">Location</th>
              <th class="px-5 py-3">Price</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3">Type</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr v-if="propertyStore.filteredProperties.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-slate-400">
                <p class="text-sm font-semibold mb-1 text-slate-900">No properties found</p>
                <p class="text-xs text-slate-500">Try adjusting your filters or add a new property listing.</p>
              </td>
            </tr>
            <tr v-for="property in propertyStore.filteredProperties" :key="property.id" class="hover:bg-slate-50/60 transition-colors">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <img
                    :src="property.image || 'https://via.placeholder.com/60x40?text=No+Image'"
                    :alt="property.title"
                    class="w-12 h-9 object-cover rounded-lg border border-slate-200"
                  >
                  <div>
                    <p class="font-semibold text-slate-900 leading-tight">{{ property.title }}</p>
                    <p class="text-[11px] text-slate-500">{{ property.bedrooms }} bed &middot; {{ property.bathrooms }} bath</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5 text-slate-600">{{ property.location }}</td>
              <td class="px-5 py-3.5 font-semibold text-slate-900">{{ propertyStore.formatPrice(property.price) }}</td>
              <td class="px-5 py-3.5">
                <span :class="getStatusClass(property.status)" class="px-2.5 py-0.5 text-[10px] font-medium rounded-md inline-block border">
                  {{ property.status }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-slate-600">{{ property.type }}</td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <router-link
                    :to="`/dashboard/admin/properties/${property.id}`"
                    class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded-md transition"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="toggleFeatured(property.id)"
                    :class="property.featured ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-slate-400 bg-slate-100 border-slate-200'"
                    class="p-1 rounded-md border hover:text-amber-600 text-xs font-medium"
                    :title="property.featured ? 'Remove from featured' : 'Mark as featured'"
                  >
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteProperty(property.id)"
                    class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-[11px] font-medium rounded-md transition"
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
import { onMounted } from 'vue'
import { usePropertyStore } from '@/stores/propertyStore'

const propertyStore = usePropertyStore()

onMounted(() => {
  propertyStore.fetchProperties()
})

const getStatusClass = (status) => {
  const classes = {
    'For Sale': 'bg-slate-100 text-slate-800 border-slate-200',
    'For Rent': 'bg-blue-50 text-blue-700 border-blue-200/60',
    'Sold': 'bg-slate-50 text-slate-500 border-slate-200',
    'Rented': 'bg-purple-50 text-purple-700 border-purple-200/60'
  }
  return classes[status] || 'bg-slate-100 text-slate-700 border-slate-200'
}

const toggleFeatured = async (id) => {
  const property = propertyStore.getPropertyById(id)
  if (property) {
    await propertyStore.updateProperty(id, { featured: !property.featured })
  }
}

const deleteProperty = async (id) => {
  if (confirm('Are you sure you want to delete this property?')) {
    await propertyStore.deleteProperty(id)
  }
}
</script>
