
<template>
  <div>
    <button
      class="md:hidden flex items-center px-4 py-2 bg-[#D4755B] text-white w-full justify-between"
      @click="mobileOpen = !mobileOpen"
    >
      <span class="font-bold">Filters</span>
      <span class="material-icons">{{ mobileOpen ? 'expand_less' : 'expand_more' }}</span>
    </button>
    <aside
      :class="[
        'bg-white border-r border-[#E6E0DA] md:w-[340px] w-full md:sticky md:top-20 md:h-[calc(100vh-5rem)] overflow-y-auto pb-24 transition-all duration-300 z-30',
        mobileOpen ? 'block' : 'hidden md:block'
      ]"
    >
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-manrope font-extralight text-lg text-[#111827]">Refine Your Search</h2>
          <button @click="resetFilters" class="font-manrope font-extralight text-sm text-[#D4755B] hover:underline">Reset all</button>
        </div>
        <div class="mb-8 border-b border-[#F5F1E8] pb-8">
          <h3 class="font-manrope font-bold text-sm text-[#111827] mb-4 uppercase tracking-wider">Location</h3>
          <div class="relative mb-3">
            <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-lg">location_on</span>
            <input
              v-model="filters.location"
              @input="emitChange"
              type="text"
              placeholder="City, neighborhood..."
              class="w-full bg-[#F5F1E8] border border-[#EBE5DE] rounded-lg pl-10 pr-4 py-3 font-manrope text-sm text-[#111827] placeholder:text-[#6B7280] focus:outline-none focus:border-[#D4755B] transition-all"
            />
          </div>
        </div>
        <div class="mb-8 border-b border-[#F5F1E8] pb-8">
          <h3 class="font-manrope font-bold text-sm text-[#111827] mb-4 uppercase tracking-wider">Property Type</h3>
          <div class="grid grid-cols-2 gap-3">
            <label
              v-for="type in propertyTypes"
              :key="type"
              class="flex items-center gap-2 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                class="accent-[#D4755B] w-5 h-5"
                :value="type"
                v-model="filters.propertyType"
                @change="emitChange"
              />
              <span class="font-manrope text-sm">{{ type }}</span>
            </label>
          </div>
        </div>
        <div class="mb-8 border-b border-[#F5F1E8] pb-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-manrope font-bold text-sm text-[#111827] uppercase tracking-wider">Price Range</h3>
            <span class="font-space-mono text-sm text-[#D4755B]">
              ₹{{ formatPrice(filters.priceRange[0]) }} - ₹{{ formatPrice(filters.priceRange[1]) }}
            </span>
          </div>
          <div class="flex flex-col gap-2 px-2">
            <div class="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="200"
                step="1"
                v-model.number="filters.priceRange[0]"
                @input="handleMinSlider"
                class="w-full accent-[#D4755B]"
              />
              <span class="text-xs text-[#9CA3AF] w-10 text-right">Min</span>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="200"
                step="1"
                v-model.number="filters.priceRange[1]"
                @input="handleMaxSlider"
                class="w-full accent-[#D4755B]"
              />
              <span class="text-xs text-[#9CA3AF] w-10 text-right">Max</span>
            </div>
            <div class="flex justify-between px-1">
              <span class="font-manrope text-xs text-[#9CA3AF]">₹0</span>
              <span class="font-manrope text-xs text-[#9CA3AF]">₹20 Cr+</span>
            </div>
          </div>
        </div>
        <div class="mb-8 border-b border-[#F5F1E8] pb-8">
          <h3 class="font-manrope font-bold text-sm text-[#111827] mb-4 uppercase tracking-wider">Bedrooms</h3>
          <select
            v-model.number="filters.bedrooms"
            @change="emitChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md font-manrope text-sm"
          >
            <option :value="0">Any</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}+</option>
          </select>
        </div>
        <div class="mb-8 border-b border-[#F5F1E8] pb-8">
          <h3 class="font-manrope font-bold text-sm text-[#111827] mb-4 uppercase tracking-wider">Bathrooms</h3>
          <select
            v-model.number="filters.bathrooms"
            @change="emitChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md font-manrope text-sm"
          >
            <option :value="0">Any</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}+</option>
          </select>
        </div>
        <div class="mb-8">
          <h3 class="font-manrope font-bold text-sm text-[#111827] mb-4 uppercase tracking-wider">Amenities</h3>
          <div class="grid grid-cols-2 gap-3">
            <label
              v-for="amenity in amenities"
              :key="amenity"
              class="flex items-center gap-2 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                class="accent-[#D4755B] w-5 h-5"
                :value="amenity"
                v-model="filters.amenities"
                @change="emitChange"
              />
              <span class="font-manrope text-sm">{{ amenity }}</span>
            </label>
          </div>
        </div>
        <button
          @click="resetFilters"
          class="w-full bg-transparent border border-[#D4755B] text-[#D4755B] font-manrope font-bold text-base py-4 rounded-xl transition-all hover:bg-[#D4755B] hover:text-white sticky bottom-0"
        >
          Reset Filters
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
const emit = defineEmits(['filter-change'])
const mobileOpen = ref(false)
const propertyTypes = [
  'Apartment', 'Villa', 'House', 'Office', 'Studio', 'Penthouse'
]
const amenities = [
  'Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Lift', 'Clubhouse', 'Power Backup', 'Balcony', 'CCTV', 'Children Play Area', 'Gated Community'
]
const filters = reactive({
  location: '',
  propertyType: [],
  priceRange: [0, 200],
  bedrooms: 0,
  bathrooms: 0,
  amenities: []
})
function emitChange() {
  emit('filter-change', { ...filters })
}
function resetFilters() {
  filters.location = ''
  filters.propertyType = []
  filters.priceRange = [0, 200]
  filters.bedrooms = 0
  filters.bathrooms = 0
  filters.amenities = []
  emitChange()
}
function handleMinSlider(e) {
  const val = Number(e.target.value)
  if (val < filters.priceRange[1]) {
    filters.priceRange[0] = val
    emitChange()
  }
}
function handleMaxSlider(e) {
  const val = Number(e.target.value)
  if (val > filters.priceRange[0]) {
    filters.priceRange[1] = val
    emitChange()
  }
}
function formatPrice(val) {
  if (val >= 200) return '20 Cr+'
  if (val >= 10) return `${(val / 10).toFixed(val % 10 === 0 ? 0 : 1)} Cr`
  return `${val * 10} L`
}
watch(filters, emitChange, { deep: true })
</script>

<style scoped>
@media (max-width: 767px) {
  aside {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh !important;
    width: 100vw !important;
    background: white;
    z-index: 50;
    box-shadow: 0 0 0 9999px rgba(0,0,0,0.2);
  }
}
</style>
