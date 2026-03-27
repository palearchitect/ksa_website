<template>
  <div>
    <div v-if="properties.length === 0" class="text-center py-12 text-gray-500">No properties found.</div>
    <div v-else :class="viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-6'">
      <PropertyCard
        v-for="property in properties"
        :key="property.id"
        :property="property"
        :is-favorite="favorites.includes(property.id)"
        @favorite-toggle="() => $emit('favorite-toggle', property.id)"
      />
    </div>
  </div>
</template>

<script setup>
import PropertyCard from './PropertyCard.vue'
defineProps({
  properties: { type: Array, required: true },
  viewMode: { type: String, default: 'grid' },
  favorites: { type: Array, default: () => [] }
})
</script>
