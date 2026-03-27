
<template>
  <div
    :class="[
      fullscreen ? 'fixed inset-0 z-50 bg-white/80 flex items-center justify-center' : 'flex items-center justify-center py-8',
      sizeClass
    ]"
    role="status"
    aria-live="polite"
  >
    <span
      class="material-icons animate-spin text-blue-500"
      :class="iconSizeClass"
      aria-hidden="true"
    ></span>
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
const iconSizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-2xl'
    case 'lg': return 'text-6xl'
    default: return 'text-4xl'
  }
})
</script>
