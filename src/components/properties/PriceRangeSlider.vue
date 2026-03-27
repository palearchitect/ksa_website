
<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between mb-2">
      <span class="font-bold text-sm">Price Range</span>
      <span class="text-xs text-[#D4755B]">₹{{ formatPrice(modelValue[0]) }} - ₹{{ formatPrice(modelValue[1]) }}</span>
    </div>
    <div class="flex items-center gap-2">
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        v-model.number="localValue[0]"
        @input="onMinChange"
        class="w-full accent-[#D4755B]"
      />
      <span class="text-xs text-[#9CA3AF] w-10 text-right">Min</span>
    </div>
    <div class="flex items-center gap-2">
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        v-model.number="localValue[1]"
        @input="onMaxChange"
        class="w-full accent-[#D4755B]"
      />
      <span class="text-xs text-[#9CA3AF] w-10 text-right">Max</span>
    </div>
    <div class="flex justify-between px-1">
      <span class="font-manrope text-xs text-[#9CA3AF]">₹0</span>
      <span class="font-manrope text-xs text-[#9CA3AF]">₹20 Cr+</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  modelValue: { type: Array, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 200 },
  step: { type: Number, default: 1 }
})
const emit = defineEmits(['update:modelValue'])
const localValue = ref([...props.modelValue])
watch(() => props.modelValue, v => localValue.value = [...v])
function onMinChange(e) {
  const val = Number(e.target.value)
  if (val < localValue.value[1]) {
    localValue.value[0] = val
    emit('update:modelValue', [...localValue.value])
  }
}
function onMaxChange(e) {
  const val = Number(e.target.value)
  if (val > localValue.value[0]) {
    localValue.value[1] = val
    emit('update:modelValue', [...localValue.value])
  }
}
function formatPrice(val) {
  if (val >= 200) return '20 Cr+'
  if (val >= 10) return `${(val / 10).toFixed(val % 10 === 0 ? 0 : 1)} Cr`
  return `${val * 10} L`
}
</script>
