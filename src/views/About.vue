<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section -->
    <section class="relative py-20 md:py-32 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-blue-800/90">
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      </div>
      
      <div class="container mx-auto px-6 lg:px-8 relative z-10">
        <div class="max-w-3xl">
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <span class="text-white text-sm font-medium">Established 2019</span>
          </div>
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Redefining Real Estate with
            <span class="text-blue-300">Integrity & Excellence</span>
          </h1>
          <p class="text-xl text-blue-100 mb-10 max-w-2xl">
            With over 5 years of trusted service, we're recognized as leading estate surveyors and valuers across Nigeria.
          </p>
          <div class="flex flex-wrap gap-4">
            <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4">
              <div class="text-2xl font-bold text-white">1000+</div>
              <div class="text-blue-200 text-sm">Properties Valued</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4">
              <div class="text-2xl font-bold text-white">5+</div>
              <div class="text-blue-200 text-sm">Years Experience</div> 
            </div> 
            <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4">
              <div class="text-2xl font-bold text-white">6</div>
              <div class="text-blue-200 text-sm">Major Cities</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Company Overview -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold mb-6">
              Company Overview
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Kayode Segun & Associates
            </h2>
            <p class="text-lg text-gray-600 mb-8">
              Registered with the Corporate Affairs Commission (CAC – BN 2761001), we are fully licensed members of the Nigerian Institution of Estate Surveyors and Valuers (NIESV) and the Estate Surveyors and Valuers Registration Board (ESVARBON), operating under Act 1975.
            </p>
            
            <!-- Certifications -->
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold text-gray-900">Corporate Affairs Commission (CAC)</h3>
                  <p class="text-gray-600 text-sm">Registration: BN 2761001</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold text-gray-900">NIESV Member</h3>
                  <p class="text-gray-600 text-sm">Nigerian Institution of Estate Surveyors and Valuers</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="font-semibold text-gray-900">ESVARBON Licensed</h3>
                  <p class="text-gray-600 text-sm">Estate Surveyors and Valuers Registration Board, Act 1975</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="relative">
            <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 lg:p-12 shadow-2xl">
              <div class="text-white">
                <h3 class="text-2xl font-bold mb-6">Our Vision & Mission</h3>
                
                <div class="mb-8">
                  <div class="flex items-center mb-4">
                    <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                      </svg>
                    </div>
                    <h4 class="text-xl font-bold">Our Vision</h4>
                  </div>
                  <p class="text-blue-100 pl-16">
                    To redefine real estate practice with integrity and build a renowned reputation as Nigeria's most trusted valuers.
                  </p>
                </div>
                
                <div>
                  <div class="flex items-center mb-4">
                    <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h4 class="text-xl font-bold">Our Mission</h4>
                  </div>
                  <p class="text-blue-100 pl-16">
                    To provide outstanding and excellent real estate market services, ensuring every client receives tailored solutions that maximize their property value.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold mb-4">
            Our Expertise
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Comprehensive Real Estate Services
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            We offer a full spectrum of estate surveying and valuation services across Nigeria's major markets.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
    <section class="py-20 bg-white">
      <div class="container mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold mb-4">
            Market Coverage
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Strong Presence Across Nigeria
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            We have extensive expertise in Nigeria's key real estate markets, with specialized knowledge of each region's unique dynamics.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    <section class="py-20 bg-gradient-to-r from-gray-900 to-blue-900">
      <div class="container mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold mb-4">
            Client Testimonials
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            Our Journey So Far
          </h2>
          <p class="text-xl text-blue-200 max-w-3xl mx-auto">
            Trusted by property owners, investors, and institutions across Nigeria.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </div>
    </section>

    <!-- Contact CTA -->
    <section class="py-20">
      <div class="container mx-auto px-6 lg:px-8">
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 lg:p-16 shadow-2xl">
          <div class="text-center">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Maximize Your Property Value?
            </h2>
            <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Get in touch with our team of expert valuers for a consultation tailored to your needs.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact-us"
                class="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Contact Our Team
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </a>
              <a
                href="tel:+2349053901001"
                class="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                Call Now
              </a>
            </div>
          </div>
        </div>
        
        <!-- Contact Info -->
        <div class="mt-12 grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 m  'b-2">Office Address</h3>
            <p class="text-gray-600">Suite J260, Road 5<br>Ikota Shopping Complex, Ajah<br>Lekki, Lagos</p>
          </div>
          
          <div class="text-center">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex  items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Email Us</h3>
            <a href="mailto:kayodesegunandassociates@gmail.com" class="text-blue-600 hover:text-blue-800">
              kayodesegunandassociates@gmail.com
            </a>
          </div>
          
          <div class="text-center">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Call Us</h3>
            <div class="space-y-1">
              <a     href="tel:+2349053901001" class="text-blue-600 hover:text-blue-800 block">+234 905 390 1001</a>
              <a href="tel:+2348184796032" class="text-blue-600 hover:text-blue-800 block">+234 818 479 6032</a>
              <a href="tel:+2349053901802" class="text-blue-600 hover:text-blue-800 block">+234 905 390 1802</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ServiceCard from '@/components/sections/ServiceCard.vue'
import CityCard from '@/components/sections/CityCard.vue'
import TestimonialCard from '@/components/sections/TestimonialCard.vue'

const services = ref([
  {
    title: 'Property Valuation',
    description: 'Accurate market valuations for residential, commercial, and industrial properties.',
    icon: '📊'
  },
  {
    title: 'Asset Valuation',
    description: 'Comprehensive plant and equipment valuation for corporate clients.',
    icon: '🏭'
  },
  {
    title: 'Property Sales & Letting',
    description: 'End-to-end property transaction services for buyers, sellers, and tenants.',
    icon: '💰'
  },
  {
    title: 'Facility Management',
    description: 'Professional management and maintenance of residential and commercial properties.',
    icon: '🏢'
  },
  {
    title: 'Feasibility Appraisal',
    description: 'Detailed viability analysis for real estate development projects.',
    icon: '📈'
  },
  {
    title: 'Property Development',
    description: 'Full-cycle development consultancy from concept to completion.',
    icon: '🏗️'
  },
  {
    title: 'Real Estate Advisory',
    description: 'Strategic advice for property investment and portfolio management.',
    icon: '🎯'
  },
  {
    title: 'Legal & Regulatory',
    description: 'Guidance on real estate laws, regulations, and compliance.',
    icon: '⚖️'
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
</script>

<style scoped>
/* Smooth transitions */
section {
  scroll-margin-top: 80px;
}

/* Gradient text animation */
.text-gradient {
  background: linear-gradient(90deg, #1e40af, #3b82f6, #1d4ed8);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>