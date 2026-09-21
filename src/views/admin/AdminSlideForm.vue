<template>
  <div class="space-y-6 max-w-4xl mx-auto text-slate-800 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
          <span>{{ isEditMode ? 'Edit Hero Slide' : 'Add New Hero Slide' }}</span>
          <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            {{ isEditMode ? 'Banner Edit' : 'New Banner' }}
          </span>
        </h1>
        <p class="text-xs text-slate-500 font-normal">Configure homepage hero carousel headers, slogans, background imagery, and CTA routes</p>
      </div>
      <button @click="goBack" class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors shadow-2xs">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        <span>Back to Carousel Slides</span>
      </button>
    </div>

    <!-- Form Container -->
    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-6 sm:p-8 space-y-5">
      <!-- Headline Title -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Headline Title *</label>
        <input
          v-model="form.title"
          required
          placeholder="e.g., Nigeria's Premier Property Valuers"
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition"
        >
      </div>

      <!-- Tagline / Slogan -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Tagline Slogan</label>
        <textarea
          v-model="form.tagline"
          rows="3"
          placeholder="e.g., Expert property valuations and comprehensive real estate solutions across Nigeria"
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition leading-relaxed resize-none"
        ></textarea>
      </div>

      <!-- Image Source & Upload Box -->
      <div class="space-y-3">
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Background Image *</label>
        <div class="flex items-center gap-4 text-xs">
          <label class="flex items-center text-slate-700 font-medium cursor-pointer">
            <input type="radio" v-model="imageSource" value="upload" class="mr-1.5 text-slate-900 focus:ring-slate-900">
            Upload from Device
          </label>
          <label class="flex items-center text-slate-700 font-medium cursor-pointer">
            <input type="radio" v-model="imageSource" value="url" class="mr-1.5 text-slate-900 focus:ring-slate-900">
            Paste Image URL
          </label>
        </div>

        <!-- Dropzone / File Upload -->
        <div v-if="imageSource === 'upload'" class="w-full">
          <label class="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100/60 transition p-4 relative">
            <div v-if="uploadingFile" class="flex flex-col items-center justify-center">
              <div class="w-6 h-6 rounded-full border-2 border-slate-300 border-t-slate-800 animate-spin mb-1.5"></div>
              <p class="text-xs text-slate-500 font-medium">Processing file upload...</p>
            </div>
            <div v-else class="flex flex-col items-center justify-center text-center">
              <svg class="w-8 h-8 mb-2 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
              <p class="text-xs text-slate-700 font-medium"><span class="text-slate-900 font-semibold underline">Click to upload</span> or drag image file</p>
              <p class="text-[10px] text-slate-400 mt-1">PNG, JPG or WEBP (max 8MB)</p>
            </div>
            <input type="file" class="hidden" accept="image/*" @change="handleFileUpload" :disabled="uploadingFile">
          </label>
        </div>

        <!-- URL Input -->
        <input
          v-else
          v-model="form.imageUrl"
          required
          type="url"
          placeholder="e.g., https://images.unsplash.com/photo-..."
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition"
        >

        <!-- Live Preview -->
        <div v-if="form.imageUrl" class="mt-3 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 h-44 relative shadow-2xs">
          <img
            :src="form.imageUrl"
            class="w-full h-full object-cover"
            alt="Slide Image Preview"
            @error="handleImageError"
          >
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-end p-4">
            <div class="text-white">
              <span class="text-[10px] font-medium bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-md uppercase tracking-wider">Live Banner Overlay</span>
              <h4 class="font-bold text-sm leading-tight mt-1 text-white">{{ form.title || 'Headline Title' }}</h4>
              <p class="text-xs text-slate-200 line-clamp-1 mt-0.5 font-normal">{{ form.tagline || 'Tagline slogan details go here.' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Buttons config -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">CTA Button Text</label>
          <input
            v-model="form.ctaText"
            placeholder="e.g., Explore Properties"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition"
          >
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">CTA Button Link</label>
          <input
            v-model="form.ctaLink"
            placeholder="e.g., /properties"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition font-mono"
          >
        </div>
      </div>

      <!-- Sorting order -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Sort Order (Hierarchy Index)</label>
        <input
          v-model.number="form.sortOrder"
          type="number"
          min="0"
          placeholder="0"
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition"
        >
        <p class="text-[11px] text-slate-500 mt-1 font-normal">Lower numbers appear first on the homepage carousel slider.</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-lg text-xs flex items-center gap-2">
        <svg class="w-4 h-4 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 pt-4 border-t border-slate-100">
        <button
          type="submit"
          :disabled="submitting"
          class="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors text-xs shadow-2xs disabled:opacity-50"
        >
          {{ submitting ? 'Saving Slide...' : (isEditMode ? 'Update Slide' : 'Publish Slide') }}
        </button>
        <button
          type="button"
          @click="goBack"
          class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition"
        >
          Cancel
        </button>
      </div>
    </form>
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

const form = ref({
  title: '',
  tagline: '',
  imageUrl: '',
  ctaText: 'Explore Properties',
  ctaLink: '/properties',
  sortOrder: 0
})

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
      if (res && res.url) {
        form.value.imageUrl = res.url
      } else {
        form.value.imageUrl = reader.result
      }
    } catch (err) {
      console.warn('File upload fallback to Data URL:', err)
      form.value.imageUrl = reader.result
    } finally {
      uploadingFile.value = false
    }
  }
  reader.readAsDataURL(file)
}

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
    errorMessage.value = 'Valid image background is required'
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
