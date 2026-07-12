<template>
  <section class="py-16 md:py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Core Services</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Comprehensive real estate solutions tailored to meet all your property needs
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Service Card 1: Valuation -->
        <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-8 text-center">
          <div class="flex justify-center mb-6">
            <div class="bg-blue-100 rounded-full p-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Property Valuation</h3>
          <p class="text-gray-600 leading-relaxed">
            Professional and accurate property valuations for residential, commercial, and industrial properties across Nigeria.
          </p>
        </div>

        <!-- Service Card 2: Sales & Lettings -->
        <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-8 text-center">
          <div class="flex justify-center mb-6">
            <div class="bg-green-100 rounded-full p-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Sales & Lettings</h3>
          <p class="text-gray-600 leading-relaxed">
            Expert guidance in buying, selling, and renting properties with transparent processes and fair market pricing.
          </p>
        </div>

        <!-- Service Card 3: Feasibility Appraisal -->
        <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-8 text-center">
          <div class="flex justify-center mb-6">
            <div class="bg-purple-100 rounded-full p-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Feasibility Appraisal</h3>
          <p class="text-gray-600 leading-relaxed">
            Comprehensive feasibility studies and project appraisals to evaluate investment viability and market potential.
          </p>
        </div>

        <!-- Service Card 4: Facility Management -->
        <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-8 text-center">
          <div class="flex justify-center mb-6">
            <div class="bg-orange-100 rounded-full p-4">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Facility Management</h3>
          <p class="text-gray-600 leading-relaxed">
            Professional facility management services ensuring optimal property maintenance and operational efficiency.
          </p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-16 text-center">
        <router-link
          to="/contact-us"
          class="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-200"
        >
          Get Started Today
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
</style>
