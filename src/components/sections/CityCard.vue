<template>
  <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
    <div :class="['h-4', 'bg-gradient-to-r', color]"></div>
    <div class="p-8">
      <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ name }}</h3>
      <div class="space-y-3">
        <div>
          <p class="text-sm text-gray-500 mb-1">Primary Focus</p>
          <p class="font-medium text-gray-900">{{ properties }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">Key Areas</p>
          <p class="text-gray-700">{{ focus }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  properties: String,
  focus: String,
  color: String
})
</script>