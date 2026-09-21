<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-950/80 via-slate-950/90 to-orange-950/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/15 shadow-2xl">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight bg-gradient-to-r from-blue-300 via-white to-orange-300 bg-clip-text text-transparent">Property Listings</h1>
        <p class="text-slate-300 text-xs mt-1 font-medium">{{ propertyStore.totalProperties }} total properties registered</p>
      </div>
      <router-link
        to="/dashboard/admin/properties/new"
        class="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-md transition-all text-xs border border-white/20"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Property Listing
      </router-link>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-xl p-4 border border-white/15 shadow-lg">
        <p class="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Total Properties</p>
        <p class="text-2xl font-extrabold text-white mt-1">{{ propertyStore.totalProperties }}</p>
      </div>
      <div class="bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-xl p-4 border border-emerald-500/30 shadow-lg">
        <p class="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">For Sale</p>
        <p class="text-2xl font-extrabold text-white mt-1">{{ propertyStore.propertiesForSale.length }}</p>
      </div>
      <div class="bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-xl p-4 border border-blue-500/30 shadow-lg">
        <p class="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">For Rent</p>
        <p class="text-2xl font-extrabold text-white mt-1">{{ propertyStore.propertiesForRent.length }}</p>
      </div>
      <div class="bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-xl p-4 border border-yellow-500/30 shadow-lg">
        <p class="text-[11px] font-semibold text-yellow-400 uppercase tracking-wider">Featured</p>
        <p class="text-2xl font-extrabold text-white mt-1">{{ propertyStore.featuredProperties.length }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-xl p-4 border border-white/15 shadow-xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <input
          v-model="propertyStore.searchQuery"
          type="text"
          placeholder="Search properties by title or location..."
          class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white outline-none focus:border-orange-400"
        >
        <select v-model="propertyStore.filters.status" class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white outline-none focus:border-orange-400 cursor-pointer">
          <option value="all">All Statuses</option>
          <option v-for="s in propertyStore.PROPERTY_STATUS" :key="s.value" :value="s.value" class="bg-slate-900 text-white">{{ s.label }}</option>
        </select>
        <select v-model="propertyStore.filters.type" class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white outline-none focus:border-orange-400 cursor-pointer">
          <option value="all">All Property Types</option>
          <option v-for="t in propertyStore.PROPERTY_TYPES" :key="t" :value="t" class="bg-slate-900 text-white">{{ t }}</option>
        </select>
      </div>
    </div>

    <!-- Properties Table -->
    <div class="bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-2xl border border-white/15 overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-950/70 border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-300">
              <th class="px-5 py-3.5">Property</th>
              <th class="px-5 py-3.5">Location</th>
              <th class="px-5 py-3.5">Price</th>
              <th class="px-5 py-3.5">Status</th>
              <th class="px-5 py-3.5">Type</th>
              <th class="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10 text-xs">
            <tr v-if="propertyStore.filteredProperties.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-slate-400">
                <p class="text-base font-bold mb-1 text-white">No properties found</p>
                <p class="text-xs text-slate-400">Try adjusting your filters or add a new property listing.</p>
              </td>
            </tr>
            <tr v-for="property in propertyStore.filteredProperties" :key="property.id" class="hover:bg-slate-900/60 transition-colors">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="property.image || 'https://via.placeholder.com/60x40?text=No+Image'"
                    :alt="property.title"
                    class="w-14 h-10 object-cover rounded-lg border border-white/10"
                  >
                  <div>
                    <p class="font-bold text-white">{{ property.title }}</p>
                    <p class="text-[11px] text-slate-400">{{ property.bedrooms }} bed &middot; {{ property.bathrooms }} bath</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4 text-slate-300">{{ property.location }}</td>
              <td class="px-5 py-4 font-bold text-orange-400">{{ propertyStore.formatPrice(property.price) }}</td>
              <td class="px-5 py-4">
                <span :class="getStatusClass(property.status)" class="px-2.5 py-1 text-[10px] font-extrabold rounded-full">
                  {{ property.status }}
                </span>
              </td>
              <td class="px-5 py-4 text-slate-300">{{ property.type }}</td>
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link
                    :to="`/dashboard/admin/properties/${property.id}`"
                    class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-[11px] font-semibold rounded-lg transition"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="toggleFeatured(property.id)"
                    :class="property.featured ? 'text-yellow-400 bg-yellow-950/40 border-yellow-800' : 'text-slate-400 bg-slate-900 border-slate-700'"
                    class="p-1 rounded-lg border hover:text-yellow-300 text-xs font-medium"
                    :title="property.featured ? 'Remove from featured' : 'Mark as featured'"
                  >
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteProperty(property.id)"
                    class="px-2.5 py-1 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 text-[11px] font-semibold rounded-lg transition"
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
    'For Sale': 'bg-emerald-950/80 text-emerald-300 border border-emerald-800',
    'For Rent': 'bg-blue-950/80 text-blue-300 border border-blue-800',
    'Sold': 'bg-slate-900 text-slate-400 border border-slate-700',
    'Rented': 'bg-purple-950/80 text-purple-300 border border-purple-800'
  }
  return classes[status] || 'bg-slate-900 text-slate-300'
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
