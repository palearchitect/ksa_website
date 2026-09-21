import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useHeroSlideStore = defineStore('heroSlide', () => {
  const slides = ref([])
  const loading = ref(false)
  const error = ref(null)

  const saveToLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('ksa_local_slides', JSON.stringify(slides.value))
      } catch (e) {}
    }
  }

  const loadFromLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('ksa_local_slides')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            slides.value = parsed
            return true
          }
        }
      } catch (e) {}
    }
    return false
  }

  const fetchSlides = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('/api/hero-slides')
      if (response.data?.success && Array.isArray(response.data.data)) {
        slides.value = response.data.data
        saveToLocalStorage()
        return { success: true, data: slides.value }
      }
      throw new Error(response.data?.message || 'Failed to fetch slides')
    } catch (err) {
      console.warn('Hero slides fetch fallback to local storage:', err.message)
      loadFromLocalStorage()
      return { success: true, data: slides.value }
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
        saveToLocalStorage()
        return { success: true, data: response.data.data }
      }
      throw new Error(response.data?.message || 'Failed to add slide')
    } catch (err) {
      const status = err.response?.status
      if (status === 404 || err.code === 'ERR_NETWORK' || !err.response) {
        console.warn('Backend hero-slides API endpoint unreachable (404/Network). Creating local slide fallback.')
        const localSlide = {
          id: Date.now(),
          ...payload,
          sortOrder: Number(payload.sortOrder) || 0,
          createdAt: new Date().toISOString()
        }
        slides.value.push(localSlide)
        saveToLocalStorage()
        return { success: true, data: localSlide }
      }

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
        saveToLocalStorage()
        return { success: true, data: response.data.data }
      }
      throw new Error(response.data?.message || 'Failed to update slide')
    } catch (err) {
      const status = err.response?.status
      if (status === 404 || err.code === 'ERR_NETWORK' || !err.response) {
        console.warn('Backend hero-slides API endpoint unreachable (404/Network). Updating local slide fallback.')
        const idx = slides.value.findIndex(s => s.id === id)
        const localSlide = { ...(slides.value[idx] || {}), ...payload, id }
        if (idx !== -1) {
          slides.value[idx] = localSlide
        } else {
          slides.value.push(localSlide)
        }
        saveToLocalStorage()
        return { success: true, data: localSlide }
      }

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
      await axios.delete(`/api/hero-slides/${id}`)
    } catch (err) {
      console.warn('Backend delete hero-slide API unreachable. Removing locally.')
    } finally {
      slides.value = slides.value.filter(s => s.id !== id)
      saveToLocalStorage()
      loading.value = false
      return { success: true }
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
    createSlide: addSlide,
    updateSlide,
    deleteSlide,
    getSlideById
  }
})
