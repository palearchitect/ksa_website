<template>
  <div class="property-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100">
    <!-- Image Container -->
    <div class="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-64 group">
      <!-- Main Image with Loading State -->
      <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center">
        <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <img
        :src="safeImageUrl"
        :alt="property.title || 'Property image'"
        @load="imageLoading = false"
        @error="handleImageError"
        :class="[
          'w-full h-full object-cover transition-all duration-500',
          imageLoading ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
        ]"
        loading="lazy"
      />
      
      <!-- Status Badge -->
      <div class="absolute top-4 right-4 z-10">
        <span
          :class="[
            'px-3 py-1.5 rounded-full text-white font-semibold text-xs shadow-lg',
            statusBadgeClass
          ]"
        >
          {{ formattedStatus }}
        </span>
      </div>
      
      <!-- Price Overlay -->
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <p class="text-2xl font-bold text-white">{{ formattedPrice }}</p>
      </div>
    </div>

    <!-- Card Content -->
    <div class="p-6 flex-grow flex flex-col">
      <!-- Title -->
      <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
        {{ property.title || 'Untitled Property' }}
      </h3>

      <!-- Location -->
      <div class="flex items-start mb-4">
        <svg class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p class="text-sm text-gray-600 line-clamp-2">{{ property.location || 'Location not specified' }}</p>
      </div>

      <!-- Property Specs Grid -->
      <div class="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-gray-200">
        <!-- Bedrooms -->
        <div class="text-center group/spec">
          <div class="flex justify-center mb-1.5">
            <div class="p-2 rounded-full bg-blue-50 group-hover/spec:bg-blue-100 transition-colors">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-2m-9-2V7a1 1 0 011-1h6a1 1 0 011 1v6.5" />
              </svg>
            </div>
          </div>
          <p class="text-lg font-bold text-gray-900">{{ safeBedrooms }}</p>
          <p class="text-xs text-gray-500 font-medium">Beds</p>
        </div>

        <!-- Bathrooms -->
        <div class="text-center group/spec">
          <div class="flex justify-center mb-1.5">
            <div class="p-2 rounded-full bg-green-50 group-hover/spec:bg-green-100 transition-colors">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 4v14a2 2 0 002 2h8a2 2 0 002-2V4m0 0a2 2 0 012 2v2H4V6a2 2 0 012-2m6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
          </div>
          <p class="text-lg font-bold text-gray-900">{{ safeBathrooms }}</p>
          <p class="text-xs text-gray-500 font-medium">Baths</p>
        </div>

        <!-- Square Footage -->
        <div class="text-center group/spec">
          <div class="flex justify-center mb-1.5">
            <div class="p-2 rounded-full bg-purple-50 group-hover/spec:bg-purple-100 transition-colors">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
              </svg>
            </div>
          </div>
          <p class="text-lg font-bold text-gray-900">{{ formattedSquareFootage }}</p>
          <p class="text-xs text-gray-500 font-medium">Sq Ft</p>
        </div>
      </div>

      <!-- View Details Button -->
      <button
        @click="handleViewDetails"
        @keyup.enter="handleViewDetails"
        :disabled="!property.id"
        :class="[
          'w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center',
          property.id 
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg active:scale-[0.98]'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
        aria-label="View property details"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        {{ property.id ? 'View Details' : 'Unavailable' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  property: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      title: '',
      location: '',
      image: '',
      price: 0,
      status: '',
      bedrooms: 0,
      bathrooms: 0,
      squareFootage: 0,
      squareFeet: 0,
      area: 0
    })
  }
})

const emit = defineEmits(['view-details'])
const imageLoading = ref(true)

// Safe property getters
const safeImageUrl = computed(() => {
  const url = props.property.image || props.property.photo || props.property.imageUrl
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=256&q=80'
  }
  
  // Ensure proper URL format
  if (url.startsWith('//')) return `https:${url}`
  if (url.startsWith('/')) return url
  if (!url.startsWith('http')) return `https://${url}`
  
  return url
})

const safeBedrooms = computed(() => {
  const beds = props.property.bedrooms || props.property.beds || props.property.bed || 0
  return Math.max(0, parseInt(beds) || 0)
})

const safeBathrooms = computed(() => {
  const baths = props.property.bathrooms || props.property.baths || props.property.bath || 0
  return Math.max(0, parseInt(baths) || 0)
})

const safeSquareFootage = computed(() => {
  const sqft = props.property.squareFootage || props.property.squareFeet || props.property.area || props.property.size || 0
  return Math.max(0, parseInt(sqft) || 0)
})

const safePrice = computed(() => {
  const price = props.property.price || props.property.cost || props.property.value || 0
  return Math.max(0, parseFloat(price) || 0)
})

const safeStatus = computed(() => {
  const status = props.property.status || 'Available'
  const statusStr = String(status).toLowerCase().trim()
  
  // Map various status formats
  if (statusStr.includes('sale') || statusStr === 'sale') return 'For Sale'
  if (statusStr.includes('rent') || statusStr === 'rent' || statusStr.includes('let')) return 'For Rent'
  if (statusStr.includes('sold') || statusStr === 'sold') return 'Sold'
  if (statusStr.includes('pending') || statusStr === 'pending') return 'Pending'
  if (statusStr.includes('available') || statusStr === 'available') return 'Available'
  
  return status.charAt(0).toUpperCase() + status.slice(1)
})

// Formatters
const formattedPrice = computed(() => {
  const price = safePrice.value
  if (price >= 1000000000) {
    return `₦${(price / 1000000000).toFixed(1)}B`
  } else if (price >= 1000000) {
    return `₦${(price / 1000000).toFixed(1)}M`
  } else if (price >= 1000) {
    return `₦${(price / 1000).toFixed(1)}K`
  }
  return `₦${price.toLocaleString('en-NG')}`
})

const formattedSquareFootage = computed(() => {
  const sqft = safeSquareFootage.value
  if (sqft >= 10000) {
    return `${(sqft / 10000).toFixed(1)}K`
  }
  return sqft.toLocaleString('en-NG')
})

const formattedStatus = computed(() => safeStatus.value)

// Dynamic styling
const statusBadgeClass = computed(() => {
  const status = safeStatus.value.toLowerCase()
  switch (status) {
    case 'for sale':
      return 'bg-gradient-to-r from-green-500 to-green-600'
    case 'for rent':
      return 'bg-gradient-to-r from-blue-500 to-blue-600'
    case 'sold':
      return 'bg-gradient-to-r from-gray-600 to-gray-700'
    case 'pending':
      return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
    case 'available':
      return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-600'
  }
})

// Event handlers
const handleImageError = (event) => {
  event.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=256&q=80'
  imageLoading.value = false
}

const handleViewDetails = () => {
  if (props.property.id) {
    emit('view-details', {
      id: props.property.id,
      title: props.property.title,
      price: safePrice.value
    })
  }
}

// Auto-hide loading after timeout (fallback)
setTimeout(() => {
  imageLoading.value = false
}, 3000)
</script>

<style scoped>
.property-card {
  min-height: 500px;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Smooth transitions */
.property-card {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Improve accessibility for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .property-card,
  .property-card * {
    transition-duration: 0.01ms !important;
  }
}

/* Ensure proper image rendering */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}
</style>