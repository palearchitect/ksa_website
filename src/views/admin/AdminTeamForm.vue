<template>
  <div class="space-y-6 max-w-4xl mx-auto text-slate-800 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
          <span>{{ isEditMode ? 'Edit Team Member Profile' : 'Add New Team Member' }}</span>
          <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            {{ isEditMode ? 'Profile Edit' : 'New Staff' }}
          </span>
        </h1>
        <p class="text-xs text-slate-500 font-normal">Provide professional details, certifications, contact records, and biography</p>
      </div>
      <button @click="goBack" class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors shadow-2xs">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        <span>Back to Staff Directory</span>
      </button>
    </div>

    <!-- Form Container -->
    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-6 sm:p-8 space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Full Name *</label>
          <input v-model="form.name" type="text" required placeholder="e.g., ESV Olaoluwa Isaac" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Address *</label>
          <input v-model="form.email" type="email" required placeholder="e.g., name@ksavaluers.com" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition font-mono">
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Role / Job Title *</label>
          <input v-model="form.role" type="text" required placeholder="e.g., Head of Valuation" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Professional Tag *</label>
          <input v-model="form.tag" type="text" required placeholder="e.g., Certified Valuer" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition">
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Biography / Profile *</label>
        <textarea v-model="form.description" required rows="4" placeholder="Describe professional experience and certifications..." class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition leading-relaxed resize-none"></textarea>
      </div>

      <!-- Image Source & Device Upload -->
      <div class="space-y-3">
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Profile Photo Source</label>
        <div class="flex items-center gap-3 text-xs">
          <label class="flex items-center text-slate-700 font-medium cursor-pointer">
            <input type="radio" v-model="imageSource" value="upload" class="mr-1.5 text-slate-900">
            Upload from Device
          </label>
          <label class="flex items-center text-slate-700 font-medium cursor-pointer">
            <input type="radio" v-model="imageSource" value="url" class="mr-1.5 text-slate-900">
            Paste Image URL / Filename
          </label>
        </div>

        <div v-if="imageSource === 'upload'" class="flex items-center gap-3">
          <label class="flex items-center justify-center px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg cursor-pointer transition text-xs border border-slate-200">
            <span>{{ uploadingFile ? 'Processing...' : 'Choose Photo File' }}</span>
            <input type="file" class="hidden" accept="image/*" @change="handleFileUpload" :disabled="uploadingFile">
          </label>
          <span class="text-xs text-slate-500 truncate max-w-xs font-mono" v-if="form.image">Photo Selected</span>
        </div>
        <input v-else v-model="form.image" type="text" placeholder="e.g., DSC00129-240x300.jpeg or https://..." class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition font-mono">
      </div>

      <div v-if="form.image" class="p-3 bg-slate-50 rounded-lg border border-slate-200 inline-block">
        <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Avatar Preview:</p>
        <img :src="getImageUrl(form.image)" alt="Preview" class="w-20 h-20 object-cover rounded-md border border-slate-200" @error="handleImageError">
      </div>

      <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-lg text-xs flex items-center gap-2">
        <svg class="w-4 h-4 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <span>{{ errorMessage }}</span>
      </div>

      <div class="flex items-center gap-3 pt-4 border-t border-slate-100">
        <button :disabled="submitting" class="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs shadow-2xs transition-colors disabled:opacity-50">
          {{ submitting ? 'Saving Profile...' : (isEditMode ? 'Update Profile' : 'Publish Member') }}
        </button>
        <button type="button" @click="goBack" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useTeamStore } from '@/stores/teamStore'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { uploadService } from '@/services/api'

const teamStore = useTeamStore()
const route = useRoute()
const router = useRouter()

const isEditMode = computed(() => Boolean(route.params.id))
const submitting = ref(false)
const errorMessage = ref('')
const imageSource = ref('upload')
const uploadingFile = ref(false)

const form = ref({
  name: '',
  role: '',
  email: '',
  tag: 'Estate Surveyor',
  description: '',
  image: ''
})

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async () => {
    uploadingFile.value = true
    try {
      const res = await uploadService.uploadFile(file.name, reader.result)
      if (res && res.url) {
        form.value.image = res.url
      } else {
        form.value.image = reader.result
      }
    } catch (err) {
      console.warn('File upload fallback:', err)
      form.value.image = reader.result
    } finally {
      uploadingFile.value = false
    }
  }
  reader.readAsDataURL(file)
}

onMounted(async () => {
  await teamStore.fetchTeamMembers()
  if (isEditMode.value) {
    const existing = teamStore.getTeamMemberById(Number(route.params.id))
    if (existing) {
      form.value = { ...existing }
    } else {
      errorMessage.value = 'Team member profile not found'
    }
  }
})

const getImageUrl = (image) => {
  if (!image) return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
  if (image.startsWith('http') || image.startsWith('data:')) return image
  try {
    return new URL(`../../assets/images/${image}`, import.meta.url).href
  } catch {
    return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
  }
}

const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
}

const handleSubmit = async () => {
  errorMessage.value = ''
  submitting.value = true
  
  const result = isEditMode.value
    ? teamStore.updateTeamMember(Number(route.params.id), form.value)
    : teamStore.addTeamMember(form.value)
    
  submitting.value = false
  if (result.success !== false) {
    router.push({ name: 'AdminTeamList' })
  } else {
    errorMessage.value = result.message || 'Failed to save team member profile'
  }
}

const goBack = () => router.push({ name: 'AdminTeamList' })
</script>
