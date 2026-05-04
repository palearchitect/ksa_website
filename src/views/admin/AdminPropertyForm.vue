<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <button @click="goBack" class="flex items-center text-gray-600 hover:text-gray-900 mb-4">
        Back to Properties
      </button>
      <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ isEditMode ? 'Edit Property' : 'Add New Property' }}</h1>

      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow p-6 space-y-4">
        <input v-model="form.title" required placeholder="Title" class="w-full px-4 py-2 border rounded-lg">
        <input v-model="form.location" required placeholder="Location" class="w-full px-4 py-2 border rounded-lg">
        <input v-model.number="form.price" required type="number" min="0" placeholder="Price" class="w-full px-4 py-2 border rounded-lg">
        <input v-model="form.image" placeholder="Image URL" class="w-full px-4 py-2 border rounded-lg">
        <textarea v-model="form.description" rows="4" placeholder="Description" class="w-full px-4 py-2 border rounded-lg"></textarea>

        <div class="grid grid-cols-2 gap-4">
          <select v-model="form.status" class="w-full px-4 py-2 border rounded-lg">
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
          <select v-model="form.type" class="w-full px-4 py-2 border rounded-lg">
            <option v-for="type in propertyStore.PROPERTY_TYPES" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <input v-model.number="form.bedrooms" type="number" min="0" placeholder="Bedrooms" class="w-full px-4 py-2 border rounded-lg">
          <input v-model.number="form.bathrooms" type="number" min="0" placeholder="Bathrooms" class="w-full px-4 py-2 border rounded-lg">
        </div>

        <label class="flex items-center gap-2">
          <input v-model="form.featured" type="checkbox">
          Feature this property
        </label>

        <p v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</p>
        <div class="flex gap-3">
          <button :disabled="submitting" class="px-6 py-3 bg-blue-600 text-white rounded-lg">
            {{ submitting ? 'Saving...' : (isEditMode ? 'Update Property' : 'Add Property') }}
          </button>
          <button type="button" @click="goBack" class="px-6 py-3 bg-gray-200 rounded-lg">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/propertyStore'

const route = useRoute()
const router = useRouter()
const propertyStore = usePropertyStore()
const isEditMode = computed(() => Boolean(route.params.id))
const submitting = ref(false)
const errorMessage = ref('')

const form = ref({
  title: '',
  location: '',
  price: 0,
  image: '',
  description: '',
  status: 'sale',
  type: 'House',
  bedrooms: 0,
  bathrooms: 0,
  featured: false
})

onMounted(async () => {
  await propertyStore.fetchProperties()
  if (isEditMode.value) {
    const existing = propertyStore.getPropertyById(Number(route.params.id))
    if (existing) form.value = { ...existing }
  }
})

const handleSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''
  const result = isEditMode.value
    ? await propertyStore.updateProperty(Number(route.params.id), form.value)
    : await propertyStore.addProperty(form.value)
  submitting.value = false
  if (!result.success) {
    errorMessage.value = result.message
    return
  }
  router.push({ name: 'AdminPropertyList' })
}

const goBack = () => router.push({ name: 'AdminPropertyList' })
</script>
