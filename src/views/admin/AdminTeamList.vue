<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-2xl">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <span>Team Directory Management</span>
          <span class="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Staff Directory
          </span>
        </h1>
        <p class="mt-1 text-sm text-slate-400">Manage official staff members, roles, and profiles shown on the public directory.</p>
      </div>
      <button 
        @click="goToAddMember"
        class="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-blue-600 hover:from-orange-400 hover:to-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Team Member
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 flex items-center justify-between shadow-xl">
        <div>
          <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Staff</p>
          <p class="text-3xl font-extrabold text-white mt-1.5">{{ teamStore.teamMembers.length }}</p>
        </div>
        <div class="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      <div class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 flex items-center justify-between shadow-xl">
        <div>
          <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">Surveyors & Valuers</p>
          <p class="text-3xl font-extrabold text-white mt-1.5">{{ surveyorCount }}</p>
        </div>
        <div class="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 flex items-center justify-between shadow-xl">
        <div>
          <p class="text-xs font-mono text-slate-400 uppercase tracking-wider">Operations & Support</p>
          <p class="text-3xl font-extrabold text-white mt-1.5">{{ operationsCount }}</p>
        </div>
        <div class="p-3.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-4 shadow-xl">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, role, department, or email..."
          class="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
        >
        <span class="absolute left-4 top-3.5 text-slate-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>
    </div>

    <!-- Members Grid -->
    <div v-if="filteredMembers.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="member in filteredMembers" 
        :key="member.id"
        class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 hover:border-slate-700/80 p-6 flex flex-col md:flex-row gap-6 shadow-xl transition duration-300 group"
      >
        <!-- Image -->
        <div class="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 mx-auto md:mx-0 relative">
          <img 
            :src="getImageUrl(member.image)" 
            :alt="member.name"
            @error="handleImageError"
            class="w-full h-full object-cover rounded-2xl border border-slate-700/80 shadow-md group-hover:scale-105 transition duration-300"
          >
        </div>

        <!-- Content -->
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">{{ member.name }}</h3>
                <p class="text-xs font-medium text-blue-400 mt-0.5">{{ member.role }}</p>
                <span class="text-xxs font-mono font-medium text-amber-300/90 bg-amber-500/10 border border-amber-500/20 inline-block px-2.5 py-0.5 rounded-full mt-2">
                  {{ member.tag }}
                </span>
              </div>
            </div>
            
            <p class="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">{{ member.description }}</p>
            
            <div class="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="text-slate-300 font-mono text-xxs">{{ member.email }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2.5 mt-5 pt-4 border-t border-slate-800/80 justify-end">
            <button
              @click="editMember(member.id)"
              class="px-3.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 font-semibold rounded-xl text-xs transition-colors"
            >
              Edit Profile
            </button>
            <button
              @click="deleteMember(member.id)"
              class="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-semibold rounded-xl text-xs transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-12 text-center shadow-xl">
      <div class="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mx-auto mb-4 text-slate-400">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-white mb-2">No Team Members Found</h3>
      <p class="text-slate-400 text-sm max-w-sm mx-auto mb-6">Create a team profile to display on your public directory.</p>
      <button
        @click="goToAddMember"
        class="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-400 hover:to-blue-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-orange-500/20"
      >
        Add Team Member
      </button>
    </div>
  </div>
</template>

<script setup>
import { useTeamStore } from '@/stores/teamStore'
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'

const teamStore = useTeamStore()
const router = useRouter()
const searchQuery = ref('')

onMounted(() => {
  teamStore.fetchTeamMembers()
})

const surveyorCount = computed(() => {
  return teamStore.teamMembers.filter(m => 
    m.role.toLowerCase().includes('surveyor') || 
    m.role.toLowerCase().includes('valuer') || 
    m.tag.toLowerCase().includes('surveyor') || 
    m.tag.toLowerCase().includes('valuer')
  ).length
})

const operationsCount = computed(() => {
  return teamStore.teamMembers.length - surveyorCount.value
})

const filteredMembers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return teamStore.teamMembers
  
  return teamStore.teamMembers.filter(m => 
    m.name.toLowerCase().includes(query) ||
    m.role.toLowerCase().includes(query) ||
    m.tag.toLowerCase().includes(query) ||
    m.email.toLowerCase().includes(query)
  )
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

const goToAddMember = () => {
  router.push({ name: 'AdminTeamForm' })
}

const editMember = (id) => {
  router.push({ name: 'AdminTeamEdit', params: { id } })
}

const deleteMember = async (id) => {
  if (confirm('Are you sure you want to remove this team member?')) {
    const result = teamStore.deleteTeamMember(id)
    if (result.success) {
      alert('Team member profile successfully removed.')
    }
  }
}
</script>

<style scoped>
.text-xxs {
  font-size: 0.65rem;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
