<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- Navigation Back -->
    <div class="flex items-center justify-between">
      <button @click="goBack" class="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors group">
        <svg class="w-5 h-5 mr-2 text-slate-500 group-hover:-translate-x-1 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Carousel Slides
      </button>
    </div>

    <!-- Container Header -->
    <div class="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-2xl flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <span>{{ isEditMode ? 'Edit Hero Slide' : 'Add New Hero Slide' }}</span>
          <span class="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {{ isEditMode ? 'Banner Edit' : 'New Banner' }}
          </span>
        </h1>
        <p class="mt-1 text-sm text-slate-400">Configure homepage hero carousel headers, slogans, background imagery, and CTA routes.</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 shadow-2xl p-6 md:p-8 space-y-6">
      <!-- Main Title -->
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Headline Title *</label>
        <input
          v-model="form.title"
          required
          placeholder="e.g., Nigeria's Premier Property Valuers"
          class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
        >
      </div>

      <!-- Tagline / Slogan -->
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Tagline Slogan</label>
        <textarea
          v-model="form.tagline"
          rows="3"
          placeholder="e.g., Expert property valuations and comprehensive real estate solutions across Nigeria"
          class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition leading-relaxed"
        ></textarea>
      </div>

      <!-- Image URL & Live Preview & Device Upload -->
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Image Source *</label>
        <div class="flex items-center gap-4 mb-3">
          <label class="flex items-center text-xs text-slate-300 cursor-pointer">
            <input type="radio" v-model="imageSource" value="upload" class="mr-2 text-blue-500 focus:ring-blue-500 bg-slate-950 border-slate-800">
            Upload from Device
          </label>
          <label class="flex items-center text-xs text-slate-300 cursor-pointer">
            <input type="radio" v-model="imageSource" value="url" class="mr-2 text-blue-500 focus:ring-blue-500 bg-slate-950 border-slate-800">
            Paste Image URL
          </label>
        </div>

        <!-- Upload input -->
        <div v-if="imageSource === 'upload'" class="space-y-2">
          <div class="flex items-center justify-center w-full">
            <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer bg-slate-950/80 hover:bg-slate-950 transition relative group">
              <div v-if="uploadingFile" class="flex flex-col items-center justify-center">
                <div class="w-8 h-8 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin mb-2"></div>
                <p class="text-xs text-slate-400 font-mono">Uploading slide background...</p>
              </div>
              <div v-else class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-2 text-slate-500 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-xs text-slate-300"><span class="font-semibold text-orange-400">Click to upload</span> or drag image file</p>
                <p class="text-xxs text-slate-500 font-mono mt-1">PNG, JPG or WEBP (max 8MB)</p>
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
          class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
        >

        <!-- Live Preview -->
        <div v-if="form.imageUrl" class="mt-4 rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 h-52 relative shadow-lg">
          <img
            :src="form.imageUrl"
            class="w-full h-full object-cover"
            alt="Slide Image Preview"
            @error="handleImageError"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-end p-5">
            <div class="text-white">
              <span class="text-xxs font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Live Banner Overlay</span>
              <h4 class="font-bold text-lg leading-tight mt-1.5 text-white">{{ form.title || 'Headline Title' }}</h4>
              <p class="text-xs text-slate-300 line-clamp-1 mt-0.5">{{ form.tagline || 'Tagline slogan details go here.' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Buttons config -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">CTA Button Text</label>
          <input
            v-model="form.ctaText"
            placeholder="e.g., Explore Properties"
            class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
          >
        </div>
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">CTA Button Link</label>
          <input
            v-model="form.ctaLink"
            placeholder="e.g., /properties"
            class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition font-mono"
          >
        </div>
      </div>

      <!-- Sorting order -->
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Sort Order (Hierarchy Index)</label>
        <input
          v-model.number="form.sortOrder"
          type="number"
          min="0"
          placeholder="0"
          class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
        >
        <p class="text-xs text-slate-500 mt-1 font-mono">Lower numbers appear first. If sort order is equal, slides are sorted by creation date.</p>
      </div>

      <!-- Form Messages -->
      <div v-if="errorMessage" class="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
        <svg class="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Buttons -->
      <div class="flex gap-4 pt-6 border-t border-slate-800/80">
        <button
          type="submit"
          :disabled="submitting"
          class="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-blue-600 hover:from-orange-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm"
        >
          {{ submitting ? 'Saving Slide...' : (isEditMode ? 'Update Slide' : 'Publish Slide') }}
        </button>
        <button
          type="button"
          @click="goBack"
          class="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition text-sm border border-slate-700"
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
