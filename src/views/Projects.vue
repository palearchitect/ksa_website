<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100/90 text-slate-900">
      <!-- Hero Section -->
      <div class="relative bg-gradient-to-b from-[#030810] via-[#071328] to-[#0a1835] text-white pt-28 md:pt-36 pb-16 overflow-hidden border-b border-white/10">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.25),rgba(249,104,22,0.1)_50%,transparent_80%)] pointer-events-none"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            Capital Projects & Advisory
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
            Development <span class="text-gradient-brand">Projects</span>
          </h1>
          <p class="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Institutional property developments, statutory project monitoring, and infrastructure advisory across Nigeria.
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Floating Glassmorphic Filters Console -->
        <div class="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-3.5 shadow-lg mb-10 -mt-16 relative z-20">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
            <!-- Search Box -->
            <div class="md:col-span-6 relative">
              <input
                v-model="projectStore.searchQuery"
                type="text"
                placeholder="Search projects by name, location, keyword..."
                class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
              <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Status Filter -->
            <div class="md:col-span-3">
              <select v-model="projectStore.filters.status" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer">
                <option value="all">All Project Statuses</option>
                <option v-for="status in projectStore.PROJECT_STATUS" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
            </div>

            <!-- Type Filter -->
            <div class="md:col-span-3">
              <select v-model="projectStore.filters.type" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer">
                <option value="all">All Asset Classes</option>
                <option v-for="type in projectStore.PROJECT_TYPES" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Results Info -->
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h2 class="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Active Portfolio</h2>
            <p class="text-xs text-slate-500 font-medium">{{ projectStore.filteredProjects.length }} development schemes cataloged</p>
          </div>
          <button 
            v-if="projectStore.searchQuery || projectStore.filters.status !== 'all' || projectStore.filters.type !== 'all'"
            @click="resetFilters" 
            class="text-xs font-semibold text-orange-600 hover:text-orange-700 underline"
          >
            Reset Filters
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="n in 4" :key="n" class="bento-card bg-white border border-slate-200 rounded-3xl p-6 animate-pulse">
            <div class="h-56 bg-slate-200 rounded-2xl mb-4"></div>
            <div class="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div class="h-10 bg-slate-100 rounded-xl"></div>
          </div>
        </div>

        <!-- Projects Grid -->
        <div v-else-if="projectStore.filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            v-for="project in projectStore.filteredProjects" 
            :key="project.id"
            class="bento-card bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <!-- Project Image Header -->
              <div class="relative h-64 overflow-hidden bg-slate-100">
                <img 
                  :src="project.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'" 
                  :alt="project.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                <div class="absolute top-4 left-4 flex gap-2">
                  <span :class="getStatusBadgeClass(project.status)" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    {{ project.status }}
                  </span>
                  <span class="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-800 rounded-full text-xs font-semibold shadow-sm">
                    {{ project.type }}
                  </span>
                </div>
                <div v-if="project.featured" class="absolute top-4 right-4">
                  <span class="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md inline-flex items-center gap-1">
                    ★ Featured
                  </span>
                </div>
                <div class="absolute bottom-4 left-4 right-4 text-white">
                  <h3 class="text-xl font-extrabold text-white tracking-tight">{{ project.title }}</h3>
                  <p class="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                    <svg class="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ project.location }}
                  </p>
                </div>
              </div>

              <!-- Project Details -->
              <div class="p-6 md:p-8">
                <p class="text-slate-600 text-xs md:text-sm leading-relaxed mb-6 line-clamp-3">
                  {{ project.description }}
                </p>

                <!-- Specifications Bento Strip -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-6 text-center">
                  <div>
                    <p class="text-[10px] uppercase font-bold text-slate-400">Class</p>
                    <p class="text-xs font-bold text-slate-800 mt-0.5 truncate">{{ project.type }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] uppercase font-bold text-slate-400">Budget</p>
                    <p class="text-xs font-bold text-slate-800 mt-0.5">{{ projectStore.formatBudget(project.budget) }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] uppercase font-bold text-slate-400">Units</p>
                    <p class="text-xs font-bold text-slate-800 mt-0.5">{{ project.totalUnits || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] uppercase font-bold text-slate-400">Progress</p>
                    <p class="text-xs font-extrabold text-blue-700 mt-0.5">{{ project.completionPercentage || 0 }}%</p>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="space-y-1.5 mb-2">
                  <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                    <div 
                      :class="getProgressBarClass(project.completionPercentage)"
                      class="h-full rounded-full transition-all duration-500"
                      :style="{ width: `${project.completionPercentage || 0}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Bar -->
            <div class="px-6 md:px-8 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
              <span class="text-xs text-slate-500 font-medium">
                <span v-if="project.expectedCompletion">Target: {{ projectStore.formatDate(project.expectedCompletion) }}</span>
                <span v-else>Milestones Ongoing</span>
              </span>
              <button
                @click="openProjectDetails(project)"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-700 transition-all duration-200"
              >
                <span>View Dossier</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bento-card p-12 bg-white border border-slate-200/80 text-center max-w-lg mx-auto">
          <div class="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">No Projects Match Your Query</h3>
          <p class="text-xs text-slate-500 mb-6">Try clearing your search terms or expanding your filter selection.</p>
          <button @click="resetFilters" class="pill-button-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider">
            Reset Filters
          </button>
        </div>
      </div>

      <!-- Full-screen Project Details Modal -->
      <Teleport to="body">
        <Transition name="modal-fade">
          <div 
            v-if="selectedProject" 
            class="fixed inset-0 z-[150] overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
            @click.self="closeProjectDetails"
          >
            <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden relative flex flex-col md:flex-row max-h-[90vh] border border-slate-200">
              <!-- Close Button -->
              <button 
                @click="closeProjectDetails" 
                class="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition hover:scale-105"
                aria-label="Close modal"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <!-- Left Side: Image / Carousel -->
              <div class="md:w-1/2 relative bg-slate-900 flex items-center justify-center min-h-[280px] md:min-h-full">
                <!-- Carousel view -->
                <div v-if="projectImages.length > 1" class="absolute inset-0 w-full h-full">
                  <TransitionGroup name="fade">
                    <img 
                      v-for="(img, idx) in projectImages" 
                      v-show="currentImageIndex === idx"
                      :key="idx"
                      :src="img" 
                      :alt="`${selectedProject.title} - ${idx + 1}`"
                      class="absolute inset-0 w-full h-full object-cover"
                    >
                  </TransitionGroup>
                  
                  <!-- Prev/Next buttons -->
                  <button 
                    @click="prevImage" 
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition z-10"
                    aria-label="Previous image"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    @click="nextImage" 
                    class="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition z-10"
                    aria-label="Next image"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <!-- Dots -->
                  <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                    <button 
                      v-for="(_, idx) in projectImages" 
                      :key="idx" 
                      @click="currentImageIndex = idx" 
                      :class="currentImageIndex === idx ? 'bg-white w-4' : 'bg-white/50 w-2'" 
                      class="h-1.5 rounded-full transition-all duration-300"
                      :aria-label="`Go to image ${idx + 1}`"
                    ></button>
                  </div>
                </div>
                <!-- Single Image -->
                <div v-else class="absolute inset-0 w-full h-full">
                  <img 
                    :src="projectImages[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'" 
                    :alt="selectedProject.title"
                    class="w-full h-full object-cover"
                  >
                </div>
              </div>

              <!-- Right Side: Details -->
              <div class="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-[85vh]">
                <div>
                  <!-- Badges -->
                  <div class="flex flex-wrap gap-2 mb-4">
                    <span :class="getStatusBadgeClass(selectedProject.status)" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {{ selectedProject.status }}
                    </span>
                    <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                      {{ selectedProject.type }}
                    </span>
                    <span v-if="selectedProject.featured" class="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                      Featured Project
                    </span>
                  </div>

                  <h3 class="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">{{ selectedProject.title }}</h3>
                  
                  <p class="text-slate-500 text-xs flex items-center gap-1.5 mb-6">
                    <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ selectedProject.location }}
                  </p>

                  <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Project Brief</h4>
                  <p class="text-slate-600 text-xs md:text-sm leading-relaxed mb-6">{{ selectedProject.description }}</p>

                  <!-- Specifications -->
                  <div class="grid grid-cols-2 gap-3 mb-6">
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p class="text-[10px] text-slate-400 font-bold uppercase">Budget Estimate</p>
                      <p class="font-bold text-slate-900 text-xs mt-0.5">{{ projectStore.formatBudget(selectedProject.budget) }}</p>
                    </div>
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p class="text-[10px] text-slate-400 font-bold uppercase">Total Units</p>
                      <p class="font-bold text-slate-900 text-xs mt-0.5">{{ selectedProject.totalUnits || 'N/A' }}</p>
                    </div>
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p class="text-[10px] text-slate-400 font-bold uppercase">Delivery Target</p>
                      <p class="font-bold text-slate-900 text-xs mt-0.5">{{ selectedProject.expectedCompletion ? projectStore.formatDate(selectedProject.expectedCompletion) : 'N/A' }}</p>
                    </div>
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p class="text-[10px] text-slate-400 font-bold uppercase">Status</p>
                      <p class="font-bold text-slate-900 text-xs mt-0.5">{{ selectedProject.status }}</p>
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div class="space-y-1.5 mb-6">
                    <div class="flex justify-between text-xs font-bold text-slate-700">
                      <span>Development Progress</span>
                      <span class="text-blue-700">{{ selectedProject.completionPercentage || 0 }}%</span>
                    </div>
                    <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                      <div 
                        :class="getProgressBarClass(selectedProject.completionPercentage)"
                        class="h-full rounded-full transition-all duration-500"
                        :style="{ width: `${selectedProject.completionPercentage || 0}%` }"
                      ></div>
                    </div>
                  </div>

                  <!-- Amenities/Features -->
                  <div v-if="selectedProject.amenities && selectedProject.amenities.length > 0" class="mb-6">
                    <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Amenities & Features</h4>
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="amenity in selectedProject.amenities" 
                        :key="amenity" 
                        class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                      >
                        {{ amenity }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="pt-4 border-t border-slate-100 flex gap-3">
                  <button 
                    @click="closeProjectDetails" 
                    class="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-full transition"
                  >
                    Dismiss
                  </button>
                  <router-link 
                    to="/book-a-tour"
                    class="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-full transition text-center shadow-glow-orange"
                  >
                    Book Site Tour
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ErrorBoundary from '../components/global/ErrorBoundary.vue'
import { useProjectStore } from '@/stores/projectStore'
import { useSEO } from '../hooks/useSEO'

useSEO({
  title: 'Our Projects | KSA Valuers',
  description: 'Discover our portfolio of exceptional real estate developments across Nigeria.'
})

const projectStore = useProjectStore()
const loading = ref(false)

const selectedProject = ref(null)
const currentImageIndex = ref(0)

const projectImages = computed(() => {
  if (!selectedProject.value) return []
  if (selectedProject.value.images && selectedProject.value.images.length > 0) {
    return selectedProject.value.images
  }
  if (selectedProject.value.image) {
    const baseImg = selectedProject.value.image
    if (baseImg.includes('unsplash.com')) {
      return [
        baseImg,
        baseImg.replace(/\?.*$/, '') + '?w=800&h=600&fit=crop&q=80&sig=1',
        baseImg.replace(/\?.*$/, '') + '?w=800&h=600&fit=crop&q=80&sig=2'
      ]
    }
    return [baseImg]
  }
  return []
})

const openProjectDetails = (project) => {
  selectedProject.value = project
  currentImageIndex.value = 0
}

const closeProjectDetails = () => {
  selectedProject.value = null
}

const nextImage = () => {
  if (projectImages.value.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % projectImages.value.length
  }
}

const prevImage = () => {
  if (projectImages.value.length > 0) {
    currentImageIndex.value = (currentImageIndex.value - 1 + projectImages.value.length) % projectImages.value.length
  }
}

const handleKeyDown = (e) => {
  if (!selectedProject.value) return
  if (e.key === 'Escape') {
    closeProjectDetails()
  } else if (e.key === 'ArrowRight') {
    nextImage()
  } else if (e.key === 'ArrowLeft') {
    prevImage()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const getStatusBadgeClass = (status) => {
  const classes = {
    'Planning': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-orange-100 text-orange-800',
    'Completed': 'bg-emerald-100 text-emerald-800',
    'On Hold': 'bg-slate-100 text-slate-800'
  }
  return classes[status] || 'bg-slate-100 text-slate-800'
}

const getProgressBarClass = (percentage) => {
  if (percentage >= 75) return 'bg-emerald-600'
  if (percentage >= 50) return 'bg-blue-600'
  if (percentage >= 25) return 'bg-orange-500'
  return 'bg-amber-500'
}

const resetFilters = () => {
  projectStore.searchQuery = ''
  projectStore.filters.status = 'all'
  projectStore.filters.type = 'all'
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Modal Fade Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Carousel Image Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
