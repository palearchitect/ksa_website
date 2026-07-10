<template>
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
    <div class="text-lg font-bold text-gray-900">
      {{ total }} Properties Found
    </div>
    <div class="flex items-center gap-4">
      <select v-model="sort" @change="$emit('sort-change', sort)" class="border rounded px-3 py-2 text-sm">
        <option value="featured">Featured</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="newest">Newest</option>
        <option value="beds">Beds</option>
      </select>
      <button @click="$emit('view-change', 'grid')" :class="viewMode==='grid' ? 'text-[#D4755B]' : 'text-gray-400'" title="Grid View" class="flex items-center">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 20px; height: 20px;">
          <rect x="3" y="3" width="7" height="7" stroke-width="2"/>
          <rect x="14" y="3" width="7" height="7" stroke-width="2"/>
          <rect x="14" y="14" width="7" height="7" stroke-width="2"/>
          <rect x="3" y="14" width="7" height="7" stroke-width="2"/>
        </svg>
      </button>
      <button @click="$emit('view-change', 'list')" :class="viewMode==='list' ? 'text-[#D4755B]' : 'text-gray-400'" title="List View" class="flex items-center">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 20px; height: 20px;">
          <line x1="8" y1="6" x2="21" y2="6" stroke-width="2" stroke-linecap="round"/>
          <line x1="8" y1="12" x2="21" y2="12" stroke-width="2" stroke-linecap="round"/>
          <line x1="8" y1="18" x2="21" y2="18" stroke-width="2" stroke-linecap="round"/>
          <line x1="3" y1="6" x2="3.01" y2="6" stroke-width="2" stroke-linecap="round"/>
          <line x1="3" y1="12" x2="3.01" y2="12" stroke-width="2" stroke-linecap="round"/>
          <line x1="3" y1="18" x2="3.01" y2="18" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  total: { type: Number, default: 0 },
  viewMode: { type: String, default: 'grid' },
  sortBy: { type: String, default: 'featured' }
})
const sort = ref(props.sortBy)
watch(() => props.sortBy, v => sort.value = v)
</script>
 