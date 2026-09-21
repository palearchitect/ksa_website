<template>
  <div v-if="instruments.length > 0" class="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 my-4 max-w-xl mx-auto shadow-lg text-white">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-bold text-orange-400 flex items-center gap-2">
        <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Supabase Instruments Feed
      </h3>
      <span class="text-xxs font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
        {{ instruments.length }} records
      </span>
    </div>
    <ul class="divide-y divide-slate-800 text-xs text-slate-300">
      <li v-for="instrument in instruments" :key="instrument.id" class="py-1.5 flex justify-between font-mono">
        <span>{{ instrument.name }}</span>
        <span class="text-slate-500">ID: {{ instrument.id }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'

const instruments = ref([])

onMounted(async () => {
  try {
    const { data, error } = await supabase.from('instruments').select('*')
    if (error) {
      console.warn('Supabase instruments query response:', error.message)
    } else if (data) {
      instruments.value = data
    }
  } catch (err) {
    console.warn('Supabase fetch exception:', err)
  }
})
</script>

<style scoped>
.text-xxs {
  font-size: 0.65rem;
}
</style>
