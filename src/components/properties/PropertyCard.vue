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
        class="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:shadow-md z-10"
        @click.stop="toggleFavorite"
      >
        <span class="material-icons text-xl" :class="isFavorite ? 'text-[#D4755B]' : 'text-gray-400'">
          {{ isFavorite ? 'favorite' : 'favorite_border' }}
        </span>
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
        <span class="material-icons text-base mr-1">location_on</span>
        <span class="line-clamp-1">{{ property.location }}</span>
      </div>
      <div class="flex items-center gap-4 text-gray-600 text-sm mb-3">
        <span class="flex items-center"><span class="material-icons text-base mr-1">king_bed</span>{{ property.bedrooms }} Beds</span>
        <span class="flex items-center"><span class="material-icons text-base mr-1">bathtub</span>{{ property.bathrooms }} Baths</span>
        <span class="flex items-center"><span class="material-icons text-base mr-1">straighten</span>{{ property.squareFootage }} sqft</span>
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
