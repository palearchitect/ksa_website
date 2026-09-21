<template>
  <div class="space-y-8 max-w-3xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <button @click="goBack" class="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors group">
        <svg class="w-5 h-5 mr-2 text-slate-500 group-hover:-translate-x-1 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Staff Directory
      </button>
    </div>

    <!-- Container Header -->
    <div class="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-2xl flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <span>{{ isEditMode ? 'Edit Team Member Profile' : 'Add New Team Member' }}</span>
          <span class="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {{ isEditMode ? 'Profile Edit' : 'New Staff' }}
          </span>
        </h1>
        <p class="mt-1 text-sm text-slate-400">Provide professional details, certifications, contact records, and biography.</p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 shadow-2xl p-6 md:p-8 space-y-6">
      
      <!-- Name & Email -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Full Name <span class="text-orange-400">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="e.g. ESV Olaoluwa Isaac"
            class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
          >
        </div>

        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Email Address <span class="text-orange-400">*</span>
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="e.g. name@ksavaluers.com"
            class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition font-mono"
          >
        </div>
      </div>

      <!-- Role & Tag -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Role / Job Title <span class="text-orange-400">*</span>
          </label>
          <input
            v-model="form.role"
            type="text"
            required
            placeholder="e.g. Head of Estate Management & Valuation"
            class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
          >
        </div>

        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Professional Tag <span class="text-orange-400">*</span>
          </label>
          <input
            v-model="form.tag"
            type="text"
            required
            placeholder="e.g. Estate Surveyor, Certified Valuer"
            class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
          >
        </div>
      </div>

      <!-- Biography / Description -->
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
          Biography / Professional Profile <span class="text-orange-400">*</span>
        </label>
        <textarea
          v-model="form.description"
          required
          rows="5"
          placeholder="Describe the member's professional focus, experience, and certifications..."
          class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition leading-relaxed"
        ></textarea>
      </div>

      <!-- Image URL & Device Upload -->
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Profile Image Source</label>
        <div class="flex items-center gap-4 mb-3">
          <label class="flex items-center text-xs text-slate-300 cursor-pointer">
            <input type="radio" v-model="imageSource" value="upload" class="mr-2 text-blue-500 focus:ring-blue-500 bg-slate-950 border-slate-800">
            Upload from Device
          </label>
          <label class="flex items-center text-xs text-slate-300 cursor-pointer">
            <input type="radio" v-model="imageSource" value="url" class="mr-2 text-blue-500 focus:ring-blue-500 bg-slate-950 border-slate-800">
            Paste Image URL / Filename
          </label>
        </div>

        <!-- Upload input -->
        <div v-if="imageSource === 'upload'" class="space-y-2 mb-2">
          <div class="flex items-center justify-center w-full">
            <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer bg-slate-950/80 hover:bg-slate-950 transition relative group">
              <div v-if="uploadingFile" class="flex flex-col items-center justify-center">
                <div class="w-8 h-8 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin mb-2"></div>
                <p class="text-xs text-slate-400 font-mono">Uploading avatar image...</p>
              </div>
              <div v-else class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-2 text-slate-500 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-xs text-slate-300"><span class="font-semibold text-orange-400">Click to upload</span> or drag photo file</p>
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
          type="text"
          placeholder="e.g. DSC00129-240x300.jpeg or https://..."
          class="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition font-mono"
        >
        <p class="text-xs text-slate-500 mt-1.5 font-mono">Provide a filename from assets/images (e.g. DSC00129-240x300.jpeg) or a custom web URL.</p>
        
        <!-- Image Preview -->
        <div v-if="form.image" class="mt-4 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 inline-block">
          <p class="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Profile Avatar Preview:</p>
          <img 
            :src="getImageUrl(form.image)" 
            alt="Preview" 
            @error="handlePreviewError"
            class="w-28 h-28 object-cover rounded-xl border border-slate-700 shadow-md"
          >
        </div>
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
          {{ submitting ? 'Saving Profile...' : (isEditMode ? 'Save Changes' : 'Create Profile') }}
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
