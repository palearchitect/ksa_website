<template>
  <div class="space-y-6 max-w-[1600px] mx-auto text-slate-800 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
          <span>Team Directory</span>
          <span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            Staff Directory
          </span>
        </h1>
        <p class="text-xs text-slate-500 font-normal">Manage official staff members, roles, and profiles shown on the public directory</p>
      </div>
      <button 
        @click="goToAddMember"
        class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors shadow-2xs"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>Add Team Member</span>
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Staff</p>
          <p class="text-2xl font-bold text-slate-900 tracking-tight mt-1 font-sans">{{ teamStore.teamMembers.length }}</p>
        </div>
        <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200/60">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Surveyors & Valuers</p>
          <p class="text-2xl font-bold text-slate-900 tracking-tight mt-1 font-sans">{{ surveyorCount }}</p>
        </div>
        <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Operations & Support</p>
          <p class="text-2xl font-bold text-slate-900 tracking-tight mt-1 font-sans">{{ operationsCount }}</p>
        </div>
        <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, role, department, or email..."
          class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white text-xs transition"
        >
        <span class="absolute left-3 top-2.5 text-slate-400">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </span>
      </div>
    </div>

    <!-- Members Grid -->
    <div v-if="filteredMembers.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="member in filteredMembers" 
        :key="member.id"
        class="bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 p-5 flex flex-col sm:flex-row gap-4 shadow-2xs transition-all"
      >
        <!-- Image -->
        <div class="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mx-auto sm:mx-0 relative">
          <img 
            :src="getImageUrl(member.image)" 
            :alt="member.name"
            @error="handleImageError"
            class="w-full h-full object-cover rounded-lg border border-slate-200 shadow-2xs"
          >
        </div>

        <!-- Content -->
        <div class="flex-1 flex flex-col justify-between space-y-2 text-xs">
          <div>
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-sm font-semibold text-slate-900 font-sans leading-tight">{{ member.name }}</h3>
                <p class="text-xs font-medium text-slate-500 mt-0.5">{{ member.role }}</p>
                <span class="text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200 inline-block px-2 py-0.5 rounded-md mt-1.5">
                  {{ member.tag }}
                </span>
              </div>
            </div>
            
            <p class="text-slate-600 text-xs mt-2 line-clamp-2 leading-relaxed">{{ member.description }}</p>
            
            <div class="mt-2 flex items-center gap-1.5 text-slate-500 text-xs">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span class="text-slate-600 font-mono text-[11px]">{{ member.email }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 mt-3 pt-3 border-t border-slate-100 justify-end">
            <button
              @click="editMember(member.id)"
              class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md text-[11px] transition-colors"
            >
              Edit Profile
            </button>
            <button
              @click="deleteMember(member.id)"
              class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 font-medium rounded-md text-[11px] transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-2xs">
      <div class="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      </div>
      <h3 class="text-sm font-semibold text-slate-900 mb-1">No Team Members Found</h3>
      <p class="text-slate-500 text-xs max-w-sm mx-auto mb-4">Create a team profile to display on your public directory.</p>
      <button
        @click="goToAddMember"
        class="inline-flex items-center px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-2xs transition"
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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
