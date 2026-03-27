<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="relative bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 text-white py-20">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-5xl md:text-6xl font-bold mb-4">Ongoing Projects</h1>
          <p class="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Track our current real estate developments and construction progress across Nigeria.
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Stats Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm">Active Projects</p>
                <p class="text-3xl font-bold text-gray-900">{{ ongoingProjects.length }}</p>
              </div>
              <div class="p-3 bg-yellow-100 rounded-full">
                <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm">Total Investment</p>
                <p class="text-3xl font-bold text-gray-900">{{ formatTotalBudget() }}</p>
              </div>
              <div class="p-3 bg-green-100 rounded-full">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm">Avg. Completion</p>
                <p class="text-3xl font-bold text-gray-900">{{ calculateAvgCompletion() }}%</p>
              </div>
              <div class="p-3 bg-blue-100 rounded-full">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Section -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search ongoing projects..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
              >
            </div>
            <div>
              <select v-model="selectedType" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white">
                <option value="all">All Types</option>
                <option v-for="type in projectStore.PROJECT_TYPES" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Projects List -->
        <div v-if="filteredOngoingProjects.length > 0" class="space-y-8">
          <div 
            v-for="project in filteredOngoingProjects" 
            :key="project.id"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div class="md:flex">
              <!-- Project Image -->
              <div class="md:w-1/3">
                <img 
                  :src="project.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'" 
                  :alt="project.title"
                  class="w-full h-64 md:h-full object-cover"
                >
              </div>

              <!-- Project Details -->
              <div class="md:w-2/3 p-8">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-2xl font-bold text-gray-900">{{ project.title }}</h3>
                      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                        🚧 {{ project.status }}
                      </span>
                    </div>
                    <p class="text-gray-600 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {{ project.location }}
                    </p>
                  </div>
                </div>

                <p class="text-gray-700 mb-6">{{ project.description }}</p>

                <!-- Project Info Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                    <p class="text-sm text-gray-500">Started</p>
                    <p class="font-semibold text-gray-900">{{ projectStore.formatDate(project.startDate) }}</p>
                  </div>
                </div>

                <!-- Progress Section -->
                <div class="mb-6">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-700">Construction Progress</span>
                    <span class="text-sm font-bold text-gray-900">{{ project.completionPercentage || 0 }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      :class="getProgressBarClass(project.completionPercentage)"
                      class="h-3 rounded-full transition-all"
                      :style="{ width: `${project.completionPercentage || 0}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Timeline -->
                <div class="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div class="flex items-center gap-4 text-sm text-gray-600">
                    <div>
                      <span class="font-medium">Expected Completion:</span>
                      <span class="ml-2">{{ projectStore.formatDate(project.expectedCompletion) }}</span>
                    </div>
                  </div>
                  <button
                    @click="viewProjectDetails(project)"
                    class="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition"
                  >
                    View Details
                  </button>
                </div>

                <!-- Amenities -->
                <div v-if="project.amenities && project.amenities.length" class="mt-4">
                  <p class="text-sm text-gray-500 mb-2">Amenities:</p>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="amenity in project.amenities" 
                      :key="amenity"
                      class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {{ amenity }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="inline-block p-8 bg-yellow-50 rounded-full mb-6">
            <svg class="w-16 h-16 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">No Ongoing Projects</h3>
          <p class="text-gray-600 mb-6">There are currently no projects in progress. Check back soon!</p>
          <router-link
            to="/projects"
            class="inline-block px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition"
          >
            View All Projects
          </router-link>
        </div>
      </div>
    </div>

    <!-- Project Detail Modal -->
    <Teleport to="body">
      <div v-if="selectedProject" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeProjectModal"></div>
        <div class="relative min-h-screen flex items-center justify-center p-4">
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Modal Header Image -->
            <div class="relative h-56">
              <img
                :src="selectedProject.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop'"
                :alt="selectedProject.title"
                class="w-full h-full object-cover rounded-t-2xl"
              >
              <button @click="closeProjectModal" class="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-100">
                <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div class="absolute bottom-4 left-4">
                <span class="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                  {{ selectedProject.status }}
                </span>
              </div>
            </div>

            <!-- Modal Content -->
            <div class="p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedProject.title }}</h2>
              <p class="text-gray-600 flex items-center gap-2 mb-4">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ selectedProject.location }}
              </p>
              <p class="text-gray-700 mb-6">{{ selectedProject.description }}</p>

              <!-- Project Info Grid -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-gray-50 p-3 rounded-lg">
                  <p class="text-xs text-gray-500">Type</p>
                  <p class="font-semibold">{{ selectedProject.type }}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                  <p class="text-xs text-gray-500">Budget</p>
                  <p class="font-semibold">{{ projectStore.formatBudget(selectedProject.budget) }}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                  <p class="text-xs text-gray-500">Total Units</p>
                  <p class="font-semibold">{{ selectedProject.totalUnits || 'N/A' }}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                  <p class="text-xs text-gray-500">Started</p>
                  <p class="font-semibold">{{ projectStore.formatDate(selectedProject.startDate) }}</p>
                </div>
              </div>

              <!-- Progress -->
              <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700">Construction Progress</span>
                  <span class="text-sm font-bold">{{ selectedProject.completionPercentage || 0 }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div
                    :class="getProgressBarClass(selectedProject.completionPercentage)"
                    class="h-3 rounded-full transition-all"
                    :style="{ width: `${selectedProject.completionPercentage || 0}%` }"
                  ></div>
                </div>
              </div>

              <!-- Timeline -->
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg">
                  <p class="text-xs text-blue-600 font-medium">Start Date</p>
                  <p class="font-semibold text-gray-900">{{ projectStore.formatDate(selectedProject.startDate) }}</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                  <p class="text-xs text-green-600 font-medium">Expected Completion</p>
                  <p class="font-semibold text-gray-900">{{ projectStore.formatDate(selectedProject.expectedCompletion) }}</p>
                </div>
              </div>

              <!-- Amenities -->
              <div v-if="selectedProject.amenities && selectedProject.amenities.length" class="mb-6">
                <h3 class="text-sm font-medium text-gray-700 mb-3">Amenities</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="amenity in selectedProject.amenities"
                    :key="amenity"
                    class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {{ amenity }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-4 pt-4 border-t">
                <router-link
                  to="/book-a-tour"
                  class="flex-1 text-center px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition"
                >
                  Schedule a Visit
                </router-link>
                <button
                  @click="closeProjectModal"
                  class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Close
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
  
  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.title?.toLowerCase().includes(query) ||
      p.location?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    )
  }
  
  // Type filter
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

const getProgressBarClass = (percentage) => {
  if (percentage >= 75) return 'bg-green-600'
  if (percentage >= 50) return 'bg-yellow-600'
  if (percentage >= 25) return 'bg-orange-600'
  return 'bg-red-600'
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
