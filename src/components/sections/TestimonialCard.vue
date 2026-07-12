<template>
  <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 h-full">
    <!-- Stars -->
    <div class="flex mb-6">
      <svg v-for="n in 5" :key="n" class="w-5 h-5 text-yellow-400" :class="{ 'opacity-30': n > rating }" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    </div>
    
    <!-- Content -->
    <p class="text-blue-100 mb-8 italic">"{{ content }}"</p>
    
    <!-- Client Info -->
    <div class="border-t border-white/20 pt-6">
      <h4 class="font-bold text-white">{{ name }}</h4>
      <p class="text-blue-200 text-sm">{{ role }}</p>
      <p class="text-blue-300 text-sm">{{ company }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  role: String,
  company: String,
  content: String,
  rating: {
    type: Number,
    default: 5
  }
})
</script>