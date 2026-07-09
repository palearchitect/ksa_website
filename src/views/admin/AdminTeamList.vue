<template>
  <div class="admin-team-list min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Team Directory Management</h1>
            <p class="text-gray-600 mt-1">Manage official staff members, roles, and profiles shown on the public directory</p>
          </div>
          <button 
            @click="goToAddMember"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center gap-2 shadow-md hover:scale-102"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Team Member
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm font-medium">Total Staff Members</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">{{ teamStore.teamMembers.length }}</p>
              </div>
              <div class="p-3 bg-blue-100 rounded-full text-blue-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm font-medium">Surveyors & Valuers</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">{{ surveyorCount }}</p>
              </div>
              <div class="p-3 bg-green-100 rounded-full text-green-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm font-medium">Operations & Support</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">{{ operationsCount }}</p>
              </div>
              <div class="p-3 bg-purple-100 rounded-full text-purple-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Search bar -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, role, department, or email..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
            <span class="absolute left-3.5 top-3.5 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <!-- Members Grid -->
      <div v-if="filteredMembers.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="member in filteredMembers" 
          :key="member.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
        >
          <!-- Image -->
          <div class="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 mx-auto md:mx-0">
            <img 
              :src="getImageUrl(member.image)" 
              :alt="member.name"
              @error="handleImageError"
              class="w-full h-full object-cover rounded-full md:rounded-xl border border-gray-200"
            >
          </div>

          <!-- Content -->
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-xl font-bold text-gray-900">{{ member.name }}</h3>
                  <p class="text-sm font-semibold text-blue-600 mt-0.5">{{ member.role }}</p>
                  <p class="text-xs text-gray-500 mt-1 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded-full">
                    {{ member.tag }}
                  </p>
                </div>
              </div>
              
              <p class="text-sm text-gray-600 mt-3 line-clamp-3">{{ member.description }}</p>
              
              <div class="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{{ member.email }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 mt-6 pt-4 border-t border-gray-100 justify-end">
              <button
                @click="editMember(member.id)"
                class="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-lg text-sm transition"
              >
                Edit Profile
              </button>
              <button
                @click="deleteMember(member.id)"
                class="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded-lg text-sm transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Team Members Found</h3>
        <p class="text-gray-600 mb-6">Create a team profile to display on your public directory</p>
        <button
          @click="goToAddMember"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          Add Team Member
        </button>
      </div>
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
