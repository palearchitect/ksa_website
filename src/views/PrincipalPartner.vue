<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Page Title & Breadcrumb -->
      <div class="mb-12">
        <nav class="flex mb-4" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <router-link to="/" class="text-gray-700 hover:text-blue-600">Home</router-link>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <router-link to="/about-us" class="ml-1 text-gray-700 hover:text-blue-600 md:ml-2">About Us</router-link>
              </div>
            </li>
            <li aria-current="page">
              <div class="flex items-center">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-1 text-gray-500 md:ml-2">Principal Partner</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Principal Partner</h1>
        <p class="text-xl text-gray-600">Leading with expertise, integrity, and vision in property valuation</p>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Left Column: Partner Profile & Quick Links -->
        <div class="lg:col-span-1">
          <!-- Partner Profile Card -->
          <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div class="flex flex-col items-center">
              <!-- Partner Photo -->
              <div class="w-64 h-64 rounded-full overflow-hidden border-4 border-blue-100 mb-6">
                <img 
                  src="../assets/images/KAYODE-e1712319829816-277x300.jpg" 
                  alt="Principal Partner"
                  class="w-full h-full object-cover"
                >
              </div>
              
              <!-- Partner Name & Title -->
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Kayode Segun</h2>
              <p class="text-blue-600 font-semibold mb-4">Principal Partner & CEO</p>
              
              <!-- Qualifications -->
              <div class="mb-6 text-center">
                <div class="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-2">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Registered Valuer
                </div>
                <div class="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-2">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  FNIVS
                </div>
              </div>

              <!-- Contact Card -->
              <div class="bg-gray-50 rounded-lg p-6 w-full mb-6">
                <h3 class="font-semibold text-gray-900 mb-4">Direct Contact</h3>
                <div class="space-y-3">
                  <a href="tel:+2349053901001" class="flex items-center text-gray-700 hover:text-blue-600">
                    <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Kayode Segun & Associates
                  </a>
                  <a href="mailto:kayode@ksavaluers.com" class="flex items-center text-gray-700 hover:text-blue-600">
                    <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    kayode@ksavaluers.com
                  </a>
                </div>
              </div>

              <!-- Schedule Consultation Button -->
              <button class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-4">
                Schedule Consultation
              </button>
              
              <!-- Social Links -->
              <div class="flex space-x-4">
                <a href="#" class="text-gray-400 hover:text-blue-600">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" class="text-gray-400 hover:text-blue-600">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" class="text-gray-400 hover:text-blue-600">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" class="text-gray-400 hover:text-blue-600">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Quick Links Sidebar -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="font-bold text-lg text-gray-900 mb-4">Quick Links</h3>
            <ul class="space-y-3">
              <li>
                <router-link to="/about-us" class="flex items-center text-gray-700 hover:text-blue-600">
                  <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About Us
                </router-link>
              </li>
              <li>
                <router-link to="/principal-partner" class="flex items-center text-blue-600 font-semibold">
                  <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Principal Partner
                </router-link>
              </li>
              <li>
                <router-link to="/team" class="flex items-center text-gray-700 hover:text-blue-600">
                  <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0A9 9 0 008.965 3.525m12 0A9 9 0 003.035 12.525" />
                  </svg>
                  Our Team
                </router-link>
              </li>
              <li>
                <router-link to="/properties" class="flex items-center text-gray-700 hover:text-blue-600">
                  <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  All Properties
                </router-link>
              </li>
              <li>
                <router-link to="/ongoing-projects" class="flex items-center text-gray-700 hover:text-blue-600">
                  <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ongoing Projects
                </router-link>
              </li>
              <li>
                <router-link to="/faq" class="flex items-center text-gray-700 hover:text-blue-600">
                  <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  FAQ
                </router-link>
              </li>
              <li>
                <router-link to="/contact-us" class="flex items-center text-gray-700 hover:text-blue-600">
                  <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Us
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <!-- Right Column: Biography & Details -->
        <div class="lg:col-span-2">
          <!-- Mission Statement -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 mb-8">
            <blockquote class="text-2xl font-light italic mb-4">
              "Our commitment is to deliver accurate, reliable, and professional property valuation services that empower our clients to make informed real estate decisions."
            </blockquote>
            <p class="font-semibold">— Kayode Segun, Principal Partner</p>
          </div>

          <!-- Biography Section -->
          <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Professional Biography</h2>
            
            <div class="prose max-w-none text-gray-700">
              <p class="mb-6 text-lg">
                Kayode Segun is a distinguished professional in the Nigerian real estate sector with over <strong>15 years of experience</strong> in property valuation, real estate consultancy, and asset management. As the Principal Partner of Kayode Segun & Associates, he leads a team of certified valuers dedicated to providing exceptional valuation services across residential, commercial, and industrial properties.
              </p>

              <h3 class="text-xl font-bold text-gray-900 mb-4 mt-8">Professional Journey</h3>
              <p class="mb-6">
                Kayode began his career in 2008 as a junior valuer at a leading property consultancy firm in Lagos. His expertise and dedication saw him rise through the ranks, culminating in the establishment of Kayode Segun & Associates in 2015. Under his leadership, the firm has grown to become one of the most respected valuation practices in Southwest Nigeria.
              </p>

              <h3 class="text-xl font-bold text-gray-900 mb-4">Areas of Expertise</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Residential Property Valuation</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Commercial Real Estate Appraisal</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Mortgage Valuation</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Rental Valuation</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Compensation & Compulsory Acquisition</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Feasibility & Viability Studies</span>
                </div>
              </div>

              <h3 class="text-xl font-bold text-gray-900 mb-4">Education & Certifications</h3>
              <ul class="list-disc pl-5 mb-8 space-y-2">
                <li>Bachelor of Science in Estate Management - University of Lagos (First Class Honors)</li>
                <li>Master of Science in Real Estate - University College London</li>
                <li>Fellow, Nigerian Institution of Estate Surveyors and Valuers (FNIVS)</li>
                <li>Registered Estate Surveyor and Valuer - Estate Surveyors and Valuers Registration Board of Nigeria</li>
                <li>Certified International Property Specialist (CIPS)</li>
                <li>Member, Royal Institution of Chartered Surveyors (MRICS)</li>
              </ul>

              <h3 class="text-xl font-bold text-gray-900 mb-4">Notable Projects & Achievements</h3>
              <div class="space-y-4">
                <div class="border-l-4 border-blue-500 pl-4 py-2">
                  <p class="font-semibold">Valuation of Commercial Complex, Victoria Island</p>
                  <p class="text-gray-600">Led valuation team for a 15-story commercial building worth ₦8.5 billion</p>
                </div>
                <div class="border-l-4 border-blue-500 pl-4 py-2">
                  <p class="font-semibold">Residential Estate Development, Lekki Phase 1</p>
                  <p class="text-gray-600">Provided comprehensive valuation services for 50-unit luxury estate development</p>
                </div>
                <div class="border-l-4 border-blue-500 pl-4 py-2">
                  <p class="font-semibold">Government Compensation Valuation</p>
                  <p class="text-gray-600">Served as lead valuer for Lagos State Government road expansion project</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Call to Action -->
          <div class="bg-white rounded-xl shadow-lg p-8 text-center">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Ready to Discuss Your Property Needs?</h3>
            <p class="text-gray-600 mb-6">Schedule a consultation with our Principal Partner for expert valuation advice.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Book Consultation
              </button>
              <router-link to="/contact-us" class="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                Contact Our Team
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import ErrorBoundary from '../components/global/ErrorBoundary.vue'
import { useSEO } from '../hooks/useSEO'
useSEO({
  title: 'Principal Partner',
  description: 'Meet our principal partner and learn about their vision and leadership.'
})
// No additional script needed for this component
</script>

<style scoped>
/* Custom styles for the page */
.prose {
  line-height: 1.75;
}

.prose p {
  margin-bottom: 1.5em;
}

.prose ul {
  margin-bottom: 1.5em;
}

/* Smooth transitions */
button, a {
  transition: all 0.2s ease-in-out;
}

/* Hover effects for cards */
.bg-white {
  transition: transform 0.2s ease-in-out;
}

.bg-white:hover {
  transform: translateY(-2px);
}
</style>