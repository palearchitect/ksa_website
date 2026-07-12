<template>
  <div class="admin-team-form min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="goBack"
          class="flex items-center text-gray-600 hover:text-gray-900 mb-4 font-medium transition"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Directory
        </button>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEditMode ? 'Edit Team Member Profile' : 'Add New Team Member' }}
        </h1>
        <p class="text-gray-600 mt-1">Provide the professional details, certifications, and background of the team member.</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        
        <!-- Name & Email -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="e.g. ESV Olaoluwa Isaac"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="e.g. name@ksavaluers.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
          </div>
        </div>

        <!-- Role & Tag -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Role / Job Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.role"
              type="text"
              required
              placeholder="e.g. Head of Estate Management & Valuation"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Professional Tag <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.tag"
              type="text"
              required
              placeholder="e.g. Estate Surveyor, Certified Valuer"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
          </div>
        </div>

        <!-- Biography / Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Biography / Professional Profile <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.description"
            required
            rows="5"
            placeholder="Describe the member's professional focus, experience, and certifications..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          ></textarea>
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
              Paste Image URL / Filename
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
            type="text"
            placeholder="e.g. DSC00129-240x300.jpeg or https://..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
          <p class="text-xs text-gray-500 mt-1.5">Provide a filename from assets/images (e.g. DSC00129-240x300.jpeg) or a custom web URL.</p>
          
          <!-- Image Preview -->
          <div v-if="form.image" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 inline-block">
            <p class="text-xs font-semibold text-gray-500 mb-2">Profile Image Preview:</p>
            <img 
              :src="getImageUrl(form.image)" 
              alt="Preview" 
              @error="handlePreviewError"
              class="w-32 h-32 object-cover rounded-xl border border-gray-300"
            >
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ errorMessage }}
        </div>

        <!-- Submit Buttons -->
        <div class="flex gap-4 pt-6 border-t border-gray-100">
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm hover:shadow transition disabled:opacity-50"
          >
            {{ submitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Profile') }}
          </button>
          <button
            type="button"
            @click="goBack"
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
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
import { useTeamStore } from '@/stores/teamStore'
import { uploadService } from '@/services/api'

const router = useRouter()
const route = useRoute()
const teamStore = useTeamStore()

const form = ref({
  name: '',
  email: '',
  role: '',
  tag: '',
  description: '',
  image: ''
})

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
  teamStore.fetchTeamMembers()
  if (isEditMode.value) {
    loadMember()
  }
})

const loadMember = () => {
  const memberId = parseInt(route.params.id)
  const member = teamStore.getTeamMemberById(memberId)
  if (member) {
    form.value = { ...member }
  } else {
    errorMessage.value = 'Team member profile not found.'
  }
}

const getImageUrl = (image) => {
  if (!image) return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
  if (image.startsWith('http') || image.startsWith('data:')) return image
  try {
    return new URL(`../../assets/images/${image}`, import.meta.url).href
  } catch {
    return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
  }
}

const handlePreviewError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
}

const handleSubmit = async () => {
  errorMessage.value = ''
  submitting.value = true

  try {
    let result
    if (isEditMode.value) {
      result = teamStore.updateTeamMember(parseInt(route.params.id), form.value)
    } else {
      result = teamStore.addTeamMember(form.value)
    }

    if (result.success) {
      alert(isEditMode.value ? 'Profile successfully updated!' : 'Profile successfully created!')
      router.push({ name: 'AdminTeamList' })
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = 'An error occurred while saving the profile.'
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.push({ name: 'AdminTeamList' })
}
</script>
