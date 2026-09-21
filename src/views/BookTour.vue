<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-slate-50 relative pt-28 md:pt-36 pb-20 px-4 sm:px-6">
      <!-- Ambient Radial Mesh Lighting -->
      <div class="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(37,99,235,0.18),rgba(249,104,22,0.08)_50%,transparent_80%)] pointer-events-none"></div>

      <!-- Header -->
      <div class="relative max-w-2xl mx-auto text-center mb-10">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          VIP Private Scheduling
        </div>
        <h1 class="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
          Book an Exclusive <span class="text-gradient-brand">Property Tour</span>
        </h1>
        <p class="text-sm md:text-base text-slate-500 max-w-lg mx-auto font-normal leading-relaxed">
          Select your preferred viewing slot for an in-person, guided walkthrough with our certified estate surveyor.
        </p>
      </div>

      <!-- Main Booking Bento Card -->
      <div class="relative bento-card bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 md:p-10 w-full max-w-2xl mx-auto shadow-xl">
        <!-- Step Indicator Capsule -->
        <div class="flex justify-center mb-8">
          <div class="inline-flex items-center gap-3 p-1.5 rounded-full bg-slate-100 border border-slate-200/80 shadow-inner">
            <div :class="['flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all', currentStep === 1 ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md' : 'text-slate-500']">
              <span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
              <span>Select Date & Time</span>
            </div>
            <div :class="['flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all', currentStep === 2 ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md' : 'text-slate-500']">
              <span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
              <span>Client Information</span>
            </div>
          </div>
        </div>

        <!-- Step 1: Select Date & Time -->
        <div v-if="currentStep === 1">
          <div class="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <h2 class="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span class="w-1.5 h-4 bg-orange-500 rounded-full"></span>
              Calendar & Time Schedule
            </h2>
            <span class="text-xs text-slate-400 font-medium">Standard Slot: 45 Mins</span>
          </div>
          
          <!-- Property Selection (if applicable) -->
          <div v-if="properties.length > 0" class="mb-6">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Select Specific Property (Optional)
            </label>
            <select v-model="selectedPropertyId" 
                    @change="loadPropertyDetails"
                    class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50 text-sm font-medium transition-all">
              <option value="">-- Choose a property listing --</option>
              <option v-for="property in properties" :key="property.id" :value="property.id">
                {{ property.title || `Property #${property.id}` }}
              </option>
            </select>
            
            <!-- Property Preview -->
            <div v-if="selectedPropertyDetails" class="mt-4 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
              <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-900">{{ selectedPropertyDetails.title }}</h4>
                <p v-if="selectedPropertyDetails.address" class="text-xs text-slate-600 mt-0.5">
                  {{ selectedPropertyDetails.address }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Calendar -->
          <div class="mb-8 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
            <div class="flex items-center justify-between mb-4">
              <button @click="previousMonth" :disabled="loadingSlots" class="p-2 hover:bg-white rounded-xl disabled:opacity-50 transition border border-transparent hover:border-slate-200 shadow-sm">
                <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 class="text-sm font-extrabold uppercase tracking-widest text-slate-900">{{ currentMonth }} {{ currentYear }}</h3>
              <button @click="nextMonth" :disabled="loadingSlots" class="p-2 hover:bg-white rounded-xl disabled:opacity-50 transition border border-transparent hover:border-slate-200 shadow-sm">
                <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Calendar Grid -->
            <div class="grid grid-cols-7 gap-1.5 mb-2">
              <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" 
                   class="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 py-1">
                {{ day }}
              </div>
              <div v-for="(day, index) in calendarDays" :key="index"
                   @click="selectDate(day.date)"
                   :class="[
                     'h-10 rounded-xl flex items-center justify-center cursor-pointer transition text-xs font-semibold relative',
                     day.isCurrentMonth ? 'hover:bg-blue-100/60 text-slate-800' : 'text-slate-300',
                     isDateSelected(day.date) ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md font-bold' : '',
                     day.isToday && !isDateSelected(day.date) ? 'border border-blue-500 text-blue-600' : '',
                     day.isPast ? 'cursor-not-allowed opacity-40 hover:bg-transparent' : '',
                     day.hasLimitedSlots && !isDateSelected(day.date) ? 'bg-orange-50 text-orange-700' : '',
                     day.isFullyBooked ? 'bg-red-50 text-red-400 cursor-not-allowed' : ''
                   ]"
                   :disabled="day.isPast || day.isFullyBooked">
                {{ day.day }}
                <span v-if="day.slotsAvailable > 0 && day.slotsAvailable <= 2 && !isDateSelected(day.date)" 
                      class="absolute top-1 right-1 w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
              </div>
            </div>
            
            <!-- Loading state for slots -->
            <div v-if="loadingSlots" class="text-center py-4">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>

          <!-- Time Slots -->
          <div v-if="!loadingSlots">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Available Inspection Hours</h3>
            <div v-if="availableTimeSlots.length === 0" class="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200">
              <svg class="w-10 h-10 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-xs font-semibold text-slate-600">No available slots for this date.</p>
              <p class="text-[11px] text-slate-400 mt-0.5">Please select another date on the calendar.</p>
            </div>
            <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button v-for="slot in availableTimeSlots" :key="slot.time"
                      @click="selectTime(slot.time)"
                      :disabled="slot.isBooked"
                      :class="[
                        'py-2.5 px-3 rounded-xl border text-xs font-semibold transition relative text-center',
                        selectedTime === slot.time && !slot.isBooked
                          ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white border-blue-600 shadow-md' 
                          : slot.isBooked
                          ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50'
                      ]">
                {{ slot.time }}
                <span v-if="slot.isBooked" class="text-[9px] block text-red-500 uppercase font-bold">Booked</span>
              </button>
            </div>
          </div>

          <!-- Next Button -->
          <div class="mt-8">
            <button @click="nextStep"
                    :disabled="!selectedDate || !selectedTime || loadingSlots"
                    :class="[
                      'w-full py-4 px-6 rounded-full font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2',
                      selectedDate && selectedTime && !loadingSlots
                        ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-orange-500 hover:from-blue-800 hover:to-orange-600 text-white shadow-glow-orange hover:shadow-xl transform active:scale-[0.99]'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    ]">
              <span>Continue to Client Details</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

      <!-- Step 2: Basic Details -->
      <div v-if="currentStep === 2">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Your Information</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input v-model="bookingDetails.name"
                   type="text"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="Enter your full name"
                   required>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input v-model="bookingDetails.email"
                   type="email"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="your.email@example.com"
                   required>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input v-model="bookingDetails.phone"
                   type="tel"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="+234 800 000 0000"
                   required>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Number of Guests
            </label>
            <input v-model="bookingDetails.guests"
                   type="number"
                   min="1"
                   max="10"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="1">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes (Optional)
            </label>
            <textarea v-model="bookingDetails.notes"
                      rows="3"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Any specific requirements or questions..."></textarea>
          </div>
          
          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <input v-model="bookingDetails.termsAccepted"
                   type="checkbox"
                   id="terms"
                   class="mt-1 mr-3">
            <label for="terms" class="text-sm text-gray-600">
              I agree to receive confirmation emails and understand that this booking is subject to availability confirmation.
            </label>
          </div>
        </div>

        <!-- Booking Summary -->
        <div class="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 class="font-medium text-gray-900 mb-2">Booking Summary</h3>
          <div class="space-y-1 text-sm text-gray-600">
            <div class="flex justify-between">
              <span>Date:</span>
              <span class="font-medium">{{ formatDate(selectedDate) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Time:</span>
              <span class="font-medium">{{ selectedTime }}</span>
            </div>
            <div v-if="selectedPropertyDetails" class="flex justify-between">
              <span>Property:</span>
              <span class="font-medium">{{ selectedPropertyDetails.title }}</span>
            </div>
            <div class="mt-3 pt-3 border-t border-blue-200">
              <p class="text-xs text-gray-500">
                Your booking will be confirmed after we receive your request and verify availability.
                A confirmation email will be sent to {{ bookingDetails.email || 'your email' }}.
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex gap-4">
          <button @click="previousStep"
                  :disabled="isSubmitting"
                  class="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50">
            Back
          </button>
          <button @click="submitBooking"
                  :disabled="!isFormValid || isSubmitting"
                  :class="[
                    'flex-1 py-3 px-4 rounded-lg font-medium transition flex items-center justify-center',
                    isFormValid && !isSubmitting
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  ]">
            <span v-if="isSubmitting" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>Confirm Booking</span>
          </button>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="bookingSuccess" class="text-center py-8">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Booking Request Submitted!</h2>
        <p class="text-gray-600 mb-4">
          Your tour request for <strong>{{ formatDate(selectedDate) }} at {{ selectedTime }}</strong> has been received.
        </p>
        
        <!-- Booking ID -->
        <div class="inline-block bg-blue-50 px-4 py-2 rounded-lg mb-6">
          <span class="text-sm text-gray-600">Booking ID:</span>
          <span class="ml-2 font-mono font-bold text-blue-700">{{ bookingId }}</span>
        </div>
        
        <!-- Contact Information -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg text-left">
          <h3 class="font-medium text-gray-900 mb-3">Next Steps:</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Confirmation email sent to <strong>{{ bookingDetails.email }}</strong></span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Our team will contact you at <strong>{{ bookingDetails.phone }}</strong> within 24 hours</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-purple-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <span>For immediate assistance: <strong>+234 905 390 1001</strong></span>
            </li>
          </ul>
        </div>

        <!-- Print/Download Options -->
        <div class="mt-6 flex gap-3 justify-center">
          <button @click="printConfirmation"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Confirmation
          </button>
          <button @click="addToCalendar"
                  class="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add to Calendar
          </button>
        </div>

        <button @click="resetBooking"
                class="mt-6 py-2 px-6 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition">
          Book Another Tour
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="bookingError" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-red-700">{{ bookingError }}</span>
        </div>
        <button @click="bookingError = null" class="mt-2 text-sm text-red-600 hover:text-red-800">
          Try Again
        </button>
      </div>
    </div>

    <!-- Contact Footer -->
    <div class="mt-8 text-center">
      <div class="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Need Immediate Assistance?</h3>
        <p class="text-gray-600 mb-4">Contact our booking team directly</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+2349053901001" 
             class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Now
          </a>
          <a href="mailto:bookings@ksavaluers.com" 
             class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Us
          </a>
        </div>
      </div>
      <p class="mt-4 text-gray-500 text-sm">© {{ new Date().getFullYear() }} Kayode Segun & Associates. All rights reserved.</p>
    </div>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import ErrorBoundary from '../components/global/ErrorBoundary.vue'
import { useSEO } from '../hooks/useSEO'
useSEO({
  title: 'Book a Property Tour',
  description: 'Schedule a viewing of your desired property with KSA Valuers.'
})
import { ref, computed, onMounted, watch } from 'vue'
import { propertyService, bookingService, emailService } from '@/services/api'
import { useBookingStore } from '@/stores/bookingStore'
import { captureEvent } from '@/plugins/posthog'

const bookingStore = useBookingStore()

// State management
const currentStep = ref(1)
const bookingError = ref(null)
const isSubmitting = ref(false)
const loadingSlots = ref(false)
const properties = ref([])
const selectedPropertyId = ref('')
const selectedPropertyDetails = ref(null)
const bookingSuccess = ref(false)

// Calendar state
const currentDate = ref(new Date())
const selectedDate = ref(null)
const selectedTime = ref(null)
const availableTimeSlots = ref([])

// Booking details
const bookingDetails = ref({
  name: '',
  email: '',
  phone: '',
  guests: 1,
  notes: '',
  termsAccepted: false
})

const bookingId = ref('')

// Form validation
const isFormValid = computed(() => {
  return bookingDetails.value.name && 
         bookingDetails.value.email && 
         bookingDetails.value.phone &&
         bookingDetails.value.termsAccepted &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingDetails.value.email)
})

// Computed calendar properties
const currentMonth = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long' })
})

const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDay = firstDay.getDay()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const days = []
  
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startingDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i)
    days.push({
      day: prevMonthLastDay - i,
      date: date,
      isCurrentMonth: false,
      isToday: false,
      isPast: date < today,
      slotsAvailable: 0,
      hasLimitedSlots: false,
      isFullyBooked: false
    })
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    // Check availability for this date
    const slotsForDate = checkDateAvailability(date)
    days.push({
      day: i,
      date: date,
      isCurrentMonth: true,
      isToday: date.getDate() === today.getDate() && 
               date.getMonth() === today.getMonth() && 
               date.getFullYear() === today.getFullYear(),
      isPast: date < today,
      slotsAvailable: slotsForDate.available,
      hasLimitedSlots: slotsForDate.available > 0 && slotsForDate.available <= 2,
      isFullyBooked: slotsForDate.available === 0
    })
  }
  
  // Next month days
  const totalCells = 42
  const remainingCells = totalCells - days.length
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      day: i,
      date: date,
      isCurrentMonth: false,
      isToday: false,
      isPast: date < today,
      slotsAvailable: 0,
      hasLimitedSlots: false,
      isFullyBooked: false
    })
  }
  
  return days
})

// Methods
const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  loadAvailableSlots()
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  loadAvailableSlots()
}

const selectDate = async (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (date >= today && !date.isPast) {
    selectedDate.value = date
    selectedTime.value = null
    await loadAvailableSlots()
  }
}

const selectTime = (time) => {
  selectedTime.value = time
}

const isDateSelected = (date) => {
  if (!selectedDate.value) return false
  return date.getDate() === selectedDate.value.getDate() &&
         date.getMonth() === selectedDate.value.getMonth() &&
         date.getFullYear() === selectedDate.value.getFullYear()
}

const formatDate = (date) => {
  if (!date) return ''
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateForAPI = (date) => {
  if (!date) return ''
  return date.toISOString().split('T')[0] // YYYY-MM-DD
}

const checkDateAvailability = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date < today) return { available: 0 }

  const dateStr = formatDateForAPI(date)
    const available = availableTimeSlots.value.filter(s => !s.isBooked).length

  return { available }
}

const loadAvailableSlots = async () => {
  if (!selectedDate.value) return
  
  loadingSlots.value = true
  try {
    const dateStr = formatDateForAPI(selectedDate.value)
    
    const response = await bookingService.getAvailableSlots(dateStr, selectedPropertyId.value || null)
    availableTimeSlots.value = response.data || []
    
  } catch (error) {
    console.error('Error loading available slots:', error)
    availableTimeSlots.value = []
  } finally {
    loadingSlots.value = false
  }
}

const loadProperties = async () => {
  try {
    const response = await propertyService.getProperties({
      pageSize: 50,
      sort: 'title:asc'
    })
    properties.value = response.data || []
  } catch (error) {
    console.error('Error loading properties:', error)
  }
}

const loadPropertyDetails = async () => {
  if (!selectedPropertyId.value) {
    selectedPropertyDetails.value = null
    return
  }
  
  try {
    const response = await propertyService.getPropertyById(selectedPropertyId.value)
    selectedPropertyDetails.value = response.data || null
  } catch (error) {
    console.error('Error loading property details:', error)
  }
}

const nextStep = () => {
  if (selectedDate.value && selectedTime.value) {
    captureEvent('tour_booking_details_started', {
      has_selected_property: Boolean(selectedPropertyId.value)
    })
    currentStep.value = 2
  }
}

const previousStep = () => {
  currentStep.value = 1
}

// Enhanced submitBooking function
const submitBooking = async () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  bookingError.value = null
  
  try {
    // Prepare booking data
    const bookingData = {
      name: bookingDetails.value.name,
      email: bookingDetails.value.email,
      phone: bookingDetails.value.phone,
      date: formatDateForAPI(selectedDate.value),
      time: selectedTime.value,
      guests: bookingDetails.value.guests,
      notes: bookingDetails.value.notes,
      status: 'pending',
      property: selectedPropertyId.value || null,
      termsAccepted: bookingDetails.value.termsAccepted,
      bookingSource: 'website'
    }
    
    const newBooking = await bookingService.createBooking(bookingData)
    await bookingStore.loadBookings()
    bookingId.value = newBooking.data.id
    
    // 2. Optional: Send confirmation email (if backend is set up)
    try {
      await emailService.sendBookingConfirmation({
        ...bookingData,
        bookingId: bookingId.value,
        formattedDate: formatDate(selectedDate.value)
      })
    } catch (emailError) {
      console.log('Email service not available:', emailError)
    }
    
    // 3. Optional: Send admin notification
    try {
      await emailService.sendAdminNotification({
        ...bookingData,
        bookingId: bookingId.value,
        formattedDate: formatDate(selectedDate.value)
      })
    } catch (emailError) {
      console.log('Email notification not available:', emailError)
    }
     
    // Update UI
    bookingSuccess.value = true
    currentStep.value = 3
    captureEvent('tour_booking_submitted', {
      property_id: selectedPropertyId.value || undefined,
      guest_count: Number(bookingDetails.value.guests) || 1,
      booking_source: 'website'
    })
    
  } catch (error) {
    console.error('Booking error:', error)
    bookingError.value = 'There was an error submitting your booking. Please try again or contact us directly.'
    
    // If it's a duplicate booking error
    if (error.response?.status === 409) {
      bookingError.value = 'This time slot appears to be already booked. Please select a different time.'
      await loadAvailableSlots() // Refresh slots
    }
  } finally {
    isSubmitting.value = false
  }
}

const resetBooking = () => {
  currentStep.value = 1
  bookingSuccess.value = false
  bookingError.value = null
  selectedDate.value = null
  selectedTime.value = null
  selectedPropertyId.value = ''
  selectedPropertyDetails.value = null
  availableTimeSlots.value = []
  bookingId.value = ''
  bookingDetails.value = {
    name: '',
    email: '',
    phone: '',
    guests: 1,
    notes: '',
    termsAccepted: false
  }
}

const printConfirmation = () => {
  const printContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1b4d84;">Kayode Segun & Associates</h2>
      <h3 style="color: #374151;">Tour Booking Confirmation</h3>
      <hr style="margin: 20px 0;">
      <p><strong>Booking ID:</strong> ${bookingId.value}</p>
      <p><strong>Date:</strong> ${formatDate(selectedDate.value)}</p>
      <p><strong>Time:</strong> ${selectedTime.value}</p>
      ${selectedPropertyDetails.value ? `<p><strong>Property:</strong> ${selectedPropertyDetails.value.title}</p>` : ''}
      <p><strong>Name:</strong> ${bookingDetails.value.name}</p>
      <p><strong>Email:</strong> ${bookingDetails.value.email}</p>
      <p><strong>Phone:</strong> ${bookingDetails.value.phone}</p>
      ${bookingDetails.value.guests > 1 ? `<p><strong>Guests:</strong> ${bookingDetails.value.guests}</p>` : ''}
      <hr style="margin: 20px 0;">
      <p style="font-size: 12px; color: #6b7280;">
        Please bring this confirmation and a valid ID to your tour.<br>
        Contact: +234 905 390 1001 | bookings@kayodesegun.com
      </p>
    </div>
  `
  
  const printWindow = window.open('', '_blank')
  printWindow.document.write(printContent)
  printWindow.document.close()
  printWindow.print()
}

const addToCalendar = () => {
  // Create iCal event
  const startDate = new Date(selectedDate.value)
  const [time, modifier] = selectedTime.value.split(' ')
  let [hours, minutes] = time.split(':').map(Number)
  
  if (modifier === 'PM' && hours < 12) hours += 12
  if (modifier === 'AM' && hours === 12) hours = 0
  
  startDate.setHours(hours, minutes, 0)
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // 1 hour later
  
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Property Tour - Kayode Segun & Associates
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DESCRIPTION:Property tour booking (ID: ${bookingId.value})\\nContact: +234 905 390 1001
LOCATION:Kayode Segun & Associates Office
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT15M
DESCRIPTION:Reminder
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`
  
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `property-tour-${bookingId.value}.ics`
  link.click()
}

// Initialize
onMounted(async () => {
  const today = new Date()
  selectedDate.value = today
  await loadProperties()
  await loadAvailableSlots()
})

// Watch for date changes
watch(selectedDate, loadAvailableSlots)
</script>

<style scoped>
/* Custom styles */
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

button, div[class*="cursor-pointer"] {
  transition: all 0.2s ease-in-out;
}

div[class*="cursor-pointer"]:hover:not(:disabled) {
  transform: scale(1.05);
}

/* Smooth transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Calendar day indicators */
.relative {
  position: relative;
}

/* Loading animation */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>