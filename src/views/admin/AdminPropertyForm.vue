<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">{{ isEditing ? 'Edit Property' : 'Add New Property' }}</h1>
        <router-link to="/admin/properties" class="text-gray-600 hover:text-gray-900 flex items-center gap-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Properties
        </router-link>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center justify-between">
        <span>{{ successMessage }}</span>
        <button @click="successMessage = ''" class="text-green-600 hover:text-green-800">&times;</button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
        <span>{{ errorMessage }}</span>
        <button @click="errorMessage = ''" class="text-red-600 hover:text-red-800">&times;</button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-8">
        <!-- Basic Information -->
        <section>
          <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Basic Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input v-model="formData.title" type="text" required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Luxury Villa in Banana Island">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select v-model="formData.status" required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Select Status --</option>
                <option v-for="s in propertyStore.PROPERTY_STATUS" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select v-model="formData.type" required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Select Type --</option>
                <option v-for="t in propertyStore.PROPERTY_TYPES" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
              <input v-model.number="formData.price" type="number" required min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 250000000">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <select v-model="formData.location" required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Select Location --</option>
                <option v-for="loc in propertyStore.NIGERIAN_LOCATIONS" :key="loc" :value="loc">{{ loc }}</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Property Details -->
        <section>
          <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Property Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <input v-model.number="formData.bedrooms" type="number" min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <input v-model.number="formData.bathrooms" type="number" min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Square Footage</label>
              <input v-model.number="formData.squareFootage" type="number" min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0">
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea v-model="formData.description" rows="4" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the property..."></textarea>
          </div>
        </section>

        <!-- Image -->
        <section>
          <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Image</h2>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input v-model="formData.image" type="url"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg">
            <p class="text-xs text-gray-500 mt-1">Paste a direct URL to the property image.</p>
          </div>
          <div v-if="formData.image" class="mt-3">
            <img :src="formData.image" alt="Preview" class="w-48 h-32 object-cover rounded-lg border" @error="imagePreviewError = true">
            <p v-if="imagePreviewError" class="text-xs text-red-500 mt-1">Could not load image preview.</p>
          </div>
        </section>

        <!-- Contact Information -->
        <section>
          <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Contact Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
              <input v-model="formData.agentName" type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. John Smith">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Agent Phone</label>
              <input v-model="formData.agentPhone" type="tel"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+234 800 000 0000">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Agent Email</label>
              <input v-model="formData.agentEmail" type="email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="agent@ksavaluers.com">
            </div>
          </div>
        </section>

        <!-- Amenities -->
        <section>
          <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Amenities</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label v-for="amenity in availableAmenities" :key="amenity" class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" :value="amenity" v-model="formData.amenities"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              <span class="text-sm text-gray-700">{{ amenity }}</span>
            </label>
          </div>
        </section>

        <!-- Tags & Featured -->
        <section>
          <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Tags & Visibility</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input v-model="tagsInput" type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="luxury, waterfront, modern">
            </div>
            <div class="flex items-center pt-6">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" v-model="formData.featured"
                  class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                <div>
                  <span class="text-sm font-medium text-gray-900">Featured Property</span>
                  <p class="text-xs text-gray-500">Show this property in featured sections on the homepage.</p>
                </div>
              </label>
            </div>
          </div>
        </section>

        <!-- Submit -->
        <div class="flex gap-4 pt-4 border-t">
          <button type="submit" :disabled="saving"
            class="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 transition">
            {{ saving ? 'Saving...' : isEditing ? 'Update Property' : 'Publish Property' }}
          </button>
          <router-link to="/admin/properties"
            class="flex-1 text-center bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold transition">
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/propertyStore'

const route = useRoute()
const router = useRouter()
const propertyStore = usePropertyStore()

const saving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const imagePreviewError = ref(false)
const tagsInput = ref('')

const isEditing = computed(() => !!route.params.id)

const availableAmenities = [
  'Swimming Pool', 'Gym', 'Security', 'Generator', 'Parking',
  'Garden', 'Home Theater', 'Smart Home', 'Elevator', 'Balcony',
  'Laundry Room', 'CCTV', 'Intercom', 'Children Playground',
  'Tennis Court', 'Servant Quarters', 'Water Treatment', 'Solar Power'
]

const formData = reactive({
  title: '',
  price: 0,
  description: '',
  bedrooms: 0,
  bathrooms: 0,
  squareFootage: 0,
  location: '',
  status: '',
  type: '',
  image: '',
  agentName: '',
  agentPhone: '',
  agentEmail: '',
  amenities: [],
  featured: false
})

// Load property data if editing
onMounted(() => {
  if (isEditing.value) {
    const property = propertyStore.getPropertyById(Number(route.params.id))
    if (property) {
      Object.assign(formData, {
        title: property.title || '',
        price: property.price || 0,
        description: property.description || '',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        squareFootage: property.squareFootage || 0,
        location: property.location || '',
        status: property.status || '',
        type: property.type || '',
        image: property.image || '',
        agentName: property.agent?.name || property.agentName || '',
        agentPhone: property.agent?.phone || property.agentPhone || '',
        agentEmail: property.agent?.email || property.agentEmail || '',
        amenities: property.amenities || [],
        featured: property.featured || false
      })
      tagsInput.value = (property.tags || []).join(', ')
    } else {
      errorMessage.value = 'Property not found.'
    }
  }
})

// Reset image preview error when URL changes
watch(() => formData.image, () => {
  imagePreviewError.value = false
})

const submitForm = () => {
  // Validate
  const errors = propertyStore.validateProperty({
    title: formData.title,
    location: formData.location,
    price: formData.price,
    status: formData.status
  })

  if (errors.length > 0) {
    errorMessage.value = errors.join('. ')
    return
  }

  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const tags = tagsInput.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)

  const propertyData = {
    ...formData,
    tags,
    agent: {
      name: formData.agentName || 'KSA Valuers Agent',
      phone: formData.agentPhone || '+234 800 000 0000',
      email: formData.agentEmail || 'info@ksavaluers.com'
    }
  }

  try {
    let result
    if (isEditing.value) {
      result = propertyStore.updateProperty(Number(route.params.id), propertyData)
    } else {
      result = propertyStore.addProperty(propertyData)
    }

    if (result.success) {
      successMessage.value = result.message
      if (!isEditing.value) {
        setTimeout(() => router.push('/admin/properties'), 1000)
      }
    } else {
      errorMessage.value = result.message
    }
  } catch (err) {
    errorMessage.value = 'Failed to save property. Please try again.'
    console.error(err)
  } finally {
    saving.value = false
  }
}
</script>
