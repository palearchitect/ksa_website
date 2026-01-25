<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            {{ adminStore.isEditMode ? 'Edit Property' : 'Add New Property' }}
          </h2>
          <p class="text-gray-600 text-sm mt-1">
            {{ adminStore.isEditMode ? 'Update property details' : 'Fill in the details to add a new property' }}
          </p>
        </div>
        <button
          @click="handleCancel"
          class="text-gray-500 hover:text-gray-700"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Error and Success Messages -->
    <div v-if="adminStore.error" class="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-red-700">{{ adminStore.error }}</span>
        <button @click="adminStore.clearMessages()" class="ml-auto text-red-600 hover:text-red-800">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="adminStore.success" class="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="text-green-700">{{ adminStore.success }}</span>
        <button @click="adminStore.clearMessages()" class="ml-auto text-green-600 hover:text-green-800">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Form Content -->
    <div class="p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
      <!-- Loading State -->
      <div v-if="loading" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-center">
          <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-blue-700">
            {{ adminStore.isEditMode ? 'Loading property data...' : 'Preparing form...' }}
          </span>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" v-else>
        <!-- Form validation errors -->
        <div v-if="Object.keys(adminStore.formErrors).length > 0" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 class="text-red-800 font-semibold mb-2">Please fix the following errors:</h3>
          <ul class="list-disc list-inside text-red-700">
            <li v-for="(error, field) in adminStore.formErrors" :key="field">{{ error }}</li>
          </ul>
        </div>

        <!-- Title Field -->
        <div class="mb-6">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Property Title
            <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="adminStore.formData.title"
            type="text"
            placeholder="e.g., Luxury Modern Apartment in Ikoyi"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            :class="{ 'border-red-500 bg-red-50': adminStore.formErrors.title }"
          />
          <p v-if="adminStore.formErrors.title" class="text-red-600 text-sm mt-1">
            {{ adminStore.formErrors.title }}
          </p>
        </div>

        <!-- Address Field -->
        <div class="mb-6">
          <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
            Address
            <span class="text-red-500">*</span>
          </label>
          <input
            id="address"
            v-model="adminStore.formData.address"
            type="text"
            placeholder="e.g., 123 Main Street, Ikoyi"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            :class="{ 'border-red-500 bg-red-50': adminStore.formErrors.address }"
          />
          <p v-if="adminStore.formErrors.address" class="text-red-600 text-sm mt-1">
            {{ adminStore.formErrors.address }}
          </p>
        </div>

        <!-- City and State -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
              City
              <span class="text-red-500">*</span>
            </label>
            <input
              id="city"
              v-model="adminStore.formData.city"
              type="text"
              placeholder="e.g., Lagos"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              :class="{ 'border-red-500 bg-red-50': adminStore.formErrors.city }"
            />
            <p v-if="adminStore.formErrors.city" class="text-red-600 text-sm mt-1">
              {{ adminStore.formErrors.city }}
            </p>
          </div>

          <div>
            <label for="state" class="block text-sm font-medium text-gray-700 mb-2">
              State
              <span class="text-red-500">*</span>
            </label>
            <input
              id="state"
              v-model="adminStore.formData.state"
              type="text"
              placeholder="e.g., Lagos State"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              :class="{ 'border-red-500 bg-red-50': adminStore.formErrors.state }"
            />
            <p v-if="adminStore.formErrors.state" class="text-red-600 text-sm mt-1">
              {{ adminStore.formErrors.state }}
            </p>
          </div>
        </div>

        <!-- Price Field -->
        <div class="mb-6">
          <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
            Price (₦)
            <span class="text-red-500">*</span>
          </label>
          <input
            id="price"
            v-model.number="adminStore.formData.price"
            type="number"
            placeholder="e.g., 450000000"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            :class="{ 'border-red-500 bg-red-50': adminStore.formErrors.price }"
          />
          <p v-if="adminStore.formErrors.price" class="text-red-600 text-sm mt-1">
            {{ adminStore.formErrors.price }}
          </p>
        </div>

        <!-- Listing Type Field -->
        <div class="mb-6">
          <label for="listingType" class="block text-sm font-medium text-gray-700 mb-2">
            Listing Type
            <span class="text-red-500">*</span>
          </label>
          <select
            id="listingType"
            v-model="adminStore.formData.listingType"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            :class="{ 'border-red-500 bg-red-50': adminStore.formErrors.listingType }"
          >
            <option value="">Select Type</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
          <p v-if="adminStore.formErrors.listingType" class="text-red-600 text-sm mt-1">
            {{ adminStore.formErrors.listingType }}
          </p>
        </div>

        <!-- Property Status -->
        <div class="mb-6">
          <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
            Property Status
            <span class="text-red-500">*</span>
          </label>
          <select
            id="status"
            v-model="adminStore.formData.status"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            :class="{ 'border-red-500 bg-red-50': adminStore.formErrors.status }"
          >
            <option value="">Select Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <p v-if="adminStore.formErrors.status" class="text-red-600 text-sm mt-1">
            {{ adminStore.formErrors.status }}
          </p>
        </div>

        <!-- Property Type -->
        <div class="mb-6">
          <label for="propertyType" class="block text-sm font-medium text-gray-700 mb-2">
            Property Type
            <span class="text-red-500">*</span>
          </label>
          <select
            id="propertyType"
            v-model="adminStore.formData.propertyType"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            :class="{ 'border-red-500 bg-red-50': adminStore.formErrors.propertyType }"
          >
            <option value="">Select Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
          </select>
          <p v-if="adminStore.formErrors.propertyType" class="text-red-600 text-sm mt-1">
            {{ adminStore.formErrors.propertyType }}
          </p>
        </div>

        <!-- Bedrooms, Bathrooms, Size -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label for="bedrooms" class="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <input
              id="bedrooms"
              v-model.number="adminStore.formData.bedrooms"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              :class="{ 'border-red-500 bg-red-50': adminStore.formErrors.bedrooms }"
            />
            <p v-if="adminStore.formErrors.bedrooms" class="text-red-600 text-sm mt-1">
              {{ adminStore.formErrors.bedrooms }}
            </p>
          </div>

          <div>
            <label for="bathrooms" class="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <input
              id="bathrooms"
              v-model.number="adminStore.formData.bathrooms"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              :class="{ 'border-red-500 bg-red-50': adminStore.formErrors.bathrooms }"
            />
            <p v-if="adminStore.formErrors.bathrooms" class="text-red-600 text-sm mt-1">
              {{ adminStore.formErrors.bathrooms }}
            </p>
          </div>

          <div>
            <label for="size" class="block text-sm font-medium text-gray-700 mb-2">
              Size (sq ft)
            </label>
            <input
              id="size"
              v-model.number="adminStore.formData.size"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              :class="{ 'border-red-500 bg-red-50': adminStore.formErrors.size }"
            />
            <p v-if="adminStore.formErrors.size" class="text-red-600 text-sm mt-1">
              {{ adminStore.formErrors.size }}
            </p>
          </div>
        </div>

        <!-- Year Built -->
        <div class="mb-6">
          <label for="yearBuilt" class="block text-sm font-medium text-gray-700 mb-2">
            Year Built
          </label>
          <input
            id="yearBuilt"
            v-model.number="adminStore.formData.yearBuilt"
            type="number"
            min="1800"
            :max="new Date().getFullYear()"
            placeholder="e.g., 2020"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            :class="{ 'border-red-500 bg-red-50': adminStore.formErrors.yearBuilt }"
          />
          <p v-if="adminStore.formErrors.yearBuilt" class="text-red-600 text-sm mt-1">
            {{ adminStore.formErrors.yearBuilt }}
          </p>
        </div>

        <!-- Description Field -->
        <div class="mb-6">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description
            <span class="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            v-model="adminStore.formData.description"
            rows="6"
            placeholder="Enter detailed property description..."
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none"
            :class="{ 'border-red-500 bg-red-50': adminStore.formErrors.description }"
          />
          <p v-if="adminStore.formErrors.description" class="text-red-600 text-sm mt-1">
            {{ adminStore.formErrors.description }}
          </p>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-4 justify-end border-t border-gray-200 pt-6">
          <button
            type="button"
            @click="handleCancel"
            :disabled="adminStore.loading"
            class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="adminStore.loading"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg v-if="adminStore.loading" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ adminStore.isEditMode ? 'Update Property' : 'Create Property' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useAdminStore } from '@/stores/admin'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const route = useRoute()
const adminStore = useAdminStore()
const loading = ref(false)

// Load property data when in edit mode
onMounted(async () => {
  if (route.params.id) {
    await loadPropertyData()
  }
})

const loadPropertyData = async () => {
  loading.value = true
  try {
    await adminStore.openForm(route.params.id)
  } catch (error) {
    console.error('Failed to load property data:', error)
    // Navigate back if error loading property
    router.push('/admin/properties')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  const success = await adminStore.saveProperty()
  
  if (success) {
    // Navigate back to properties list after successful save
    router.push('/admin/properties')
  }
}

const handleCancel = () => {
  adminStore.closeForm()
  router.push('/admin/properties')
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>