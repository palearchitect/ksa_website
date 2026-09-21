<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-transparent">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-b from-[#030810] via-[#071328] to-[#0a1835] text-white pt-28 md:pt-36 pb-16 overflow-hidden border-b border-white/10">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.28),rgba(249,104,22,0.1)_50%,transparent_80%)] pointer-events-none"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-widest text-orange-400 mb-6 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          Direct Communications
        </div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
          Connect With <span class="text-gradient-brand">Our Valuers</span>
        </h1>
        <p class="text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Get in touch with Nigeria's premier estate surveyors and property valuers for expert consultation, asset valuation, and investment advisory.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <!-- Contact Form (Bento Card, 7 Cols) -->
        <div class="lg:col-span-7">
          <div class="bento-card bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 md:p-10 shadow-xl">
            <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div>
                <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Send Us a Direct Message</h2>
                <p class="text-xs md:text-sm text-slate-500 mt-1 font-medium">Responses guaranteed within 24 business hours</p>
              </div>
              <span class="hidden sm:inline-flex px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                Official Inquiry
              </span>
            </div>
            
            <!-- Form submits directly to Formspree - no JavaScript interception -->
            <form action="https://formspree.io/f/mkodweqd" method="POST" class="space-y-6">
              <!-- Name -->
              <div>
                <label for="name" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Full Name <span class="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="e.g. Arc. Adebayo Adeleke"
                  class="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white"
                />
              </div>

              <!-- Email & Phone -->
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label for="email" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Email Address <span class="text-orange-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    placeholder="name@company.com"
                    class="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label for="phone" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="+234 800 000 0000"
                    class="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <!-- Subject -->
              <div>
                <label for="subject" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Subject / Inquiry Type <span class="text-orange-500">*</span>
                </label>
                <select
                  name="subject"
                  id="subject"
                  required
                  class="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white"
                >
                  <option value="" disabled selected>Select an inquiry category</option>
                  <option value="property-valuation">Property Valuation & Appraisal</option>
                  <option value="estate-management">Estate Management & Advisory</option>
                  <option value="sales-inquiry">Property Acquisition / Listing</option>
                  <option value="investment-consultation">Real Estate Investment Advisory</option>
                  <option value="legal-advice">Statutory Title & Documentation</option>
                  <option value="general-inquiry">General Institutional Inquiry</option>
                </select>
              </div>

              <!-- Message -->
              <div>
                <label for="message" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Message Description <span class="text-orange-500">*</span>
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  required
                  placeholder="Provide property details, location, purpose of valuation or specific inquiries..."
                  class="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white resize-none"
                ></textarea>
              </div>

              <!-- Honeypot field to prevent spam (hidden from users) -->
              <input type="text" name="_gotcha" style="display:none" />
              <input type="hidden" name="_next" value="https://ksavaluers.com/thank-you" />
              <input type="hidden" name="_subject" value="New contact form submission from KSA Valuers website!" />

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  class="w-full py-4 px-6 rounded-full font-bold text-white tracking-wide bg-gradient-to-r from-blue-700 via-blue-600 to-orange-500 hover:from-blue-800 hover:to-orange-600 shadow-glow-orange hover:shadow-xl transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span>Dispatch Message</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <p class="text-[11px] text-slate-400 text-center mt-3">
                  Protected by standard institutional confidentiality policies. We never share your data.
                </p>
              </div>
            </form>
          </div>
        </div>

        <!-- Contact Information (Bento Side Column, 5 Cols) -->
        <div class="lg:col-span-5 space-y-6">
          <!-- Office Address with Map Bento Card -->
          <div class="bento-card bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xl">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-900/20">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-orange-600">Headquarters</span>
                <h3 class="text-lg font-bold text-slate-900 mt-0.5">Lekki Principal Office</h3>
                <p class="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">
                  Suite J260, Road 5, Ikota Shopping Complex,<br>
                  Ajah, Lekki, Lagos State, Nigeria
                </p>
              </div>
            </div>
            
            <!-- Interactive Map -->
            <div id="contact-map" class="mt-6 rounded-2xl overflow-hidden h-44 border border-slate-200 shadow-inner" style="z-index: 10;"></div>
          </div>

          <!-- Contact Methods Bento Card -->
          <div class="bento-card bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xl">
            <h3 class="text-base font-extrabold uppercase tracking-wider text-slate-900 mb-6 flex items-center gap-2">
              <span class="w-1.5 h-4 bg-orange-500 rounded-full"></span>
              Direct Inquiries & Helpdesk
            </h3>
            
            <div class="space-y-6">
              <!-- Phone Numbers -->
              <div>
                <h4 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Telephone Lines</h4>
                <div class="space-y-2">
                  <a href="tel:+2349053901001" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 text-slate-800 hover:text-blue-700 transition-all group border border-slate-100">
                    <span class="text-sm font-semibold tracking-tight">+234 905 390 1001</span>
                    <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100/70 text-blue-700">Primary</span>
                  </a>
                  <a href="tel:+2349053898636" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 text-slate-800 hover:text-blue-700 transition-all group border border-slate-100">
                    <span class="text-sm font-semibold tracking-tight">+234 905 389 8636</span>
                    <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-600">Line 2</span>
                  </a>
                  <a href="tel:+2349053901802" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 text-slate-800 hover:text-blue-700 transition-all group border border-slate-100">
                    <span class="text-sm font-semibold tracking-tight">+234 905 390 1802</span>
                    <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-600">Advisory</span>
                  </a>
                </div>
              </div>

              <!-- Email -->
              <div>
                <h4 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Email Desks</h4>
                <a href="mailto:contact@ksavaluers.com" class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-orange-50/60 text-slate-800 hover:text-orange-600 transition-all border border-slate-100">
                  <div class="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span class="text-sm font-semibold">contact@ksavaluers.com</span>
                </a>
              </div>

              <!-- Business Hours -->
              <div class="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0c1938] text-white">
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-slate-200">Consultation Schedule</h4>
                </div>
                <div class="text-xs space-y-1 text-slate-300">
                  <div class="flex justify-between">
                    <span>Monday – Friday:</span>
                    <span class="font-bold text-white">8:00 AM – 5:00 PM</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Saturday:</span>
                    <span class="font-bold text-orange-300">9:00 AM – 2:00 PM</span>
                  </div>
                  <div class="flex justify-between text-slate-400">
                    <span>Sunday:</span>
                    <span>By Prior Appointment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Section (Swiss Bento Grid) -->
      <div class="mt-16 lg:mt-24">
        <div class="text-center mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest mb-3">
            Knowledge Hub
          </div>
          <h2 class="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Frequently Answered Queries</h2>
          <p class="text-sm md:text-base text-slate-500 max-w-2xl mx-auto mt-2">
            Essential information regarding valuation procedures, documentation prerequisites, and jurisdictional coverage.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bento-card bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <h3 class="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-600"></span>
              How long does an institutional valuation take?
            </h3>
            <p class="text-xs md:text-sm text-slate-600 leading-relaxed">Standard residential and commercial valuation reports are dispatched within 3-5 business days following physical inspection. Complex asset audits or plant valuations are scheduled on milestone agreements.</p>
          </div>
          <div class="bento-card bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <h3 class="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-500"></span>
              What title documents are required for inspection?
            </h3>
            <p class="text-xs md:text-sm text-slate-600 leading-relaxed">Required instruments include Deed of Assignment, Certificate of Occupancy (C of O) or Governor's Consent, approved survey plans, and architectural drawings where applicable.</p>
          </div>
          <div class="bento-card bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <h3 class="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-600"></span>
              Do you execute field valuations outside Lagos State?
            </h3>
            <p class="text-xs md:text-sm text-slate-600 leading-relaxed">Yes. We possess active field teams and valuation networks operating across Abuja (FCT), Port Harcourt, Ibadan, Abeokuta, and all major commercial centers across Nigeria.</p>
          </div>
          <div class="bento-card bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <h3 class="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-500"></span>
              How are professional valuation fees structured?
            </h3>
            <p class="text-xs md:text-sm text-slate-600 leading-relaxed">Our fee schedule adheres strictly to the official Scale of Professional Charges approved by ESVARBON and the Nigerian Institution of Estate Surveyors and Valuers (NIESV).</p>
          </div>
        </div>
        
        <div class="text-center mt-8">
          <router-link
            to="/faq"
            class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:text-blue-600 hover:border-blue-600 font-semibold text-xs uppercase tracking-wider transition-all bg-white hover:bg-slate-50 shadow-sm"
          >
            Explore Complete FAQ Index
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Live Chat Widget Toggle -->
    <button
      @click="toggleChat"
      class="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-glow-orange hover:shadow-orange-500/40 transition-all duration-300 flex items-center justify-center z-[1000] hover:scale-105 active:scale-95 group focus:outline-none border-2 border-white/20"
      aria-label="Open chat"
    >
      <span class="absolute right-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10">
        AI Advisory Assistant
      </span>
      <span class="absolute top-0 right-0 flex h-3.5 w-3.5" v-if="!showChat">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500 border-2 border-white"></span>
      </span>
      <svg v-if="!showChat" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Chat Window -->
    <div v-if="showChat" class="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] max-h-[75vh] bg-white rounded-3xl shadow-2xl z-[1010] flex flex-col overflow-hidden border border-slate-200/80 transition-all duration-300">
      <!-- Header -->
      <div class="p-4 bg-gradient-to-r from-[#030810] via-[#091938] to-[#1b4d84] text-white flex-shrink-0 border-b border-white/10">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-9 h-9 bg-white/10 rounded-2xl flex items-center justify-center mr-3 backdrop-blur-md border border-white/15">
              <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h4 class="font-extrabold text-sm tracking-tight text-white">KSA AI Valuer Desk</h4>
              <p class="text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                Institutional Intelligence Online
              </p>
            </div>
          </div>
          <button @click="toggleChat" class="text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Messages List -->
      <div ref="chatContainer" class="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/70">
        <div v-for="(msg, index) in chatMessages" :key="index" :class="['flex', msg.sender === 'user' ? 'justify-end' : 'justify-start']">
          <div :class="['max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm', msg.sender === 'user' ? 'bg-[#1b4d84] text-white rounded-br-none' : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none']">
            <p class="leading-relaxed">{{ msg.text }}</p>
            <p class="text-[10px] mt-1 text-right opacity-60">{{ formatTime(msg.timestamp) }}</p>
          </div>
        </div>
        
        <!-- Bouncing Dots Typing Loader -->
        <div v-if="chatLoading" class="flex justify-start">
          <div class="bg-white border border-slate-200/80 rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-1 shadow-sm">
            <span class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
      
      <!-- Quick Prompts Chips -->
      <div v-if="chatMessages.length === 1 && !chatLoading" class="px-4 py-2 bg-slate-50 flex flex-wrap gap-2 border-t border-slate-200/60 flex-shrink-0">
        <button
          v-for="prompt in quickPrompts"
          :key="prompt"
          @click="sendQuickPrompt(prompt)"
          class="text-[11px] font-semibold bg-white hover:bg-orange-50 hover:text-orange-600 border border-slate-200 hover:border-orange-300 text-slate-700 px-3 py-1.5 rounded-full transition-all duration-200 shadow-sm"
        >
          {{ prompt }}
        </button>
      </div>

      <!-- Input Bar -->
      <div class="p-3 border-t border-slate-200/80 bg-white flex-shrink-0">
        <div class="flex items-center gap-2">
          <input
            v-model="chatMessage"
            @keyup.enter="sendChatMessage"
            type="text"
            placeholder="Inquire about property valuation, fees..."
            class="flex-grow px-4 py-2.5 text-xs md:text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
            :disabled="chatLoading"
          />
          <button
            @click="sendChatMessage"
            class="p-2.5 bg-gradient-to-r from-blue-700 to-orange-500 hover:from-blue-800 hover:to-orange-600 text-white rounded-full transition-all duration-200 flex-shrink-0 shadow-md disabled:opacity-50"
            :disabled="!chatMessage.trim() || chatLoading"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import ErrorBoundary from '../components/global/ErrorBoundary.vue'
import { useSEO } from '../hooks/useSEO'
import { ref, onMounted, nextTick } from 'vue'
import api from '@/services/api'
import { captureEvent } from '@/plugins/posthog'

useSEO({
  title: 'Contact Us - KSA Valuers',
  description: 'Get in touch with Nigeria’s premier property valuers for expert consultation, property valuation, and comprehensive real estate solutions.'
})


onMounted(() => {
  if (typeof window !== 'undefined' && window.L) {
    const map = window.L.map('contact-map').setView([6.4656076, 3.5573418], 16)

    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map)

    const officeMarker = window.L.marker([6.4656076, 3.5573418]).addTo(map)
    officeMarker.bindPopup('<b>KSA Valuers Office</b><br>Suite J260, Road 5, Ikota Shopping Complex, Lekki, Lagos.').openPopup()
  }
})

// Chat state
const showChat = ref(false)
const chatMessage = ref('')
const chatMessages = ref([])
const chatLoading = ref(false)
const chatContainer = ref(null)

const quickPrompts = [
  'What services do you offer?',
  'How do I book a property tour?',
  'Where is your office located?',
  'Tell me about your ongoing projects'
]

const toggleChat = () => {
  showChat.value = !showChat.value
  if (showChat.value && chatMessages.value.length === 0) {
    chatMessages.value.push({
      text: "Hello! Welcome to KSA Valuers. I am your virtual assistant. How can I help you with property valuations, ongoing projects, or our real estate services today?",
      sender: 'support',
      timestamp: new Date()
    })
    scrollToBottom()
  }
}

const sendQuickPrompt = (promptText) => {
  sendChatMessage(promptText)
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const sendChatMessage = async (overrideText = null) => {
  const text = typeof overrideText === 'string' ? overrideText.trim() : chatMessage.value.trim()
  if (!text || chatLoading.value) return

  chatMessages.value.push({
    text: text,
    sender: 'user',
    timestamp: new Date()
  })
  captureEvent('chat_message_sent', {
    message_source: overrideText ? 'quick_prompt' : 'freeform'
  })
  
  if (!overrideText) {
    chatMessage.value = ''
  }
  
  chatLoading.value = true
  scrollToBottom()

  try {
    const res = await api.post('/api/ask-ai', { question: text })
    chatMessages.value.push({
      text: res.data?.answer || res.answer || "Thanks for your message. Our support team will respond shortly.",
      sender: 'support',
      timestamp: new Date()
    })
  } catch (err) {
    console.error('Failed to get AI response:', err)
    chatMessages.value.push({
      text: "Sorry, I'm having trouble connecting to our AI assistant right now. Please call us directly or try again later.",
      sender: 'support',
      timestamp: new Date()
    })
  } finally {
    chatLoading.value = false
    scrollToBottom()
  }
}

// Format timestamp for chat
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
/* Smooth transitions */
* {
  transition: background-color 0.2s, border-color 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
}

/* Chat widget animation */
.fixed {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Form focus states */
input:focus, textarea:focus, select:focus {
  outline: none;
  ring-width: 2px;
}

/* Scrollbar styling for chat */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .fixed.bottom-20 {
    bottom: 5rem;
    right: 1rem;
    width: calc(100% - 2rem);
    max-width: 320px;
  }
}

/* Hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* Loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>