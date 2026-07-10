import { defineStore } from 'pinia'
import { ref } from 'vue'
import { faqService } from '@/services/api'

export const useFaqStore = defineStore('faq', () => {
  const faqs = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchFAQs = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await faqService.getFAQs()
      faqs.value = response.data
      return { success: true, data: faqs.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const addFAQ = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const response = await faqService.createFAQ(payload)
      faqs.value.push(response.data)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateFAQ = async (id, payload) => {
    loading.value = true
    error.value = null
    try {
      const response = await faqService.updateFAQ(id, payload)
      const idx = faqs.value.findIndex(f => f.id === id)
      if (idx !== -1) {
        faqs.value[idx] = response.data
      }
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteFAQ = async (id) => {
    loading.value = true
    error.value = null
    try {
      await faqService.deleteFAQ(id)
      faqs.value = faqs.value.filter(f => f.id !== id)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    faqs,
    loading,
    error,
    fetchFAQs,
    addFAQ,
    updateFAQ,
    deleteFAQ
  }
})
