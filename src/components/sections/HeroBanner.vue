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
          :style="{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('${slide.imageUrl}')` }"
        >
          <!-- Content Container -->
          <div class="text-center text-white max-w-4xl px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
            <!-- Main Headline -->
            <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight select-none">
              {{ slide.title }}
            </h1>

            <!-- Tagline -->
            <p class="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 md:mb-10 leading-relaxed select-none">
              {{ slide.tagline }}
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
              <router-link
                :to="slide.ctaLink || '/properties'"
                class="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {{ slide.ctaText || 'Explore Properties' }}
              </router-link>
              
              <button
                @click="isDrawerOpen = true"
                class="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-gray-950 transition-all duration-300 gap-2"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                View Slides Drawer
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Slide Navigation Arrows -->
    <button @click="prevSlide" class="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/75 text-white transition z-20 focus:outline-none">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button @click="nextSlide" class="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/75 text-white transition z-20 focus:outline-none">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Bottom Indicator Dots -->
    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
      <button
        v-for="(_, index) in slides"
        :key="index"
        @click="selectSlide(index)"
        class="w-3.5 h-3.5 rounded-full transition-all duration-300 focus:outline-none"
        :class="activeIndex === index ? 'bg-blue-500 scale-125' : 'bg-white/50 hover:bg-white'"
      ></button>
    </div>

    <!-- Slider Side Drawer Menu (slides in from right) -->
    <Transition name="slide-left">
      <div v-show="isDrawerOpen" class="fixed top-0 right-0 h-full w-80 md:w-96 bg-gray-900 text-white shadow-2xl z-[150] flex flex-col border-l border-gray-800">
        <!-- Drawer Header -->
        <div class="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 class="text-xl font-bold tracking-wide flex items-center gap-2">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Slider Gallery
          </h3>
          <button @click="isDrawerOpen = false" class="p-2 rounded-full hover:bg-gray-800 transition text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Drawer Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div
            v-for="(slide, index) in slides"
            :key="slide.id || index"
            @click="selectSlide(index)"
            class="group cursor-pointer rounded-xl border overflow-hidden transition-all duration-300"
            :class="activeIndex === index ? 'border-blue-500 ring-2 ring-blue-500/50 bg-gray-800/80' : 'border-gray-800 bg-gray-800/30 hover:border-gray-700 hover:bg-gray-800/50'"
          >
            <!-- Slide Image -->
            <div class="h-28 bg-cover bg-center relative" :style="{ backgroundImage: `url('${slide.imageUrl}')` }">
              <div class="absolute inset-0 bg-gradient-to-t from-gray-950/70 to-transparent"></div>
              <span class="absolute bottom-2 right-2 px-2 py-0.5 bg-blue-600/90 text-xs font-bold rounded">
                Slide {{ index + 1 }}
              </span>
            </div>
            <!-- Slide Text -->
            <div class="p-3">
              <h4 class="font-semibold text-sm group-hover:text-blue-400 transition" :class="{ 'text-blue-500': activeIndex === index }">
                {{ slide.title }}
              </h4>
              <p class="text-xs text-gray-400 line-clamp-2 mt-1">
                {{ slide.tagline }}
              </p>
            </div>
          </div>
        </div>

        <!-- Drawer Footer -->
        <div class="p-6 border-t border-gray-800 bg-gray-950/40 text-center">
          <p class="text-xs text-gray-500">Auto-playing every 6s unless selected</p>
        </div>
      </div>
    </Transition>

    <!-- Drawer Dark Backdrop Overlay -->
    <Transition name="fade">
      <div
        v-if="isDrawerOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-xs z-[140]"
        @click="isDrawerOpen = false"
      ></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'

const slides = ref([])
const activeIndex = ref(0)
const isDrawerOpen = ref(false)
const autoPlayInterval = ref(null)

// Lock body scroll when drawer is open to prevent double scrollbars
watch(isDrawerOpen, (isOpen) => {
  if (isOpen) {
    document.body.classList.add('menu-open')
  } else {
    document.body.classList.remove('menu-open')
  }
})

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
