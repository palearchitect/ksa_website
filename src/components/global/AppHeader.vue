<template>
  <header class="app-header shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div class="flex items-center justify-between">
        <!-- Logo Section -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center space-x-6">
            <img
              src="@/assets/images/logo.png"
              class="h-12 w-auto md:h-16"
              alt="KSA Valuers Logo"
            />
          </router-link>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-2">
          <AppNavigation />
        </div>
        
        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 focus:outline-none backdrop-blur-sm transition-colors duration-200"
            :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              v-if="!mobileMenuOpen"
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              v-else
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Dark Backdrop Overlay -->
    <Transition name="fade">
      <div 
        v-if="mobileMenuOpen" 
        class="mobile-backdrop" 
        @click="mobileMenuOpen = false"
      ></div>
    </Transition>

    <!-- Mobile Sidebar Navigation Drawer -->
    <Transition name="slide-left">
      <AppNavigation 
        v-if="mobileMenuOpen" 
        :mobile="true" 
        @navigate="mobileMenuOpen = false"
      />
    </Transition>
  </header>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import AppNavigation from './AppNavigation.vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Watch mobileMenuOpen to toggle scroll lock class on document body
watch(mobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.classList.add('menu-open')
  } else {
    document.body.classList.remove('menu-open')
  }
})

// Clean up body class if component is destroyed while menu is open
onUnmounted(() => {
  document.body.classList.remove('menu-open')
})
</script>

<style scoped>
/* Header Sticky Stacking Context */
.app-header {
  position: sticky;
  top: 0;
  z-index: 100; /* High z-index to ensure it sits on top of all page elements */
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-b: 1px solid #f3f4f6;
  transition: background-color 0.3s ease;
}

/* Enhanced logo hover effect */
img {
  transition: all 0.3s ease;
}

.router-link-active:hover img {
  transform: scale(1.03);
  filter: brightness(1.05);
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