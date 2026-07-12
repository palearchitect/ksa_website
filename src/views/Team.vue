<template>
  <ErrorBoundary>
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
              <router-link
                to="/admin/login"
                class="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Already a Member? Sign In
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Auth Status Banner (Admins/staff only) -->
      <div v-if="authStore.isAuthenticated && ['admin', 'webadmin'].includes(authStore.user?.role)" class="bg-blue-50 border-b border-blue-200 py-3 text-center">
        <p class="text-sm text-blue-800">
          Logged in as <strong>{{ authStore.user?.name }}</strong>.
          <router-link to="/dashboard/admin/team" class="ml-2 underline font-semibold text-blue-600 hover:text-blue-800">Go to Directory Management</router-link>
        </p>
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
          <!-- Dynamic Team Member Cards -->
          <div 
            v-for="member in teamStore.teamMembers" 
            :key="member.id"
            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between"
          >
            <div class="p-8">
              <div class="flex items-center mb-6">
                <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 flex-shrink-0">
                  <img 
                    :src="getImageUrl(member.image)"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  >
                </div>
                <div class="ml-4">
                  <h3 class="text-xl font-bold text-gray-900">{{ member.name }}</h3>
                  <p class="text-blue-600 font-semibold text-sm">{{ member.role }}</p>
                </div>
              </div>
              <div class="mb-6">
                <div v-if="member.tag" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 mb-3">
                  {{ member.tag }}
                </div>
                <p class="text-gray-600 text-sm leading-relaxed line-clamp-4">
                  {{ member.description }}
                </p>
              </div>
              <div class="border-t border-gray-100 pt-6 mt-auto">
                <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contact</h4>
                <div class="space-y-2">
                  <a :href="`mailto:${member.email}`" class="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ member.email }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Join Our Team Card (Always present at the end of the public directory) -->
          <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-center">
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
      </div>

      <!-- Expertise Section -->
      <div class="mt-20 pt-12 border-t border-gray-200">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Our Areas of Expertise</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive property solutions backed by professional expertise and industry knowledge.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Property Valuation</h3>
            <p class="text-gray-600">Accurate market valuations for residential, commercial, and industrial properties.</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Estate Management</h3>
            <p class="text-gray-600">Professional management services for residential and commercial estates.</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Cost Consulting</h3>
            <p class="text-gray-600">Construction cost analysis and budget optimization for development projects.</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
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
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTeamStore } from '@/stores/teamStore'
import { useAuthStore } from '@/stores/authStore'
import ErrorBoundary from '../components/global/ErrorBoundary.vue'
import { useSEO } from '../hooks/useSEO'

useSEO({
  title: 'Our Team',
  description: 'Meet the professionals behind KSA Valuers.'
})

const teamStore = useTeamStore()
const authStore = useAuthStore()

onMounted(() => {
  teamStore.fetchTeamMembers()
})

const getImageUrl = (image) => {
  if (!image) return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
  if (image.startsWith('http') || image.startsWith('data:')) return image
  try {
    return new URL(`../assets/images/${image}`, import.meta.url).href
  } catch {
    return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
  }
}

const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
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
</style>