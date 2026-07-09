import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTeamStore = defineStore('team', () => {
  const teamMembers = ref([])
  const loading = ref(false)
  const error = ref(null)

  const defaultTeamMembers = [
    {
      id: 1,
      name: 'ESV. Markson Ajiboye',
      role: 'Head Business Unit',
      tag: 'Certified Estate Surveyor & Valuer',
      image: 'IMG-20240405-WA0009-233x300.jpg',
      description: 'With extensive experience in real estate, Markson leads our agency and sales division. His expertise ensures optimal property valuations and successful client transactions across major Nigerian markets.',
      email: 'info@ksavaluers.com'
    },
    {
      id: 2,
      name: 'Eniola Abiola Kayode',
      role: 'Human Resource Manager',
      tag: 'HR Specialist',
      image: 'IMG-20240405-WA0011-e1712320368546-300x268.jpg',
      description: 'A dynamic HR professional skilled in recruitment, employee relations, training, and development. Eniola ensures our team maintains the highest standards of professionalism and client service.',
      email: 'info@ksavaluers.com'
    },
    {
      id: 3,
      name: 'ESV Akinyele Abiodun',
      role: 'Head of Estate Management & Valuation',
      tag: 'Estate Surveyor',
      image: 'DSC00129-240x300.jpeg',
      description: 'A seasoned estate surveyor with strong problem-solving and communication skills. Akinyele specializes in property valuation, estate management, and ensuring compliance with regulatory standards.',
      email: 'abiodun@ksavaluers.com'
    },
    {
      id: 4,
      name: 'ESV Olaoluwa Isaac Ojewumi',
      role: 'Head of Sales Department',
      tag: 'Sales & Agency Expert',
      image: 'DSC00141-scaled.jpeg',
      description: 'Experienced in real estate sales and agency leadership. Olaoluwa drives our sales initiatives with strategic market insights and exceptional client relationship management.',
      email: 'olaoluwaisaac@ksavaluers.com'
    }
  ]

  const fetchTeamMembers = () => {
    loading.value = true
    try {
      const stored = localStorage.getItem('ksa_team_members')
      if (stored) {
        teamMembers.value = JSON.parse(stored)
      } else {
        teamMembers.value = [...defaultTeamMembers]
        localStorage.setItem('ksa_team_members', JSON.stringify(defaultTeamMembers))
      }
      return { success: true, data: teamMembers.value }
    } catch (err) {
      error.value = err.message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const addTeamMember = (payload) => {
    loading.value = true
    try {
      const nextId = teamMembers.value.length ? Math.max(...teamMembers.value.map(m => m.id)) + 1 : 1
      const newMember = {
        ...payload,
        id: nextId,
        image: payload.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
      }
      teamMembers.value.push(newMember)
      localStorage.setItem('ksa_team_members', JSON.stringify(teamMembers.value))
      return { success: true, data: newMember }
    } catch (err) {
      error.value = err.message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateTeamMember = (id, payload) => {
    loading.value = true
    try {
      const idx = teamMembers.value.findIndex(m => m.id === id)
      if (idx !== -1) {
        teamMembers.value[idx] = { ...payload, id }
        localStorage.setItem('ksa_team_members', JSON.stringify(teamMembers.value))
        return { success: true, data: teamMembers.value[idx] }
      }
      throw new Error('Member not found')
    } catch (err) {
      error.value = err.message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteTeamMember = (id) => {
    loading.value = true
    try {
      teamMembers.value = teamMembers.value.filter(m => m.id !== id)
      localStorage.setItem('ksa_team_members', JSON.stringify(teamMembers.value))
      return { success: true }
    } catch (err) {
      error.value = err.message
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
