<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-blue-900 to-blue-800">
      <div class="absolute inset-0 bg-black/30"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p class="text-xl text-blue-100 max-w-3xl mx-auto">
            Get in touch with Nigeria's premier property valuers for expert consultation, property valuation, and comprehensive real estate solutions.
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <!-- Contact Form -->
        <div>
          <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 md:mb-8">Send us a Message</h2>
            
            <!-- Form submits directly to Formspree - no JavaScript interception -->
            <form action="https://formspree.io/f/mkodweqd" method="POST" class="space-y-6">
              <!-- Name -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="John Doe"
                  class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <!-- Email & Phone -->
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    placeholder="john@example.com"
                    class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="+234 800 000 0000"
                    class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <!-- Subject -->
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span class="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  id="subject"
                  required
                  class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="" disabled selected>Select a subject</option>
                  <option value="property-valuation">Property Valuation Inquiry</option>
                  <option value="estate-management">Estate Management Services</option>
                  <option value="sales-inquiry">Property Sales Inquiry</option>
                  <option value="investment-consultation">Investment Consultation</option>
                  <option value="legal-advice">Legal Advice & Documentation</option>
                  <option value="career-opportunities">Career Opportunities</option>
                  <option value="general-inquiry">General Inquiry</option>
                  <option value="feedback">Feedback & Suggestions</option>
                </select>
              </div>

              <!-- Message -->
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                  Message <span class="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="6"
                  required
                  placeholder="Please provide details about your inquiry..."
                  class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                ></textarea>
              </div>

              <!-- Honeypot field to prevent spam (hidden from users) -->
              <input type="text" name="_gotcha" style="display:none" />

              <!-- Optional: Redirect to a thank you page on your site -->
              <input type="hidden" name="_next" value="https://ksavaluers.com/thank-you" />

              <!-- Optional: Custom subject for email -->
              <input type="hidden" name="_subject" value="New contact form submission from KSA Valuers website!" />

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Send Message
                </button>
                <p class="text-xs text-gray-500 mt-3">
                  By submitting this form, you agree to our Privacy Policy and consent to being contacted by KSA Valuers.
                </p>
              </div>
            </form>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="space-y-8">
          <!-- Office Address with Map -->
          <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div class="flex items-start">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">Office Address</h3>
                <p class="text-gray-600">
                  Suite J260, Road 5, Ikota Shopping Complex,<br>
                  Ajah, Lekki, Lagos, Nigeria
                </p>
              </div>
            </div>
            
            <!-- Interactive Map -->
            <div id="contact-map" class="mt-6 rounded-lg overflow-hidden h-48 border border-gray-200" style="z-index: 10;"></div>
          </div>

          <!-- Contact Methods -->
          <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 class="text-lg font-bold text-gray-900 mb-6">Get in Touch</h3>
            
            <div class="space-y-8">
              <!-- Phone Numbers -->
              <div>
                <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Phone Numbers</h4>
                <div class="space-y-3">
                  <a href="tel:+2349053901001" class="flex items-center text-gray-700 hover:text-blue-600 transition-colors group">
                    <svg class="w-5 h-5 text-gray-400 mr-3 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +234 905 390 1001
                  </a>
                  <a href="tel:+2349053898636" class="flex items-center text-gray-700 hover:text-blue-600 transition-colors group">
                    <svg class="w-5 h-5 text-gray-400 mr-3 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +234 905 389 8636
                  </a>
                  <a href="tel:+2349053901802" class="flex items-center text-gray-700 hover:text-blue-600 transition-colors group">
                    <svg class="w-5 h-5 text-gray-400 mr-3 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +234 905 390 1802
                  </a>
                </div>
              </div>

              <!-- Email -->
              <div>
                <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Email Address</h4>
                <a href="mailto:contact@ksavaluers.com" class="flex items-center text-gray-700 hover:text-blue-600 transition-colors group">
                  <svg class="w-5 h-5 text-gray-400 mr-3 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contact@ksavaluers.com
                </a>
              </div>

              <!-- Business Hours -->
              <div>
                <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Business Hours</h4>
                <div class="flex items-center text-gray-700">
                  <svg class="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                    <p class="text-sm text-gray-500 mt-1">Saturday: 9:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>

              <!-- Social Media -->
              <div class="pt-6 border-t border-gray-100">
                <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Connect With Us</h4>
                <div class="flex space-x-3">
                  <!-- Facebook -->
                  <a href="https://facebook.com/ksavaluers" target="_blank" rel="noopener noreferrer" class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors group">
                    <svg class="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  
                  <!-- Instagram -->
                  <a href="https://instagram.com/Ksavaluers" target="_blank" rel="noopener noreferrer" class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center hover:bg-pink-200 transition-colors group">
                    <svg class="w-6 h-6 text-pink-600 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  
                  <!-- LinkedIn -->
                  <a href="https://linkedin.com/company/ksavaluers" target="_blank" rel="noopener noreferrer" class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors group">
                    <svg class="w-6 h-6 text-blue-700 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  
                  <!-- Twitter/X -->
                  <a href="https://twitter.com/ksavaluers" target="_blank" rel="noopener noreferrer" class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors group">
                    <svg class="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ/Quick Help Section -->
      <div class="mt-12 lg:mt-16">
        <div class="text-center mb-8 lg:mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p class="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Quick answers to common inquiries about our property valuation and management services.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-4 lg:gap-6">
          <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 class="text-lg font-bold text-gray-900 mb-3">How long does property valuation take?</h3>
            <p class="text-gray-600">Standard property valuations are completed within 3-5 business days. Complex or large-scale properties may require additional time for thorough assessment.</p>
          </div>
          <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 class="text-lg font-bold text-gray-900 mb-3">What documents do I need for valuation?</h3>
            <p class="text-gray-600">Typically required: Proof of ownership, property title documents, recent utility bills, and any existing property surveys or architectural drawings.</p>
          </div>
          <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 class="text-lg font-bold text-gray-900 mb-3">Do you serve clients outside Lagos?</h3>
            <p class="text-gray-600">Yes, we provide property valuation services across Nigeria with offices and partners in major cities including Abuja, Port Harcourt, and Ibadan.</p>
          </div>
          <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 class="text-lg font-bold text-gray-900 mb-3">What are your service charges?</h3>
            <p class="text-gray-600">Fees vary based on property type, location, and service scope. Contact us for a customized quote based on your specific requirements.</p>
          </div>
        </div>
        
        <div class="text-center mt-6 lg:mt-8">
          <router-link
            to="/faq"
            class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group"
          >
            View all FAQs
            <svg class="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Live Chat Widget Toggle -->
    <button
      @click="toggleChat"
      class="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 flex items-center justify-center z-[1000] hover:scale-110 active:scale-95 group focus:outline-none"
      aria-label="Open chat"
    >
      <span class="absolute right-16 bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-blue-800">
        Chat with Expert AI
      </span>
      <span class="absolute top-0 right-0 flex h-3 w-3" v-if="!showChat">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
      </span>
      <svg v-if="!showChat" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Chat Window -->
    <div v-if="showChat" class="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[480px] max-h-[75vh] bg-white rounded-2xl shadow-2xl z-[1010] flex flex-col overflow-hidden border border-gray-150 transition-all duration-300">
      <!-- Header -->
      <div class="p-4 bg-gradient-to-r from-blue-900 to-indigo-800 text-white flex-shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 backdrop-blur-sm">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-sm tracking-wide">KSA Virtual Assistant</h4>
              <p class="text-[10px] text-green-300 font-semibold flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span>
                AI Agent Online
              </p>
            </div>
          </div>
          <button @click="toggleChat" class="text-white/80 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Messages List -->
      <div ref="chatContainer" class="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50/50">
        <div v-for="(msg, index) in chatMessages" :key="index" :class="['flex', msg.sender === 'user' ? 'justify-end' : 'justify-start']">
          <div :class="['max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm', msg.sender === 'user' ? 'bg-[#1b4d84] text-white rounded-br-none' : 'bg-white border border-gray-150 text-gray-800 rounded-bl-none']">
            <p class="leading-relaxed">{{ msg.text }}</p>
            <p class="text-[10px] mt-1 text-right opacity-60">{{ formatTime(msg.timestamp) }}</p>
          </div>
        </div>
        
        <!-- Bouncing Dots Typing Loader -->
        <div v-if="chatLoading" class="flex justify-start">
          <div class="bg-white border border-gray-150 rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-1 shadow-sm">
            <span class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
      
      <!-- Quick Prompts Chips -->
      <div v-if="chatMessages.length === 1 && !chatLoading" class="px-4 py-2 bg-gray-50 flex flex-wrap gap-2 border-t border-gray-100 flex-shrink-0">
        <button
          v-for="prompt in quickPrompts"
          :key="prompt"
          @click="sendQuickPrompt(prompt)"
          class="text-xs bg-white hover:bg-orange-50 hover:text-orange-600 border border-gray-200 hover:border-orange-200 text-gray-600 px-2.5 py-1.5 rounded-full transition-all duration-200 shadow-sm"
        >
          {{ prompt }}
        </button>
      </div>

      <!-- Input Bar -->
      <div class="p-3 border-t border-gray-100 bg-white flex-shrink-0">
        <div class="flex items-center gap-2">
          <input
            v-model="chatMessage"
            @keyup.enter="sendChatMessage"
            type="text"
            placeholder="Ask a question..."
            class="flex-grow px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1b4d84] focus:border-[#1b4d84] bg-gray-50"
            :disabled="chatLoading"
          />
          <button
            @click="sendChatMessage"
            class="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-200 flex-shrink-0 shadow-sm disabled:opacity-50"
            :disabled="!chatMessage.trim() || chatLoading"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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