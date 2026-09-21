<template>
  <div class="relative w-full h-screen overflow-hidden bg-gray-950">
    <!-- Main Carousel Slides -->
    <div class="relative w-full h-full">
      <TransitionGroup name="fade-slide">
        <div
          v-for="(slide, index) in slides"
          v-show="activeIndex === index"
          :key="slide.id || index"
          class="absolute inset-0 bg-cover bg-center flex items-center justify-center transition-all duration-1000"
          :style="{ backgroundImage: `linear-gradient(to bottom, rgba(3, 8, 16, 0.75) 0%, rgba(7, 19, 36, 0.6) 50%, rgba(3, 8, 16, 0.9) 100%), radial-gradient(circle at 80% 20%, rgba(249, 104, 22, 0.18) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.22) 0%, transparent 50%), url('${slide.imageUrl}')` }"
        >
          <!-- Content Container -->
          <div class="text-center text-white max-w-4xl px-4 sm:px-6 lg:px-8 mt-20 md:mt-24">
            <!-- Micro Pill Badge -->
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs uppercase font-bold tracking-widest text-orange-400 mb-6 shadow-sm">
              <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              Chartered Valuation & Asset Advisory
            </div>

            <!-- Main Headline -->
            <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-6 leading-tight tracking-tight select-none">
              {{ slide.title }}
            </h1>

            <!-- Tagline -->
            <p class="text-base sm:text-lg md:text-xl text-slate-200 mb-8 md:mb-10 leading-relaxed font-normal max-w-2xl mx-auto select-none">
              {{ slide.tagline }}
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
              <router-link
                :to="slide.ctaLink || '/properties'"
                class="pill-button-primary px-8 py-3.5 text-xs uppercase tracking-widest font-bold shadow-lg hover:shadow-orange-500/30 transition-all duration-300 w-full sm:w-auto"
              >
                {{ slide.ctaText || 'Explore Properties' }}
              </router-link>

              <router-link
                to="/book-a-tour"
                class="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold text-white border border-white/25 hover:border-white/60 bg-white/10 hover:bg-white/20 backdrop-blur-xl transition-all duration-300 gap-2 w-full sm:w-auto"
              >
                <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book Inspection
              </router-link>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Slide Navigation Arrows -->
    <button @click="prevSlide" class="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center bg-slate-950/60 hover:bg-slate-900/90 text-white/90 hover:text-white border border-white/15 backdrop-blur-md transition-all duration-200 z-20 focus:outline-none">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button @click="nextSlide" class="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center bg-slate-950/60 hover:bg-slate-900/90 text-white/90 hover:text-white border border-white/15 backdrop-blur-md transition-all duration-200 z-20 focus:outline-none">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Bottom Indicator Pill Capsules -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-20">
      <button
        v-for="(_, index) in slides"
        :key="index"
        @click="selectSlide(index)"
        class="h-1.5 rounded-full transition-all duration-300 focus:outline-none"
        :class="activeIndex === index ? 'w-8 bg-gradient-to-r from-orange-500 to-blue-500' : 'w-2 bg-white/40 hover:bg-white/70'"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const slides = ref([])
const activeIndex = ref(0)
const autoPlayInterval = ref(null)

const fetchSlides = async () => {
  try {
    const response = await axios.get('/api/hero-slides')
    if (response.data?.success && response.data.data.length > 0) {
      slides.value = response.data.data
    } else {
      useFallbackSlides()
    }
  } catch (error) {
    console.error('Failed to load hero slides:', error)
    useFallbackSlides()
  }
}

const useFallbackSlides = () => {
  slides.value = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&h=900&fit=crop',
      title: "Nigeria's Premier Property Valuers",
      tagline: 'Expert property valuations and comprehensive real estate solutions across Nigeria',
      ctaText: 'Explore Properties',
      ctaLink: '/properties'
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&h=900&fit=crop',
      title: 'Smart Real Estate Investments',
      tagline: 'Discover high-yield properties in prime locations across Lagos, Abuja, and Port Harcourt',
      ctaText: 'View Ongoing Projects',
      ctaLink: '/ongoing-projects'
    }
  ]
}

const prevSlide = () => {
  resetAutoPlay()
  activeIndex.value = activeIndex.value === 0 ? slides.value.length - 1 : activeIndex.value - 1
}

const nextSlide = () => {
  resetAutoPlay()
  activeIndex.value = activeIndex.value === slides.value.length - 1 ? 0 : activeIndex.value + 1
}

const selectSlide = (index) => {
  activeIndex.value = index
  resetAutoPlay()
}

const startAutoPlay = () => {
  autoPlayInterval.value = setInterval(() => {
    if (!isDrawerOpen.value && slides.value.length > 1) {
      activeIndex.value = (activeIndex.value + 1) % slides.value.length
    }
  }, 6000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
  }
}

const resetAutoPlay = () => {
  stopAutoPlay()
  startAutoPlay()
}

onMounted(async () => {
  await fetchSlides()
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
  document.body.classList.remove('menu-open')
})
</script>

<style scoped>
/* Fade-slide Transition for Slides */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: scale(1.02);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

/* Slide Transition for Side Drawer */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
}

/* Fade Transition for Backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Prevent double scrollbar when drawer is open */
:global(body.menu-open) {
  overflow: hidden;
}
</style>
