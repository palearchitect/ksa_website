<template>
  <div
    class="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
    :style="{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=800&fit=crop')` }"
  >
    <!-- Content Container -->
    <div class="text-center text-white max-w-4xl px-4 sm:px-6 lg:px-8">
      <!-- Main Headline -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
        Nigeria's Premier Property Valuers
      </h1>

      <!-- Tagline -->
      <p class="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 md:mb-10 leading-relaxed">
        Expert property valuations and comprehensive real estate solutions across Nigeria
      </p>

      <!-- CTA Button -->
      <router-link
        to="/all-properties"
        class="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Explore Properties
      </router-link>

      <!-- Secondary CTA -->
      <div class="mt-6">
        <router-link
          to="/book-a-tour"
          class="inline-block ml-0 sm:ml-4 mt-4 sm:mt-0 px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
        >
          Book a Tour
        </router-link>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>
