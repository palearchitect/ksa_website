<template>
  <section class="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Properties</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our hand-picked selection of premium properties across Nigeria. Find your perfect home or investment opportunity.
        </p>
      </div>

      <!-- Carousel Container -->
      <div v-if="properties.length > 0" class="relative">
        <!-- Carousel Track -->
        <div class="overflow-hidden">
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
            class="pointer-events-auto ml-4 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow z-10 text-gray-800 hover:bg-gray-100"
            :disabled="currentIndex === 0"
            :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Next Button -->
          <button
            @click="nextProperty"
            class="pointer-events-auto mr-4 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow z-10 text-gray-800 hover:bg-gray-100"
            :disabled="currentIndex === properties.length - 1"
            :class="{ 'opacity-50 cursor-not-allowed': currentIndex === properties.length - 1 }"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Carousel Indicators -->
        <div class="flex justify-center gap-2 mt-8">
          <button
            v-for="(property, idx) in properties"
            :key="property.id"
            @click="currentIndex = idx"
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="
              idx === currentIndex
                ? 'bg-blue-600 w-8'
                : 'bg-gray-300 hover:bg-gray-400'
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
      <div class="mt-16 text-center">
        <router-link
          to="/properties"
          class="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          View All Properties →
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
