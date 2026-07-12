<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <button @click="goBack" class="flex items-center text-gray-600 hover:text-gray-900 mb-4 focus:outline-none">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Carousel Slides
      </button>

      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        {{ isEditMode ? 'Edit Hero Slide' : 'Add New Hero Slide' }}
      </h1>

      <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow p-6 space-y-6">
        <!-- Main Title -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Headline Title *</label>
          <input
            v-model="form.title"
            required
            placeholder="e.g., Nigeria's Premier Property Valuers"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
        </div>

        <!-- Tagline / Slogan -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Tagline Slogan</label>
          <textarea
            v-model="form.tagline"
            rows="3"
            placeholder="e.g., Expert property valuations and comprehensive real estate solutions across Nigeria"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <!-- Image URL & Live Preview & Device Upload -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Image Source *</label>
          <div class="flex items-center gap-4 mb-3">
            <label class="flex items-center text-sm text-gray-700 cursor-pointer">
              <input type="radio" v-model="imageSource" value="upload" class="mr-2 text-blue-600 focus:ring-blue-500">
              Upload from Device
            </label>
            <label class="flex items-center text-sm text-gray-700 cursor-pointer">
              <input type="radio" v-model="imageSource" value="url" class="mr-2 text-blue-600 focus:ring-blue-500">
              Paste Image URL
            </label>
          </div>

          <!-- Upload input -->
          <div v-if="imageSource === 'upload'" class="space-y-2">
            <div class="flex items-center justify-center w-full">
              <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition relative">
                <div v-if="uploadingFile" class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="animate-spin h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p class="text-sm text-gray-500 font-medium">Uploading file...</p>
                </div>
                <div v-else class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p class="text-sm text-gray-500"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                  <p class="text-xs text-gray-400">PNG, JPG or JPEG (max 8MB)</p>
                </div>
                <input type="file" class="hidden" accept="image/*" @change="handleFileUpload" :disabled="uploadingFile" />
              </label>
            </div>
          </div>

          <!-- URL input -->
          <input
            v-else
            v-model="form.imageUrl"
            required
            type="url"
            placeholder="e.g., https://images.unsplash.com/photo-..."
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
          <!-- Live Preview -->
          <div v-if="form.imageUrl" class="mt-3 rounded-lg border overflow-hidden bg-gray-150 h-52 relative">
            <img
              :src="form.imageUrl"
              class="w-full h-full object-cover"
              alt="Slide Image Preview"
              @error="handleImageError"
            >
            <div class="absolute inset-0 bg-black/40 flex items-end p-4">
              <div class="text-white">
                <span class="text-xs bg-blue-600/90 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Live Preview Overlay</span>
                <h4 class="font-bold text-lg leading-tight mt-1">{{ form.title || 'Headline Title' }}</h4>
                <p class="text-xs text-gray-200 line-clamp-1">{{ form.tagline || 'Tagline slogan details go here.' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Buttons config -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">CTA Button Text</label>
            <input
              v-model="form.ctaText"
              placeholder="e.g., Explore Properties"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">CTA Button Link</label>
            <input
              v-model="form.ctaLink"
              placeholder="e.g., /properties"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
        </div>

        <!-- Sorting order -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Sort Order (Hierarchy Index)</label>
          <input
            v-model.number="form.sortOrder"
            type="number"
            min="0"
            placeholder="0"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
          <p class="text-xs text-gray-400 mt-1">Lower numbers appear first. If sort order is equal, slides are sorted by creation date.</p>
        </div>

        <!-- Form Messages -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ errorMessage }}
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-6 border-t border-gray-100">
          <button
            type="submit"
            :disabled="submitting"
            class="flex-grow px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50 text-sm"
          >
            {{ submitting ? 'Saving...' : (isEditMode ? 'Update Slide' : 'Add Slide') }}
          </button>
          <button
            type="button"
            @click="goBack"
            class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition text-sm"
          >
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
import { useHeroSlideStore } from '@/stores/heroSlideStore'
import { uploadService } from '@/services/api'

const route = useRoute()
const router = useRouter()
const heroSlideStore = useHeroSlideStore()

const isEditMode = computed(() => Boolean(route.params.id))
const submitting = ref(false)
const errorMessage = ref('')
const imageSource = ref('upload')
const uploadingFile = ref(false)

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
        form.value.imageUrl = res.url
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

const form = ref({
  title: '',
  tagline: '',
  imageUrl: '',
  ctaText: 'Explore Properties',
  ctaLink: '/properties',
  sortOrder: 0
})

onMounted(async () => {
  await heroSlideStore.fetchSlides()
  if (isEditMode.value) {
    const existing = heroSlideStore.getSlideById(Number(route.params.id))
    if (existing) {
      form.value = { ...existing }
    } else {
      errorMessage.value = 'Requested hero slide could not be found'
    }
  }
})

const handleImageError = (e) => {
  console.warn('Live preview image failed to load:', e.target.src)
}

const handleSubmit = async () => {
  errorMessage.value = ''
  
  if (!form.value.imageUrl || !form.value.imageUrl.trim()) {
    errorMessage.value = 'Valid image URL is required'
    return
  }

  submitting.value = true
  const result = isEditMode.value
    ? await heroSlideStore.updateSlide(Number(route.params.id), form.value)
    : await heroSlideStore.addSlide(form.value)
    
  submitting.value = false
  if (!result.success) {
    errorMessage.value = result.message || 'Failed to save slide'
    return
  }
  router.push({ name: 'AdminSlideList' })
}

const goBack = () => router.push({ name: 'AdminSlideList' })
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
