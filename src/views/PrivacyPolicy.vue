<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-gray-50 py-16 md:py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-extrabold text-[#0f294a] mb-4">Privacy Policy</h1>
          <p class="text-sm text-gray-500">Last updated: July 12, 2026</p>
          <div class="w-20 h-1 bg-[#f96816] mx-auto mt-4 rounded-full"></div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-gray-700 leading-relaxed space-y-6">
          <section>
            <h2 class="text-2xl font-bold text-[#0f294a] mb-3">1. Introduction</h2>
            <p>
              Welcome to KSA Valuers (Kayode Segun & Associates). We are committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our portal, or engage our property valuation and management services.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-[#0f294a] mb-3">2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect on the website includes:</p>
            <ul class="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number that you voluntarily give to us.</li>
              <li><strong>Property Data:</strong> Details regarding properties you submit for valuation, sales, or leasing.</li>
              <li><strong>Financial Data:</strong> Transactional details associated with payments made for our services.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-[#0f294a] mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, including:</p>
            <ul class="list-disc pl-6 space-y-2 mt-2">
              <li>Processing and generating property valuation reports.</li>
              <li>Managing your account and viewing appointments.</li>
              <li>Sending confirmation emails, updates, and responding to support requests.</li>
              <li>Preventing fraudulent activities and securing our platform.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-[#0f294a] mb-3">4. Information Sharing & Disclosure</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operations (like email delivery services or database hosting), or when required by law to comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-[#0f294a] mb-3">5. Data Security</h2>
            <p>
              We implement a variety of security measures, including administrative, technical, and physical safeguards, to maintain the safety of your personal information. However, no electronic transmission or storage technology can be guaranteed 100% secure.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-[#0f294a] mb-3">6. Contact Us</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
            <div class="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-150 inline-block">
              <p class="font-bold text-[#0f294a]">KSA Valuers (Kayode Segun & Associates)</p>
              <p>Email: <a href="mailto:info@ksavaluers.com" class="text-blue-600 hover:underline">info@ksavaluers.com</a></p>
              <p>Phone: +234 905 390 1001</p>
              <p>Address: Suite J260, Road 5 Ikota Shopping Complex, Lekki-Ajah, Lagos, Nigeria</p>
            </div>
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
  title: 'Privacy Policy - KSA Valuers',
  description: 'Understand how KSA Valuers collects, handles, and protects your personal and property data.'
})
</script>
