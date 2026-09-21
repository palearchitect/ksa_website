<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <button @click="goBack" class="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors group">
        <svg class="w-5 h-5 mr-2 text-slate-500 group-hover:-translate-x-1 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Development Projects
      </button>
    </div>

    <!-- Container Header -->
    <div class="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-2xl flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <span>{{ isEditMode ? 'Edit Project Plan' : 'Add New Project' }}</span>
          <span class="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {{ isEditMode ? 'Project Update' : 'New Initiative' }}
          </span>
        </h1>
        <p class="mt-1 text-sm text-slate-400">Configure development milestones, budget allocations, Nigerian location metadata, and progress tracking.</p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 shadow-2xl p-6 md:p-8 space-y-6">
      <!-- Title -->
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
          Project Title <span class="text-orange-400">*</span>
        </label>
        <input
          v-model="form.title"
          type="text"
          required
          placeholder="e.g., Luxury Waterfront Estate - Banana Island"
          class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
        >
      </div>

      <!-- Location -->
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
          Location <span class="text-orange-400">*</span>
        </label>
        <select
          v-model="form.location"
          required
          class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
        >
          <option value="" class="bg-slate-900 text-slate-500">Select Location</option>
          <option v-for="location in projectStore.NIGERIAN_LOCATIONS" :key="location" :value="location" class="bg-slate-900 text-white">
            {{ location }}
          </option>
        </select>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
          Description <span class="text-orange-400">*</span>
        </label>
        <textarea
          v-model="form.description"
          required
          rows="4"
          placeholder="Describe the development project, its architectural scope, features, and target completion timeline..."
          class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition leading-relaxed"
        ></textarea>
      </div>

      <!-- Status & Type -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Status <span class="text-orange-400">*</span>
          </label>
          <select
            v-model="form.status"
            required
            class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
          >
            <option value="" class="bg-slate-900 text-slate-500">Select Status</option>
            <option v-for="status in projectStore.PROJECT_STATUS" :key="status.value" :value="status.value" class="bg-slate-900 text-white">
              {{ status.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Project Type <span class="text-orange-400">*</span>
          </label>
          <select
            v-model="form.type"
            required
            class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
          >
            <option value="" class="bg-slate-900 text-slate-500">Select Type</option>
            <option v-for="type in projectStore.PROJECT_TYPES" :key="type" :value="type" class="bg-slate-900 text-white">
              {{ type }}
            </option>
          </select>
        </div>
      </div>

      <!-- Budget & Total Units -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Budget (₦)
          </label>
          <input
            v-model.number="form.budget"
            type="number"
            min="0"
            placeholder="15000000000"
            class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
          >
          <p class="text-xs text-slate-500 mt-1 font-mono">Enter capital budget in Naira</p>
        </div>

        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Total Units
          </label>
          <input
            v-model.number="form.totalUnits"
            type="number"
            min="0"
            placeholder="50"
            class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
          >
          <p class="text-xs text-slate-500 mt-1 font-mono">Total planned residential or commercial units</p>
        </div>
      </div>

      <!-- Dates -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Start Date
          </label>
          <input
            v-model="form.startDate"
            type="date"
            class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
          >
        </div>

        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Expected Completion
          </label>
          <input
            v-model="form.expectedCompletion"
            type="date"
            class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
          >
        </div>
      </div>

      <!-- Completion Percentage -->
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
          <span>Development Completion Progress</span>
          <span class="text-orange-400 font-bold">{{ form.completionPercentage }}%</span>
        </label>
        <input
          v-model.number="form.completionPercentage"
          type="range"
          min="0"
          max="100"
          class="w-full accent-orange-500 bg-slate-950 cursor-pointer"
        >
        <div class="w-full bg-slate-950 rounded-full h-2.5 mt-2 border border-slate-800 overflow-hidden">
          <div 
            :class="getProgressBarClass(form.completionPercentage)"
            class="h-2.5 rounded-full transition-all duration-300"
            :style="{ width: `${form.completionPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Image URL & Device Upload -->
      <div class="border-t border-slate-800/80 pt-6">
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">Project Banner Image</label>
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
        <div v-if="imageSource === 'upload'" class="space-y-2 mb-2">
          <div class="flex items-center justify-center w-full">
            <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer bg-slate-950/80 hover:bg-slate-950 transition relative group">
              <div v-if="uploadingFile" class="flex flex-col items-center justify-center">
                <div class="w-8 h-8 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin mb-2"></div>
                <p class="text-xs text-slate-400 font-mono">Uploading project banner...</p>
              </div>
              <div v-else class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-2 text-slate-500 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-xs text-slate-300"><span class="font-semibold text-orange-400">Click to upload</span> or drag banner file</p>
                <p class="text-xxs text-slate-500 font-mono mt-1">PNG, JPG or WEBP (max 8MB)</p>
              </div>
              <input type="file" class="hidden" accept="image/*" @change="handleFileUpload" :disabled="uploadingFile" />
            </label>
          </div>
        </div>

        <!-- URL input -->
        <input
          v-else
          v-model="form.image"
          type="url"
          placeholder="https://images.unsplash.com/photo-..."
          class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
        >
        
        <!-- Image Preview -->
        <div v-if="form.image" class="mt-4">
          <img :src="form.image" alt="Preview" class="w-full h-48 object-cover rounded-xl border border-slate-800 shadow-md">
        </div>
      </div>

      <!-- Amenities -->
      <div class="border-t border-slate-800/80 pt-6">
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
          Site Amenities & Infrastructure
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <label v-for="amenity in availableAmenities" :key="amenity" class="flex items-center p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 cursor-pointer transition">
            <input
              type="checkbox"
              :value="amenity"
              v-model="form.amenities"
              class="w-4 h-4 rounded border-slate-800 bg-slate-950 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900"
            >
            <span class="text-xs text-slate-300 ml-2.5 font-medium">{{ amenity }}</span>
          </label>
        </div>
      </div>

      <!-- Featured -->
      <div class="flex items-center pt-2">
        <input
          v-model="form.featured"
          type="checkbox"
          id="featured"
          class="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
        >
        <label for="featured" class="ml-2.5 text-xs font-medium text-slate-300">
          Feature this development project on the public portfolio banner
        </label>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
        <svg class="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Submit Buttons -->
      <div class="flex gap-4 pt-6 border-t border-slate-800/80">
        <button
          type="submit"
          :disabled="submitting"
          class="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-blue-600 hover:from-orange-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm"
        >
          {{ submitting ? 'Persisting Project...' : (isEditMode ? 'Update Project' : 'Publish Project') }}
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
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { uploadService } from '@/services/api'

const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()

const form = ref({
  title: '',
  location: '',
  description: '',
  status: '',
  type: '',
  totalUnits: 0,
  budget: 0,
  startDate: '',
  expectedCompletion: '',
  completionPercentage: 0,
  image: '',
  amenities: [],
  featured: false
})

const availableAmenities = [
  'Swimming Pool',
  'Gym',
  'Marina',
  'Security',
  '24/7 Power',
  'Parking',
  'Conference Rooms',
  'High-speed Internet',
  'Elevator',
  'Garden',
  'Playground',
  'CCTV'
]

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

const isEditMode = computed(() => !!route.params.id)

onMounted(() => {
  projectStore.fetchProjects()
  if (isEditMode.value) {
    loadProject()
  }
})

const loadProject = () => {
  const projectId = parseInt(route.params.id)
  const project = projectStore.getProjectById(projectId)
  
  if (project) {
    form.value = { ...project }
  } else {
    errorMessage.value = 'Project not found'
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''
  
  // Validation
  const errors = projectStore.validateProject(form.value)
  if (errors.length > 0) {
    errorMessage.value = errors.join(', ')
    return
  }
  
  submitting.value = true
  
  try {
    let result
    if (isEditMode.value) {
      result = await projectStore.updateProject(parseInt(route.params.id), form.value)
    } else {
      result = await projectStore.addProject(form.value)
    }
    
    if (result.success) {
      alert(result.message)
      router.push({ name: 'AdminProjectList' })
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = 'An error occurred. Please try again.'
    console.error('Form submission error:', error)
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.push({ name: 'AdminProjectList' })
}

const getProgressBarClass = (percentage) => {
  if (percentage >= 75) return 'bg-green-600'
  if (percentage >= 50) return 'bg-yellow-600'
  if (percentage >= 25) return 'bg-orange-600'
  return 'bg-red-600'
}
</script>
