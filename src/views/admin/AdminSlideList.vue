<template>
  <div class="space-y-6 max-w-[1600px] mx-auto text-slate-800 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
          <span>Hero Slides</span>
          <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            Homepage Hero
          </span>
        </h1>
        <p class="text-xs text-slate-500 font-normal">Manage the hero slides, slogans, and action CTAs displayed on the public landing page banner</p>
      </div>
      <router-link
        :to="{ name: 'AdminSlideForm' }"
        class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors shadow-2xs"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>Add New Slide</span>
      </router-link>
    </div>

    <!-- Error State -->
    <div v-if="heroSlideStore.error" class="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-2xs">
      <div class="flex items-center gap-2.5">
        <svg class="w-4 h-4 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ heroSlideStore.error }}</span>
      </div>
      <button @click="loadSlides" class="text-rose-600 underline font-semibold hover:text-rose-800 text-xs">Retry</button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-20 gap-3">
      <div class="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-800 animate-spin"></div>
      <p class="text-xs text-slate-500">Loading hero slides catalog...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="heroSlideStore.slides.length === 0" class="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-2xs">
      <div class="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-sm font-semibold text-slate-900 mb-1">No hero slides found</h3>
      <p class="text-slate-500 text-xs max-w-sm mx-auto mb-4">Create your first hero slide to customize the homepage carousel banner display.</p>
      <router-link
        :to="{ name: 'AdminSlideForm' }"
        class="inline-flex items-center px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-2xs transition"
      >
        Add First Slide
      </router-link>
    </div>

    <!-- Slides Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="slide in heroSlideStore.slides"
        :key="slide.id"
        class="bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 overflow-hidden flex flex-col shadow-2xs transition-all duration-200"
      >
        <!-- Thumbnail Image -->
        <div class="h-44 bg-cover bg-center relative overflow-hidden bg-slate-100" :style="{ backgroundImage: `url('${slide.imageUrl}')` }">
          <div class="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition duration-200 flex items-center justify-center gap-2">
            <router-link
              :to="{ name: 'AdminSlideEdit', params: { id: slide.id } }"
              class="p-2 bg-white text-slate-700 hover:bg-slate-100 rounded-lg shadow-sm border border-slate-200 transition"
              title="Edit Slide"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </router-link>
            <button
              @click="confirmDelete(slide.id)"
              class="p-2 bg-white text-rose-600 hover:bg-rose-50 rounded-lg shadow-sm border border-rose-200 transition"
              title="Delete Slide"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          <span class="absolute top-2.5 left-2.5 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] rounded-md font-mono font-medium">
            Order: {{ slide.sortOrder }}
          </span>
        </div>

        <!-- Description / Details -->
        <div class="p-4 flex-grow flex flex-col justify-between space-y-3">
          <div>
            <h3 class="font-semibold text-slate-900 font-sans text-sm mb-1 line-clamp-1">{{ slide.title }}</h3>
            <p class="text-xs text-slate-500 line-clamp-2 font-normal leading-relaxed">{{ slide.tagline }}</p>
          </div>

          <div class="border-t border-slate-100 pt-3">
            <div class="flex items-center justify-between text-xs text-slate-500">
              <span>CTA: <strong class="text-slate-900 font-medium">{{ slide.ctaText }}</strong></span>
              <span class="truncate max-w-[130px] text-slate-400">Link: <code class="text-[10px] bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-mono">{{ slide.ctaLink }}</code></span>
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
</style>
