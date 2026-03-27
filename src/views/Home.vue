<template>
  <div>
    <!-- Hero Banner Section -->
    <HeroBanner />

    <!-- Service Highlights Section -->
    <ServiceHighlights />

    <!-- Additional Info Section -->
    <section class="py-16 md:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Why Choose Us -->
        <div class="mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">Why Choose KSA Valuers?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Expert Team</h3>
                <p class="mt-2 text-gray-600">
                  Highly qualified professionals with years of experience in the real estate industry.
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Fast & Reliable</h3>
                <p class="mt-2 text-gray-600">
                  Quick turnaround times with accurate and dependable valuations and assessments.
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Secure & Confidential</h3>
                <p class="mt-2 text-gray-600">
                  Your property details and personal information are handled with utmost confidentiality.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12 text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p class="text-blue-100 text-lg mb-8">
            Contact us today to learn more about our services and how we can help you with your property needs.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <router-link
              to="/contact-us"
              class="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Contact Us
            </router-link>
            <router-link
              to="/book-a-tour"
              class="px-8 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors duration-200 border border-white"
            >
              Book a Tour
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import HeroBanner from '@/components/sections/HeroBanner.vue'
import ServiceHighlights from '@/components/sections/ServiceHighlights.vue'
</script>

<style scoped>
</style>
