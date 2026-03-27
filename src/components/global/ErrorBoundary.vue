<template>
  <div>
    <slot v-if="!error" />
    <div v-else class="flex flex-col items-center justify-center py-16">
      <span class="material-icons text-5xl text-[#D4755B] mb-4">error_outline</span>
      <p class="font-manrope text-lg text-[#374151] mb-2">Something went wrong.</p>
      <p class="text-sm text-gray-500 mb-4">{{ error }}</p>
      <button @click="reload" class="bg-[#D4755B] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#B86851]">Reload</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const error = ref(null)
function reload() {
  window.location.reload()
}
function errorCaptured(err) {
  error.value = err?.message || 'Unknown error'
  return false
}
</script>
