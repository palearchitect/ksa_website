
<template>
  <div
    :class="[
      fullscreen ? 'fixed inset-0 z-50 bg-white/80 flex items-center justify-center' : 'flex items-center justify-center py-8',
      sizeClass
    ]"
    role="status"
    aria-live="polite"
  >
    <svg
      class="animate-spin text-blue-500"
      :class="spinnerSizeClass"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span v-if="message" class="ml-4 text-gray-700 font-medium text-lg">{{ message }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  message: { type: String, default: '' },
  size: { type: String, default: 'md' }, // sm, md, lg
  fullscreen: { type: Boolean, default: false }
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'py-2'
    case 'lg': return 'py-16'
    default: return 'py-8'
  }
})
const spinnerSizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-6 h-6'
    case 'lg': return 'w-16 h-16'
    default: return 'w-10 h-10'
  }
})
</script>
