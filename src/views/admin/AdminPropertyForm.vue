<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <button @click="goBack" class="flex items-center text-gray-600 hover:text-gray-900 mb-4">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Properties
      </button>
      <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ isEditMode ? 'Edit Property' : 'Add New Property' }}</h1>

      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input v-model="form.title" required placeholder="e.g., Luxury 4 Bedroom Terrace" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input v-model="form.location" required placeholder="e.g., Lekki Phase 1, Lagos" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
            <input v-model.number="form.price" required type="number" min="0" placeholder="Price" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Primary Image URL</label>
            <input v-model="form.image" type="url" placeholder="https://images.unsplash.com/photo-..." class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea v-model="form.description" rows="4" placeholder="Detailed description of the property..." class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="form.status" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select v-model="form.type" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option v-for="type in propertyStore.PROPERTY_TYPES" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <input v-model.number="form.bedrooms" type="number" min="0" placeholder="0" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <input v-model.number="form.bathrooms" type="number" min="0" placeholder="0" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Square Footage (sqft)</label>
            <input v-model.number="form.squareFootage" type="number" min="0" placeholder="0" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>

        <!-- Property Image Gallery -->
        <div class="border-t border-gray-200 pt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Image Gallery</label>
          <div class="space-y-3 mb-3">
            <div v-for="(imgUrl, idx) in form.images" :key="idx" class="flex gap-2 items-center">
              <input v-model="form.images[idx]" type="url" placeholder="Gallery Image URL" class="flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <button type="button" @click="removeImage(idx)" class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition text-sm">
                Remove
              </button>
            </div>
          </div>
          <button type="button" @click="addImageUrl" class="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg transition text-sm">
            + Add Image URL to Gallery
          </button>
        </div>

        <div class="flex items-center">
          <input v-model="form.featured" type="checkbox" id="featured" class="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
          <label for="featured" class="text-sm font-medium text-gray-700">Feature this property on homepage</label>
        </div>

        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ errorMessage }}
        </div>

        <div class="flex gap-3 pt-6 border-t border-gray-200">
          <button :disabled="submitting" class="flex-grow px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50">
            {{ submitting ? 'Saving...' : (isEditMode ? 'Update Property' : 'Add Property') }}
          </button>
          <button type="button" @click="goBack" class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/propertyStore'

const route = useRoute()
const router = useRouter()
const propertyStore = usePropertyStore()
const isEditMode = computed(() => Boolean(route.params.id))
const submitting = ref(false)
const errorMessage = ref('')

const form = ref({
  title: '',
  location: '',
  price: 0,
  image: '',
  images: [],
  description: '',
  status: 'sale',
  type: 'House',
  bedrooms: 0,
  bathrooms: 0,
  squareFootage: 0,
  featured: false
})

onMounted(async () => {
  await propertyStore.fetchProperties()
  if (isEditMode.value) {
    const existing = propertyStore.getPropertyById(Number(route.params.id))
    if (existing) {
      form.value = {
        ...existing,
        images: existing.images ? [...existing.images] : []
      }
    }
  }
})

const addImageUrl = () => {
  if (!form.value.images) {
    form.value.images = []
  }
  form.value.images.push('')
}

const removeImage = (idx) => {
  form.value.images.splice(idx, 1)
}

const handleSubmit = async () => {
  errorMessage.value = ''
  
  // Client-side validation
  const errors = propertyStore.validateProperty(form.value)
  if (errors.length > 0) {
    errorMessage.value = errors.join(', ')
    return
  }

  submitting.value = true
  
  // Filter out empty URL values in images gallery
  const payload = {
    ...form.value,
    images: form.value.images ? form.value.images.filter(url => url && url.trim()) : []
  }

  const result = isEditMode.value
    ? await propertyStore.updateProperty(Number(route.params.id), payload)
    : await propertyStore.addProperty(payload)
    
  submitting.value = false
  if (!result.success) {
    errorMessage.value = result.message
    return
  }
  router.push({ name: 'AdminPropertyList' })
}

const goBack = () => router.push({ name: 'AdminPropertyList' })
</script>
