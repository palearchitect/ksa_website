<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Hero Carousel Slides</h1>
          <p class="mt-1 text-sm text-gray-500">Manage the sliding images and slogans displayed on the website homepage hero banner.</p>
        </div>
        <router-link
          :to="{ name: 'AdminSlideForm' }"
          class="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition text-sm"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Slide
        </router-link>
      </div>

      <!-- Error State -->
      <div v-if="heroSlideStore.error" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
        <span>{{ heroSlideStore.error }}</span>
        <button @click="loadSlides" class="text-red-800 underline font-semibold hover:text-red-950">Retry</button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Empty State -->
      <div v-else-if="heroSlideStore.slides.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">No hero slides found</h3>
        <p class="text-gray-500 mb-6">Create your first hero slide to customize the landing page banner display.</p>
        <router-link
          :to="{ name: 'AdminSlideForm' }"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm shadow-sm"
        >
          Add First Slide
        </router-link>
      </div>

      <!-- Slides Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="slide in heroSlideStore.slides"
          :key="slide.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300"
        >
          <!-- Thumbnail Image -->
          <div class="h-48 bg-cover bg-center relative" :style="{ backgroundImage: `url('${slide.imageUrl}')` }">
            <div class="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-3">
              <router-link
                :to="{ name: 'AdminSlideEdit', params: { id: slide.id } }"
                class="p-2 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow transition"
                title="Edit Slide"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </router-link>
              <button
                @click="confirmDelete(slide.id)"
                class="p-2 bg-red-600/90 hover:bg-red-600 text-white rounded-full shadow transition"
                title="Delete Slide"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <span class="absolute top-3 left-3 px-2 py-1 bg-gray-900/85 text-xs text-white rounded font-medium">
              Order: {{ slide.sortOrder }}
            </span>
          </div>

          <!-- Description / Details -->
          <div class="p-5 flex-grow flex flex-col justify-between">
            <div>
              <h3 class="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{{ slide.title }}</h3>
              <p class="text-sm text-gray-500 line-clamp-2 mb-4">{{ slide.tagline }}</p>
            </div>

            <div class="border-t border-gray-100 pt-4 mt-auto">
              <div class="flex items-center justify-between text-xs text-gray-400">
                <span>CTA: <strong>{{ slide.ctaText }}</strong></span>
                <span class="truncate max-w-[150px]">Link: <code class="text-xxs bg-gray-100 px-1 rounded">{{ slide.ctaLink }}</code></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHeroSlideStore } from '@/stores/heroSlideStore'

const heroSlideStore = useHeroSlideStore()
const loading = ref(false)

const loadSlides = async () => {
  loading.value = true
  await heroSlideStore.fetchSlides()
  loading.value = false
}

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this hero slide from the homepage carousel?')) {
    const res = await heroSlideStore.deleteSlide(id)
    if (!res.success) {
      alert(res.message || 'Failed to delete slide')
    }
  }
}

onMounted(() => {
  loadSlides()
})
</script>

<style scoped>
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
}

.text-xxs {
  font-size: 0.65rem;
}
</style>
