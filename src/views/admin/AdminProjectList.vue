<template>
  <div class="admin-project-list min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Projects Management</h1>
            <p class="text-gray-600 mt-1">Manage your ongoing and completed projects</p>
          </div>
          <button 
            @click="goToAddProject"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Project
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm">Total Projects</p>
                <p class="text-2xl font-bold text-gray-900">{{ projectStore.totalProjects }}</p>
              </div>
              <div class="p-3 bg-blue-100 rounded-full">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm">In Progress</p>
                <p class="text-2xl font-bold text-gray-900">{{ projectStore.activeProjects.length }}</p>
              </div>
              <div class="p-3 bg-yellow-100 rounded-full">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm">Completed</p>
                <p class="text-2xl font-bold text-gray-900">{{ projectStore.completedProjects.length }}</p>
              </div>
              <div class="p-3 bg-green-100 rounded-full">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm">Featured</p>
                <p class="text-2xl font-bold text-gray-900">{{ projectStore.featuredProjects.length }}</p>
              </div>
              <div class="p-3 bg-purple-100 rounded-full">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Search & Filter -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                v-model="projectStore.searchQuery"
                type="text"
                placeholder="Search projects..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
            <div>
              <select
                v-model="projectStore.filters.status"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option v-for="status in projectStore.PROJECT_STATUS" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
            </div>
            <div>
              <select
                v-model="projectStore.filters.type"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option v-for="type in projectStore.PROJECT_TYPES" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Projects List -->
      <div v-if="projectStore.filteredProjects.length > 0" class="grid grid-cols-1 gap-6">
        <div 
          v-for="project in projectStore.filteredProjects" 
          :key="project.id"
          class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div class="flex flex-col md:flex-row">
            <!-- Image -->
            <div class="md:w-1/3">
              <img 
                :src="project.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'" 
                :alt="project.title"
                class="w-full h-64 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
              >
            </div>

            <!-- Content -->
            <div class="flex-1 p-6">
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-2xl font-bold text-gray-900">{{ project.title }}</h3>
                    <span 
                      :class="getStatusBadgeClass(project.status)"
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ project.status }}
                    </span>
                    <span v-if="project.featured" class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                      ⭐ Featured
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

              <p class="text-gray-700 mb-4">{{ project.description }}</p>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p class="text-gray-500">Type</p>
                  <p class="font-semibold text-gray-900">{{ project.type }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Total Units</p>
                  <p class="font-semibold text-gray-900">{{ project.totalUnits || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Budget</p>
                  <p class="font-semibold text-gray-900">{{ projectStore.formatBudget(project.budget) }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Completion</p>
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
                  <span>Started: {{ projectStore.formatDate(project.startDate) }}</span>
                  <span class="mx-2">•</span>
                  <span>Expected: {{ projectStore.formatDate(project.expectedCompletion) }}</span>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="editProject(project.id)"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    @click="toggleFeatured(project.id)"
                    class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                  >
                    {{ project.featured ? 'Unfeature' : 'Feature' }}
                  </button>
                  <button
                    @click="deleteProject(project.id)"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow p-12 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Projects Found</h3>
        <p class="text-gray-600 mb-6">Get started by adding your first project</p>
        <button
          @click="goToAddProject"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          Add New Project
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProjectStore } from '@/stores/projectStore'
import { useRouter } from 'vue-router'

const projectStore = useProjectStore()
const router = useRouter()

const goToAddProject = () => {
  router.push({ name: 'AdminProjectForm' })
}

const editProject = (id) => {
  router.push({ name: 'AdminProjectEdit', params: { id } })
}

const toggleFeatured = (id) => {
  const project = projectStore.getProjectById(id)
  if (project) {
    projectStore.updateProject(id, { featured: !project.featured })
  }
}

const deleteProject = (id) => {
  if (confirm('Are you sure you want to delete this project?')) {
    const result = projectStore.deleteProject(id)
    if (result.success) {
      alert(result.message)
    }
  }
}

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
</script>
