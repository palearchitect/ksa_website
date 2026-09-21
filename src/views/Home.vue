<template>
  <div>
    <!-- Hero Banner Section -->
    <HeroBanner />

    <!-- Featured Properties Carousel Section -->
    <FeaturedPropertiesCarousel />

    <!-- Service Highlights Section -->
    <ServiceHighlights />

    <!-- Additional Info Section - Swiss Bento Architecture -->
    <section class="py-20 md:py-28 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100/90 relative overflow-hidden">
      <!-- Ambient background mesh gradients -->
      <div class="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-10 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest-swiss uppercase text-orange-600 bg-orange-500/10 border border-orange-500/20 mb-3">
            <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            The KSA Standard
          </span>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Why Discerning Clients <br class="hidden sm:inline" />
            <span class="text-gradient-brand">Choose KSA Valuers</span>
          </h2>
          <p class="mt-4 text-base md:text-lg text-slate-600 font-normal leading-relaxed">
            Institutional-grade property advisory, chartered valuation rigor, and state-of-the-art property management tailored for investors across West Africa.
          </p>
        </div>

        <!-- Asymmetrical Swiss Bento Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          
          <!-- Bento Tile 1: Precision Leadership (Large 2-col span) -->
          <div class="md:col-span-2 bento-card p-8 md:p-10 relative overflow-hidden group flex flex-col justify-between">
            <div class="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-500 pointer-events-none"></div>
            
            <div>
              <div class="flex items-center justify-between mb-6">
                <div class="w-12 h-12 rounded-2xl bg-blue-900/10 border border-blue-900/15 flex items-center justify-center text-blue-700">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                  Chartered & Certified
                </span>
              </div>
              <h3 class="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                Institutional-Grade Valuation Expertise
              </h3>
              <p class="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl">
                Led by chartered estate surveyors and registered valuers, our practice adheres strictly to NIESV and ESVARBON regulatory standards, delivering audit-proof appraisals trusted by major financial institutions.
              </p>
            </div>

            <!-- Bento Card Metric Strip -->
            <div class="grid grid-cols-3 gap-4 pt-8 mt-6 border-t border-slate-100">
              <div>
                <div class="text-xl md:text-2xl font-extrabold text-slate-900">₦50B+</div>
                <div class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mt-0.5">Assets Appraised</div>
              </div>
              <div>
                <div class="text-xl md:text-2xl font-extrabold text-slate-900">99.8%</div>
                <div class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mt-0.5">Audit Acceptance</div>
              </div>
              <div>
                <div class="text-xl md:text-2xl font-extrabold text-orange-600">15+ Yrs</div>
                <div class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mt-0.5">Domain Mastery</div>
              </div>
            </div>
          </div>

          <!-- Bento Tile 2: Fast & Reliable (1-col span) -->
          <div class="bento-card p-8 relative overflow-hidden group flex flex-col justify-between">
            <div class="absolute -right-8 -top-8 w-40 h-40 bg-orange-500/5 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <div class="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 mb-6">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-2.5 tracking-tight">
                Rapid Turnaround
              </h3>
              <p class="text-slate-600 text-sm leading-relaxed">
                Streamlined inspection protocols and automated comparative analysis enable comprehensive draft valuation delivery within 48–72 hours.
              </p>
            </div>

            <div class="pt-6 mt-4">
              <span class="inline-flex items-center text-xs font-bold text-orange-600 group-hover:text-orange-700 transition">
                Express Appraisal Options →
              </span>
            </div>
          </div>

          <!-- Bento Tile 3: Secure & Confidential (1-col span) -->
          <div class="bento-card p-8 relative overflow-hidden group flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-slate-900/10 border border-slate-900/15 flex items-center justify-center text-slate-800 mb-6">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-2.5 tracking-tight">
                Bank-Grade Confidentiality
              </h3>
              <p class="text-slate-600 text-sm leading-relaxed">
                Your portfolio metrics and property intelligence are governed under rigorous NDA commitments with cryptographic data storage.
              </p>
            </div>

            <div class="pt-6 mt-4">
              <span class="inline-flex items-center text-xs font-bold text-slate-700 group-hover:text-slate-900 transition">
                Secure Client Portal Access →
              </span>
            </div>
          </div>

          <!-- Bento Tile 4: Holistic Asset Management (Large 2-col span) -->
          <div class="md:col-span-2 bento-card p-8 md:p-10 relative overflow-hidden group flex flex-col justify-between">
            <div class="absolute -left-10 -bottom-10 w-60 h-60 bg-orange-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div class="flex items-center justify-between mb-6">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-900/20 to-orange-500/20 border border-white/40 flex items-center justify-center text-blue-900">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span class="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200/60">
                  End-to-End Solutions
                </span>
              </div>
              <h3 class="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                Full-Lifecycle Real Estate Management
              </h3>
              <p class="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl">
                From project feasibility and continuous development monitoring to tenant onboarding, automated lease collections, and facilities maintenance.
              </p>
            </div>

            <div class="flex flex-wrap gap-2 pt-6 mt-4">
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Residential Valuations</span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Commercial Portfolios</span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Development Monitoring</span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">PMS Automation</span>
            </div>
          </div>

        </div>

        <!-- Modern Bento CTA Card with Balanced Palette -->
        <div class="bento-card-dark p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <!-- Ambient Glow Orbs -->
          <div class="absolute -top-24 -left-24 w-80 h-80 bg-blue-600/25 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -right-24 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 max-w-2xl mx-auto">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest-swiss uppercase text-orange-400 bg-orange-500/10 border border-orange-500/20 mb-4">
              Connect With Chartered Appraisers
            </span>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Ready to Maximize Your Real Estate Value?
            </h2>
            <p class="text-slate-300 text-base md:text-lg mb-8 font-normal leading-relaxed">
              Schedule an executive consultation or book a site inspection with our senior valuation partners today.
            </p>
            
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
              <router-link
                to="/contact-us"
                class="pill-button-primary px-8 py-3.5 text-xs uppercase tracking-widest font-bold shadow-lg hover:shadow-orange-500/30 transition-all duration-300 w-full sm:w-auto"
              >
                Inquire With Valuers
              </router-link>
              <router-link
                to="/book-a-tour"
                class="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold text-white border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300 w-full sm:w-auto"
              >
                Book Inspection Tour
              </router-link>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import HeroBanner from '@/components/sections/HeroBanner.vue'
import FeaturedPropertiesCarousel from '@/components/sections/FeaturedPropertiesCarousel.vue'
import ServiceHighlights from '@/components/sections/ServiceHighlights.vue'
</script>

<style scoped>
</style>
