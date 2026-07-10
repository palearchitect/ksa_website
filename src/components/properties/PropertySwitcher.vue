<template>
  <div class="property-switcher flex items-center">
    <label for="prop-select" class="sr-only">Switch Property</label>
    <select
      id="prop-select"
      v-model="activeId"
      class="prop-select-dropdown bg-slate-900 border border-slate-700 text-white rounded px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-[#D4755B]"
    >
      <option value="all">All Properties</option>
      <option v-for="p in availableProperties" :key="p.id" :value="p.id">
        {{ p.title }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { usePmsStore } from '@/stores/pmsStore'
import { useAuthStore } from '@/stores/authStore'
import { propertyService } from '@/services/api'
import { ref } from 'vue'

const pmsStore = usePmsStore()
const authStore = useAuthStore()

const activeId = ref('all')
const allPropertiesList = ref([])

onMounted(async () => {
  activeId.value = pmsStore.selectedPropertyId
  
  if (['admin', 'manager', 'management'].includes(authStore.user?.role)) {
    try {
      const res = await propertyService.getProperties()
      // Support nested data structures in response
      allPropertiesList.value = res.data || res || []
    } catch (err) {
      console.error('Failed to load properties list for switcher:', err)
    }
  }
})

const availableProperties = computed(() => {
  if (authStore.user?.role === 'propertyowner') {
    const props = pmsStore.ownerSummary?.properties || []
    return props.map(p => ({ id: p.propertyId, title: p.propertyTitle }))
  } else {
    const list = Array.isArray(allPropertiesList.value) ? allPropertiesList.value : []
    return list.map(p => ({ id: p.id, title: p.title }))
  }
})

watch(activeId, (newId) => {
  pmsStore.setSelectedPropertyId(newId)
})

watch(() => pmsStore.selectedPropertyId, (newId) => {
  activeId.value = newId
})
</script>

<style scoped>
.prop-select-dropdown {
  min-width: 160px;
  max-width: 240px;
  cursor: pointer;
  transition: all 0.2s;
}
.prop-select-dropdown:hover {
  background-color: #1e293b;
  border-color: #be185d;
}
</style>
