<template>
  <div
    class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer relative group"
    @click="goToDetail"
  >
    <!-- Image Gallery -->
    <div class="relative w-full h-56 bg-gray-100">
      <img
        :src="currentImage"
        :alt="property.title"
        class="w-full h-full object-cover object-center transition-all duration-300"
      />
      <!-- Carousel Dots -->
      <div v-if="property.images && property.images.length > 1" class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        <button
          v-for="(img, idx) in property.images"
          :key="idx"
          class="w-2 h-2 rounded-full"
          :class="idx === imageIdx ? 'bg-[#D4755B]' : 'bg-white border border-[#D4755B]'"
          @click.stop="imageIdx = idx"
        ></button>
      </div>
      <!-- Favorite Button -->
      <button
        class="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:shadow-md z-10 flex items-center justify-center"
        @click.stop="toggleFavorite"
      >
        <svg
          class="w-5 h-5 transition-colors duration-200"
          :class="isFavorite ? 'text-[#D4755B] fill-current' : 'text-gray-400'"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      <!-- Type Badge -->
      <span class="absolute top-3 left-3 bg-[#D4755B] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
        {{ property.type }}
      </span>
    </div>
    <!-- Details -->
    <div class="p-5">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-gray-900 group-hover:text-[#D4755B] line-clamp-1">{{ property.title }}</h3>
        <span class="text-xl font-bold text-[#D4755B]">
          {{ formatPrice(property.price) }}<span v-if="property.status === 'For Rent'" class="text-xs font-normal">/month</span>
        </span>
      </div>
      <div class="flex items-center text-gray-500 text-sm mb-2">
        <svg class="w-4 h-4 mr-1 text-[#D4755B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px; flex-shrink: 0;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="line-clamp-1">{{ property.location }}</span>
      </div>
      <div class="flex items-center gap-4 text-gray-600 text-xs mb-3">
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-2-4v8m-14-8v8m2-8h10M9 6v4m6-4v4" />
          </svg>
          {{ property.bedrooms }} Beds
        </span>
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16M4 14a4 4 0 004 4h8a4 4 0 004-4v-4H4v4zm3-5v1m10-1v1" />
          </svg>
          {{ property.bathrooms }} Baths
        </span>
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <rect x="2" y="7" width="20" height="10" rx="2" stroke-width="2"/>
            <line x1="6" y1="7" x2="6" y2="12" stroke-width="2"/>
            <line x1="10" y1="7" x2="10" y2="12" stroke-width="2"/>
            <line x1="14" y1="7" x2="14" y2="12" stroke-width="2"/>
            <line x1="18" y1="7" x2="18" y2="12" stroke-width="2"/>
          </svg>
          {{ property.squareFootage }} sqft
        </span>
      </div>
      <p class="text-gray-700 text-sm line-clamp-2 mb-2">{{ property.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  property: { type: Object, required: true },
  isFavorite: { type: Boolean, default: false }
})
const emit = defineEmits(['favorite-toggle'])
const router = useRouter()

const imageIdx = ref(0)
const currentImage = computed(() => {
  if (props.property.images && props.property.images.length > 0) {
    return props.property.images[imageIdx.value]
  }
  return props.property.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
})

function toggleFavorite() {
  emit('favorite-toggle', props.property.id)
}
function goToDetail() {
  router.push({ name: 'PropertyDetail', params: { id: props.property.id } })
}
function formatPrice(price) {
  if (!price && price !== 0) return 'Price not set'
  if (price >= 1000000000) return `₦${(price / 1000000000).toFixed(2)}B`
  if (price >= 1000000) return `₦${(price / 1000000).toFixed(1)}M`
  if (price >= 1000) return `₦${(price / 1000).toFixed(1)}K`
  return `₦${price.toLocaleString()}`
}
</script>

<style scoped>
/* 1-line clamp */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 1;
}
/* 2-line clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}
</style>
