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
      <button @click="$emit('view-change', 'grid')" :class="viewMode==='grid' ? 'text-[#D4755B]' : 'text-gray-400'">
        <span class="material-icons">grid_view</span>
      </button>
      <button @click="$emit('view-change', 'list')" :class="viewMode==='list' ? 'text-[#D4755B]' : 'text-gray-400'">
        <span class="material-icons">view_list</span>
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
 