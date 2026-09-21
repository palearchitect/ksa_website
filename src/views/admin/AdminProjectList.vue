<template>
  <div class="space-y-6 max-w-[1600px] mx-auto text-slate-800 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">Ongoing Projects</h1>
        <p class="text-xs text-slate-500 font-normal">{{ projectStore.totalProjects }} real estate development projects registered</p>
      </div>
      <button 
        @click="goToAddProject"
        class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors shadow-2xs"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>Add New Project</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Projects</p>
          <p class="text-2xl font-bold text-slate-900 tracking-tight mt-1 font-sans">{{ projectStore.totalProjects }}</p>
        </div>
        <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200/60">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5" /></svg>
        </div>
      </div>
      <div class="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">In Progress</p>
          <p class="text-2xl font-bold text-slate-900 tracking-tight mt-1 font-sans">{{ projectStore.activeProjects.length }}</p>
        </div>
        <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>
      <div class="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Completed</p>
          <p class="text-2xl font-bold text-slate-900 tracking-tight mt-1 font-sans">{{ projectStore.completedProjects.length }}</p>
        </div>
        <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>
      <div class="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-semibold text-purple-600 uppercase tracking-wider">Featured</p>
          <p class="text-2xl font-bold text-slate-900 tracking-tight mt-1 font-sans">{{ projectStore.featuredProjects.length }}</p>
        </div>
        <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/60">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.488-.416.874-.834.618l-4.71-2.88a.563.563 0 00-.586 0l-4.71 2.88c-.418.256-.95-.13-.834-.618l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <input
          v-model="projectStore.searchQuery"
          type="text"
          placeholder="Search projects by title or location..."
          class="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-slate-300 focus:bg-white transition"
        >
        <select
          v-model="projectStore.filters.status"
          class="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-slate-300 focus:bg-white transition cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option v-for="status in projectStore.PROJECT_STATUS" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
        <select
          v-model="projectStore.filters.type"
          class="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-slate-300 focus:bg-white transition cursor-pointer"
        >
          <option value="all">All Project Types</option>
          <option v-for="type in projectStore.PROJECT_TYPES" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>
    </div>

    <!-- Projects List -->
    <div v-if="projectStore.filteredProjects.length > 0" class="grid grid-cols-1 gap-4">
      <div 
        v-for="project in projectStore.filteredProjects" 
        :key="project.id"
        class="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs hover:border-slate-300 transition-all p-4 sm:p-5"
      >
        <div class="flex flex-col md:flex-row gap-5">
          <!-- Image -->
          <div class="md:w-64 flex-shrink-0">
            <img 
              :src="project.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'" 
              :alt="project.title"
              class="w-full h-44 md:h-full object-cover rounded-lg border border-slate-200"
            >
          </div>

          <!-- Content -->
          <div class="flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div class="flex flex-wrap justify-between items-start mb-2 gap-2">
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-base font-semibold text-slate-900 tracking-tight font-sans">{{ project.title }}</h3>
                    <span 
                      :class="getStatusBadgeClass(project.status)"
                      class="px-2.5 py-0.5 rounded-md text-[10px] font-medium inline-block border"
                    >
                      {{ project.status }}
                    </span>
                    <span v-if="project.featured" class="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-md text-[10px] font-medium">
                      ⭐ Featured
                    </span>
                  </div>
                  <p class="text-slate-500 text-xs flex items-center gap-1 mt-1 font-normal">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {{ project.location }}
                  </p>
                </div>
              </div>

              <p class="text-slate-600 text-xs mb-3 line-clamp-2 leading-relaxed">{{ project.description }}</p>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                <div>
                  <p class="text-[10px] text-slate-400 uppercase font-semibold">Type</p>
                  <p class="font-semibold text-slate-900">{{ project.type }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 uppercase font-semibold">Total Units</p>
                  <p class="font-semibold text-slate-900">{{ project.totalUnits || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 uppercase font-semibold">Budget</p>
                  <p class="font-semibold text-slate-900">{{ projectStore.formatBudget(project.budget) }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 uppercase font-semibold">Completion</p>
                  <p class="font-semibold text-blue-600">{{ project.completionPercentage || 0 }}%</p>
                </div>
              </div>

              <!-- Progress Bar -->
              <div>
                <div class="w-full bg-slate-100 rounded-full h-1.5 border border-slate-200 overflow-hidden">
                  <div 
                    :class="getProgressBarClass(project.completionPercentage)"
                    class="h-full rounded-full transition-all"
                    :style="{ width: `${project.completionPercentage || 0}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap justify-between items-center pt-3 border-t border-slate-100 gap-2 text-xs">
              <div class="text-[11px] text-slate-400 font-normal">
                <span>Started: {{ projectStore.formatDate(project.startDate) }}</span>
                <span class="mx-1.5">&bull;</span>
                <span>Expected: {{ projectStore.formatDate(project.expectedCompletion) }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <button
                  @click="editProject(project.id)"
                  class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded-md transition"
                >
                  Edit
                </button>
                <button
                  @click="toggleFeatured(project.id)"
                  :class="project.featured ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-slate-600 bg-slate-100 border-slate-200'"
                  class="px-2.5 py-1 text-[11px] font-medium rounded-md border transition"
                >
                  {{ project.featured ? 'Unfeature' : 'Feature' }}
                </button>
                <button
                  @click="deleteProject(project.id)"
                  class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-[11px] font-medium rounded-md transition"
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
    <div v-else class="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-2xs">
      <svg class="w-10 h-10 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <h3 class="text-sm font-semibold text-slate-900 mb-1">No Projects Found</h3>
      <p class="text-slate-500 text-xs mb-4">Get started by adding your first project listing</p>
      <button
        @click="goToAddProject"
        class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs shadow-2xs transition"
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
    'Planning': 'bg-blue-50 text-blue-700 border-blue-200/60',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-200/60',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    'On Hold': 'bg-slate-100 text-slate-700 border-slate-200'
  }
  return classes[status] || 'bg-slate-100 text-slate-700 border-slate-200'
}

const getProgressBarClass = (percentage) => {
  if (percentage >= 75) return 'bg-emerald-500'
  if (percentage >= 50) return 'bg-amber-500'
  if (percentage >= 25) return 'bg-blue-500'
  return 'bg-slate-400'
}
</script>
