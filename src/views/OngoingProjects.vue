<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-transparent text-slate-900">
      <!-- Hero Section -->
      <div class="relative bg-gradient-to-b from-[#030810] via-[#071328] to-[#0a1835] text-white pt-28 md:pt-36 pb-16 overflow-hidden border-b border-white/10">
        <PatternBackgroundDark />
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.25),rgba(249,104,22,0.1)_50%,transparent_80%)] pointer-events-none"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            Capital Developments & Progress
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-white mb-4">
            Ongoing <span class="font-serif italic font-normal text-gradient-brand">Developments</span>
          </h1>
          <p class="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Real-time milestone tracking, capital allocations, and construction progress across our active developmental portfolio.
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Stats Bento Strip -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div class="bento-card p-6 bg-white border border-slate-200/90 shadow-lg flex items-center justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Active Developments</p>
              <p class="text-3xl font-extrabold text-slate-900 mt-1">{{ ongoingProjects.length }}</p>
              <p class="text-xs text-slate-400 mt-0.5">Sites currently breaking ground</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          <div class="bento-card p-6 bg-white border border-slate-200/90 shadow-lg flex items-center justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Committed Capital</p>
              <p class="text-3xl font-extrabold text-slate-900 mt-1">{{ formatTotalBudget() }}</p>
              <p class="text-xs text-slate-400 mt-0.5">Aggregate project value</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div class="bento-card p-6 bg-white border border-slate-200/90 shadow-lg flex items-center justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Mean Progress Rate</p>
              <p class="text-3xl font-extrabold text-blue-700 mt-1">{{ calculateAvgCompletion() }}%</p>
              <p class="text-xs text-slate-400 mt-0.5">Average milestone delivery</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Filter Console (Glass Pill) -->
        <div class="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-3 shadow-md mb-10">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div class="md:col-span-8 relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search ongoing projects by name, location..."
                class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
              <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div class="md:col-span-4">
              <select v-model="selectedType" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer">
                <option value="all">All Asset Types</option>
                <option v-for="type in projectStore.PROJECT_TYPES" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Projects Bento Grid -->
        <div v-if="filteredOngoingProjects.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div 
            v-for="project in filteredOngoingProjects" 
            :key="project.id"
            class="bento-card bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <!-- Project Image with Badge -->
              <div class="relative h-64 overflow-hidden bg-slate-100">
                <img 
                  :src="project.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'" 
                  :alt="project.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                <div class="absolute top-4 left-4">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-500 text-white shadow-md">
                    <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    {{ project.status }}
                  </span>
                </div>
                <div class="absolute bottom-4 left-4 right-4 text-white">
                  <p class="text-xs text-orange-300 font-semibold uppercase tracking-wider">{{ project.type }}</p>
                  <h3 class="text-xl font-extrabold text-white tracking-tight">{{ project.title }}</h3>
                </div>
              </div>

              <!-- Project Details -->
              <div class="p-6 md:p-8">
                <p class="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                  <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ project.location }}
                </p>

                <p class="text-slate-600 text-xs md:text-sm leading-relaxed mb-6 line-clamp-2">
                  {{ project.description }}
                </p>

                <!-- Project Quick Metrics Bento Strip -->
                <div class="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 mb-6 text-center">
                  <div>
                    <p class="text-[10px] uppercase font-bold text-slate-400">Budget</p>
                    <p class="text-xs md:text-sm font-extrabold text-slate-900">{{ projectStore.formatBudget(project.budget) }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] uppercase font-bold text-slate-400">Planned Units</p>
                    <p class="text-xs md:text-sm font-extrabold text-slate-900">{{ project.totalUnits || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] uppercase font-bold text-slate-400">Target Date</p>
                    <p class="text-xs md:text-sm font-extrabold text-slate-900">{{ projectStore.formatDate(project.expectedCompletion) }}</p>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="space-y-2 mb-6">
                  <div class="flex justify-between items-center text-xs">
                    <span class="font-bold text-slate-700">Construction Milestones</span>
                    <span class="font-extrabold text-blue-700">{{ project.completionPercentage || 0 }}% Completed</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/60">
                    <div 
                      class="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500"
                      :style="{ width: `${project.completionPercentage || 0}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="px-6 md:px-8 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
              <span class="text-xs text-slate-500 font-medium">
                Started: {{ projectStore.formatDate(project.startDate) }}
              </span>
              <button
                @click="viewProjectDetails(project)"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-700 transition-all duration-200"
              >
                <span>Milestone Details</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bento-card p-12 bg-white border border-slate-200/80 text-center max-w-lg mx-auto">
          <div class="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">No Ongoing Projects Found</h3>
          <p class="text-xs text-slate-500 mb-6">No active developments match your current query.</p>
          <router-link
            to="/projects"
            class="pill-button-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider inline-block"
          >
            View Projects Catalog
          </router-link>
        </div>
      </div>
    </div>

    <!-- Project Detail Modal -->
    <Teleport to="body">
      <div v-if="selectedProject" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" @click="closeProjectModal"></div>
        <div class="relative min-h-screen flex items-center justify-center p-4">
          <div class="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <!-- Modal Header Image -->
            <div class="relative h-60 overflow-hidden">
              <img
                :src="selectedProject.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop'"
                :alt="selectedProject.title"
                class="w-full h-full object-cover"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              <button @click="closeProjectModal" class="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-md transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div class="absolute bottom-4 left-6 right-6 text-white">
                <span class="px-3 py-1 bg-orange-500 text-white rounded-full text-[11px] font-bold uppercase tracking-wider mb-2 inline-block">
                  {{ selectedProject.status }}
                </span>
                <h2 class="text-2xl font-extrabold text-white">{{ selectedProject.title }}</h2>
              </div>
            </div>

            <!-- Modal Content -->
            <div class="p-6 md:p-8 space-y-6">
              <p class="text-xs text-slate-500 flex items-center gap-2">
                <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ selectedProject.location }}
              </p>
              
              <p class="text-slate-600 text-xs md:text-sm leading-relaxed">{{ selectedProject.description }}</p>

              <!-- Project Info Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p class="text-[10px] font-bold text-slate-400 uppercase">Type</p>
                  <p class="font-extrabold text-xs text-slate-900 mt-0.5">{{ selectedProject.type }}</p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p class="text-[10px] font-bold text-slate-400 uppercase">Capital Budget</p>
                  <p class="font-extrabold text-xs text-slate-900 mt-0.5">{{ projectStore.formatBudget(selectedProject.budget) }}</p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p class="text-[10px] font-bold text-slate-400 uppercase">Units</p>
                  <p class="font-extrabold text-xs text-slate-900 mt-0.5">{{ selectedProject.totalUnits || 'N/A' }}</p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p class="text-[10px] font-bold text-slate-400 uppercase">Expected</p>
                  <p class="font-extrabold text-xs text-slate-900 mt-0.5">{{ projectStore.formatDate(selectedProject.expectedCompletion) }}</p>
                </div>
              </div>

              <!-- Progress -->
              <div class="space-y-2">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-slate-700">Milestone Completion</span>
                  <span class="font-extrabold text-blue-700">{{ selectedProject.completionPercentage || 0 }}%</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                  <div
                    class="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500"
                    :style="{ width: `${selectedProject.completionPercentage || 0}%` }"
                  ></div>
                </div>
              </div>

              <!-- Amenities -->
              <div v-if="selectedProject.amenities && selectedProject.amenities.length">
                <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Project Features</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="amenity in selectedProject.amenities"
                    :key="amenity"
                    class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                  >
                    {{ amenity }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-4 border-t border-slate-100">
                <router-link
                  to="/book-a-tour"
                  class="flex-1 text-center py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-glow-orange transition"
                >
                  Schedule Site Inspection
                </router-link>
                <button
                  @click="closeProjectModal"
                  class="px-6 py-3 rounded-full border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </ErrorBoundary>
</template>

<script setup>
import { ref, computed } from 'vue'
import ErrorBoundary from '../components/global/ErrorBoundary.vue'
import PatternBackgroundDark from '../components/global/PatternBackgroundDark.vue'
import { useProjectStore } from '@/stores/projectStore'
import { useSEO } from '../hooks/useSEO'

useSEO({
  title: 'Ongoing Projects | KSA Valuers',
  description: 'Track our current real estate developments and construction progress across Nigeria.'
})

const projectStore = useProjectStore()
const searchQuery = ref('')
const selectedType = ref('all')

const ongoingProjects = computed(() => {
  return projectStore.projects.filter(p => p.status === 'In Progress')
})

const filteredOngoingProjects = computed(() => {
  let filtered = [...ongoingProjects.value]
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.title?.toLowerCase().includes(query) ||
      p.location?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    )
  }
  
  if (selectedType.value !== 'all') {
    filtered = filtered.filter(p => p.type === selectedType.value)
  }
  
  return filtered
})

const formatTotalBudget = () => {
  const total = ongoingProjects.value.reduce((sum, p) => sum + (p.budget || 0), 0)
  return projectStore.formatBudget(total)
}

const calculateAvgCompletion = () => {
  if (ongoingProjects.value.length === 0) return 0
  const total = ongoingProjects.value.reduce((sum, p) => sum + (p.completionPercentage || 0), 0)
  return Math.round(total / ongoingProjects.value.length)
}

const selectedProject = ref(null)

const viewProjectDetails = (project) => {
  selectedProject.value = project
}

const closeProjectModal = () => {
  selectedProject.value = null
}
</script>

<style scoped>
</style>
