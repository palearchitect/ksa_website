<template>
  <div class="min-h-screen bg-transparent text-slate-900">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-b from-[#030810] via-[#071328] to-[#0a1835] text-white pt-28 pb-24 overflow-hidden border-b border-white/10">
      <PatternBackgroundDark />
      <!-- Ambient radial gradients -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.25),rgba(249,104,22,0.1)_50%,transparent_80%)] pointer-events-none"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest-swiss uppercase text-orange-400 bg-orange-500/10 border border-orange-500/20 mb-4">
          <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          Prime Real Estate Catalog
        </span>
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight mb-4 text-white">
          Curated <span class="font-serif italic font-normal text-gradient-brand-light">Real Estate Holdings</span>
        </h1>
        <p class="text-base sm:text-lg text-slate-300 mb-4 max-w-2xl mx-auto font-normal leading-relaxed">
          Find your ideal residential acquisition or prime commercial investment from our verified portfolio across Nigeria.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Floating Glassmorphic Filters Console -->
      <div class="glass-pill p-3 -mt-16 mb-12 relative z-20 shadow-2xl border border-white/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <!-- Search Box -->
          <div class="md:col-span-2 relative">
            <input
              v-model="propertyStore.searchQuery"
              type="text"
              placeholder="Search properties by title, district, city..."
              class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-full text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            >
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Status Filter -->
          <div>
            <select v-model="propertyStore.filters.status" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-full text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer">
              <option value="all">All Status</option>
              <option v-for="status in propertyStore.PROPERTY_STATUS" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>

          <!-- Type Filter -->
          <div>
            <select v-model="propertyStore.filters.type" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-full text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer">
              <option value="all">All Types</option>
              <option v-for="type in propertyStore.PROPERTY_TYPES" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Results Info Strip -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h2 class="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Available Listings</h2>
          <p class="text-xs md:text-sm text-slate-500 font-medium">{{ propertyStore.filteredProperties.length }} properties currently available</p>
        </div>
      </div>

      <!-- Properties Bento Grid -->
      <div v-if="propertyStore.filteredProperties.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PropertyCard
          v-for="property in propertyStore.filteredProperties"
          :key="property.id"
          :property="property"
        />
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
import PatternBackgroundDark from '../components/global/PatternBackgroundDark.vue'
import PropertyCard from '@/components/properties/PropertyCard.vue'
import { usePropertyStore } from '@/stores/propertyStore'
import { useSEO } from '../hooks/useSEO'
import { captureEvent } from '@/plugins/posthog'

useSEO({
  title: 'All Properties | KSA Valuers',
  description: 'Browse all properties from KSA Valuers. Find your dream home or investment property in Nigeria.',
})

const router = useRouter()
const propertyStore = usePropertyStore()

// Load properties if empty
if (propertyStore.properties.length === 0) {
  propertyStore.fetchProperties()
}

const viewProperty = (id) => {
  const property = propertyStore.properties.find(item => item.id === id)
  captureEvent('property_details_viewed', {
    property_id: id,
    property_status: property?.status,
    property_type: property?.type,
    is_featured: Boolean(property?.featured)
  })
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
