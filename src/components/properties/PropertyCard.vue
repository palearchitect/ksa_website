<template>
  <div
    class="bento-card overflow-hidden cursor-pointer relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    @click="goToDetail"
  >
    <!-- Image Gallery -->
    <div class="relative w-full h-60 bg-slate-100 overflow-hidden">
      <img
        :src="currentImage"
        :alt="property.title"
        class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none"></div>

      <!-- Left / Right Navigation Arrows -->
      <button
        v-if="imageList.length > 1"
        @click.stop="prevImage"
        class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-20 shadow-md border border-white/20"
        title="Previous image"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        v-if="imageList.length > 1"
        @click.stop="nextImage"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-20 shadow-md border border-white/20"
        title="Next image"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Carousel Dots -->
      <div v-if="imageList.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-slate-950/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
        <button
          v-for="(_, idx) in imageList"
          :key="idx"
          class="h-1.5 rounded-full transition-all duration-200"
          :class="idx === imageIdx ? 'w-4 bg-orange-500' : 'w-1.5 bg-white/70 hover:bg-white'"
          @click.stop="imageIdx = idx"
        ></button>
      </div>

      <!-- Image Count Indicator Pill -->
      <div v-if="imageList.length > 1" class="absolute bottom-3 right-3 bg-slate-950/75 text-white px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md flex items-center gap-1 z-10 border border-white/20">
        <span>📷 {{ imageIdx + 1 }}/{{ imageList.length }}</span>
      </div>

      <!-- Favorite Button -->
      <button
        class="absolute top-3 right-3 bg-white/90 backdrop-blur-md rounded-full p-2 shadow hover:shadow-md z-10 flex items-center justify-center border border-white/40 hover:border-orange-500/40 transition"
        @click.stop="toggleFavorite"
      >
        <svg
          class="w-4 h-4 transition-colors duration-200"
          :class="isFavorite ? 'text-orange-500 fill-current' : 'text-slate-400 hover:text-orange-500'"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <!-- Type Badge Pill -->
      <span class="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
        {{ property.type }}
      </span>
    </div>

    <!-- Details -->
    <div class="p-5">
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3 class="text-base md:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition line-clamp-1">{{ property.title }}</h3>
        <span class="text-lg md:text-xl font-extrabold text-blue-900 group-hover:text-orange-600 transition whitespace-nowrap">
          {{ formatPrice(property.price) }}<span v-if="property.status === 'For Rent'" class="text-xs font-normal text-slate-500">/mo</span>
        </span>
      </div>
      <div class="flex items-center text-slate-500 text-xs md:text-sm mb-3">
        <svg class="w-4 h-4 mr-1 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

const imageList = computed(() => {
  if (Array.isArray(props.property.images) && props.property.images.length > 0) {
    return props.property.images
  }
  if (props.property.image) {
    return [props.property.image]
  }
  return ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80']
})

const currentImage = computed(() => {
  return imageList.value[imageIdx.value] || imageList.value[0]
})

function nextImage() {
  if (imageList.value.length > 0) {
    imageIdx.value = (imageIdx.value + 1) % imageList.value.length
  }
}

function prevImage() {
  if (imageList.value.length > 0) {
    imageIdx.value = (imageIdx.value - 1 + imageList.value.length) % imageList.value.length
  }
}

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
