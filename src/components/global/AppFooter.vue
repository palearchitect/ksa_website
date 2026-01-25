<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <!-- Company Info -->
        <div>
          <h3 class="text-xl font-bold mb-4">KSA Valuers</h3>
          <p class="text-gray-400">Your trusted real estate partner for valuations and property management.</p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2 text-gray-400">
            <li><router-link to="/" class="hover:text-white transition-colors">Home</router-link></li>
            <li><router-link to="/about-us" class="hover:text-white transition-colors">About Us</router-link></li>
            <li><router-link to="/contact-us" class="hover:text-white transition-colors">Contact</router-link></li>
            <li><router-link to="/faq" class="hover:text-white transition-colors">FAQ</router-link></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Contact Us</h4>
          <p class="text-gray-400 mb-2">Email: info@ksavaluers.com</p>
          <p class="text-gray-400 mb-2">Phone: +234 905 390 1001</p>
          <p class="text-gray-400">Address:<br>Suite J260, Road 5 Ikota Shopping Complex, Lekki-Ajah, Lagos</p>
          </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-700 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 mb-4 md:mb-0">&copy; 2024 KSA Valuers. All rights reserved.</p>
          <div class="flex space-x-6">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
</style>
