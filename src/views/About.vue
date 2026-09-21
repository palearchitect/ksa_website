<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-transparent text-slate-900">
      <!-- Hero Section -->
      <section class="relative bg-gradient-to-b from-[#030810] via-[#071328] to-[#0a1835] text-white pt-28 md:pt-36 pb-20 overflow-hidden border-b border-white/10">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.25),rgba(249,104,22,0.1)_50%,transparent_80%)] pointer-events-none"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-widest text-orange-400 mb-6 shadow-sm">
              <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              Chartered Valuation Practice • Est. 2019
            </div>
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Redefining Real Estate with <br />
              <span class="text-gradient-brand">Integrity & Excellence</span>
            </h1>
            <p class="text-base sm:text-lg text-slate-300 mb-10 max-w-2xl font-normal leading-relaxed">
              With institutional rigor and certified estate surveying practice, we provide audit-grade valuations, development monitoring, and automated property management across Nigeria.
            </p>
            <div class="grid grid-cols-3 gap-4 max-w-lg">
              <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center">
                <div class="text-2xl sm:text-3xl font-extrabold text-white">₦50B+</div>
                <div class="text-slate-300 text-xs mt-0.5">Assets Appraised</div>
              </div>
              <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center">
                <div class="text-2xl sm:text-3xl font-extrabold text-orange-400">1000+</div>
                <div class="text-slate-300 text-xs mt-0.5">Valuations Done</div> 
              </div> 
              <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center">
                <div class="text-2xl sm:text-3xl font-extrabold text-blue-400">6</div>
                <div class="text-slate-300 text-xs mt-0.5">Major Hubs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Company Overview (Bento Architecture) -->
      <section class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-12 gap-8 items-start">
            <!-- Left 7 cols: Company Profile & Accreditations -->
            <div class="lg:col-span-7 bento-card p-8 md:p-10 bg-white border border-slate-200/90 shadow-xl">
              <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest-swiss uppercase text-blue-700 bg-blue-50 border border-blue-200/60 mb-4">
                Corporate Governance
              </span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                Kayode Segun & Associates
              </h2>
              <p class="text-slate-600 text-sm md:text-base leading-relaxed mb-8">
                Registered with the Corporate Affairs Commission (CAC – BN 2761001), we are fully licensed members of the Nigerian Institution of Estate Surveyors and Valuers (NIESV) and the Estate Surveyors and Valuers Registration Board (ESVARBON), operating strictly under Act 1975 statutory provisions.
              </p>
              
              <!-- Accreditation Bento Strip -->
              <div class="space-y-3 pt-6 border-t border-slate-100">
                <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-900 text-xs sm:text-sm">Corporate Affairs Commission (CAC)</h3>
                    <p class="text-slate-500 text-[11px]">Certified Business Registration: BN 2761001</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-900 text-xs sm:text-sm">NIESV Member Practice</h3>
                    <p class="text-slate-500 text-[11px]">The Nigerian Institution of Estate Surveyors and Valuers</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-900 text-xs sm:text-sm">ESVARBON Licensed Valuers</h3>
                    <p class="text-slate-500 text-[11px]">Estate Surveyors and Valuers Registration Board of Nigeria, Act 1975</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Right 5 cols: Vision & Mission (Dark Bento Masterpiece) -->
            <div class="lg:col-span-5 bento-card-dark p-8 md:p-10 shadow-2xl relative overflow-hidden text-white flex flex-col justify-between">
              <div class="absolute -top-10 -right-10 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl pointer-events-none"></div>
              
              <div>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest-swiss uppercase text-orange-400 bg-orange-500/10 border border-orange-500/20 mb-6">
                  Core Foundations
                </span>
                <h3 class="text-2xl font-extrabold text-white mb-8 tracking-tight">Our Vision & Mission</h3>
                
                <div class="mb-8 pb-6 border-b border-white/10">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">
                      01
                    </div>
                    <h4 class="text-lg font-bold text-white">Our Vision</h4>
                  </div>
                  <p class="text-slate-300 text-xs sm:text-sm leading-relaxed pl-11">
                    To redefine real estate valuation and advisory practice with audit-grade transparency, becoming West Africa's benchmark institution for trusted asset governance.
                  </p>
                </div>
                
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-sm font-bold">
                      02
                    </div>
                    <h4 class="text-lg font-bold text-white">Our Mission</h4>
                  </div>
                  <p class="text-slate-300 text-xs sm:text-sm leading-relaxed pl-11">
                    To deliver rigorous property valuations, strategic transaction advisory, and automated asset management that empower clients to protect and compound capital.
                  </p>
                </div>
              </div>

              <div class="pt-8 mt-6">
                <router-link
                  to="/principal-partner"
                  class="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Meet The Leadership</span>
                  <span>→</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Services Grid -->
      <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-14">
            <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest-swiss uppercase text-orange-600 bg-orange-500/10 border border-orange-500/20 mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              Full Spectrum Capability
            </span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Professional Services
            </h2>
            <p class="mt-3 text-sm md:text-base text-slate-500 leading-relaxed">
              Tailored valuation, developmental appraisal, and management solutions adhering to regulatory guidelines.
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              v-for="(service, index) in services"
              :key="index"
              :title="service.title"
              :description="service.description"
              :icon="service.icon"
            />
          </div>
        </div>
      </section>

      <!-- Market Coverage -->
      <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-14">
            <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest-swiss uppercase text-blue-700 bg-blue-500/10 border border-blue-500/20 mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Geographic Scope
            </span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Presence Across Nigeria
            </h2>
            <p class="mt-3 text-sm md:text-base text-slate-500 leading-relaxed">
              Valuation insight and asset coverage spanning high-velocity urban centers and primary developmental corridors.
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CityCard
              v-for="(city, index) in cities"
              :key="index"
              :name="city.name"
              :properties="city.properties"
              :focus="city.focus"
              :color="city.color"
            />
          </div>
        </div>
      </section>

      <!-- Client Testimonials -->
      <section class="py-20 bg-gradient-to-b from-[#030810] via-[#071328] to-[#0a1835] text-white relative overflow-hidden border-t border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="text-center mb-14">
            <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest-swiss uppercase text-orange-400 bg-orange-500/10 border border-orange-500/20 mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              Client Endorsements
            </span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our Journey So Far
            </h2>
            <p class="text-sm md:text-base text-slate-300 max-w-2xl mx-auto mt-2 mb-6">
              Trusted by private property owners, institutional lenders, and corporations across Nigeria.
            </p>
            <button 
              @click="showFeedbackModal = true" 
              class="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full transition shadow-md inline-flex items-center gap-2"
            >
              <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Submit Client Feedback
            </button>
          </div>
          
          <!-- If testimonials count <= 3, show grid -->
          <div v-if="testimonials.length <= 3" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestimonialCard
              v-for="(testimonial, index) in testimonials"
              :key="index"
              :name="testimonial.name"
              :role="testimonial.role"
              :company="testimonial.company"
              :content="testimonial.content"
              :rating="testimonial.rating"
            />
          </div>

          <!-- If testimonials count > 3, show slide carousel -->
          <div v-else class="relative max-w-3xl mx-auto">
            <div class="overflow-hidden relative min-h-[260px] bg-white/5 backdrop-blur-xl rounded-3xl border border-white/15 p-8 shadow-2xl text-white">
              <TransitionGroup name="fade-slide">
                <div 
                  v-for="(testimonial, index) in displayTestimonials" 
                  v-show="currentTestimonialIndex === index"
                  :key="index"
                  class="absolute inset-0 p-8 flex flex-col justify-between"
                >
                  <div>
                    <!-- Rating Stars -->
                    <div class="flex gap-1 mb-4">
                      <svg 
                        v-for="star in testimonial.rating" 
                        :key="star" 
                        class="w-4 h-4 text-orange-400 fill-current" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <p class="text-base md:text-lg italic text-slate-200 mb-6 leading-relaxed">"{{ testimonial.content }}"</p>
                  </div>
                  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <h4 class="font-extrabold text-sm text-white">{{ testimonial.name }}</h4>
                      <p class="text-xs text-slate-400">{{ testimonial.role }} <span v-if="testimonial.company">at {{ testimonial.company }}</span></p>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
            
            <!-- Carousel Navigation Controls -->
            <div class="flex justify-between items-center mt-6">
              <button @click="prevTestimonial" class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition" aria-label="Previous testimonial">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <div class="flex gap-2">
                <button 
                  v-for="(_, idx) in displayTestimonials" 
                  :key="idx" 
                  @click="currentTestimonialIndex = idx" 
                  :class="currentTestimonialIndex === idx ? 'bg-orange-500 w-5' : 'bg-white/30 w-2'" 
                  class="h-1.5 rounded-full transition-all duration-300"
                  :aria-label="`Go to testimonial ${idx + 1}`"
                ></button>
              </div>
              
              <button @click="nextTestimonial" class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition" aria-label="Next testimonial">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Submit Feedback Modal -->
      <Teleport to="body">
        <div v-if="showFeedbackModal" class="fixed inset-0 z-[150] overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full relative border border-slate-200">
            <!-- Close Button -->
            <button @click="showFeedbackModal = false" class="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition text-slate-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <h3 class="text-xl font-extrabold text-slate-900 mb-1">Submit Client Feedback</h3>
            <p class="text-slate-500 mb-5 text-xs">Let us know about your appraisal experience with KSA Valuers.</p>
            
            <form @submit.prevent="submitFeedback" class="space-y-3.5">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input v-model="feedbackForm.name" type="text" required class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                <input v-model="feedbackForm.email" type="email" required class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500">
              </div>
              
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Client Role *</label>
                <input v-model="feedbackForm.role" type="text" placeholder="e.g. Property Investor, Corporate Client" required class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500">
              </div>
              
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Company / Organization</label>
                <input v-model="feedbackForm.company" type="text" placeholder="e.g. Sterling Holdings" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500">
              </div>
              
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Rating *</label>
                <div class="flex gap-2">
                  <button v-for="star in 5" :key="star" type="button" @click="feedbackForm.rating = star" class="p-1 hover:scale-110 transition">
                    <svg :class="feedbackForm.rating >= star ? 'text-orange-400 fill-current' : 'text-slate-200'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Feedback Remarks *</label>
                <textarea v-model="feedbackForm.content" required rows="3" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"></textarea>
              </div>
              
              <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-glow-orange transition">
                Submit Testimonial
              </button>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- Contact CTA Bento Masterpiece -->
      <section class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bento-card-dark p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div class="absolute -top-24 -left-24 w-80 h-80 bg-blue-600/25 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-24 -right-24 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <div class="relative z-10 max-w-2xl mx-auto">
              <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest-swiss uppercase text-orange-400 bg-orange-500/10 border border-orange-500/20 mb-4">
                Consult With Chartered Appraisers
              </span>
              <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                Ready to Maximize Your Real Estate Value?
              </h2>
              <p class="text-slate-300 text-base md:text-lg mb-8 font-normal leading-relaxed">
                Connect with our team of chartered surveyors and registered valuers for an audit-grade assessment.
              </p>
              
              <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
                <router-link
                  to="/contact-us"
                  class="pill-button-primary px-8 py-3.5 text-xs uppercase tracking-widest font-bold shadow-lg hover:shadow-orange-500/30 transition-all duration-300 w-full sm:w-auto"
                >
                  Contact Our Team
                </router-link>
                <a
                  href="tel:+2349053901001"
                  class="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold text-white border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300 w-full sm:w-auto"
                >
                  Call +234 905 390 1001
                </a>
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
import { useSEO } from '../hooks/useSEO'
useSEO({
  title: 'About Us - KSA Valuers',
  description: 'Learn about our mission, values, and team at KSA Valuers, Nigeria’s trusted property valuers.'
})
import { ref, onMounted, onUnmounted, watch, reactive } from 'vue'
import { emailService } from '@/services/api'
import ServiceCard from '@/components/sections/ServiceCard.vue'
import CityCard from '@/components/sections/CityCard.vue'
import TestimonialCard from '@/components/sections/TestimonialCard.vue'
import { captureEvent } from '@/plugins/posthog'

const services = ref([
  {
    title: 'Property Valuation',
    description: 'Accurate market valuations for residential, commercial, and industrial properties.',
    icon: 'valuation'
  },
  {
    title: 'Asset Valuation',
    description: 'Comprehensive plant and equipment valuation for corporate clients.',
    icon: 'asset'
  },
  {
    title: 'Property Sales & Letting',
    description: 'End-to-end property transaction services for buyers, sellers, and tenants.',
    icon: 'sales'
  },
  {
    title: 'Facility Management',
    description: 'Professional management and maintenance of residential and commercial properties.',
    icon: 'facility'
  },
  {
    title: 'Feasibility Appraisal',
    description: 'Detailed viability analysis for real estate development projects.',
    icon: 'feasibility'
  },
  {
    title: 'Property Development',
    description: 'Full-cycle development consultancy from concept to completion.',
    icon: 'development'
  },
  {
    title: 'Real Estate Advisory',
    description: 'Strategic advice for property investment and portfolio management.',
    icon: 'advisory'
  },
  {
    title: 'Legal & Regulatory',
    description: 'Guidance on real estate laws, regulations, and compliance.',
    icon: 'legal'
  }
])

const cities = ref([
  {
    name: 'Lagos',
    properties: 'Commercial & Residential',
    focus: 'Lekki, Ikoyi, Victoria Island',
    color: 'from-blue-500 to-blue-700'
  },
  {
    name: 'Abuja',
    properties: 'Government & Diplomatic',
    focus: 'Maitama, Asokoro, Wuse',
    color: 'from-green-500 to-green-700'
  },
  {
    name: 'Port Harcourt',
    properties: 'Industrial & Residential',
    focus: 'GRA, Trans-Amadi',
    color: 'from-purple-500 to-purple-700'
  },
  {
    name: 'Kano',
    properties: 'Commercial & Heritage',
    focus: 'Nasarawa GRA, Bompai',
    color: 'from-amber-500 to-amber-700'
  },
  {
    name: 'Kaduna',
    properties: 'Mixed-Use Developments',
    focus: 'Barnawa, Kawo',
    color: 'from-red-500 to-red-700'
  },
  {
    name: 'Other Markets',
    properties: 'Nationwide Coverage',
    focus: 'Ibadan, Enugu, Benin',
    color: 'from-gray-500 to-gray-700'
  }
])

const testimonials = ref([
  {
    name: 'Chief Adebayo Williams',
    role: 'Property Investor',
    company: 'Williams Holdings',
    content: 'KSA Valuers provided exceptional service in valuing our commercial portfolio across Lagos. Their attention to detail and market knowledge is unmatched.',
    rating: 5
  },
  {
    name: 'Mrs. Ngozi Okonkwo',
    role: 'Residential Client',
    company: 'Private Homeowner',
    content: 'The team helped us navigate a complex property sale in Abuja. Professional, transparent, and achieved above-market value for our property.',
    rating: 5
  },
  {
    name: 'Engr. Tunde Raji',
    role: 'Corporate Director',
    company: 'Manufacturing Co. Ltd',
    content: 'Their asset valuation for our industrial plant was thorough and precise. Essential for our financial reporting and insurance requirements.',
    rating: 5
  }
])

const showFeedbackModal = ref(false)
const feedbackForm = reactive({
  name: '',
  email: '',
  role: '',
  company: '',
  rating: 5,
  content: ''
})

const displayTestimonials = ref([])
const currentTestimonialIndex = ref(0)
let testimonialInterval = null

const shuffleTestimonials = () => {
  const arr = [...testimonials.value]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  displayTestimonials.value = arr
}

const startTestimonialAutoplay = () => {
  stopTestimonialAutoplay()
  if (testimonials.value.length > 3) {
    testimonialInterval = setInterval(() => {
      currentTestimonialIndex.value = (currentTestimonialIndex.value + 1) % testimonials.value.length
    }, 6000)
  }
}

const stopTestimonialAutoplay = () => {
  if (testimonialInterval) clearInterval(testimonialInterval)
}

const nextTestimonial = () => {
  currentTestimonialIndex.value = (currentTestimonialIndex.value + 1) % testimonials.value.length
  startTestimonialAutoplay()
}

const prevTestimonial = () => {
  currentTestimonialIndex.value = (currentTestimonialIndex.value - 1 + testimonials.value.length) % testimonials.value.length
  startTestimonialAutoplay()
}

const submitFeedback = async () => {
  try {
    const subject = `Testimonial: ${feedbackForm.role}${feedbackForm.company ? ' at ' + feedbackForm.company : ''} (Rating: ${feedbackForm.rating}/5)`
    
    await emailService.sendContactForm({
      name: feedbackForm.name,
      email: feedbackForm.email,
      phone: null,
      subject: subject,
      message: feedbackForm.content
    })

    testimonials.value.push({
      name: feedbackForm.name,
      role: feedbackForm.role,
      company: feedbackForm.company || '',
      content: feedbackForm.content,
      rating: feedbackForm.rating
    })
    
    captureEvent('testimonial_submitted', {
      rating: feedbackForm.rating
    })

    showFeedbackModal.value = false
    Object.assign(feedbackForm, {
      name: '',
      email: '',
      role: '',
      company: '',
      rating: 5,
      content: ''
    })
    
    alert('Thank you! Your feedback has been submitted successfully.')
  } catch (err) {
    console.error('Failed to submit testimonial:', err)
    alert('Failed to submit testimonial. Please try again.')
  }
}

watch(testimonials, () => {
  shuffleTestimonials()
  startTestimonialAutoplay()
}, { deep: true })

onMounted(() => {
  shuffleTestimonials()
  startTestimonialAutoplay()
})

onUnmounted(() => {
  stopTestimonialAutoplay()
})
</script>

<style scoped>
/* Fade-slide transition for testimonials */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.6s ease-in-out;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>