<template>
  <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 h-full">
    <div class="flex items-start mb-6">
      <div class="text-4xl mr-4">{{ icon }}</div>
      <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
    </div>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  icon: String
})
</script>