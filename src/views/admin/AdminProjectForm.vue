<template>
  <div class="space-y-6 max-w-4xl mx-auto text-slate-800 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
          <span>{{ isEditMode ? 'Edit Project Plan' : 'Add New Project' }}</span>
          <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            {{ isEditMode ? 'Project Update' : 'New Initiative' }}
          </span>
        </h1>
        <p class="text-xs text-slate-500 font-normal">Configure development milestones, budget allocations, location metadata, and progress</p>
      </div>
      <button @click="goBack" class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors shadow-2xs">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        <span>Back to Development Projects</span>
      </button>
    </div>

    <!-- Form Container -->
    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-6 sm:p-8 space-y-5">
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Project Title *</label>
        <input v-model="form.title" required placeholder="e.g., Luxury Waterfront Estate - Banana Island" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition">
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Location *</label>
        <select v-model="form.location" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition">
          <option value="">Select Location</option>
          <option v-for="location in projectStore.NIGERIAN_LOCATIONS" :key="location" :value="location">{{ location }}</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Description *</label>
        <textarea v-model="form.description" required rows="4" placeholder="Describe the development project, its architectural scope, features..." class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition leading-relaxed resize-none"></textarea>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Status *</label>
          <select v-model="form.status" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition">
            <option value="">Select Status</option>
            <option v-for="status in projectStore.PROJECT_STATUS" :key="status.value" :value="status.value">{{ status.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Project Type *</label>
          <select v-model="form.type" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition">
            <option value="">Select Type</option>
            <option v-for="type in projectStore.PROJECT_TYPES" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Budget (₦)</label>
          <input v-model.number="form.budget" type="number" min="0" placeholder="15000000000" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Total Planned Units</label>
          <input v-model.number="form.totalUnits" type="number" min="0" placeholder="50" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition">
        </div>
      </div>

      <!-- Image Source & Upload -->
      <div class="space-y-3">
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Cover Image</label>
        <div class="flex items-center gap-3 text-xs">
          <label class="flex items-center text-slate-700 font-medium cursor-pointer">
            <input type="radio" v-model="imageSource" value="upload" class="mr-1.5 text-slate-900">
            Upload File
          </label>
          <label class="flex items-center text-slate-700 font-medium cursor-pointer">
            <input type="radio" v-model="imageSource" value="url" class="mr-1.5 text-slate-900">
            Direct Image URL
          </label>
        </div>

        <div v-if="imageSource === 'upload'" class="flex items-center gap-3">
          <label class="flex items-center justify-center px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg cursor-pointer transition text-xs border border-slate-200">
            <span>{{ uploadingFile ? 'Processing...' : 'Choose Image File' }}</span>
            <input type="file" class="hidden" accept="image/*" @change="handleFileUpload" :disabled="uploadingFile">
          </label>
          <span class="text-xs text-slate-500 truncate max-w-xs font-mono" v-if="form.image">Image Selected</span>
        </div>
        <input v-else v-model="form.image" type="url" placeholder="https://images.unsplash.com/photo-..." class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white text-xs transition">
      </div>

      <div v-if="form.image" class="rounded-lg border border-slate-200 overflow-hidden h-36 bg-slate-100 relative">
        <img :src="form.image" class="w-full h-full object-cover" alt="Project Preview" />
      </div>

      <div class="flex items-center pt-2">
        <input v-model="form.featured" type="checkbox" id="featured" class="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900">
        <label for="featured" class="ml-2 text-xs font-medium text-slate-700">Feature this project on landing page</label>
      </div>

      <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-lg text-xs flex items-center gap-2">
        <svg class="w-4 h-4 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <span>{{ errorMessage }}</span>
      </div>

      <div class="flex items-center gap-3 pt-4 border-t border-slate-100">
        <button :disabled="submitting" class="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs shadow-2xs transition-colors disabled:opacity-50">
          {{ submitting ? 'Saving Project...' : (isEditMode ? 'Update Project' : 'Publish Project') }}
        </button>
        <button type="button" @click="goBack" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { uploadService } from '@/services/api'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

const isEditMode = computed(() => Boolean(route.params.id))
const submitting = ref(false)
const errorMessage = ref('')
const imageSource = ref('upload')
const uploadingFile = ref(false)

const form = ref({
  title: '',
  location: 'Lekki Phase 1, Lagos',
  description: '',
  status: 'In Progress',
  type: 'Residential Development',
  budget: 500000000,
  totalUnits: 20,
  completionPercentage: 35,
  startDate: '',
  expectedCompletion: '',
  image: '',
  featured: false
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
  await projectStore.fetchProjects()
  if (isEditMode.value) {
    const existing = projectStore.getProjectById(Number(route.params.id))
    if (existing) {
      form.value = { ...existing }
    } else {
      errorMessage.value = 'Project not found'
    }
  }
})

const handleSubmit = async () => {
  errorMessage.value = ''
  submitting.value = true
  
  const saveFn = projectStore.createProject || projectStore.addProject
  const result = isEditMode.value
    ? await projectStore.updateProject(Number(route.params.id), form.value)
    : await saveFn.call(projectStore, form.value)
    
  submitting.value = false
  if (result.success !== false) {
    router.push('/dashboard/admin/projects')
  } else {
    errorMessage.value = result.message || 'Failed to save project'
  }
}

const goBack = () => router.push('/dashboard/admin/projects')
</script>
