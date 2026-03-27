<template>
  <ErrorBoundary>
    <!-- Loading State -->
    <LoadingState v-if="loading" message="Loading property details..." />

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="text-center max-w-md">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button 
          @click="loadProperty" 
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!property" class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="text-center max-w-md">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
        <p class="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <router-link 
          to="/properties" 
          class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Browse Properties
        </router-link>
      </div>
    </div>

    <!-- Property Content -->
    <div v-else class="min-h-screen bg-gray-50">
      <!-- Breadcrumb -->
      <nav class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center space-x-2 text-sm">
            <router-link to="/" class="text-gray-500 hover:text-gray-700">Home</router-link>
            <span class="text-gray-400">/</span>
            <router-link to="/properties" class="text-gray-500 hover:text-gray-700">Properties</router-link>
            <span class="text-gray-400">/</span>
            <span class="text-gray-900 font-medium truncate max-w-xs">{{ property.title }}</span>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Left Column -->
          <div class="lg:w-2/3">
            <!-- Main Image -->
            <div class="relative rounded-2xl overflow-hidden shadow-lg mb-4 bg-gray-100">
              <div v-if="imageError" class="w-full h-96 flex items-center justify-center bg-gray-200">
                <svg class="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <img 
                v-else
                :src="currentImage" 
                :alt="property.title" 
                class="w-full h-96 object-cover"
                @error="handleImageError"
              >
              
              <!-- Status Badge -->
              <div class="absolute top-4 left-4">
                <span :class="statusBadgeClass" class="px-4 py-2 rounded-full text-sm font-semibold">
                  {{ property.status === 'sale' ? 'For Sale' : 'For Rent' }}
                </span>
              </div>

              <!-- Favorite Button -->
              <button 
                @click="toggleFavorite" 
                class="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition"
              >
                <svg 
                  class="w-6 h-6" 
                  :class="isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
              </button>

              <!-- Featured Badge -->
              <div v-if="property.featured" class="absolute bottom-4 left-4">
                <span class="px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                  ★ Featured
                </span>
              </div>
            </div>

            <!-- Thumbnails -->
            <div v-if="hasMultipleImages" class="grid grid-cols-4 gap-4 mb-8">
              <button 
                v-for="(img, index) in property.images" 
                :key="index"
                @click="changeImage(img)"
                class="relative rounded-lg overflow-hidden border-2 transition hover:opacity-90"
                :class="currentImage === img ? 'border-blue-500' : 'border-transparent'"
              >
                <img 
                  :src="img" 
                  :alt="`${property.title} - ${index + 1}`"
                  class="w-full h-20 object-cover bg-gray-100"
                  @error="handleThumbnailError"
                >
              </button>
            </div>

            <!-- Property Details -->
            <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{{ property.title }}</h1>
              
              <!-- Location -->
              <div class="flex items-center mb-6">
                <svg class="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-gray-600">{{ property.location }}</span>
              </div>

              <!-- Price -->
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p class="text-3xl md:text-4xl font-bold text-gray-900">{{ formatPrice(property.price) }}</p>
                    <p class="text-gray-600 mt-1">
                      {{ property.status === 'sale' ? 'Sale Price' : 'Monthly Rent' }}
                    </p>
                  </div>
                  <button 
                    @click="openBookingModal" 
                    class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
                  >
                    Book a Tour
                  </button>
                </div>
              </div>

              <!-- Key Features -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="text-center p-4 bg-gray-50 rounded-xl">
                  <div class="text-xl md:text-2xl font-bold text-blue-600 mb-2">{{ property.bedrooms || 0 }}</div>
                  <div class="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-xl">
                  <div class="text-xl md:text-2xl font-bold text-blue-600 mb-2">{{ property.bathrooms || 0 }}</div>
                  <div class="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-xl">
                  <div class="text-xl md:text-2xl font-bold text-blue-600 mb-2">{{ property.size || 'N/A' }}</div>
                  <div class="text-sm text-gray-600">Sq Ft</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-xl">
                  <div class="text-xl md:text-2xl font-bold text-blue-600 mb-2">{{ property.yearBuilt || 'N/A' }}</div>
                  <div class="text-sm text-gray-600">Year Built</div>
                </div>
              </div>

              <!-- Description -->
              <div class="mb-8">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p class="text-gray-700 leading-relaxed">{{ property.description }}</p>
                <p v-if="property.additionalDescription" class="text-gray-700 leading-relaxed mt-4">
                  {{ property.additionalDescription }}
                </p>
              </div>

              <!-- Amenities -->
              <div v-if="property.amenities?.length" class="mb-8">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div v-for="amenity in property.amenities" :key="amenity" class="flex items-center">
                    <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-gray-700">{{ amenity }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="lg:w-1/3">
            <!-- Agent Card -->
            <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Contact Agent</h3>
              
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  {{ agentInitials }}
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">{{ agentName }}</h4>
                  <p class="text-sm text-gray-600">Licensed Agent</p>
                </div>
              </div>

              <div class="space-y-3 mb-6">
                <div class="flex items-center text-gray-600">
                  <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span class="text-sm">{{ agentPhone }}</span>
                </div>
                <div class="flex items-center text-gray-600">
                  <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="text-sm">{{ agentEmail }}</span>
                </div>
              </div>

              <div class="space-y-3">
                <button 
                  @click="openContactModal" 
                  class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
                >
                  Contact Agent
                </button>
                <button 
                  @click="openScheduleModal" 
                  class="w-full py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
                >
                  Schedule Viewing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <Teleport to="body">
        <!-- Booking Modal -->
        <div v-if="showBookingModal" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeAllModals"></div>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Book a Tour</h3>
                <form @submit.prevent="submitBooking" class="space-y-4">
                  <input 
                    v-model="bookingForm.name" 
                    type="text" 
                    required 
                    placeholder="Full Name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <input 
                    v-model="bookingForm.email" 
                    type="email" 
                    required 
                    placeholder="Email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <input 
                    v-model="bookingForm.phone" 
                    type="tel" 
                    required 
                    placeholder="Phone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <input 
                    v-model="bookingForm.date" 
                    type="date" 
                    required 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <input 
                    v-model="bookingForm.time" 
                    type="time" 
                    required 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <div class="flex justify-end space-x-3 mt-5">
                    <button 
                      type="button" 
                      @click="closeAllModals"
                      class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Modal -->
        <div v-if="showContactModal" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeAllModals"></div>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Contact Agent</h3>
                <form @submit.prevent="submitContact" class="space-y-4">
                  <input 
                    v-model="contactForm.name" 
                    type="text" 
                    required 
                    placeholder="Your Name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <input 
                    v-model="contactForm.email" 
                    type="email" 
                    required 
                    placeholder="Your Email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <textarea 
                    v-model="contactForm.message" 
                    required 
                    placeholder="Your Message"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                  <div class="flex justify-end space-x-3 mt-5">
                    <button 
                      type="button" 
                      @click="closeAllModals"
                      class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Schedule Modal -->
        <div v-if="showScheduleModal" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeAllModals"></div>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Schedule Viewing</h3>
                <form @submit.prevent="submitSchedule" class="space-y-4">
                  <input 
                    v-model="scheduleForm.name" 
                    type="text" 
                    required 
                    placeholder="Your Name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <input 
                    v-model="scheduleForm.email" 
                    type="email" 
                    required 
                    placeholder="Your Email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <input 
                    v-model="scheduleForm.date" 
                    type="date" 
                    required 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <input 
                    v-model="scheduleForm.time" 
                    type="time" 
                    required 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <div class="flex justify-end space-x-3 mt-5">
                    <button 
                      type="button" 
                      @click="closeAllModals"
                      class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Schedule
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ErrorBoundary from '../components/global/ErrorBoundary.vue'
import LoadingState from '../components/global/LoadingState.vue'
import { useSEO } from '../hooks/useSEO'

// SEO
useSEO({
  title: 'Property Details',
  description: 'View detailed information about this property.'
})

const route = useRoute()
const router = useRouter()

// State
const loading = ref(true)
const error = ref(null)
const property = ref(null)
const currentImage = ref('')
const isFavorite = ref(false)
const imageError = ref(false)

// Modal state
const showBookingModal = ref(false)
const showContactModal = ref(false)
const showScheduleModal = ref(false)

// Form state
const bookingForm = reactive({ name: '', email: '', phone: '', date: '', time: '' })
const contactForm = reactive({ name: '', email: '', message: '' })
const scheduleForm = reactive({ name: '', email: '', date: '', time: '' })

// Computed
const statusBadgeClass = computed(() => {
  return property.value?.status === 'sale'
    ? 'bg-green-100 text-green-800'
    : 'bg-blue-100 text-blue-800'
})

const hasMultipleImages = computed(() => {
  return property.value?.images?.length > 1
})

const agentInitials = computed(() => {
  const name = property.value?.agent?.name || 'KSA Valuers'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const agentName = computed(() => {
  return property.value?.agent?.name || 'KSA Valuers Agent'
})

const agentPhone = computed(() => {
  return property.value?.agent?.phone || '+234 800 000 0000'
})

const agentEmail = computed(() => {
  return property.value?.agent?.email || 'info@ksavaluers.com'
})

// Methods
const loadProperty = async () => {
  loading.value = true
  error.value = null
  imageError.value = false
  
  try {
    const propertyId = route.params.id
    
    // Try to fetch from API
    try {
      const response = await fetch(`/api/properties/${propertyId}`)
      if (response.ok) {
        property.value = await response.json()
      } else {
        // Use mock data for demo
        property.value = getMockProperty(propertyId)
      }
    } catch {
      // Use mock data if API fails
      property.value = getMockProperty(propertyId)
    }
    
    currentImage.value = property.value.images?.[0] || ''
    
    // Check favorites
    const favorites = JSON.parse(localStorage.getItem('propertyFavorites') || '[]')
    isFavorite.value = favorites.includes(Number(property.value.id))
    
  } catch (err) {
    console.error('Failed to load property:', err)
    error.value = 'Failed to load property details'
  } finally {
    loading.value = false
  }
}

const getMockProperty = (id) => ({
  id: Number(id) || 1,
  title: 'Luxury Villa in Banana Island',
  location: 'Banana Island, Lagos',
  price: 250000000,
  status: 'sale',
  bedrooms: 5,
  bathrooms: 6,
  size: '5,000',
  yearBuilt: 2020,
  description: 'Magnificent luxury villa with panoramic ocean views, private pool, and state-of-the-art amenities.',
  additionalDescription: 'The villa includes a chef\'s kitchen, home theater, and smart home automation.',
  amenities: ['Swimming Pool', 'Gym', 'Home Theater', 'Garden', 'Security', 'Generator'],
  images: [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    'https://images.unsplash.com/photo-1567496898669-ee935f003f30?w=800'
  ],
  featured: true,
  agent: {
    name: 'Akinyele Abiodun',
    phone: '+234 800 123 4567',
    email: 'abiodun@ksavaluers.com'
  }
})

const handleImageError = () => {
  imageError.value = true
}

const handleThumbnailError = (e) => {
  e.target.src = 'https://via.placeholder.com/150?text=No+Image'
}

const changeImage = (img) => {
  currentImage.value = img
  imageError.value = false
}

const toggleFavorite = () => {
  const favorites = JSON.parse(localStorage.getItem('propertyFavorites') || '[]')
  const propertyId = Number(property.value.id)
  
  if (isFavorite.value) {
    const index = favorites.indexOf(propertyId)
    if (index > -1) favorites.splice(index, 1)
  } else {
    favorites.push(propertyId)
  }
  
  localStorage.setItem('propertyFavorites', JSON.stringify(favorites))
  isFavorite.value = !isFavorite.value
}

const formatPrice = (price) => {
  if (!price && price !== 0) return 'Price on request'
  
  const num = Number(price)
  if (isNaN(num)) return 'Price on request'
  
  if (num >= 1000000) {
    return `₦${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `₦${(num / 1000).toFixed(1)}K`
  }
  
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(num)
}

// Modal handlers
const openBookingModal = () => {
  // Navigate to the full Book a Tour page with property pre-selected
  router.push({ path: '/book-a-tour', query: { property: property.value?.id } })
}

const openContactModal = () => {
  showContactModal.value = true
}

const openScheduleModal = () => {
  showScheduleModal.value = true
}

const closeAllModals = () => {
  showBookingModal.value = false
  showContactModal.value = false
  showScheduleModal.value = false
  
  // Reset forms
  Object.assign(bookingForm, { name: '', email: '', phone: '', date: '', time: '' })
  Object.assign(contactForm, { name: '', email: '', message: '' })
  Object.assign(scheduleForm, { name: '', email: '', date: '', time: '' })
}

const bookingMessage = ref('')
const contactMessage = ref('')
const scheduleMessage = ref('')

const submitBooking = async () => {
  try {
    const { useBookingStore } = await import('@/stores/bookingStore')
    const bookingStore = useBookingStore()
    bookingStore.createBooking({
      name: bookingForm.name,
      email: bookingForm.email,
      phone: bookingForm.phone,
      date: bookingForm.date,
      time: bookingForm.time,
      property: property.value?.id || null,
      status: 'pending'
    })
    bookingMessage.value = 'Booking request submitted! We will contact you soon.'
    setTimeout(() => { closeAllModals(); bookingMessage.value = '' }, 2000)
  } catch (err) {
    bookingMessage.value = 'Failed to submit booking. Please try again.'
  }
}

const submitContact = async () => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: contactForm.name,
        email: contactForm.email,
        subject: `Property Inquiry: ${property.value?.title || 'Property'}`,
        message: contactForm.message
      })
    })
    contactMessage.value = 'Message sent to agent!'
    setTimeout(() => { closeAllModals(); contactMessage.value = '' }, 2000)
  } catch (err) {
    contactMessage.value = 'Failed to send message. Please try again.'
  }
}

const submitSchedule = async () => {
  try {
    const { useBookingStore } = await import('@/stores/bookingStore')
    const bookingStore = useBookingStore()
    bookingStore.createBooking({
      name: scheduleForm.name,
      email: scheduleForm.email,
      date: scheduleForm.date,
      time: scheduleForm.time,
      property: property.value?.id || null,
      status: 'pending',
      notes: `Scheduled viewing for: ${property.value?.title || 'Property'}`
    })
    scheduleMessage.value = 'Viewing scheduled! We will confirm shortly.'
    setTimeout(() => { closeAllModals(); scheduleMessage.value = '' }, 2000)
  } catch (err) {
    scheduleMessage.value = 'Failed to schedule viewing. Please try again.'
  }
}

// Lifecycle
onMounted(() => {
  loadProperty()
})

// Watch for route changes
watch(() => route.params.id, () => {
  loadProperty()
})
</script>

<style scoped>
.sticky {
  position: sticky;
  top: 1.5rem;
}

@media (max-width: 1024px) {
  .sticky {
    position: static;
  }
}
</style>