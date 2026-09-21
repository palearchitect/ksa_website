<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-2xl">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <span>Hero Carousel Slides</span>
          <span class="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Homepage Hero
          </span>
        </h1>
        <p class="mt-1 text-sm text-slate-400">Manage the hero slides, slogans, and action CTAs displayed on the public landing page banner.</p>
      </div>
      <router-link
        :to="{ name: 'AdminSlideForm' }"
        class="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-blue-600 hover:from-orange-400 hover:to-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add New Slide
      </router-link>
    </div>

    <!-- Error State -->
    <div v-if="heroSlideStore.error" class="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-5 py-4 rounded-xl text-sm flex items-center justify-between backdrop-blur-md">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ heroSlideStore.error }}</span>
      </div>
      <button @click="loadSlides" class="text-rose-400 underline font-semibold hover:text-rose-200 text-xs">Retry</button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-20 gap-3">
      <div class="relative flex items-center justify-center">
        <div class="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin"></div>
        <div class="absolute w-8 h-8 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" style="animation-direction: reverse; animation-duration: 0.8s;"></div>
      </div>
      <p class="text-xs text-slate-400">Loading hero slides catalog...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="heroSlideStore.slides.length === 0" class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-12 text-center shadow-xl">
      <div class="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mx-auto mb-4 text-slate-400">
        <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-white mb-1">No hero slides found</h3>
      <p class="text-slate-400 text-sm max-w-sm mx-auto mb-6">Create your first hero slide to customize the homepage carousel banner display.</p>
      <router-link
        :to="{ name: 'AdminSlideForm' }"
        class="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-400 hover:to-blue-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-orange-500/20"
      >
        Add First Slide
      </router-link>
    </div>

    <!-- Slides Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="slide in heroSlideStore.slides"
        :key="slide.id"
        class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 hover:border-slate-700/80 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300"
      >
        <!-- Thumbnail Image -->
        <div class="h-48 bg-cover bg-center relative overflow-hidden bg-slate-950" :style="{ backgroundImage: `url('${slide.imageUrl}')` }">
          <div class="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-3">
            <router-link
              :to="{ name: 'AdminSlideEdit', params: { id: slide.id } }"
              class="p-2.5 bg-slate-800/90 hover:bg-blue-600 text-white rounded-xl shadow-lg border border-slate-700 hover:border-blue-500 transition-all duration-200"
              title="Edit Slide"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </router-link>
            <button
              @click="confirmDelete(slide.id)"
              class="p-2.5 bg-slate-800/90 hover:bg-rose-600 text-white rounded-xl shadow-lg border border-slate-700 hover:border-rose-500 transition-all duration-200"
              title="Delete Slide"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          <span class="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/85 backdrop-blur-md text-xs text-orange-400 border border-orange-500/20 rounded-lg font-mono font-medium shadow-md">
            Order: {{ slide.sortOrder }}
          </span>
        </div>

        <!-- Description / Details -->
        <div class="p-5 flex-grow flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-white text-base mb-1.5 line-clamp-1 group-hover:text-orange-400 transition-colors">{{ slide.title }}</h3>
            <p class="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{{ slide.tagline }}</p>
          </div>

          <div class="border-t border-slate-800/80 pt-3.5 mt-auto">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span class="text-slate-300">CTA: <strong class="text-blue-400 font-medium">{{ slide.ctaText }}</strong></span>
              <span class="truncate max-w-[140px] text-slate-400">Link: <code class="text-xxs bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">{{ slide.ctaLink }}</code></span>
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
