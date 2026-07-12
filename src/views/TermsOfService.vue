<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-gray-50 py-16 md:py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-extrabold text-[#0f294a] mb-4">Terms of Service</h1>
          <p class="text-sm text-gray-500">Last updated: July 12, 2026</p>
          <div class="w-20 h-1 bg-[#f96816] mx-auto mt-4 rounded-full"></div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-gray-700 leading-relaxed space-y-6">
          <section>
            <h2 class="text-2xl font-bold text-[#0f294a] mb-3">1. Agreement to Terms</h2>
            <p>
              These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and KSA Valuers (Kayode Segun & Associates), concerning your access to and use of our website and services. By accessing the site, you agree that you have read, understood, and agree to be bound by all of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-[#0f294a] mb-3">2. Intellectual Property Rights</h2>
            <p>
              Unless otherwise indicated, the website, including source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics, are our proprietary property and are protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-[#0f294a] mb-3">3. User Representations</h2>
            <p>By using the site or registering for appointments, you represent and warrant that:</p>
            <ul class="list-disc pl-6 space-y-2 mt-2">
              <li>All registration information you submit will be true, accurate, current, and complete.</li>
              <li>You will maintain the accuracy of such information and promptly update it as necessary.</li>
              <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
              <li>You will not use the site for any illegal or unauthorized purpose.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-[#0f294a] mb-3">4. Property Valuations & Services</h2>
            <p>
              Our property valuations are executed by certified estate surveyors and valuers in accordance with national and international professional standards. Reports generated are intended solely for the purposes stated in the service agreement and cannot be redistributed or used for unauthorized third-party financial representations without our express written consent.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-[#0f294a] mb-3">5. Limitation of Liability</h2>
            <p>
              In no event will we or our partners, directors, or employees be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site or services.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-[#0f294a] mb-3">6. Governing Law</h2>
            <p>
              These Terms shall be governed by and defined in accordance with the laws of the Federal Republic of Nigeria. Kayode Segun & Associates and yourself irrevocably consent that the courts of Nigeria shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
            </p>
          </section>
        </div>

        <div class="text-center mt-12">
          <router-link to="/" class="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Homepage
          </router-link>
        </div>
      </div>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import ErrorBoundary from '../components/global/ErrorBoundary.vue'
import { useSEO } from '../hooks/useSEO'

useSEO({
  title: 'Terms of Service - KSA Valuers',
  description: 'Review the legal terms and service agreements governing your relationship with KSA Valuers.'
})
</script>
