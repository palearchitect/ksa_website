<template>
  <div class="admin-project-form min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="goBack"
          class="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </button>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEditMode ? 'Edit Project' : 'Add New Project' }}
        </h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow p-6 space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Project Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="e.g., Luxury Waterfront Estate - Banana Island"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
        </div>

        <!-- Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Location <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.location"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Location</option>
            <option v-for="location in projectStore.NIGERIAN_LOCATIONS" :key="location" :value="location">
              {{ location }}
            </option>
          </select>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.description"
            required
            rows="4"
            placeholder="Describe the project, its features, and unique selling points..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <!-- Status & Type -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Status <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Status</option>
              <option v-for="status in projectStore.PROJECT_STATUS" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Project Type <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.type"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Type</option>
              <option v-for="type in projectStore.PROJECT_TYPES" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
        </div>

        <!-- Budget & Total Units -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Budget (₦)
            </label>
            <input
              v-model.number="form.budget"
              type="number"
              min="0"
              placeholder="15000000000"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
            <p class="text-xs text-gray-500 mt-1">Enter budget in Naira</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Total Units
            </label>
            <input
              v-model.number="form.totalUnits"
              type="number"
              min="0"
              placeholder="50"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
            <p class="text-xs text-gray-500 mt-1">Number of units/properties in project</p>
          </div>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              v-model="form.startDate"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Expected Completion
            </label>
            <input
              v-model="form.expectedCompletion"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
        </div>

        <!-- Completion Percentage -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Completion Percentage: {{ form.completionPercentage }}%
          </label>
          <input
            v-model.number="form.completionPercentage"
            type="range"
            min="0"
            max="100"
            class="w-full"
          >
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              :class="getProgressBarClass(form.completionPercentage)"
              class="h-2 rounded-full transition-all"
              :style="{ width: `${form.completionPercentage}%` }"
            ></div>
          </div>
        </div>

        <!-- Image URL & Device Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Image Source</label>
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
          <div v-if="imageSource === 'upload'" class="space-y-2 mb-2">
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
            v-model="form.image"
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
          <p class="text-xs text-gray-500 mt-1">Enter image URL (Unsplash, ImageKit, etc.)</p>
          
          <!-- Image Preview -->
          <div v-if="form.image" class="mt-4">
            <img :src="form.image" alt="Preview" class="w-full h-48 object-cover rounded-lg">
          </div>
        </div>

        <!-- Amenities -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Amenities
          </label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <label v-for="amenity in availableAmenities" :key="amenity" class="flex items-center">
              <input
                type="checkbox"
                :value="amenity"
                v-model="form.amenities"
                class="mr-2 rounded"
              >
              <span class="text-sm text-gray-700">{{ amenity }}</span>
            </label>
          </div>
        </div>

        <!-- Featured -->
        <div class="flex items-center">
          <input
            v-model="form.featured"
            type="checkbox"
            id="featured"
            class="mr-2 rounded"
          >
          <label for="featured" class="text-sm font-medium text-gray-700">
            Feature this project on homepage
          </label>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {{ errorMessage }}
        </div>

        <!-- Submit Buttons -->
        <div class="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Saving...' : (isEditMode ? 'Update Project' : 'Add Project') }}
          </button>
          <button
            type="button"
            @click="goBack"
            class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
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
