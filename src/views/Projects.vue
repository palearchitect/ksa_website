<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-5xl md:text-6xl font-bold mb-4">Our Projects</h1>
          <p class="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Discover our portfolio of exceptional real estate developments across Nigeria.
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Filters Section -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search Box -->
            <div>
              <input
                v-model="projectStore.searchQuery"
                type="text"
                placeholder="Search projects..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
            </div>

            <!-- Status Filter -->
            <div>
              <select v-model="projectStore.filters.status" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="all">All Status</option>
                <option v-for="status in projectStore.PROJECT_STATUS" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
            </div>

            <!-- Type Filter -->
            <div>
              <select v-model="projectStore.filters.type" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="all">All Types</option>
                <option v-for="type in projectStore.PROJECT_TYPES" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Results Info -->
        <div class="mb-6 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Our Projects</h2>
            <p class="text-gray-600">{{ projectStore.filteredProjects.length }} projects found</p>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="n in 4" :key="n" class="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div class="h-64 bg-gray-300"></div>
            <div class="p-6">
              <div class="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div class="h-3 bg-gray-300 rounded w-1/2 mb-6"></div>
              <div class="flex justify-between">
                <div class="h-3 bg-gray-300 rounded w-1/4"></div>
                <div class="h-3 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Projects Grid -->
        <div v-else-if="projectStore.filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            v-for="project in projectStore.filteredProjects" 
            :key="project.id"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <!-- Project Image -->
            <div class="relative h-64">
              <img 
                :src="project.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'" 
                :alt="project.title"
                class="w-full h-full object-cover"
              >
              <div class="absolute top-4 left-4">
                <span :class="getStatusBadgeClass(project.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                  {{ project.status }}
                </span>
              </div>
              <div v-if="project.featured" class="absolute top-4 right-4">
                <span class="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold">
                  ⭐ Featured
                </span>
              </div>
            </div>

            <!-- Project Details -->
            <div class="p-6">
              <div class="mb-4">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ project.title }}</h3>
                <p class="text-gray-600 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ project.location }}
                </p>
              </div>

              <p class="text-gray-700 mb-4 line-clamp-3">{{ project.description }}</p>

              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-sm text-gray-500">Type</p>
                  <p class="font-semibold text-gray-900">{{ project.type }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Budget</p>
                  <p class="font-semibold text-gray-900">{{ projectStore.formatBudget(project.budget) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Total Units</p>
                  <p class="font-semibold text-gray-900">{{ project.totalUnits || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Completion</p>
                  <p class="font-semibold text-gray-900">{{ project.completionPercentage || 0 }}%</p>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mb-4">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    :class="getProgressBarClass(project.completionPercentage)"
                    class="h-2 rounded-full transition-all"
                    :style="{ width: `${project.completionPercentage || 0}%` }"
                  ></div>
                </div>
              </div>

              <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                <div class="text-sm text-gray-500">
                  <span v-if="project.expectedCompletion">Expected: {{ projectStore.formatDate(project.expectedCompletion) }}</span>
                </div>
                <button
                  @click="viewProjectDetails(project)"
                  class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="inline-block p-8 bg-blue-50 rounded-full mb-6">
            <svg class="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">No Projects Found</h3>
          <p class="text-gray-600 mb-6">Try adjusting your search filters or check back later for new projects.</p>
          <button @click="resetFilters" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
            Reset All Filters
          </button>
        </div>
      </div>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import { ref } from 'vue'
import ErrorBoundary from '../components/global/ErrorBoundary.vue'
import { useProjectStore } from '@/stores/projectStore'
import { useSEO } from '../hooks/useSEO'

useSEO({
  title: 'Our Projects | KSA Valuers',
  description: 'Discover our portfolio of exceptional real estate developments across Nigeria.'
})

const projectStore = useProjectStore()
const loading = ref(false)

const getStatusBadgeClass = (status) => {
  const classes = {
    'Planning': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
    'On Hold': 'bg-orange-100 text-orange-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getProgressBarClass = (percentage) => {
  if (percentage >= 75) return 'bg-green-600'
  if (percentage >= 50) return 'bg-yellow-600'
  if (percentage >= 25) return 'bg-orange-600'
  return 'bg-red-600'
}

const resetFilters = () => {
  projectStore.searchQuery = ''
  projectStore.filters.status = 'all'
  projectStore.filters.type = 'all'
}

const viewProjectDetails = (project) => {
  alert(`Project Details:\n\nTitle: ${project.title}\nLocation: ${project.location}\nStatus: ${project.status}\nCompletion: ${project.completionPercentage}%\n\nFull detail page coming soon!`)
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
</style>
