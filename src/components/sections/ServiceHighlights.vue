<template>
  <section class="py-20 md:py-28 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100/90 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest-swiss uppercase text-blue-700 bg-blue-500/10 border border-blue-500/20 mb-3">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          Core Capabilities
        </span>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Comprehensive Real Estate <span class="text-gradient-brand">Solutions</span>
        </h2>
        <p class="mt-4 text-base md:text-lg text-slate-600 leading-relaxed font-normal">
          Delivering rigorous valuation integrity, strategic brokerage, and technology-driven property management tailored to institutional and private investors.
        </p>
      </div>

      <!-- Services Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Service Card 1: Valuation -->
        <div class="bento-card p-8 flex flex-col justify-between group hover:border-blue-500/40">
          <div>
            <div class="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-700 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-2 block">Statutory & Commercial</span>
            <h3 class="text-lg font-bold text-slate-900 mb-2.5 tracking-tight group-hover:text-blue-600 transition">
              Property Valuation
            </h3>
            <p class="text-slate-600 text-xs md:text-sm leading-relaxed">
              Mortgage security, balance sheet, probate, and compulsory acquisition appraisals under NIESV/ESVARBON guidelines.
            </p>
          </div>
          <div class="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-blue-600">
            <span>Request Appraisal</span>
            <span>→</span>
          </div>
        </div>

        <!-- Service Card 2: Sales & Lettings -->
        <div class="bento-card p-8 flex flex-col justify-between group hover:border-orange-500/40">
          <div>
            <div class="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-2 block">Brokerage Advisory</span>
            <h3 class="text-lg font-bold text-slate-900 mb-2.5 tracking-tight group-hover:text-orange-600 transition">
              Sales & Lettings
            </h3>
            <p class="text-slate-600 text-xs md:text-sm leading-relaxed">
              Targeted marketing, qualified buyer matching, and closing facilitation for premium residential and commercial holdings.
            </p>
          </div>
          <div class="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-orange-600">
            <span>Explore Listings</span>
            <span>→</span>
          </div>
        </div>

        <!-- Service Card 3: Feasibility Appraisal -->
        <div class="bento-card p-8 flex flex-col justify-between group hover:border-blue-500/40">
          <div>
            <div class="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-800 mb-6 group-hover:scale-110 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-700 mb-2 block">Investment Analytics</span>
            <h3 class="text-lg font-bold text-slate-900 mb-2.5 tracking-tight group-hover:text-blue-600 transition">
              Feasibility Appraisal
            </h3>
            <p class="text-slate-600 text-xs md:text-sm leading-relaxed">
              In-depth financial viability modeling, sensitivity testing, and development yield forecasts for capital investors.
            </p>
          </div>
          <div class="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-blue-600">
            <span>View Case Studies</span>
            <span>→</span>
          </div>
        </div>

        <!-- Service Card 4: Facility Management -->
        <div class="bento-card p-8 flex flex-col justify-between group hover:border-orange-500/40">
          <div>
            <div class="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-2 block">Operations & PMS</span>
            <h3 class="text-lg font-bold text-slate-900 mb-2.5 tracking-tight group-hover:text-orange-600 transition">
              Facility Management
            </h3>
            <p class="text-slate-600 text-xs md:text-sm leading-relaxed">
              Automated rent collections, preventative maintenance scheduling, and 24/7 tenant support via our property portal.
            </p>
          </div>
          <div class="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-orange-600">
            <span>Access Portal</span>
            <span>→</span>
          </div>
        </div>
      </div>

      <!-- Quick Consultation Pill -->
      <div class="mt-14 text-center">
        <router-link
          to="/contact-us"
          class="pill-button-primary px-8 py-3 text-xs uppercase tracking-widest font-bold shadow-md hover:shadow-orange-500/30 transition-all duration-300"
        >
          Explore Full Service Catalog →
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
</style>
