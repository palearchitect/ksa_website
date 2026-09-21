<template>
  <footer class="bg-slate-950 text-white relative overflow-hidden">
    <!-- Dark Wallpaper SVG Pattern Layer -->
    <PatternBackgroundDark />
    
    <!-- Top Gradient Hairline Accent -->
    <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/40 via-orange-500/40 to-transparent"></div>
    
    <!-- Ambient mesh background glows -->
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <!-- Brand & Certification Column -->
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <span class="text-xl font-extrabold tracking-tight text-white">
              KSA <span class="text-orange-500">Valuers</span>
            </span>
          </div>
          <p class="text-slate-400 text-xs md:text-sm leading-relaxed mb-5">
            Registered Estate Surveyors & Valuers offering audit-grade asset appraisals, project viability modeling, and automated property management across Nigeria.
          </p>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest-swiss uppercase text-slate-300 bg-white/5 border border-white/10">
            <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            NIESV & ESVARBON Certified
          </div>
        </div>

        <!-- Quick Navigation -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest-swiss text-slate-200 mb-5">
            Navigation
          </h4>
          <ul class="space-y-2.5 text-xs text-slate-400">
            <li><router-link to="/" class="hover:text-orange-400 transition-colors">Home</router-link></li>
            <li><router-link to="/about-us" class="hover:text-orange-400 transition-colors">About Our Practice</router-link></li>
            <li><router-link to="/properties" class="hover:text-orange-400 transition-colors">Properties Catalog</router-link></li>
            <li><router-link to="/projects" class="hover:text-orange-400 transition-colors">Development Projects</router-link></li>
            <li><router-link to="/blog" class="hover:text-orange-400 transition-colors">Insights & Market Reports</router-link></li>
          </ul>
        </div>

        <!-- Portals & Services -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest-swiss text-slate-200 mb-5">
            Client Services
          </h4>
          <ul class="space-y-2.5 text-xs text-slate-400">
            <li><router-link to="/book-a-tour" class="text-orange-400 hover:text-orange-300 font-semibold transition-colors">Book Inspection Tour →</router-link></li>
            <li><router-link to="/admin/login" class="hover:text-white transition-colors">Management Portal</router-link></li>
            <li><router-link to="/faq" class="hover:text-white transition-colors">Client FAQ</router-link></li>
            <li><router-link to="/principal-partner" class="hover:text-white transition-colors">Principal Partner</router-link></li>
            <li><router-link to="/team" class="hover:text-white transition-colors">Executive Team</router-link></li>
          </ul>
        </div>

        <!-- Contact & Location -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-widest-swiss text-slate-200 mb-5">
            Headquarters
          </h4>
          <p class="text-slate-400 text-xs leading-relaxed mb-3">
            Suite J260, Road 5 Ikota Shopping Complex, Lekki-Ajah Expressway, Lagos, Nigeria.
          </p>
          <div class="space-y-1.5 text-xs">
            <p class="text-slate-300 font-medium">Email: <a href="mailto:info@ksavaluers.com" class="text-blue-400 hover:underline">info@ksavaluers.com</a></p>
            <p class="text-slate-300 font-medium">Telephone: <a href="tel:+2349053901001" class="text-slate-200 hover:text-orange-400">+234 905 390 1001</a></p>
          </div>
        </div>
      </div>

      <!-- Footer Watermark -->
      <div class="absolute -bottom-12 -right-12 md:right-4 pointer-events-none select-none opacity-[0.05] overflow-hidden">
        <img
          src="@/assets/images/logo.png"
          class="w-72 md:w-[480px] object-contain filter grayscale invert"
          alt=""
          aria-hidden="true"
        />
      </div>

      <!-- Divider -->
      <div class="border-t border-slate-900 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
        <p class="mb-4 md:mb-0">&copy; 2026 KSA Valuers. All rights reserved. Registered Estate Surveyors & Valuers.</p>
        <div class="flex space-x-6">
          <router-link to="/privacy-policy" class="hover:text-slate-300 transition-colors">Privacy Policy</router-link>
          <router-link to="/terms-of-service" class="hover:text-slate-300 transition-colors">Terms of Service</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import PatternBackgroundDark from './PatternBackgroundDark.vue'
</script>

<style scoped>
</style>
