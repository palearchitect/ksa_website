<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- Navigation Back -->
    <div class="flex items-center justify-between">
      <button @click="goBack" class="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors group">
        <svg class="w-5 h-5 mr-2 text-slate-500 group-hover:-translate-x-1 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Properties Catalog
      </button>
    </div>

    <!-- Container Header -->
    <div class="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-2xl flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <span>{{ isEditMode ? 'Edit Property Listing' : 'Add New Property' }}</span>
          <span class="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
            {{ isEditMode ? 'Mutation Mode' : 'Creation Mode' }}
          </span>
        </h1>
        <p class="mt-1 text-sm text-slate-400">Configure listing metadata, pricing schedules, architectural specs, and high-res media.</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 shadow-2xl p-6 md:p-8 space-y-6">
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Title *</label>
        <input v-model="form.title" required placeholder="e.g., Luxury 4 Bedroom Terrace" class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition">
      </div>

      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Location *</label>
        <input v-model="form.location" required placeholder="e.g., Lekki Phase 1, Lagos" class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition">
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Price (₦) *</label>
          <input v-model.number="form.price" required type="number" min="0" placeholder="Price" class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition">
        </div>

        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Primary Cover Image</label>
          <div class="flex items-center gap-4 mb-2">
            <label class="flex items-center text-xs text-slate-300 cursor-pointer">
              <input type="radio" v-model="imageSource" value="upload" class="mr-2 text-blue-500 focus:ring-blue-500 bg-slate-950 border-slate-800">
              Upload File
            </label>
            <label class="flex items-center text-xs text-slate-300 cursor-pointer">
              <input type="radio" v-model="imageSource" value="url" class="mr-2 text-blue-500 focus:ring-blue-500 bg-slate-950 border-slate-800">
              Direct Image URL
            </label>
          </div>
          
          <div v-if="imageSource === 'upload'" class="flex items-center gap-3">
            <label class="flex items-center justify-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl cursor-pointer transition text-xs border border-slate-700">
              <span>{{ uploadingFile ? 'Uploading...' : 'Choose Image File' }}</span>
              <input type="file" class="hidden" accept="image/*" @change="handleFileUpload" :disabled="uploadingFile">
            </label>
            <span class="text-xs text-slate-400 truncate max-w-xs font-mono" v-if="form.image">{{ form.image }}</span>
          </div>
          
          <input v-else v-model="form.image" type="url" placeholder="https://images.unsplash.com/photo-..." class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition">
        </div>
      </div>

      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Description</label>
        <textarea v-model="form.description" rows="4" placeholder="Detailed architectural description of the property..." class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition leading-relaxed"></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Status</label>
          <select v-model="form.status" class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition">
            <option value="sale" class="bg-slate-900 text-white">For Sale</option>
            <option value="rent" class="bg-slate-900 text-white">For Rent</option>
            <option value="sold" class="bg-slate-900 text-white">Sold</option>
            <option value="rented" class="bg-slate-900 text-white">Rented</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Property Type</label>
          <select v-model="form.type" class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition">
            <option v-for="type in propertyStore.PROPERTY_TYPES" :key="type" :value="type" class="bg-slate-900 text-white">{{ type }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Bedrooms</label>
          <input v-model.number="form.bedrooms" type="number" min="0" placeholder="0" class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition">
        </div>
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Bathrooms</label>
          <input v-model.number="form.bathrooms" type="number" min="0" placeholder="0" class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition">
        </div>
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Square Footage (sqft)</label>
          <input v-model.number="form.squareFootage" type="number" min="0" placeholder="0" class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition">
        </div>
      </div>

      <!-- Property Image Gallery -->
      <div class="border-t border-slate-800/80 pt-6">
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">Media Gallery</label>
        <div class="space-y-3 mb-4">
          <div v-for="(imgUrl, idx) in form.images" :key="idx" class="flex gap-2.5 items-center">
            <input v-model="form.images[idx]" type="url" placeholder="Gallery Image URL" class="flex-grow px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm transition">
            <label class="flex items-center justify-center px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl cursor-pointer transition text-xs border border-slate-700 flex-shrink-0">
              <span>{{ uploadingGalleryIdx === idx ? 'Uploading...' : 'Upload' }}</span>
              <input type="file" class="hidden" accept="image/*" @change="handleGalleryFileUpload($event, idx)" :disabled="uploadingGalleryIdx !== null">
            </label>
            <button type="button" @click="removeImage(idx)" class="px-3.5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-medium rounded-xl transition text-xs flex-shrink-0">
              Remove
            </button>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <button type="button" @click="addImageUrl" class="px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 font-medium rounded-xl transition text-xs">
            + Add Image URL Slot
          </button>
          <label class="px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-medium rounded-xl cursor-pointer transition text-xs flex items-center justify-center">
            <span>+ Upload Gallery File</span>
            <input type="file" class="hidden" accept="image/*" @change="handleNewGalleryUpload" :disabled="uploadingGalleryIdx !== null">
          </label>
        </div>
      </div>

      <div class="flex items-center pt-2">
        <input v-model="form.featured" type="checkbox" id="featured" class="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900">
        <label for="featured" class="ml-2.5 text-xs font-medium text-slate-300">Feature this property on the homepage carousel showcase</label>
      </div>

      <div v-if="errorMessage" class="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
        <svg class="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <div class="flex gap-4 pt-6 border-t border-slate-800/80">
        <button :disabled="submitting" class="flex-grow px-6 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-blue-600 hover:from-orange-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm">
          {{ submitting ? 'Persisting Changes...' : (isEditMode ? 'Update Property' : 'Publish Property Listing') }}
        </button>
        <button type="button" @click="goBack" class="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition text-sm border border-slate-700">
          Cancel
        </button>
      </div>
    </form>
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
