<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-950/80 via-slate-950/90 to-orange-950/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/15 shadow-2xl">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight bg-gradient-to-r from-blue-300 via-white to-orange-300 bg-clip-text text-transparent">Ongoing Projects</h1>
        <p class="text-slate-300 text-xs mt-1 font-medium">Manage real estate development projects and track progress</p>
      </div>
      <button 
        @click="goToAddProject"
        class="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-md transition-all text-xs border border-white/20"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add New Project
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-xl p-4 border border-white/15 shadow-lg">
        <p class="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Total Projects</p>
        <p class="text-2xl font-extrabold text-white mt-1">{{ projectStore.totalProjects }}</p>
      </div>
      <div class="bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-xl p-4 border border-yellow-500/30 shadow-lg">
        <p class="text-[11px] font-semibold text-yellow-400 uppercase tracking-wider">In Progress</p>
        <p class="text-2xl font-extrabold text-white mt-1">{{ projectStore.activeProjects.length }}</p>
      </div>
      <div class="bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-xl p-4 border border-emerald-500/30 shadow-lg">
        <p class="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Completed</p>
        <p class="text-2xl font-extrabold text-white mt-1">{{ projectStore.completedProjects.length }}</p>
      </div>
      <div class="bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-xl p-4 border border-purple-500/30 shadow-lg">
        <p class="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">Featured</p>
        <p class="text-2xl font-extrabold text-white mt-1">{{ projectStore.featuredProjects.length }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-xl p-4 border border-white/15 shadow-xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <input
          v-model="projectStore.searchQuery"
          type="text"
          placeholder="Search projects..."
          class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white outline-none focus:border-orange-400"
        >
        <select
          v-model="projectStore.filters.status"
          class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white outline-none focus:border-orange-400 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option v-for="status in projectStore.PROJECT_STATUS" :key="status.value" :value="status.value" class="bg-slate-900 text-white">
            {{ status.label }}
          </option>
        </select>
        <select
          v-model="projectStore.filters.type"
          class="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white outline-none focus:border-orange-400 cursor-pointer"
        >
          <option value="all">All Project Types</option>
          <option v-for="type in projectStore.PROJECT_TYPES" :key="type" :value="type" class="bg-slate-900 text-white">
            {{ type }}
          </option>
        </select>
      </div>
    </div>

    <!-- Projects List -->
    <div v-if="projectStore.filteredProjects.length > 0" class="grid grid-cols-1 gap-6">
      <div 
        v-for="project in projectStore.filteredProjects" 
        :key="project.id"
        class="bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-2xl border border-white/15 overflow-hidden shadow-2xl hover:border-orange-500/40 transition-all"
      >
        <div class="flex flex-col md:flex-row">
          <!-- Image -->
          <div class="md:w-1/3">
            <img 
              :src="project.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'" 
              :alt="project.title"
              class="w-full h-56 md:h-full object-cover"
            >
          </div>

          <!-- Content -->
          <div class="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div class="flex flex-wrap justify-between items-start mb-3 gap-2">
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-xl font-extrabold text-white tracking-tight">{{ project.title }}</h3>
                    <span 
                      :class="getStatusBadgeClass(project.status)"
                      class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    >
                      {{ project.status }}
                    </span>
                    <span v-if="project.featured" class="px-2.5 py-0.5 bg-purple-950/80 text-purple-300 border border-purple-800 rounded-full text-[10px] font-bold">
                      ⭐ Featured
                    </span>
                  </div>
                  <p class="text-slate-300 text-xs flex items-center gap-1.5 mt-1 font-medium">
                    <svg class="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {{ project.location }}
                  </p>
                </div>
              </div>

              <p class="text-slate-300 text-xs mb-4 leading-relaxed">{{ project.description }}</p>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs bg-slate-950/60 p-3 rounded-xl border border-white/10">
                <div>
                  <p class="text-[10px] text-slate-400 uppercase font-semibold">Type</p>
                  <p class="font-bold text-white">{{ project.type }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 uppercase font-semibold">Total Units</p>
                  <p class="font-bold text-white">{{ project.totalUnits || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 uppercase font-semibold">Budget</p>
                  <p class="font-bold text-orange-400">{{ projectStore.formatBudget(project.budget) }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 uppercase font-semibold">Completion</p>
                  <p class="font-bold text-blue-400">{{ project.completionPercentage || 0 }}%</p>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mb-4">
                <div class="w-full bg-slate-900 rounded-full h-2 border border-white/10 overflow-hidden">
                  <div 
                    :class="getProgressBarClass(project.completionPercentage)"
                    class="h-full rounded-full transition-all"
                    :style="{ width: `${project.completionPercentage || 0}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap justify-between items-center pt-4 border-t border-white/10 gap-2">
              <div class="text-[11px] text-slate-400">
                <span>Started: {{ projectStore.formatDate(project.startDate) }}</span>
                <span class="mx-1.5">•</span>
                <span>Expected: {{ projectStore.formatDate(project.expectedCompletion) }}</span>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editProject(project.id)"
                  class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  @click="toggleFeatured(project.id)"
                  class="px-3 py-1.5 bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-800/60 text-xs font-semibold rounded-lg transition"
                >
                  {{ project.featured ? 'Unfeature' : 'Feature' }}
                </button>
                <button
                  @click="deleteProject(project.id)"
                  class="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 text-xs font-semibold rounded-lg transition"
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
    <div v-else class="bg-gradient-to-br from-blue-950/75 via-slate-950/85 to-orange-950/70 backdrop-blur-2xl rounded-2xl border border-white/15 p-12 text-center shadow-2xl">
      <svg class="w-12 h-12 text-slate-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <h3 class="text-lg font-bold text-white mb-1">No Projects Found</h3>
      <p class="text-slate-400 text-xs mb-4">Get started by adding your first project listing</p>
      <button
        @click="goToAddProject"
        class="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-md transition text-xs"
      >
        Add New Project
      </button>
    </div>
  </div>
</template>

<script setup>
import { useProjectStore } from '@/stores/projectStore'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const projectStore = useProjectStore()
const router = useRouter()

onMounted(() => {
  projectStore.fetchProjects()
})

const goToAddProject = () => {
  router.push({ name: 'AdminProjectForm' })
}

const editProject = (id) => {
  router.push({ name: 'AdminProjectEdit', params: { id } })
}

const toggleFeatured = async (id) => {
  const project = projectStore.getProjectById(id)
  if (project) {
    await projectStore.updateProject(id, { featured: !project.featured })
  }
}

const deleteProject = async (id) => {
  if (confirm('Are you sure you want to delete this project?')) {
    const result = await projectStore.deleteProject(id)
    if (result.success) {
      alert(result.message)
    }
  }
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'Planning': 'bg-blue-950/80 text-blue-300 border border-blue-800',
    'In Progress': 'bg-yellow-950/80 text-yellow-300 border border-yellow-800',
    'Completed': 'bg-emerald-950/80 text-emerald-300 border border-emerald-800',
    'On Hold': 'bg-orange-950/80 text-orange-300 border border-orange-800'
  }
  return classes[status] || 'bg-slate-900 text-slate-300'
}

const getProgressBarClass = (percentage) => {
  if (percentage >= 75) return 'bg-emerald-500'
  if (percentage >= 50) return 'bg-yellow-500'
  if (percentage >= 25) return 'bg-orange-500'
  return 'bg-red-500'
}
</script>
