<template>
  <header class="app-header-floating" :class="{ 'is-scrolled': isScrolled }">
    <!-- Desktop: Centered Navigation Island -->
    <div class="hidden md:flex items-center justify-center w-full pointer-events-auto">
      <AppNavigation />
    </div>

    <!-- Mobile Header Bar: Raw Logo + Menu Button -->
    <div class="md:hidden flex items-center justify-between w-full px-4 pointer-events-auto">
      <router-link to="/" class="flex items-center">
        <img
          src="@/assets/images/logo.png"
          class="h-9 w-auto drop-shadow-md"
          alt="KSA Valuers Logo"
        />
      </router-link>
      
      <!-- Mobile menu pill button -->
      <button
        @click="toggleMobileMenu"
        class="w-10 h-10 rounded-full flex items-center justify-center bg-slate-900/60 backdrop-blur-xl border border-white/20 text-white shadow-md hover:border-orange-500/50 hover:text-orange-400 transition-all duration-200 focus:outline-none"
        :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          v-if="!mobileMenuOpen"
          class="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg
          v-else
          class="h-5 w-5 text-orange-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile Sidebar Dark Backdrop Overlay -->
    <Transition name="fade">
      <div 
        v-if="mobileMenuOpen" 
        class="mobile-backdrop pointer-events-auto" 
        @click="mobileMenuOpen = false"
      ></div>
    </Transition>

    <!-- Mobile Sidebar Navigation Drawer -->
    <Transition name="slide-left">
      <AppNavigation 
        v-if="mobileMenuOpen" 
        :mobile="true" 
        class="pointer-events-auto"
        @navigate="mobileMenuOpen = false"
      />
    </Transition>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import AppNavigation from './AppNavigation.vue'

const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

watch(mobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.classList.add('menu-open')
  } else {
    document.body.classList.remove('menu-open')
  }
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  document.body.classList.remove('menu-open')
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-header-floating {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.app-header-floating.is-scrolled {
  padding-top: 0.75rem;
}

/* Mobile Dark Overlay Backdrop */
.mobile-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 90; /* Right below the mobile drawer */
}

/* Prevent body scroll when mobile menu is open */
:global(body.menu-open) {
  overflow: hidden;
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

/* Slide Transition for Sidebar Drawer */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
}
</style>