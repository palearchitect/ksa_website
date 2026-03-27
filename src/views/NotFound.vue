<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative z-10 max-w-lg w-full text-center">
      <!-- Error Number with Animation -->
      <div class="mb-8">
        <span class="text-9xl font-bold text-gray-800 inline-block">
          <span class="text-blue-600 animate-pulse">4</span>
          <span class="text-purple-600 animate-pulse animation-delay-100">0</span>
          <span class="text-pink-600 animate-pulse animation-delay-200">4</span>
        </span>
      </div>

      <!-- Error Icon -->
      <div class="mb-8">
        <div class="inline-block p-6 bg-white rounded-2xl shadow-xl">
          <svg class="w-20 h-20 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Main Message -->
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p class="text-xl text-gray-600 mb-8 leading-relaxed">
        Oops! The page you're looking for seems to have wandered off into the digital wilderness.
      </p>

      <!-- Possible Reasons -->
      <div class="bg-white rounded-xl p-6 mb-8 shadow-lg">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">This might have happened because:</h3>
        <ul class="text-left text-gray-600 space-y-2">
          <li class="flex items-start">
            <svg class="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>The page has been moved or deleted</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>You might have typed the wrong URL</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>The link you followed might be broken</span>
          </li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/"
          class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Homepage
        </router-link>
        
        <button
          @click="goBack"
          class="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 shadow-lg hover:bg-gray-50 hover:border-gray-400 transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
      </div>

      <!-- Additional Help -->
      <div class="mt-12 pt-8 border-t border-gray-200">
        <p class="text-gray-500 mb-4">Still lost? Try these helpful links:</p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/properties" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
            Browse Properties
          </router-link>
          <router-link to="/contact-us" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
            Contact Support
          </router-link>
          <router-link to="/faq" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
            Visit FAQ
          </router-link>
          <a href="javascript:location.reload()" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
            Refresh Page
          </a>
        </div>
      </div>

      <!-- Fun Message -->
      <div class="mt-8">
        <p class="text-sm text-gray-400 italic">
          "Not all who wander are lost, but this page certainly is!"
        </p>
      </div>
    </div>

    <!-- Footer Note -->
    <div class="absolute bottom-8 text-center">
      <p class="text-gray-400 text-sm">
        Need help? Contact us at 
        <a href="mailto:support@example.com" class="text-blue-500 hover:text-blue-700">
          support@example.com
        </a>
      </p>
    </div>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import ErrorBoundary from '../components/global/ErrorBoundary.vue'
import { useSEO } from '../hooks/useSEO'
useSEO({
  title: '404 - Page Not Found',
  description: 'Sorry, the page you are looking for does not exist.'
})
import { useRouter } from 'vue-router'

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
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-100 {
  animation-delay: 100ms;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

/* Smooth transitions for buttons */
button, a {
  transition: all 0.2s ease-in-out;
}
</style>