<template>
  <header class="bg-white/80 backdrop-blur-sm shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-between">
        <!-- Logo Section -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center space-x-6">
            <!-- Logo Size -->
            <img 
              src="@/assets/logo.png"
              class="h-24 w-auto md:h-32"
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
            aria-expanded="false"
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

    <!-- Mobile Sidebar Overlay (slides in from right) -->
    <AppNavigation 
      v-if="mobileMenuOpen" 
      :mobile="true" 
      @close="mobileMenuOpen = false"
    />
  </header>
</template>

<script setup>
import { ref } from 'vue'
import AppNavigation from './AppNavigation.vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Close sidebar when clicking outside (optional)
const closeOnClickOutside = (event) => {
  if (mobileMenuOpen.value && !event.target.closest('.mobile-sidebar')) {
    mobileMenuOpen.value = false
  }
}
</script>

<style scoped>
/* Enhanced hover effect */
img {
  transition: all 0.3s ease;
}

.router-link-active:hover img {
  transform: scale(1.05);
  filter: brightness(1.1);
}

/* Prevent body scroll when mobile menu is open */
:global(body.menu-open) {
  overflow: hidden;
}
</style>