<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-blue-900 to-blue-800">
      <div class="absolute inset-0 bg-black/30"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Meet Our Team of Professionals
          </h1>
          <p class="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            At Kayode Segun & Associates (KSA Valuers), we serve as the trusted interface between property owners and tenants, ensuring lease renewals at market rates and compliance with tenancy agreements through expert property management and valuation services.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/contact-us"
              class="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Join Our Team
            </router-link>
            <button
              @click="showAuthModal = true"
              class="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Already a Member? Sign In
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Our Leadership & Expert Team
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          A dedicated team of certified professionals committed to delivering exceptional property valuation and management services across Nigeria.
        </p>
      </div>

      <!-- Team Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Team Member 1 -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="p-8">
            <div class="flex items-center mb-6">
              <div class="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white text-2xl font-bold mr-4">
                MA
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">ESV. Markson Ajiboye</h3>
                <p class="text-blue-600 font-medium">Head Business Unit</p>
              </div>
            </div>
            <div class="mb-6">
              <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-3">
                Certified Estate Surveyor & Valuer
              </div>
              <p class="text-gray-600">
                With extensive experience in real estate, Markson leads our agency and sales division. His expertise ensures optimal property valuations and successful client transactions across major Nigerian markets.
              </p>
            </div>
            <div class="border-t border-gray-100 pt-6">
              <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact</h4>
              <div class="space-y-2">
                <a href="tel:+2349053898636" class="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                  <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +234 905 389 8636
                </a>
                <a href="mailto:info@ksavaluers.com" class="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                  <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@ksavaluers.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Member 2 -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="p-8">
            <div class="flex items-center mb-6">
              <div class="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center text-white text-2xl font-bold mr-4">
                EK
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Eniola Abiola Kayode</h3>
                <p class="text-purple-600 font-medium">Human Resource Manager</p>
              </div>
            </div>
            <div class="mb-6">
              <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mb-3">
                HR Specialist
              </div>
              <p class="text-gray-600">
                A dynamic HR professional skilled in recruitment, employee relations, training, and development. Eniola ensures our team maintains the highest standards of professionalism and client service.
              </p>
            </div>
            <div class="border-t border-gray-100 pt-6">
              <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact</h4>
              <div class="space-y-2">
                <a href="mailto:info@ksavaluers.com" class="flex items-center text-gray-700 hover:text-purple-600 transition-colors">
                  <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@ksavaluers.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Member 3 -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="p-8">
            <div class="flex items-center mb-6">
              <div class="w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center text-white text-2xl font-bold mr-4">
                AA
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Akinyele Abiodun</h3>
                <p class="text-green-600 font-medium">Head, Estate Management & Valuation</p>
                <p class="text-sm text-gray-500">HND, Estate Management</p>
              </div>
            </div>
            <div class="mb-6">
              <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-3">
                Estate Surveyor
              </div>
              <p class="text-gray-600">
                A seasoned estate surveyor with strong problem-solving and communication skills. Akinyele specializes in property valuation, estate management, and ensuring compliance with regulatory standards.
              </p>
            </div>
            <div class="border-t border-gray-100 pt-6">
              <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact</h4>
              <div class="space-y-2">
                <a href="tel:+2349053901001" class="flex items-center text-gray-700 hover:text-green-600 transition-colors">
                  <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +234 905 390 1001
                </a>
                <a href="mailto:abiodun@ksavaluers.com" class="flex items-center text-gray-700 hover:text-green-600 transition-colors">
                  <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  abiodun@ksavaluers.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Member 4 -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="p-8">
            <div class="flex items-center mb-6">
              <div class="w-20 h-20 rounded-full bg-gradient-to-r from-orange-600 to-orange-700 flex items-center justify-center text-white text-2xl font-bold mr-4">
                OI
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Olaoluwa Isaac Ojewumi</h3>
                <p class="text-orange-600 font-medium">Head, Sales Department</p>
                <p class="text-sm text-gray-500">BSc, Estate Management</p>
              </div>
            </div>
            <div class="mb-6">
              <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-3">
                Sales & Agency Expert
              </div>
              <p class="text-gray-600">
                Experienced in real estate sales and agency leadership. Olaoluwa drives our sales initiatives with strategic market insights and exceptional client relationship management.
              </p>
            </div>
            <div class="border-t border-gray-100 pt-6">
              <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact</h4>
              <div class="space-y-2">
                <a href="tel:+2349053901802" class="flex items-center text-gray-700 hover:text-orange-600 transition-colors">
                  <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +234 905 390 1802
                </a>
                <a href="mailto:isaac@ksavaluers.com" class="flex items-center text-gray-700 hover:text-orange-600 transition-colors">
                  <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  isaac@ksavaluers.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Member 5 -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="p-8">
            <div class="flex items-center mb-6">
              <div class="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white text-2xl font-bold mr-4">
                AB
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Akinyele Bola</h3>
                <p class="text-red-600 font-medium">Construction Cost Consultant</p>
              </div>
            </div>
            <div class="mb-6">
              <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 mb-3">
                Cost Analysis Specialist
              </div>
              <p class="text-gray-600">
                Specialist in construction cost analysis and project budgeting. Bola ensures accurate cost estimations and value optimization for all construction and development projects.
              </p>
            </div>
            <div class="border-t border-gray-100 pt-6">
              <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact</h4>
              <div class="space-y-2">
                <a href="mailto:info@ksavaluers.com" class="flex items-center text-gray-700 hover:text-red-600 transition-colors">
                  <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@ksavaluers.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Join Our Team Card -->
        <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg overflow-hidden">
          <div class="p-8 h-full flex flex-col justify-center items-center text-center">
            <div class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-6">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Join Our Team</h3>
            <p class="text-blue-100 mb-8">
              Looking to build a career in property valuation and real estate management? We're always seeking talented professionals to join our growing team.
            </p>
            <router-link
              to="/contact-us"
              class="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Apply Now
            </router-link>
          </div>
        </div>
      </div>

      <!-- Expertise Section -->
      <div class="mt-20 pt-12 border-t border-gray-200">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Our Areas of Expertise</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive property solutions backed by professional expertise and industry knowledge.
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Property Valuation</h3>
            <p class="text-gray-600">Accurate market valuations for residential, commercial, and industrial properties.</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Estate Management</h3>
            <p class="text-gray-600">Professional management services for residential and commercial estates.</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Cost Consulting</h3>
            <p class="text-gray-600">Construction cost analysis and budget optimization for development projects.</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Agency & Sales</h3>
            <p class="text-gray-600">Professional property sales and leasing agency services with market expertise.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gradient-to-r from-blue-900 to-blue-800 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-white mb-6">Ready to Work With Professionals?</h2>
          <p class="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Connect with our team for expert property valuation, management, and consultancy services.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/contact-us"
              class="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Contact Our Team
            </router-link>
            <a
              href="tel:+2349053901001"
              class="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Now: +234 905 390 1001
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Authentication Modal -->
    <div v-if="showAuthModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="showAuthModal = false"></div>
      <div class="relative min-h-screen flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div class="p-8">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-2xl font-bold text-gray-900">Team Member Access</h3>
              <button 
                @click="showAuthModal = false"
                class="text-gray-500 hover:text-gray-700"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-6">
              <!-- Login Form -->
              <div v-if="authMode === 'login'">
                <div class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    v-model="loginForm.email"
                    type="email"
                    placeholder="team.member@ksavaluers.com"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input 
                    v-model="loginForm.password"
                    type="password"
                    placeholder="Enter your password"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button 
                  @click="handleLogin"
                  class="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 mb-4"
                >
                  Sign In to Dashboard
                </button>
                <p class="text-center text-sm text-gray-600">
                  Don't have an account? 
                  <button @click="authMode = 'signup'" class="text-blue-600 hover:text-blue-800 font-medium">
                    Request Access
                  </button>
                </p>
              </div>

              <!-- Signup Form -->
              <div v-if="authMode === 'signup'">
                <div class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    v-model="signupForm.name"
                    type="text"
                    placeholder="John Doe"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    v-model="signupForm.email"
                    type="email"
                    placeholder="john.doe@ksavaluers.com"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select 
                    v-model="signupForm.department"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="valuation">Valuation</option>
                    <option value="management">Estate Management</option>
                    <option value="sales">Sales & Agency</option>
                    <option value="hr">Human Resources</option>
                    <option value="consulting">Cost Consulting</option>
                  </select>
                </div>
                <button 
                  @click="handleSignup"
                  class="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 mb-4"
                >
                  Request Team Access
                </button>
                <p class="text-center text-sm text-gray-600">
                  Already have an account? 
                  <button @click="authMode = 'login'" class="text-blue-600 hover:text-blue-800 font-medium">
                    Sign In
                  </button>
                </p>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-gray-200">
              <p class="text-xs text-gray-500 text-center">
                Team member access is restricted to KSA Valuers employees and authorized partners.
                <br>
                Contact HR for access requests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const showAuthModal = ref(false)
const authMode = ref('login') // 'login' or 'signup'

// Forms
const loginForm = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  name: '',
  email: '',
  department: ''
})

// Methods
const handleLogin = () => {
  // For demo purposes - redirect to admin dashboard
  // In production, this would validate credentials
  router.push('/admin')
  showAuthModal.value = false
}

const handleSignup = () => {
  // In production, this would send an access request
  alert(`Access request sent for ${signupForm.value.name}. HR will contact you shortly.`)
  showAuthModal.value = false
  
  // Reset form
  signupForm.value = {
    name: '',
    email: '',
    department: ''
  }
}
</script>

<style scoped>
/* Smooth transitions */
* {
  transition: background-color 0.2s, border-color 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
}

/* Card hover effects */
.bg-white:hover {
  transform: translateY(-4px);
}

/* Gradient text for emphasis */
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Modal animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>