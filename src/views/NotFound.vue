<template>
  <ErrorBoundary>
    <div class="py-16 md:py-24 bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <!-- Background Abstract Accent Gradients -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <div class="relative z-10 max-w-lg w-full text-center">
        <!-- Error Number with Animation -->
        <div class="mb-6">
          <span class="text-9xl font-extrabold tracking-tight text-gray-900 inline-block select-none">
            <span class="text-blue-600">4</span>
            <span class="text-orange-500">0</span>
            <span class="text-blue-700">4</span>
          </span>
        </div>

        <!-- Main Message -->
        <h1 class="text-3xl font-extrabold text-gray-900 mb-4">Page Not Found</h1>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed">
          Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
        </p>

        <!-- Possible Reasons -->
        <div class="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm text-left">
          <h3 class="text-base font-bold text-gray-800 mb-4">This might have happened because:</h3>
          <ul class="text-gray-600 space-y-3 text-sm">
            <li class="flex items-start">
              <svg class="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>The link you followed is broken or has moved</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>The URL was entered incorrectly or changed</span>
            </li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/"
            class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-sm transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Homepage
          </router-link>
          
          <button
            @click="goBack"
            class="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>

        <!-- Additional Help -->
        <div class="mt-12 pt-8 border-t border-gray-200 text-sm">
          <p class="text-gray-500 mb-4 font-medium">Or try one of these helpful sections:</p>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link to="/properties" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-semibold">
              Browse Properties
            </router-link>
            <router-link to="/contact-us" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-semibold">
              Contact Support
            </router-link>
            <router-link to="/faq" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-semibold">
              Visit FAQ
            </router-link>
          </div>
          <p class="text-gray-400 text-xs mt-8">
            Need direct help? Email us at 
            <a href="mailto:info@ksavaluers.com" class="text-blue-600 hover:text-blue-800 font-semibold underline">
              info@ksavaluers.com
            </a>
          </p>
        </div>
      </div>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import ErrorBoundary from '../components/global/ErrorBoundary.vue'
import { useSEO } from '../hooks/useSEO'
import { useRouter } from 'vue-router'

useSEO({
  title: '404 - Page Not Found',
  description: 'Sorry, the page you are looking for does not exist.'
})

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
button, a {
  transition: all 0.2s ease-in-out;
}
</style>