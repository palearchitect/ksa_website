import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useHeroSlideStore = defineStore('heroSlide', () => {
  const slides = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchSlides = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('/api/hero-slides')
      if (response.data?.success) {
        slides.value = response.data.data
        return { success: true, data: slides.value }
      }
      throw new Error(response.data?.message || 'Failed to fetch slides')
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const addSlide = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post('/api/hero-slides', payload)
      if (response.data?.success) {
        slides.value.push(response.data.data)
        return { success: true, data: response.data.data }
      }
      throw new Error(response.data?.message || 'Failed to add slide')
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateSlide = async (id, payload) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.put(`/api/hero-slides/${id}`, payload)
      if (response.data?.success) {
        const idx = slides.value.findIndex(s => s.id === id)
        if (idx !== -1) {
          slides.value[idx] = response.data.data
        }
        return { success: true, data: response.data.data }
      }
      throw new Error(response.data?.message || 'Failed to update slide')
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteSlide = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.delete(`/api/hero-slides/${id}`)
      if (response.data?.success) {
        slides.value = slides.value.filter(s => s.id !== id)
        return { success: true }
      }
      throw new Error(response.data?.message || 'Failed to delete slide')
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const getSlideById = (id) => {
    return slides.value.find(s => s.id === id)
  }

  return {
    slides,
    loading,
    error,
    fetchSlides,
    addSlide,
    updateSlide,
    deleteSlide,
    getSlideById
  }
})
