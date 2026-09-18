<template>
  <div>
    <div v-if="error" class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100 text-center">
        <div class="inline-flex p-3.5 bg-red-100 rounded-full text-red-600 mb-5">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-950 mb-2">Something went wrong</h2>
        <p class="text-gray-600 mb-6 text-sm">
          An unexpected render crash occurred. Click reload below to refresh the session. If the problem persists, please contact KSA support.
        </p>
        <div class="flex gap-4 justify-center">
          <button @click="reloadPage" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-md">
            Reload Page
          </button>
          <button @click="goHome" class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-sm transition-all border border-gray-200">
            Go to Home
          </button>
        </div>
        <details class="mt-6 text-left text-xs text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-200 overflow-x-auto max-h-40">
          <summary class="cursor-pointer font-semibold mb-2 select-none text-gray-700">Error diagnostic details</summary>
          <pre class="font-mono text-[10px] whitespace-pre-wrap leading-relaxed">{{ error.stack || error.message || error }}</pre>
        </details>
      </div>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const error = ref(null)

onErrorCaptured((err) => {
  error.value = err
  console.error('[ErrorBoundary caught exception]:', err)
})

const reloadPage = () => {
  window.location.reload()
}

const goHome = () => {
  error.value = null
  window.location.href = '/'
}
</script>
