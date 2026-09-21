import { defineStore } from 'pinia'
import { ref } from 'vue'
import { teamServiceContent } from '@/services/api'

export const useTeamStore = defineStore('team', () => {
  const teamMembers = ref([])
  const loading = ref(false)
  const error = ref(null)

  const mapMember = (m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    tag: m.tag,
    image: m.imageUrl || m.image, // supports both backend and legacy frontend naming
    imageUrl: m.imageUrl || m.image,
    description: m.description,
    email: m.email
  })

  const saveToLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('ksa_local_team', JSON.stringify(teamMembers.value))
      } catch (e) {}
    }
  }

  const loadFromLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('ksa_local_team')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            teamMembers.value = parsed
            return true
          }
        }
      } catch (e) {}
    }
    return false
  }

  const fetchTeamMembers = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await teamServiceContent.getTeam()
      if (response?.data && Array.isArray(response.data)) {
        teamMembers.value = response.data.map(mapMember)
        saveToLocalStorage()
        return { success: true, data: teamMembers.value }
      }
      throw new Error('Invalid team response')
    } catch (err) {
      console.warn('Team fetch fallback to local storage:', err.message)
      loadFromLocalStorage()
      return { success: true, data: teamMembers.value }
    } finally {
      loading.value = false
    }
  }

  const addTeamMember = async (payload) => {
    loading.value = true
    error.value = null
    const data = {
      name: payload.name,
      role: payload.role,
      tag: payload.tag,
      imageUrl: payload.imageUrl || payload.image,
      description: payload.description,
      email: payload.email
    }

    try {
      const response = await teamServiceContent.createTeam(data)
      const newMember = mapMember(response?.data || response)
      teamMembers.value.unshift(newMember)
      saveToLocalStorage()
      return { success: true, data: newMember }
    } catch (err) {
      const status = err.response?.status
      if (status === 404 || err.code === 'ERR_NETWORK' || !err.response) {
        console.warn('Backend API endpoint unreachable (404/Network). Creating local team member fallback.')
        const localMember = mapMember({ id: Date.now(), ...data })
        teamMembers.value.unshift(localMember)
        saveToLocalStorage()
        return { success: true, data: localMember }
      }

      error.value = err.response?.data?.message || err.message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateTeamMember = async (id, payload) => {
    loading.value = true
    error.value = null
    const data = {
      name: payload.name,
      role: payload.role,
      tag: payload.tag,
      imageUrl: payload.imageUrl || payload.image,
      description: payload.description,
      email: payload.email
    }

    try {
      const response = await teamServiceContent.updateTeam(id, data)
      const updatedMember = mapMember(response?.data || response)
      const idx = teamMembers.value.findIndex(m => m.id === id)
      if (idx !== -1) {
        teamMembers.value[idx] = updatedMember
      }
      saveToLocalStorage()
      return { success: true, data: updatedMember }
    } catch (err) {
      const status = err.response?.status
      if (status === 404 || err.code === 'ERR_NETWORK' || !err.response) {
        console.warn('Backend API endpoint unreachable (404/Network). Updating local team member fallback.')
        const localMember = mapMember({ id, ...data })
        const idx = teamMembers.value.findIndex(m => m.id === id)
        if (idx !== -1) {
          teamMembers.value[idx] = localMember
        } else {
          teamMembers.value.unshift(localMember)
        }
        saveToLocalStorage()
        return { success: true, data: localMember }
      }

      error.value = err.response?.data?.message || err.message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteTeamMember = async (id) => {
    loading.value = true
    error.value = null
    try {
      await teamServiceContent.deleteTeam(id)
    } catch (err) {
      console.warn('Backend delete team API unreachable. Removing locally.')
    } finally {
      teamMembers.value = teamMembers.value.filter(m => m.id !== id)
      saveToLocalStorage()
      loading.value = false
      return { success: true }
    }
  }

  const getTeamMemberById = (id) => {
    return teamMembers.value.find(m => m.id === id)
  }

  return {
    teamMembers,
    loading,
    error,
    fetchTeamMembers,
    addTeamMember,
    createTeamMember: addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getTeamMemberById
  }
})
