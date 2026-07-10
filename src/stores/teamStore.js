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

  const fetchTeamMembers = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await teamServiceContent.getTeam()
      teamMembers.value = response.data.map(mapMember)
      return { success: true, data: teamMembers.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const addTeamMember = async (payload) => {
    loading.value = true
    error.value = null
    try {
      // Map frontend `image` to backend `imageUrl`
      const data = {
        name: payload.name,
        role: payload.role,
        tag: payload.tag,
        imageUrl: payload.imageUrl || payload.image,
        description: payload.description,
        email: payload.email
      }
      const response = await teamServiceContent.createTeam(data)
      const newMember = mapMember(response.data)
      teamMembers.value.push(newMember)
      return { success: true, data: newMember }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateTeamMember = async (id, payload) => {
    loading.value = true
    error.value = null
    try {
      const data = {
        name: payload.name,
        role: payload.role,
        tag: payload.tag,
        imageUrl: payload.imageUrl || payload.image,
        description: payload.description,
        email: payload.email
      }
      const response = await teamServiceContent.updateTeam(id, data)
      const updatedMember = mapMember(response.data)
      const idx = teamMembers.value.findIndex(m => m.id === id)
      if (idx !== -1) {
        teamMembers.value[idx] = updatedMember
      }
      return { success: true, data: updatedMember }
    } catch (err) {
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
      teamMembers.value = teamMembers.value.filter(m => m.id !== id)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
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
    updateTeamMember,
    deleteTeamMember,
    getTeamMemberById
  }
})
