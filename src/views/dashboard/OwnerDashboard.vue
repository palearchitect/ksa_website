<template>
  <DashboardLayout>
    <div class="owner-dashboard px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- LOADING STATE -->
      <div v-if="pmsStore.loading" class="flex flex-col items-center justify-center py-20">
        <svg class="animate-spin h-10 w-10 text-[#D4755B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="mt-4 text-gray-500 font-medium">Retrieving portfolio metrics...</span>
      </div>

      <!-- ERROR STATE -->
      <div v-else-if="pmsStore.error" class="error-card p-6 rounded-2xl bg-red-50 border border-red-100 text-center max-w-md mx-auto my-12">
        <span class="text-red-500 font-bold block text-lg mb-2">Failed to load data</span>
        <p class="text-gray-600 text-sm mb-4">{{ pmsStore.error }}</p>
        <button @click="pmsStore.fetchOwnerSummary()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold">Retry</button>
      </div>

      <!-- PORTFOLIO ONBOARDING STATE (No properties linked) -->
      <div v-else-if="!hasLinkedAssets" class="max-w-2xl mx-auto my-12">
        <div class="onboarding-card bg-white rounded-2xl border border-gray-100 shadow-xl p-8 text-center relative overflow-hidden">
          <div class="glow-effect absolute -right-20 -top-20 w-48 h-48 bg-[#D4755B] opacity-10 rounded-full blur-3xl"></div>
          
          <div class="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-100">
            <svg class="w-10 h-10 text-amber-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
            </svg>
          </div>

          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">Portfolio Under Setup</h2>
          <p class="text-gray-600 text-base max-w-md mx-auto mb-6">
            Welcome to KSA Valuers, <strong class="text-gray-900">{{ authStore.user?.name }}</strong>! We are currently mapping your physical real estate assets to your digital owner account.
          </p>

          <div class="email-badge bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 inline-flex items-center gap-2 mb-8">
            <span class="text-xs text-gray-500 font-semibold uppercase tracking-wider">Registered Email:</span>
            <span class="text-sm font-bold text-gray-800">{{ authStore.user?.email }}</span>
          </div>

          <div class="border-t border-gray-100 pt-6">
            <h4 class="text-sm font-bold text-gray-900 mb-2">Need to expedite setup?</h4>
            <p class="text-gray-500 text-xs mb-4">Provide your portfolio manager with the registered email above to link your properties.</p>
            <a href="mailto:support@ksavaluers.com?subject=Owner%20Portfolio%20Setup" class="inline-flex items-center justify-center px-6 py-3 bg-[#D4755B] hover:bg-[#B86851] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all">
              Contact Portfolio Manager
            </a>
          </div>
        </div>
      </div>

      <!-- PORTFOLIO ACTIVE STATE -->
      <div v-else>
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <span class="text-xs font-bold text-[#D4755B] uppercase tracking-wider">Property Owner Portal</span>
            <h1 class="text-3xl font-black text-slate-900 mt-1">Hello, {{ authStore.user?.name || 'Owner' }}</h1>
            <p class="text-gray-500 text-sm mt-0.5">Scoped asset yield and performance tracker. Tenant PII withheld.</p>
          </div>
          <div class="flex items-center gap-3">
            <button 
              @click="viewMode = 'cards'"
              :class="['px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all flex items-center gap-1.5', viewMode === 'cards' ? 'bg-[#D4755B] text-white border-[#D4755B]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50']"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              Cards
            </button>
            <button 
              @click="viewMode = 'table'"
              :class="['px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all flex items-center gap-1.5', viewMode === 'table' ? 'bg-[#D4755B] text-white border-[#D4755B]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50']"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 6h16M4 12h16M4 18h16"/></svg>
              Table
            </button>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Properties -->
          <div class="kpi-glass bg-[#111827] text-white p-6 rounded-2xl relative overflow-hidden border border-slate-800 shadow-xl group hover:border-[#D4755B] transition-colors">
            <div class="absolute right-3 top-3 opacity-10 group-hover:scale-110 transition-transform">
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <span class="text-xs uppercase tracking-wider text-slate-400 font-bold">Total Assets</span>
            <div class="text-3xl font-extrabold mt-2">{{ filteredSummary.totalProperties }}</div>
            <div class="text-xs text-slate-400 mt-1">Properties linked</div>
          </div>

          <!-- Active Leases -->
          <div class="kpi-glass bg-white p-6 rounded-2xl relative overflow-hidden border border-gray-100 shadow-md group hover:border-[#D4755B] transition-colors">
            <div class="absolute right-3 top-3 opacity-5 group-hover:scale-110 transition-transform">
              <svg class="w-16 h-16 text-[#D4755B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <span class="text-xs uppercase tracking-wider text-gray-500 font-bold">Active Leases</span>
            <div class="text-3xl font-extrabold mt-2 text-slate-900">{{ filteredSummary.activeLeases }}</div>
            <div class="text-xs text-green-600 font-semibold mt-1">● Occupied units</div>
          </div>

          <!-- Total Collected -->
          <div class="kpi-glass bg-white p-6 rounded-2xl relative overflow-hidden border border-gray-100 shadow-md group hover:border-[#D4755B] transition-colors">
            <div class="absolute right-3 top-3 opacity-5 group-hover:scale-110 transition-transform">
              <svg class="w-16 h-16 text-[#D4755B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <span class="text-xs uppercase tracking-wider text-gray-500 font-bold">Revenue Realized</span>
            <div class="text-3xl font-extrabold mt-2 text-slate-900">{{ fmt(simulatedTotalCollected) }}</div>
            <div class="text-xs text-gray-500 mt-1" v-if="rentIncreasePercent > 0">Projected: +{{ rentIncreasePercent }}% adjustment</div>
            <div class="text-xs text-gray-500 mt-1" v-else>All time collected</div>
          </div>

          <!-- Avg Rent -->
          <div class="kpi-glass bg-white p-6 rounded-2xl relative overflow-hidden border border-gray-100 shadow-md group hover:border-[#D4755B] transition-colors">
            <div class="absolute right-3 top-3 opacity-5 group-hover:scale-110 transition-transform">
              <svg class="w-16 h-16 text-[#D4755B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            </div>
            <span class="text-xs uppercase tracking-wider text-gray-500 font-bold">Average Rent</span>
            <div class="text-3xl font-extrabold mt-2 text-slate-900">{{ fmt(simulatedAvgRent) }}</div>
            <div class="text-xs text-gray-500 mt-1">Average yield per asset</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left: Assets List/Table (2 Cols) -->
          <div class="lg:col-span-2 space-y-6">
            <div class="card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 class="text-lg font-bold text-gray-900 mb-4">My Asset Portfolio</h3>
              
              <!-- Cards View -->
              <div v-if="viewMode === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="p in filteredProperties" :key="p.propertyId" class="asset-card p-4 rounded-xl border border-gray-100 bg-gray-50 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <span class="text-xs bg-[#D4755B] text-white px-2 py-0.5 rounded-full font-bold inline-block mb-2">{{ p.location || 'Lagos' }}</span>
                    <h4 class="text-base font-bold text-slate-800 leading-tight mb-1">{{ p.propertyTitle }}</h4>
                    <p class="text-xs text-gray-500">Property ID: #{{ p.propertyId }}</p>
                  </div>
                  
                  <div class="mt-4 pt-4 border-t border-gray-200">
                    <div class="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Monthly Rent:</span>
                      <strong class="text-slate-800">{{ fmt(p.monthlyRent * (1 + rentIncreasePercent / 100)) }}</strong>
                    </div>
                    <div class="flex justify-between text-xs text-gray-600 mb-3">
                      <span>Total Collected:</span>
                      <strong class="text-slate-800">{{ fmt(p.totalPaid * (1 + rentIncreasePercent / 100)) }}</strong>
                    </div>
                    
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-xs font-semibold text-gray-500">Occupancy:</span>
                      <div class="flex items-center gap-1.5">
                        <div class="occ-bar w-24">
                          <div class="occ-fill" :style="{ width: `${Math.min(p.unitsOccupied * 20, 100)}%` }"></div>
                        </div>
                        <span class="text-xs font-bold text-slate-800">{{ Math.min(p.unitsOccupied * 20, 100) }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Table View -->
              <div v-else class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr class="border-b border-gray-200 text-gray-500 font-bold">
                      <th class="py-3 px-2">Property</th>
                      <th class="py-3 px-2">Location</th>
                      <th class="py-3 px-2">Occupied Units</th>
                      <th class="py-3 px-2 text-right">Monthly Rent</th>
                      <th class="py-3 px-2 text-right">Collected</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="p in filteredProperties" :key="p.propertyId" class="border-b border-gray-100 text-gray-700 hover:bg-gray-50">
                      <td class="py-3.5 px-2 font-semibold text-slate-900">{{ p.propertyTitle }}</td>
                      <td class="py-3.5 px-2">{{ p.location || '—' }}</td>
                      <td class="py-3.5 px-2">{{ p.unitsOccupied }} units</td>
                      <td class="py-3.5 px-2 text-right font-semibold">{{ fmt(p.monthlyRent * (1 + rentIncreasePercent / 100)) }}</td>
                      <td class="py-3.5 px-2 text-right font-semibold text-green-600">{{ fmt(p.totalPaid * (1 + rentIncreasePercent / 100)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Right: Interactive Yield Calculator Widget (1 Col) -->
          <div class="space-y-6">
            <div class="calculator-card bg-[#111827] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden border border-slate-800">
              <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-[#D4755B] opacity-5 rounded-full blur-2xl"></div>
              
              <h3 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <svg class="w-5 h-5 text-[#D4755B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                Rent Yield Simulator
              </h3>
              <p class="text-slate-400 text-xs mb-6">Drag the adjustment slider to preview estimated portfolio yield changes.</p>
              
              <div class="space-y-6">
                <!-- Adjustment Slider -->
                <div>
                  <div class="flex justify-between text-sm font-semibold mb-2">
                    <span class="text-slate-300">Adjustment:</span>
                    <span class="text-[#D4755B] font-bold">+{{ rentIncreasePercent }}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="30" 
                    v-model.number="rentIncreasePercent"
                    class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#D4755B]"
                  />
                  <div class="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>0% (Current)</span>
                    <span>15%</span>
                    <span>30% (Max)</span>
                  </div>
                </div>

                <!-- Projection Stats -->
                <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div class="flex justify-between text-xs">
                    <span class="text-slate-400">Current Yield:</span>
                    <span class="font-semibold text-slate-300">{{ fmt(baseTotalCollected) }}</span>
                  </div>
                  <div class="flex justify-between text-xs">
                    <span class="text-slate-400">Projected Yield:</span>
                    <span class="font-semibold text-[#D4755B]">{{ fmt(simulatedTotalCollected) }}</span>
                  </div>
                  <div class="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold">
                    <span class="text-white">Est. Delta:</span>
                    <span class="text-green-500">+{{ fmt(simulatedTotalCollected - baseTotalCollected) }}</span>
                  </div>
                </div>

                <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                  💡 Adjusted values represent theoretical calculations to assist asset planning and do not bind active contract terms.
                </div>
              </div>
            </div>

            <!-- PII Notice Banner -->
            <div class="bg-amber-50/50 border border-amber-200/80 rounded-xl p-5 text-sm text-amber-900 flex items-start gap-3 shadow-sm">
              <svg class="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-width="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke-width="2"/>
              </svg>
              <div>
                <strong class="font-bold block text-slate-800 mb-0.5">Tenant PII Protection</strong>
                <p class="text-xs text-gray-600 leading-relaxed">Tenant names, phone numbers, and private credentials are withheld under security policies. Contact property management to resolve specific occupant issues.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from './DashboardLayout.vue'
import { usePmsStore } from '@/stores/pmsStore'
import { useAuthStore } from '@/stores/authStore'

const pmsStore = usePmsStore()
const authStore = useAuthStore()

const viewMode = ref('cards')
const rentIncreasePercent = ref(0)

onMounted(() => {
  pmsStore.fetchOwnerSummary()
})

const hasLinkedAssets = computed(() => {
  return pmsStore.ownerSummary?.properties?.length > 0
})

const filteredProperties = computed(() => {
  const allProps = pmsStore.ownerSummary?.properties || []
  if (pmsStore.selectedPropertyId === 'all' || !pmsStore.selectedPropertyId) {
    return allProps
  }
  return allProps.filter(p => p.propertyId === pmsStore.selectedPropertyId)
})

const filteredSummary = computed(() => {
  const baseSummary = pmsStore.ownerSummary?.summary
  if (!baseSummary) return null
  if (pmsStore.selectedPropertyId === 'all' || !pmsStore.selectedPropertyId) {
    return baseSummary
  }
  const matchedProp = (pmsStore.ownerSummary?.properties || []).find(p => p.propertyId === pmsStore.selectedPropertyId)
  if (!matchedProp) {
    return {
      totalProperties: 0,
      activeLeases: 0,
      totalCollected: 0,
      avgRent: 0
    }
  }
  return {
    totalProperties: 1,
    activeLeases: matchedProp.unitsOccupied || 0,
    totalCollected: matchedProp.totalPaid || 0,
    avgRent: matchedProp.monthlyRent || 0
  }
})

// Calculator / projections computeds
const baseTotalCollected = computed(() => {
  return filteredSummary.value?.totalCollected || 0
})

const baseAvgRent = computed(() => {
  return filteredSummary.value?.avgRent || 0
})

const simulatedTotalCollected = computed(() => {
  const multiplier = 1 + (rentIncreasePercent.value / 100)
  return Math.round(baseTotalCollected.value * multiplier)
})

const simulatedAvgRent = computed(() => {
  const multiplier = 1 + (rentIncreasePercent.value / 100)
  return Math.round(baseAvgRent.value * multiplier)
})

const fmt = (n) => {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN', 
    maximumFractionDigits: 0 
  }).format(n || 0)
}
</script>

<style scoped>
.onboarding-card {
  transition: all 0.3s ease;
}
.onboarding-card:hover {
  transform: translateY(-2px);
}
.kpi-glass {
  transition: all 0.25s ease;
}
.kpi-glass:hover {
  transform: translateY(-3px);
}
.asset-card {
  transition: all 0.2s ease-in-out;
}
.asset-card:hover {
  border-color: #D4755B;
}
.occ-bar {
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
}
.occ-fill {
  height: 100%;
  background: linear-gradient(90deg, #D4755B, #B86851);
  border-radius: 99px;
  transition: width 0.4s ease;
}
</style>
