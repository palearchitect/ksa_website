<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100/90 text-slate-900">
      <!-- Hero Section -->
      <div class="relative bg-gradient-to-b from-[#030810] via-[#071328] to-[#0a1835] text-white pt-28 md:pt-36 pb-16 overflow-hidden border-b border-white/10">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.25),rgba(249,104,22,0.1)_50%,transparent_80%)] pointer-events-none"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            Practice Leadership & Associates
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
            Our Chartered <span class="text-gradient-brand">Professionals</span>
          </h1>
          <p class="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            A dedicated team of certified surveyors, registered valuers, and real estate advisors delivering audit-grade property appraisals and asset management across Nigeria.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <router-link
              to="/contact-us"
              class="pill-button-primary px-7 py-3 text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-orange-500/30"
            >
              Consult With Our Valuers
            </router-link>
            <router-link
              to="/principal-partner"
              class="inline-flex items-center justify-center px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300"
            >
              Principal Partner Profile →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Auth Status Banner (Admins/staff only) -->
      <div v-if="authStore.isAuthenticated && ['admin', 'webadmin'].includes(authStore.user?.role)" class="bg-blue-50 border-b border-blue-200/80 py-2.5 px-4 text-center">
        <p class="text-xs text-blue-800">
          Logged in as <strong>{{ authStore.user?.name }}</strong>.
          <router-link to="/dashboard/admin/team" class="ml-2 font-bold underline text-blue-700 hover:text-blue-900">Manage Team Directory →</router-link>
        </p>
      </div>

      <!-- Team Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <!-- Section Header -->
        <div class="text-center mb-14">
          <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest-swiss uppercase text-blue-700 bg-blue-500/10 border border-blue-500/20 mb-3">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Professional Directory
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Leadership & Senior Surveyors
          </h2>
          <p class="text-sm md:text-base text-slate-500 max-w-2xl mx-auto mt-2">
            Multi-disciplinary practitioners adhering to strict NIESV and ESVARBON regulatory governance.
          </p>
        </div>

        <!-- Team Grid (Bento Style) -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Dynamic Team Member Cards -->
          <div 
            v-for="member in teamStore.teamMembers" 
            :key="member.id"
            class="bento-card bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div class="flex items-center gap-4 mb-6">
                <div class="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-100 flex-shrink-0 shadow-sm">
                  <img 
                    :src="getImageUrl(member.image)"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    @error="handleImageError"
                    :alt="member.name"
                  >
                </div>
                <div>
                  <h3 class="text-lg font-extrabold text-slate-900 tracking-tight">{{ member.name }}</h3>
                  <p class="text-xs font-bold text-blue-700 mt-0.5">{{ member.role }}</p>
                  <div v-if="member.tag" class="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200/60">
                    {{ member.tag }}
                  </div>
                </div>
              </div>

              <p class="text-slate-600 text-xs md:text-sm leading-relaxed mb-6 line-clamp-4">
                {{ member.description }}
              </p>
            </div>

            <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
              <a 
                :href="`mailto:${member.email}`" 
                class="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors gap-2"
              >
                <div class="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span class="truncate max-w-[180px]">{{ member.email }}</span>
              </a>
              <span class="text-slate-300">→</span>
            </div>
          </div>

          <!-- Join Our Team Card (Bento Master Tile) -->
          <div class="bento-card-dark rounded-3xl p-8 shadow-2xl flex flex-col justify-between text-center relative overflow-hidden">
            <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div>
              <div class="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-orange-400 mx-auto mb-6 shadow-sm">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 class="text-2xl font-extrabold text-white mb-3 tracking-tight">Join Our Practice</h3>
              <p class="text-slate-300 text-xs md:text-sm leading-relaxed mb-6">
                Are you a chartered surveyor, registered valuer, or GIS analyst looking to build institutional mastery? Explore career opportunities at KSA Valuers.
              </p>
            </div>

            <div class="pt-6 border-t border-white/10">
              <router-link
                to="/contact-us"
                class="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold uppercase tracking-wider shadow-glow-orange transition inline-block text-center"
              >
                Submit Professional CV
              </router-link>
            </div>
          </div>
        </div>

        <!-- Expertise Section -->
        <div class="mt-20 pt-16 border-t border-slate-200">
          <div class="text-center mb-14">
            <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest-swiss uppercase text-orange-600 bg-orange-500/10 border border-orange-500/20 mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              Core Disciplines
            </span>
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Practice Competencies</h2>
            <p class="text-sm text-slate-500 max-w-2xl mx-auto mt-2">
              Our valuation directors and senior associates specialize in four integrated service verticals.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bento-card p-6 bg-white border border-slate-200/90 shadow-md flex flex-col justify-between">
              <div>
                <div class="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-base font-bold text-slate-900 mb-2">Statutory Valuation</h3>
                <p class="text-xs text-slate-500 leading-relaxed">Mortgage collateral, balance-sheet valuation, probate, and compulsory acquisition appraisals.</p>
              </div>
            </div>

            <div class="bento-card p-6 bg-white border border-slate-200/90 shadow-md flex flex-col justify-between">
              <div>
                <div class="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 class="text-base font-bold text-slate-900 mb-2">Asset Management</h3>
                <p class="text-xs text-slate-500 leading-relaxed">Automated lease collections, tenant vetting, and facilities upkeep for commercial and residential schemes.</p>
              </div>
            </div>

            <div class="bento-card p-6 bg-white border border-slate-200/90 shadow-md flex flex-col justify-between">
              <div>
                <div class="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-base font-bold text-slate-900 mb-2">Project Feasibility</h3>
                <p class="text-xs text-slate-500 leading-relaxed">Comprehensive development appraisal, cash flow sensitivity modeling, and site monitoring.</p>
              </div>
            </div>

            <div class="bento-card p-6 bg-white border border-slate-200/90 shadow-md flex flex-col justify-between">
              <div>
                <div class="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 class="text-base font-bold text-slate-900 mb-2">Capital Advisory</h3>
                <p class="text-xs text-slate-500 leading-relaxed">Institutional acquisition, disposal structuring, and portfolio rationalization across Nigeria.</p>
              </div>
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
  title: 'Our Team | KSA Valuers',
  description: 'Meet the chartered estate surveyors and valuation professionals at KSA Valuers.'
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
</style>