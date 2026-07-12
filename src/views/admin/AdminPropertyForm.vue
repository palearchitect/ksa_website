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
            <label class="block text-sm font-medium text-gray-700 mb-1">Primary Image</label>
            <div class="flex items-center gap-4 mb-2">
              <label class="flex items-center text-sm text-gray-700 cursor-pointer">
                <input type="radio" v-model="imageSource" value="upload" class="mr-2 text-blue-600 focus:ring-blue-500">
                Upload
              </label>
              <label class="flex items-center text-sm text-gray-700 cursor-pointer">
                <input type="radio" v-model="imageSource" value="url" class="mr-2 text-blue-600 focus:ring-blue-500">
                Paste URL
              </label>
            </div>
            
            <div v-if="imageSource === 'upload'" class="flex items-center gap-2">
              <label class="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg cursor-pointer transition text-sm">
                <span>{{ uploadingFile ? 'Uploading...' : 'Choose File' }}</span>
                <input type="file" class="hidden" accept="image/*" @change="handleFileUpload" :disabled="uploadingFile">
              </label>
              <span class="text-xs text-gray-500 truncate max-w-xs" v-if="form.image">{{ form.image }}</span>
            </div>
            
            <input v-else v-model="form.image" type="url" placeholder="https://images.unsplash.com/photo-..." class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
              <label class="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg cursor-pointer transition text-sm flex-shrink-0">
                <span>{{ uploadingGalleryIdx === idx ? 'Uploading...' : 'Upload' }}</span>
                <input type="file" class="hidden" accept="image/*" @change="handleGalleryFileUpload($event, idx)" :disabled="uploadingGalleryIdx !== null">
              </label>
              <button type="button" @click="removeImage(idx)" class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition text-sm">
                Remove
              </button>
            </div>
          </div>
          <div class="flex gap-2">
            <button type="button" @click="addImageUrl" class="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg transition text-sm">
              + Add Image URL
            </button>
            <label class="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 font-semibold rounded-lg cursor-pointer transition text-sm flex items-center justify-center">
              <span>+ Upload Image File</span>
              <input type="file" class="hidden" accept="image/*" @change="handleNewGalleryUpload" :disabled="uploadingGalleryIdx !== null">
            </label>
          </div>
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
import { uploadService } from '@/services/api'

const route = useRoute()
const router = useRouter()
const propertyStore = usePropertyStore()
const isEditMode = computed(() => Boolean(route.params.id))
const submitting = ref(false)
const errorMessage = ref('')
const imageSource = ref('upload')
const uploadingFile = ref(false)
const uploadingGalleryIdx = ref(null)

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (file.size > 8 * 1024 * 1024) {
    alert('File size exceeds 8MB limit.')
    return
  }

  const reader = new FileReader()
  reader.onload = async () => {
    uploadingFile.value = true
    try {
      const res = await uploadService.uploadFile(file.name, reader.result)
      if (res.success && res.url) {
        form.value.image = res.url
      } else {
        alert(res.message || 'File upload failed.')
      }
    } catch (err) {
      console.error(err)
      alert('Error uploading file. Please try again.')
    } finally {
      uploadingFile.value = false
    }
  }
  reader.readAsDataURL(file)
}

const handleGalleryFileUpload = async (event, idx) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (file.size > 8 * 1024 * 1024) {
    alert('File size exceeds 8MB limit.')
    return
  }

  const reader = new FileReader()
  reader.onload = async () => {
    uploadingGalleryIdx.value = idx
    try {
      const res = await uploadService.uploadFile(file.name, reader.result)
      if (res.success && res.url) {
        form.value.images[idx] = res.url
      } else {
        alert(res.message || 'File upload failed.')
      }
    } catch (err) {
      console.error(err)
      alert('Error uploading file. Please try again.')
    } finally {
      uploadingGalleryIdx.value = null
    }
  }
  reader.readAsDataURL(file)
}

const handleNewGalleryUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (file.size > 8 * 1024 * 1024) {
    alert('File size exceeds 8MB limit.')
    return
  }

  const reader = new FileReader()
  reader.onload = async () => {
    if (!form.value.images) {
      form.value.images = []
    }
    const idx = form.value.images.length
    form.value.images.push('')
    uploadingGalleryIdx.value = idx
    try {
      const res = await uploadService.uploadFile(file.name, reader.result)
      if (res.success && res.url) {
        form.value.images[idx] = res.url
      } else {
        form.value.images.splice(idx, 1)
        alert(res.message || 'File upload failed.')
      }
    } catch (err) {
      console.error(err)
      form.value.images.splice(idx, 1)
      alert('Error uploading file. Please try again.')
    } finally {
      uploadingGalleryIdx.value = null
    }
  }
  reader.readAsDataURL(file)
}

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
