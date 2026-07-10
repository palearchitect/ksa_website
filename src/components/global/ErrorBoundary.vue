<template>
  <div>
    <slot v-if="!error" />
    <div v-else class="flex flex-col items-center justify-center py-16">
      <svg class="w-12 h-12 text-[#D4755B] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 48px; height: 48px;">
        <circle cx="12" cy="12" r="10" stroke-width="2"/>
        <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round"/>
        <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <p class="font-manrope text-lg text-[#374151] mb-2">Something went wrong.</p>
      <p class="text-sm text-gray-500 mb-4">{{ error }}</p>
      <button @click="reload" class="bg-[#D4755B] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#B86851]">Reload</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
const error = ref(null)
function reload() {
  window.location.reload()
}
onErrorCaptured((err) => {
  error.value = err?.message || 'Unknown error'
  return false
})
</script>
