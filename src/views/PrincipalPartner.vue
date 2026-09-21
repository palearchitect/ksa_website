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
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3">
            Principal <span class="text-gradient-brand">Partner</span>
          </h1>
          <p class="text-sm md:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            Directing institutional valuation standards, strategic advisory, and asset governance across Nigeria with over 13 years of regulatory excellence.
          </p>
        </div>
      </section>

      <!-- Bento Grid Layout Section -->
      <section class="py-12 md:py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <!-- Left Column: Portrait Card & Credentials (4 cols) -->
            <div class="lg:col-span-5 space-y-6">
              <!-- Portrait Tile (White Bento Card) -->
              <div class="bento-card p-6 md:p-8 bg-white text-slate-900 border border-slate-200/90 shadow-2xl relative overflow-hidden">
                <div class="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6 shadow-md border border-slate-100 bg-slate-100">
                  <img
                    src="../assets/images/KAYODE-e1712319829816-277x300.jpg"
                    alt="ESV. Kayode Segun"
                    class="w-full h-full object-cover object-top filter contrast-105"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                  <div class="absolute bottom-4 left-4 right-4 text-white">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-white text-[11px] font-bold uppercase tracking-wider shadow">
                      ANIVS, RSV, mcia
                    </span>
                  </div>
                </div>

                <div class="text-left mb-6">
                  <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">ESV. Kayode Segun</h2>
                  <p class="text-sm font-semibold text-blue-700 mt-0.5">Principal Partner & Head of Practice</p>
                  <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                    Registered Estate Surveyor & Valuer with extensive experience in statutory valuation, bank securities, and asset auditing.
                  </p>
                </div>

                <!-- Accreditation Badges -->
                <div class="space-y-2.5 pt-4 border-t border-slate-100">
                  <div class="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </div>
                    <div>
                      <p class="font-bold text-slate-800">NIESV Member</p>
                      <p class="text-[11px] text-slate-500">The Nigerian Institution of Estate Surveyors and Valuers</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div class="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </div>
                    <div>
                      <p class="font-bold text-slate-800">ESVARBON Registered</p>
                      <p class="text-[11px] text-slate-500">Estate Surveyors and Valuers Registration Board</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </div>
                    <div>
                      <p class="font-bold text-slate-800">CIAN Certified</p>
                      <p class="text-[11px] text-slate-500">Certified Institute of Auctioneers of Nigeria</p>
                    </div>
                  </div>
                </div>

                <!-- Direct Action Buttons -->
                <div class="mt-6 pt-6 border-t border-slate-100 space-y-2">
                  <router-link
                    to="/book-a-tour"
                    class="w-full py-3 px-4 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-blue-700 via-blue-600 to-orange-500 hover:from-blue-800 hover:to-orange-600 shadow-glow-orange transition-all flex items-center justify-center gap-2"
                  >
                    <span>Request Executive Consultation</span>
                    <span>→</span>
                  </router-link>
                  
                  <a
                    href="tel:+2349053901001"
                    class="w-full py-2.5 px-4 rounded-full font-semibold text-xs text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/40 transition-all flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Direct Line: +234 905 390 1001
                  </a>
                </div>
              </div>
            </div>

            <!-- Right Column: Bento Cards (7 cols) -->
            <div class="lg:col-span-7 space-y-6">
              
              <!-- Quote Bento Card -->
              <div class="bento-card p-8 md:p-10 bg-gradient-to-br from-blue-900 via-[#0b1e42] to-slate-900 border border-white/15 text-white relative overflow-hidden shadow-xl">
                <div class="absolute -right-8 -bottom-8 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div class="text-orange-400 text-5xl font-serif font-black leading-none mb-3">“</div>
                <blockquote class="text-lg md:text-xl font-light italic leading-relaxed text-slate-100 mb-6">
                  Our core mandate is delivering rigorous, defensible valuation intelligence that empowers institutions and investors to deploy capital with unyielding confidence.
                </blockquote>
                <div class="flex items-center gap-3">
                  <div class="h-0.5 w-8 bg-orange-500"></div>
                  <p class="text-xs uppercase tracking-widest font-bold text-slate-300">
                    ESV. Kayode Segun • Principal Partner
                  </p>
                </div>
              </div>

              <!-- Biography Bento Tile (White) -->
              <div class="bento-card p-8 md:p-10 bg-white text-slate-900 border border-slate-200/90 shadow-xl">
                <div class="flex items-center gap-2 mb-4">
                  <span class="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                  <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Leadership Profile</h3>
                </div>
                <h2 class="text-2xl font-extrabold tracking-tight text-slate-900 mb-6">Thirteen Years of Industry Benchmarking</h2>
                <div class="space-y-4 text-sm text-slate-600 leading-relaxed font-normal">
                  <p>
                    <strong class="text-slate-900">ESV. Kayode Segun</strong> is an established Estate Surveyor and Registered Valuer with over thirteen (13) years of top-tier professional practice across Nigeria. As the founding Principal Partner of Kayode Segun & Associates, he oversees the firm's strategic valuation advisory, high-stakes asset auditing, and portfolio asset management.
                  </p>
                  <p>
                    Prior to launching Kayode Segun & Associates, he honed his practice at renowned professional firms including <span class="text-slate-900 font-medium">Oladipo, Awoeyo & Partners</span>, orchestrating nationwide property inspections, market analyses, insurance claims evaluations, and complex mortgage collateral valuations for institutional tier-1 lenders.
                  </p>
                </div>
              </div>

              <!-- Metrics Mini-Bento Row -->
              <div class="grid grid-cols-3 gap-4">
                <div class="bento-card p-5 bg-white text-slate-900 border border-slate-200/80 shadow-sm text-center">
                  <div class="text-2xl md:text-3xl font-extrabold text-blue-900">13+</div>
                  <div class="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Years Practice</div>
                </div>
                <div class="bento-card p-5 bg-white text-slate-900 border border-slate-200/80 shadow-sm text-center">
                  <div class="text-2xl md:text-3xl font-extrabold text-orange-600">₦50B+</div>
                  <div class="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Portfolio Valued</div>
                </div>
                <div class="bento-card p-5 bg-white text-slate-900 border border-slate-200/80 shadow-sm text-center">
                  <div class="text-2xl md:text-3xl font-extrabold text-slate-900">100%</div>
                  <div class="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Regulatory Score</div>
                </div>
              </div>

              <!-- Areas of Expertise (Bento White Card) -->
              <div class="bento-card p-8 bg-white text-slate-900 border border-slate-200/90 shadow-xl">
                <div class="flex items-center gap-2 mb-4">
                  <span class="w-1.5 h-4 bg-orange-500 rounded-full"></span>
                  <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Advisory Domains</h3>
                </div>
                <h3 class="text-xl font-bold tracking-tight text-slate-900 mb-6">Core Competencies</h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span class="text-xs font-bold text-slate-800">Real Estate & Asset Valuation</span>
                  </div>
                  <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span class="text-xs font-bold text-slate-800">Licensed Auctioneering</span>
                  </div>
                  <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span class="text-xs font-bold text-slate-800">Property & Tenancy Consultancy</span>
                  </div>
                  <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span class="text-xs font-bold text-slate-800">Institutional Asset Management</span>
                  </div>
                  <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                    <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span class="text-xs font-bold text-slate-800">Project Viability & Investment Advisory</span>
                  </div>
                </div>
              </div>

              <!-- Education & Training (Bento Tile) -->
              <div class="bento-card p-8 bg-white text-slate-900 border border-slate-200/90 shadow-xl">
                <div class="flex items-center gap-2 mb-4">
                  <span class="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                  <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Academic & Executive</h3>
                </div>
                <h3 class="text-xl font-bold tracking-tight text-slate-900 mb-4">Qualifications & Training</h3>
                <ul class="space-y-3 text-xs md:text-sm text-slate-600">
                  <li class="flex items-start gap-3">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span><strong class="text-slate-900">B.Sc. Estate Management & Valuation</strong> — University of Lagos (UNILAG).</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></span>
                    <span><strong class="text-slate-900">Executive Policy, Strategy and Leadership Training</strong> — National Institute for Policy and Strategic Studies (NIPSS), Kuru, Jos.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span><strong class="text-slate-900">Certified Member</strong> — Certified Institute of Auctioneers of Nigeria (CIAN).</span>
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