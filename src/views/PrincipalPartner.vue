<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-gradient-to-b from-[#030810] via-[#071328] to-[#040914] text-white relative">
      <!-- Dedicated Dark Theme Real Estate SVG Wallpaper Layer -->
      <PatternBackgroundDark />
      <!-- Hero Header -->
      <section class="relative pt-28 md:pt-36 pb-12 overflow-hidden border-b border-white/10">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.25),rgba(249,104,22,0.1)_50%,transparent_80%)] pointer-events-none"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav class="flex mb-4" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-2 text-xs text-slate-400">
              <li>
                <router-link to="/" class="hover:text-orange-400 transition-colors">Home</router-link>
              </li>
              <li>/</li>
              <li>
                <router-link to="/about-us" class="hover:text-orange-400 transition-colors">About Us</router-link>
              </li>
              <li>/</li>
              <li class="text-slate-200 font-semibold">Principal Partner</li>
            </ol>
          </nav>
          
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            Practice Leadership
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-white mb-3">
            Principal <span class="font-serif italic font-normal text-gradient-brand">Partner</span>
          </h1>
          <p class="text-sm md:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            Directing institutional valuation standards, strategic advisory, and asset governance across Nigeria with over 13 years of regulatory excellence.
          </p>
        </div>
      </section>

      <!-- Bento Grid Layout Section -->
      <section class="py-12 md:py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Left Column: Commanding Visual Portrait & Badges (5 cols) -->
            <div class="lg:col-span-5 space-y-6">
              <!-- Dark Luxury Portrait Bento Card -->
              <div class="bento-card-dark p-6 md:p-8 bg-[#0b132b] text-white border border-slate-800 shadow-2xl relative overflow-hidden group">
                <!-- Atmospheric Backlighting Glow -->
                <div class="absolute -top-10 -left-10 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/30 transition-all duration-500"></div>
                <div class="absolute -bottom-10 -right-10 w-60 h-60 bg-orange-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/25 transition-all duration-500"></div>

                <!-- Full-Bleed Portrait Container -->
                <div class="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6 shadow-2xl border border-slate-700/60 bg-slate-900 group">
                  <img
                    src="../assets/images/KAYODE-e1712319829816-277x300.jpg"
                    alt="ESV. Kayode Segun - Principal Partner"
                    class="w-full h-full object-cover object-top filter brightness-105 contrast-110 group-hover:scale-105 transition-all duration-700"
                  />
                  <!-- Gradient fade at bottom into card base -->
                  <div class="absolute inset-0 bg-gradient-to-t from-[#0b132b] via-[#0b132b]/20 to-transparent"></div>
                  
                  <!-- Overlaid Verified Credential Badges -->
                  <div class="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/90 backdrop-blur-md text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg border border-orange-400/40">
                      <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      ANIVS, RSV, mcia
                    </span>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/90 backdrop-blur-md text-blue-200 text-[11px] font-bold uppercase tracking-wider shadow-lg border border-blue-400/30">
                      Certified Valuer & Appraiser
                    </span>
                  </div>
                </div>

                <!-- Verified Accreditations Strip -->
                <div class="space-y-3 pt-4 border-t border-slate-800">
                  <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div class="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-blue-500/30">
                      ✓
                    </div>
                    <div>
                      <p class="font-bold text-white">NIESV Member Practice</p>
                      <p class="text-[11px] text-slate-400">The Nigerian Institution of Estate Surveyors and Valuers</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div class="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-orange-500/30">
                      ✓
                    </div>
                    <div>
                      <p class="font-bold text-white">ESVARBON Licensed Valuer</p>
                      <p class="text-[11px] text-slate-400">Estate Surveyors and Valuers Registration Board (Act 1975)</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-emerald-500/30">
                      ✓
                    </div>
                    <div>
                      <p class="font-bold text-white">CIAN Certified Auctioneer</p>
                      <p class="text-[11px] text-slate-400">Certified Institute of Auctioneers of Nigeria</p>
                    </div>
                  </div>
                </div>

                <!-- Direct Action Buttons -->
                <div class="mt-6 pt-6 border-t border-slate-800 space-y-3">
                  <router-link
                    to="/book-a-tour"
                    class="pill-button-primary w-full py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider text-white shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Request Executive Consultation</span>
                    <span>→</span>
                  </router-link>
                  
                  <a
                    href="tel:+2349053901001"
                    class="w-full py-3 px-6 rounded-full font-semibold text-xs text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 bg-slate-900/60 hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Direct Desk: +234 905 390 1001
                  </a>
                </div>
              </div>
            </div>

            <!-- Right Column: Dominant Title, Bio, Mandate & Executive Stats (7 cols) -->
            <div class="lg:col-span-7 space-y-6">
              
              <!-- Dominant Name & Executive Mandate Card (#0F172A) -->
              <div class="bento-card-dark p-8 md:p-10 bg-[#0f172a] text-white border border-slate-800 shadow-2xl relative overflow-hidden">
                <div class="absolute -right-12 -top-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

                <!-- Dominant Header Block -->
                <div class="mb-8 pb-6 border-b border-slate-800">
                  <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest-swiss uppercase text-orange-400 bg-orange-500/10 border border-orange-500/20 mb-4">
                    <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Head of Practice & Lead Valuer
                  </span>
                  <h1 class="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-white mb-2">
                    ESV. Kayode Segun
                  </h1>
                  <h2 class="text-base sm:text-lg font-serif italic font-bold text-gradient-brand tracking-wide">
                    Principal Partner & Head of Practice
                  </h2>
                </div>

                <!-- Mandate Quote in High-Legibility Calligraphic & Serif Typography -->
                <div class="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-[#0a1835]/80 to-slate-900/80 border border-blue-500/20 shadow-inner">
                  <div class="text-orange-400 text-5xl font-serif leading-none mb-1">“</div>
                  <blockquote class="text-lg sm:text-xl font-serif italic font-normal leading-relaxed text-slate-100 mb-4">
                    Our core mandate is delivering rigorous, defensible valuation intelligence that empowers institutions and investors to deploy capital with unyielding confidence.
                  </blockquote>
                  <div class="flex items-center gap-3">
                    <div class="h-0.5 w-6 bg-orange-500"></div>
                    <p class="text-lg font-calligraphic text-orange-400 tracking-wide">
                      ESV. Kayode Segun • Practice Mandate
                    </p>
                  </div>
                </div>

                <!-- Quick-Hit Executive Stats Bar -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-md">
                    <div class="text-2xl sm:text-3xl font-black text-white">13+ Yrs</div>
                    <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Regulatory Excellence</div>
                  </div>
                  <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-md">
                    <div class="text-2xl sm:text-3xl font-black text-orange-400">₦50B+</div>
                    <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Portfolio Appraised</div>
                  </div>
                  <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-md">
                    <div class="text-2xl sm:text-3xl font-black text-blue-400">300+</div>
                    <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Bank & Corporate Audits</div>
                  </div>
                </div>
              </div>

              <!-- Biography Bento Tile (Dark Slate #0F172A) -->
              <div class="bento-card-dark p-8 md:p-10 bg-[#0f172a] text-white border border-slate-800 shadow-2xl">
                <div class="flex items-center gap-2 mb-4">
                  <span class="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                  <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Leadership Biography</h3>
                </div>
                <h3 class="text-2xl font-extrabold tracking-tight text-white mb-6">Thirteen Years of Industry Benchmarking</h3>
                <div class="space-y-4 text-sm text-slate-300 leading-relaxed font-normal">
                  <p>
                    <strong class="text-white">ESV. Kayode Segun</strong> is a distinguished Estate Surveyor and Registered Valuer with over thirteen (13) years of top-tier professional practice across Nigeria. As founding Principal Partner of Kayode Segun & Associates, he directs the firm's strategic valuation practice, institutional asset audits, and capital investment advisory.
                  </p>
                  <p>
                    Prior to establishing Kayode Segun & Associates, he honed his practice at renowned professional firms including <span class="text-white font-semibold">Oladipo, Awoeyo & Partners</span>, orchestrating nationwide property inspections, market feasibility studies, insurance claims evaluations, and complex mortgage collateral valuations for tier-1 financial institutions.
                  </p>
                </div>
              </div>

              <!-- Advisory Domains (Dark Slate #0F172A) -->
              <div class="bento-card-dark p-8 bg-[#0f172a] text-white border border-slate-800 shadow-2xl">
                <div class="flex items-center gap-2 mb-4">
                  <span class="w-1.5 h-4 bg-orange-500 rounded-full"></span>
                  <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Practice Competencies</h3>
                </div>
                <h3 class="text-xl font-bold tracking-tight text-white mb-6">Core Advisory Domains</h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div class="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span class="text-xs font-bold text-slate-200">Statutory Real Estate & Asset Valuation</span>
                  </div>
                  <div class="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span class="text-xs font-bold text-slate-200">Licensed Auctioneering & Asset Disposal</span>
                  </div>
                  <div class="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span class="text-xs font-bold text-slate-200">Property & Tenancy Consultancy</span>
                  </div>
                  <div class="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span class="text-xs font-bold text-slate-200">Institutional Asset & Facility Governance</span>
                  </div>
                  <div class="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 sm:col-span-2">
                    <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span class="text-xs font-bold text-slate-200">Development Viability Modeling & Sensitivity Testing</span>
                  </div>
                </div>
              </div>

              <!-- Qualifications & Training (Dark Slate #0F172A) -->
              <div class="bento-card-dark p-8 bg-[#0f172a] text-white border border-slate-800 shadow-2xl">
                <div class="flex items-center gap-2 mb-4">
                  <span class="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                  <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Academic & Executive Training</h3>
                </div>
                <h3 class="text-xl font-bold tracking-tight text-white mb-4">Professional Certifications</h3>
                <ul class="space-y-3.5 text-xs md:text-sm text-slate-300">
                  <li class="flex items-start gap-3">
                    <span class="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span>
                    <span><strong class="text-white">B.Sc. Estate Management & Valuation</strong> — University of Lagos (UNILAG).</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="w-2 h-2 rounded-full bg-orange-400 mt-1.5 flex-shrink-0"></span>
                    <span><strong class="text-white">Executive Policy, Strategy and Leadership Training</strong> — National Institute for Policy and Strategic Studies (NIPSS), Kuru, Jos.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                    <span><strong class="text-white">Certified Member</strong> — Certified Institute of Auctioneers of Nigeria (CIAN).</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import ErrorBoundary from '../components/global/ErrorBoundary.vue'
import PatternBackgroundDark from '../components/global/PatternBackgroundDark.vue'
import { useSEO } from '../hooks/useSEO'

useSEO({
  title: 'Principal Partner - ESV. Kayode Segun | KSA Valuers',
  description: 'Meet ESV. Kayode Segun, Principal Partner of Kayode Segun & Associates with over 13 years of leadership in property valuation across Nigeria.'
})
</script>

<style scoped>
</style>