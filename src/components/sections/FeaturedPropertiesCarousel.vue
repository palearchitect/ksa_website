<template>
  <section class="py-20 md:py-28 bg-gradient-to-b from-[#030810] via-[#071328] to-[#0a1835] text-white relative overflow-hidden border-t border-b border-white/10">
    <!-- Ambient Lighting -->
    <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/15 via-orange-500/10 to-blue-600/15 blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-14">
        <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest-swiss uppercase text-orange-400 bg-orange-500/10 border border-orange-500/30 mb-3">
          <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
          Exclusive Listings
        </span>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Curated <span class="text-gradient-brand">Portfolio Holdings</span>
        </h2>
        <p class="mt-4 text-base md:text-lg text-slate-300 leading-relaxed font-normal">
          Hand-picked selection of verified prime residential and commercial opportunities across Nigeria, fully vetted by our valuation team.
        </p>
      </div>

      <!-- Carousel Container -->
      <div v-if="properties.length > 0" class="relative">
        <!-- Carousel Track -->
        <div class="overflow-hidden py-4">
          <div
            class="flex transition-transform duration-500 ease-out"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          >
            <div
              v-for="(property, idx) in properties"
              :key="property.id"
              class="w-full flex-shrink-0 px-4"
            >
              <div class="max-w-2xl mx-auto">
                <PropertyCard
                  :property="property"
                  :is-favorite="favorites.includes(property.id)"
                  @favorite-toggle="toggleFavorite"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center justify-between absolute inset-y-0 left-0 right-0 pointer-events-none">
          <!-- Previous Button -->
          <button
            @click="previousProperty"
            class="pointer-events-auto ml-2 md:-ml-5 w-11 h-11 rounded-full flex items-center justify-center bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-xl hover:border-orange-400 text-white hover:text-orange-400 transition-all duration-200 z-20 focus:outline-none"
            :disabled="currentIndex === 0"
            :class="{ 'opacity-30 cursor-not-allowed': currentIndex === 0 }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Next Button -->
          <button
            @click="nextProperty"
            class="pointer-events-auto mr-2 md:-mr-5 w-11 h-11 rounded-full flex items-center justify-center bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-xl hover:border-orange-400 text-white hover:text-orange-400 transition-all duration-200 z-20 focus:outline-none"
            :disabled="currentIndex === properties.length - 1"
            :class="{ 'opacity-30 cursor-not-allowed': currentIndex === properties.length - 1 }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Carousel Indicators -->
        <div class="flex items-center justify-center space-x-2 mt-8">
          <button
            v-for="(property, idx) in properties"
            :key="property.id"
            @click="currentIndex = idx"
            class="h-1.5 rounded-full transition-all duration-300 focus:outline-none"
            :class="
              idx === currentIndex
                ? 'w-8 bg-gradient-to-r from-orange-500 to-blue-500'
                : 'w-2 bg-white/30 hover:bg-white/60'
            "
            :aria-label="`Go to property ${idx + 1}`"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-600 text-lg mb-4">No featured properties available at the moment.</p>
        <router-link
          to="/properties"
          class="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          View All Properties
        </router-link>
      </div>

      <!-- CTA Section -->
      <div class="mt-14 text-center">
        <router-link
          to="/properties"
          class="pill-button-primary px-8 py-3 text-xs uppercase tracking-widest font-bold shadow-md hover:shadow-orange-500/30 transition-all duration-300"
        >
          Browse Complete Properties Catalog →
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePropertyStore } from '@/stores/propertyStore'
import PropertyCard from '@/components/properties/PropertyCard.vue'

const propertyStore = usePropertyStore()
const currentIndex = ref(0)
const favorites = ref([])

// Get featured properties
const properties = computed(() => {
  // Show up to 5 featured properties, or all if less
  const featured = propertyStore.featuredProperties || propertyStore.properties
  return featured.slice(0, 5)
})

// Navigation functions
const nextProperty = () => {
  if (currentIndex.value < properties.value.length - 1) {
    currentIndex.value++
  }
}

const previousProperty = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const toggleFavorite = (propertyId) => {
  const idx = favorites.value.indexOf(propertyId)
  if (idx > -1) {
    favorites.value.splice(idx, 1)
  } else {
    favorites.value.push(propertyId)
  }
}

// Load favorites from localStorage
onMounted(() => {
  const stored = localStorage.getItem('favoriteProperties')
  if (stored) {
    favorites.value = JSON.parse(stored)
  }
})
</script>

<style scoped>
/* Smooth carousel transitions */
.transition-transform {
  will-change: transform;
}

/* Disable buttons when at start/end */
button:disabled {
  pointer-events: none;
}
</style>
