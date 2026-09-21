<template>
  <div class="admin-dashboard space-y-6 max-w-[1600px] mx-auto text-slate-800">
    
    <!-- ── Sub-Header: Title & Quick Metrics (KSA Brand Colors) ────────────── -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/70 p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm backdrop-blur-md">
      <!-- Title & Action Tools -->
      <div class="flex items-center gap-3 sm:gap-4 flex-wrap">
        <button class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center transition shadow-sm">
          <svg class="w-4.5 h-4.5 text-slate-700" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Estate Management</h1>
        </div>

        <!-- Action Cluster Icons in Pill Container -->
        <div class="hidden xl:flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-full border border-slate-200/80 shadow-sm ml-2">
          <button @click="refreshData" class="p-1.5 text-slate-500 hover:text-orange-500 rounded-full hover:bg-orange-50 transition" title="Refresh Data">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
          </button>
          <button class="p-1.5 text-slate-500 hover:text-orange-500 rounded-full hover:bg-orange-50 transition" title="Grid View">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
          </button>
          <button class="p-1.5 text-slate-500 hover:text-orange-500 rounded-full hover:bg-orange-50 transition" title="Chat & Feedback">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
          </button>
          <button class="p-1.5 text-slate-500 hover:text-orange-500 rounded-full hover:bg-orange-50 transition" title="Export Data">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
          </button>
          <button class="p-1.5 text-slate-500 hover:text-orange-500 rounded-full hover:bg-orange-50 transition" title="Print Report">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231a1.125 1.125 0 01-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.085 48.085 0 00-14.326 0C3.768 7.44 3 8.375 3 9.456v6.294a2.25 2.25 0 002.25 2.25h1.091" /></svg>
          </button>
        </div>
      </div>

      <!-- Quick Metrics Summary Pills -->
      <div class="flex items-center gap-3">
        <!-- Active Leads Pill (KSA Orange) -->
        <div class="bg-white px-5 py-3 rounded-3xl border border-slate-200/70 shadow-sm flex items-center gap-4 flex-1 sm:flex-initial">
          <div class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
            👤
          </div>
          <div>
            <span class="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Active Leads</span>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xl font-black text-slate-900 leading-none">140</span>
              <span class="px-2 py-0.5 bg-orange-100 text-orange-600 font-extrabold text-[10px] rounded-full flex items-center gap-0.5">
                +12% ↗
              </span>
            </div>
          </div>
        </div>

        <!-- Total Closed Pill (Royal Blue) -->
        <div class="bg-white px-5 py-3 rounded-3xl border border-slate-200/70 shadow-sm flex items-center gap-4 flex-1 sm:flex-initial">
          <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
            🤝
          </div>
          <div>
            <span class="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Total Closed</span>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xl font-black text-slate-900 leading-none">52</span>
              <span class="px-2 py-0.5 bg-blue-100 text-blue-600 font-extrabold text-[10px] rounded-full flex items-center gap-0.5">
                +12% ↗
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Notification Banner -->
    <div v-if="alertMsg" :class="['p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-sm transition-all', alertIsError ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-orange-50 border-orange-200 text-orange-800']">
      <div class="flex items-center gap-2.5">
        <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ alertMsg }}</span>
      </div>
      <button @click="alertMsg = ''" class="text-slate-400 hover:text-slate-700">&times;</button>
    </div>

    <!-- ── Main Bento Grid Layout (KSA Brand Colors) ──────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- ── LEFT COLUMN (Sales Analytics, Goals, Reminders, Active Listings) ── -->
      <div class="lg:col-span-7 xl:col-span-8 space-y-6">
        
        <!-- 1. Sales Analytics Dual-Line Chart Card (KSA Orange & Royal Blue) -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/70 hover:border-orange-500/30 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-900">Sales Analytics</h3>
            <div class="relative">
              <select v-model="analyticsPeriod" class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 outline-none cursor-pointer hover:bg-slate-100 transition">
                <option value="last_month">Last Month</option>
                <option value="this_quarter">This Quarter</option>
                <option value="this_year">This Year</option>
              </select>
            </div>
          </div>

          <!-- Dual-Line SVG Chart Container -->
          <div class="relative pt-4 pb-2">
            <!-- Floating Tooltip Legend -->
            <div class="absolute top-2 right-12 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200/80 shadow-lg flex items-center gap-4 text-xs font-bold z-10">
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-orange-500"></span>
                <span class="text-slate-500">Income</span>
                <span class="text-slate-900 font-extrabold ml-1">$6,620.00</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-blue-500"></span>
                <span class="text-slate-500">Expenses</span>
                <span class="text-slate-900 font-extrabold ml-1">$4,458.00</span>
              </div>
            </div>

            <svg class="w-full h-48 sm:h-56 overflow-visible" viewBox="0 0 700 200">
              <defs>
                <linearGradient id="incomeGradKSA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f96816" stop-opacity="0.25"/>
                  <stop offset="100%" stop-color="#f96816" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="expenseGradKSA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2563eb" stop-opacity="0.2"/>
                  <stop offset="100%" stop-color="#2563eb" stop-opacity="0"/>
                </linearGradient>
              </defs>

              <!-- Grid Horizontal Lines -->
              <line x1="0" y1="20" x2="700" y2="20" stroke="#f1f5f9" stroke-width="1.5" stroke-dasharray="4 4" />
              <line x1="0" y1="70" x2="700" y2="70" stroke="#f1f5f9" stroke-width="1.5" stroke-dasharray="4 4" />
              <line x1="0" y1="120" x2="700" y2="120" stroke="#f1f5f9" stroke-width="1.5" stroke-dasharray="4 4" />
              <line x1="0" y1="170" x2="700" y2="170" stroke="#cbd5e1" stroke-width="1.5" />

              <!-- Area Fill Paths -->
              <path d="M 0,140 Q 100,60 200,70 T 400,20 T 600,60 L 700,65 L 700,170 L 0,170 Z" fill="url(#incomeGradKSA)" />
              <path d="M 0,160 Q 100,120 200,130 T 400,110 T 600,130 L 700,140 L 700,170 L 0,170 Z" fill="url(#expenseGradKSA)" />

              <!-- Income Smooth Line (KSA Orange) -->
              <path d="M 0,140 Q 100,60 200,70 T 400,20 T 600,60 L 700,65" fill="none" stroke="#f96816" stroke-width="4" stroke-linecap="round" />
              <!-- Expenses Smooth Line (Royal Blue) -->
              <path d="M 0,160 Q 100,120 200,130 T 400,110 T 600,130 L 700,140" fill="none" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round" />

              <!-- Active Data Marker Point -->
              <circle cx="400" cy="20" r="7" fill="#f96816" stroke="#ffffff" stroke-width="3" />
            </svg>

            <!-- X-Axis Months Strip -->
            <div class="flex justify-between text-[11px] font-bold text-slate-400 pt-2 px-1">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span class="text-orange-500 font-black">Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        <!-- 2. Dual Grid Row: Goals Donut Chart + Reminder Card -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Goals Donut Chart Card -->
          <div class="bg-white p-6 rounded-3xl border border-slate-200/70 hover:border-orange-500/30 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold text-slate-900">Goals</h3>
              <button class="text-slate-400 hover:text-slate-600 text-lg font-bold">⋮</button>
            </div>

            <!-- Donut Chart & Center Legend -->
            <div class="flex flex-col items-center justify-center my-2 relative">
              <svg class="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                <!-- Background Circle -->
                <circle cx="60" cy="60" r="45" fill="none" stroke="#f1f5f9" stroke-width="14" />
                <!-- Royal Blue Segment -->
                <circle cx="60" cy="60" r="45" fill="none" stroke="#2563eb" stroke-width="14" stroke-dasharray="283" stroke-dashoffset="190" stroke-linecap="round" />
                <!-- KSA Orange Segment -->
                <circle cx="60" cy="60" r="45" fill="none" stroke="#f96816" stroke-width="14" stroke-dasharray="283" stroke-dashoffset="90" stroke-linecap="round" />
              </svg>
              <!-- Center Metric Text -->
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span class="text-xl font-black text-slate-900 leading-tight">32,012</span>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Income</span>
              </div>
            </div>

            <!-- Bottom Breakdown Cards -->
            <div class="grid grid-cols-2 gap-3 pt-2">
              <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-xl bg-white text-orange-500 flex items-center justify-center text-xs shadow-sm">👛</div>
                <div>
                  <span class="text-xs font-black text-slate-900 block">$10,360</span>
                  <span class="text-[9px] font-bold text-slate-400 block">From January</span>
                </div>
              </div>
              <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-xl bg-white text-blue-600 flex items-center justify-center text-xs shadow-sm">💳</div>
                <div>
                  <span class="text-xs font-black text-slate-900 block">$16,800</span>
                  <span class="text-[9px] font-bold text-slate-400 block">From June</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Reminder Card -->
          <div class="bg-white p-6 rounded-3xl border border-slate-200/70 hover:border-orange-500/30 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold text-slate-900">Reminder</h3>
              <button class="text-slate-400 hover:text-orange-500 transition">
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              </button>
            </div>

            <div class="space-y-3">
              <!-- Follow-Ups Item -->
              <div class="bg-orange-50/70 hover:bg-orange-50 p-3.5 rounded-2xl border border-orange-100/80 transition flex items-center justify-between group cursor-pointer">
                <div>
                  <h4 class="text-xs font-bold text-slate-900">Follow-Ups</h4>
                  <p class="text-[11px] font-medium text-slate-500 mt-0.5">15 leads need to be followed up</p>
                  <div class="flex items-center gap-1 mt-2">
                    <div class="flex -space-x-2">
                      <img class="w-5 h-5 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" />
                      <img class="w-5 h-5 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" />
                      <img class="w-5 h-5 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" />
                    </div>
                    <span class="text-[10px] font-bold text-slate-400 ml-1">+11</span>
                  </div>
                </div>
                <div class="w-7 h-7 rounded-full bg-white text-orange-500 flex items-center justify-center font-bold text-xs shadow-sm group-hover:bg-orange-500 group-hover:text-white transition">
                  ❯
                </div>
              </div>

              <!-- Visits Item -->
              <div class="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-2xl border border-slate-100 transition flex items-center justify-between group cursor-pointer">
                <div>
                  <h4 class="text-xs font-bold text-slate-900">Visits</h4>
                  <p class="text-[11px] font-medium text-slate-500 mt-0.5">2 Properties and 3 Leads visit today</p>
                </div>
                <div class="w-7 h-7 rounded-full bg-white text-slate-600 flex items-center justify-center font-bold text-xs shadow-sm group-hover:bg-orange-500 group-hover:text-white transition">
                  ❯
                </div>
              </div>

              <!-- Expire Listings Item -->
              <div class="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-2xl border border-slate-100 transition flex items-center justify-between group cursor-pointer">
                <div>
                  <h4 class="text-xs font-bold text-slate-900">Expire Listings</h4>
                  <p class="text-[11px] font-medium text-slate-500 mt-0.5">2 Listings are about to expire in 3 days</p>
                </div>
                <div class="w-7 h-7 rounded-full bg-white text-slate-600 flex items-center justify-center font-bold text-xs shadow-sm group-hover:bg-orange-500 group-hover:text-white transition">
                  ❯
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Active Listings Table Card -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/70 hover:border-orange-500/30 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 class="text-lg font-bold text-slate-900">Active Listing</h3>
            <div class="flex items-center gap-2">
              <div class="relative">
                <input
                  type="text"
                  v-model="tableSearchQuery"
                  placeholder="Search..."
                  class="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs outline-none focus:border-orange-500 focus:bg-white transition w-44"
                />
                <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              </div>
              <router-link to="/dashboard/admin/properties" class="p-1.5 text-slate-400 hover:text-orange-500 transition">
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              </router-link>
            </div>
          </div>

          <!-- Table Container -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th class="py-3 px-2">Property</th>
                  <th class="py-3 px-2">Type</th>
                  <th class="py-3 px-2">Units</th>
                  <th class="py-3 px-2">Cost</th>
                  <th class="py-3 px-2">Active Leads</th>
                  <th class="py-3 px-2">Views</th>
                  <th class="py-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs font-semibold">
                <tr v-for="item in filteredActiveListings" :key="item.id" class="hover:bg-slate-50/80 transition-colors">
                  <td class="py-3 px-2 flex items-center gap-3">
                    <img :src="item.image" class="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0" />
                    <div>
                      <span class="font-bold text-slate-900 block leading-tight">{{ item.title }}</span>
                      <span class="text-[10px] font-medium text-slate-400 block">{{ item.location }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-2 text-slate-600">{{ item.type }}</td>
                  <td class="py-3 px-2 text-slate-600 font-mono">{{ item.units }}</td>
                  <td class="py-3 px-2 font-extrabold text-slate-900">{{ item.cost }}</td>
                  <td class="py-3 px-2">
                    <div class="flex items-center gap-1">
                      <div class="flex -space-x-1.5">
                        <img v-for="(av, idx) in item.leadAvatars" :key="idx" :src="av" class="w-5 h-5 rounded-full border border-white object-cover" />
                      </div>
                      <span class="text-[10px] font-bold text-slate-500">+{{ item.leadCount }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-2 text-slate-600 font-mono">{{ item.views }}</td>
                  <td class="py-3 px-2 text-right">
                    <span :class="['px-3 py-1 rounded-full text-[10px] font-bold inline-block', item.statusClass]">
                      {{ item.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- ── RIGHT COLUMN (Featured Property, Leads Cards, Schedule) ──────── -->
      <div class="lg:col-span-5 xl:col-span-4 space-y-6">
        
        <!-- 1. Featured Property Hero Card ("The Somerset" in KSA Orange & Navy) -->
        <div class="bg-white p-5 rounded-3xl border border-slate-200/70 hover:border-orange-500/30 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
          <!-- Hero Banner Image & Stacked Thumbnails -->
          <div class="grid grid-cols-12 gap-2 relative">
            <div class="col-span-9 relative rounded-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                alt="Property Hero"
              />
              <span class="absolute bottom-2.5 left-2.5 px-3 py-1 bg-orange-500/95 backdrop-blur-md text-white font-extrabold text-[10px] rounded-full flex items-center gap-1 shadow-md">
                <span>🟧</span> Recommended to 14 Leads
              </span>
              <button class="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center font-bold text-xs shadow-md">
                ↗
              </button>
            </div>
            
            <div class="col-span-3 flex flex-col gap-2">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80" class="w-full h-20 rounded-xl object-cover" />
              <div class="relative rounded-xl overflow-hidden h-22">
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=200&q=80" class="w-full h-full object-cover filter brightness-75" />
                <span class="absolute inset-0 flex items-center justify-center text-white font-extrabold text-xs">+7</span>
              </div>
            </div>
          </div>

          <!-- Title & Stats -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-lg font-black text-slate-900 leading-tight">The Somerset</h4>
                <span class="text-xs font-semibold text-slate-400">House</span>
              </div>
              <div class="flex items-center gap-4 text-xs font-bold text-slate-700">
                <div><span class="text-slate-900 font-black">185</span> <span class="text-[10px] text-slate-400 font-medium">Sold</span></div>
                <div><span class="text-slate-900 font-black">178</span> <span class="text-[10px] text-slate-400 font-medium">Rented</span></div>
                <div><span class="text-slate-900 font-black">4K+</span> <span class="text-[10px] text-slate-400 font-medium">Views</span></div>
              </div>
            </div>

            <!-- Deals Progress Bar (KSA Orange) -->
            <div class="space-y-1 pt-1">
              <div class="flex justify-between text-[11px] font-bold">
                <span class="text-slate-700">Deals</span>
                <span class="text-orange-500 font-extrabold">↗</span>
              </div>
              <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div class="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full" style="width: 65%"></div>
              </div>
              <div class="flex justify-between text-[10px] font-bold text-slate-400 pt-0.5">
                <span><strong class="text-slate-900 font-black">52</strong> Closed Deals</span>
                <span><strong class="text-slate-900 font-black">160</strong> On Progress</span>
              </div>
            </div>

            <!-- Specs Badges -->
            <div class="flex items-center gap-2 flex-wrap pt-2 text-[11px] font-bold text-slate-600">
              <span class="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-1">🛏 6 Bed</span>
              <span class="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-1">🚿 4 Bath</span>
              <span class="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-1">📐 40 m² Property Area</span>
              <span class="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-1">📅 2025 year Build</span>
            </div>
          </div>
        </div>

        <!-- 2. Lead / Client Contact Cards (KSA Orange & Royal Blue) -->
        <div class="space-y-3">
          <!-- Lead Card 1 -->
          <div class="bg-white p-4 rounded-3xl border border-slate-200/70 shadow-sm flex items-center justify-between gap-3 hover:border-orange-300 transition">
            <div class="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" class="w-11 h-11 rounded-2xl object-cover border border-slate-200" />
              <div>
                <h4 class="text-sm font-black text-slate-900 leading-tight">Robert Fox</h4>
                <span class="text-[11px] font-medium text-slate-400 block">House - Buy</span>
                <span class="text-xs font-black text-slate-900 block mt-1">$1,475,300</span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <div class="flex items-center gap-1.5">
                <button class="w-7 h-7 rounded-full bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-600 flex items-center justify-center transition">📞</button>
                <button class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">↗</button>
              </div>
              <span class="px-2.5 py-0.5 bg-orange-100 text-orange-600 font-extrabold text-[10px] rounded-full">Closed Won</span>
              <span class="text-[9px] font-semibold text-slate-400">● Maison Sterling</span>
            </div>
          </div>

          <!-- Lead Card 2 -->
          <div class="bg-white p-4 rounded-3xl border border-slate-200/70 shadow-sm flex items-center justify-between gap-3 hover:border-blue-300 transition">
            <div class="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" class="w-11 h-11 rounded-2xl object-cover border border-slate-200" />
              <div>
                <h4 class="text-sm font-black text-slate-900 leading-tight">Kathryn Murphy</h4>
                <span class="text-[11px] font-medium text-slate-400 block">Apartment - Buy</span>
                <span class="text-xs font-black text-slate-900 block mt-1">$600K - $850K</span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <div class="flex items-center gap-1.5">
                <button class="w-7 h-7 rounded-full bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-600 flex items-center justify-center transition">📞</button>
                <button class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">↗</button>
              </div>
              <span class="px-2.5 py-0.5 bg-blue-100 text-blue-700 font-extrabold text-[10px] rounded-full">New Lead</span>
              <button class="px-2.5 py-0.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-[9px] rounded-full flex items-center gap-1 shadow-sm transition">
                ✔ See Suggestion
              </button>
            </div>
          </div>
        </div>

        <!-- 3. Upcoming Appointments & Calendar Card (Active Date KSA Orange) -->
        <div class="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-900">Upcoming Appointments</h3>
            <div class="flex items-center gap-1">
              <button class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs flex items-center justify-center font-bold">&lt;</button>
              <button class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs flex items-center justify-center font-bold">&gt;</button>
            </div>
          </div>

          <!-- Date Selector Strip -->
          <div class="grid grid-cols-7 gap-1 text-center">
            <div
              v-for="d in dateStrip"
              :key="d.date"
              @click="activeDate = d.date"
              :class="['p-2 rounded-2xl cursor-pointer transition flex flex-col items-center justify-center', activeDate === d.date ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'bg-slate-50 text-slate-600 hover:bg-slate-100']"
            >
              <span class="text-xs font-black">{{ d.date }}</span>
              <span class="text-[9px] font-bold opacity-80">{{ d.day }}</span>
            </div>
          </div>

          <!-- Sub Tabs Filter -->
          <div class="flex items-center gap-4 text-xs font-bold border-b border-slate-100 pb-2">
            <button @click="appointmentTab = 'all'" :class="appointmentTab === 'all' ? 'text-orange-500 font-black border-b-2 border-orange-500 pb-1' : 'text-slate-400 hover:text-slate-700'">All</button>
            <button @click="appointmentTab = 'assigned'" :class="appointmentTab === 'assigned' ? 'text-orange-500 font-black border-b-2 border-orange-500 pb-1' : 'text-slate-400 hover:text-slate-700'">Assigned</button>
            <button @click="appointmentTab = 'schedule'" :class="appointmentTab === 'schedule' ? 'text-orange-500 font-black border-b-2 border-orange-500 pb-1' : 'text-slate-400 hover:text-slate-700'">My Schedule</button>
          </div>

          <!-- Appointments List -->
          <div class="space-y-3">
            <div v-for="app in filteredAppointments" :key="app.id" class="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 hover:bg-slate-100/60 transition">
              <h4 class="text-xs font-bold text-slate-900">{{ app.title }}</h4>
              <p class="text-[10px] text-slate-400 font-medium leading-tight">{{ app.address }}</p>
            </div>
          </div>
        </div>

        <!-- 4. FAQ Directory CRUD Card -->
        <div class="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-slate-900">FAQ Database</h3>
              <p class="text-[11px] text-slate-400">Support question entries</p>
            </div>
            <button @click="openFAQModal()" class="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-full shadow-sm transition">
              + Add FAQ
            </button>
          </div>

          <div class="divide-y divide-slate-100 max-h-56 overflow-y-auto">
            <div v-for="f in faqs" :key="f.id" class="py-2.5 flex items-center justify-between text-xs">
              <div class="truncate max-w-[200px]">
                <span class="font-bold text-slate-900 block truncate">{{ f.question }}</span>
                <span class="text-[10px] text-slate-400 truncate block">{{ f.answer }}</span>
              </div>
              <div class="flex items-center gap-1.5 flex-shrink-0">
                <button @click="openFAQModal(f)" class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold">Edit</button>
                <button @click="handleDeleteFAQ(f.id)" class="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold">Delete</button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- FAQ Modal -->
    <div v-if="showFAQModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 space-y-4">
        <div class="flex justify-between items-center pb-3 border-b border-slate-100">
          <h3 class="text-base font-bold text-slate-900">{{ modalMode === 'create' ? 'Create FAQ Entry' : 'Edit FAQ Entry' }}</h3>
          <button @click="showFAQModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>
        <form @submit.prevent="handleSaveFAQ" class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">Question</label>
            <input type="text" v-model="faqForm.question" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">Answer</label>
            <textarea v-model="faqForm.answer" required rows="3" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition resize-none"></textarea>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">Sort Order</label>
            <input type="number" v-model="faqForm.sort_order" min="0" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition" />
          </div>
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" @click="showFAQModal = false" class="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md">Save FAQ</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/propertyStore'
import { useProjectStore } from '@/stores/projectStore'
import { useFaqStore } from '@/stores/faqStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const propertyStore = usePropertyStore()
const projectStore = useProjectStore()
const faqStore = useFaqStore()
const authStore = useAuthStore()

const analyticsPeriod = ref('last_month')
const tableSearchQuery = ref('')
const activeDate = ref('10')
const appointmentTab = ref('all')

const alertMsg = ref('')
const alertIsError = ref(false)

const showFAQModal = ref(false)
const modalMode = ref('create')
const selectedFaqId = ref(null)
const faqForm = ref({ question: '', answer: '', sort_order: 0 })
const faqs = ref([])

const dateStrip = [
  { date: '08', day: 'Sun' },
  { date: '09', day: 'Mon' },
  { date: '10', day: 'Tue' },
  { date: '11', day: 'Wed' },
  { date: '12', day: 'Thu' },
  { date: '13', day: 'Fri' },
  { date: '14', day: 'Sat' }
]

const appointments = [
  { id: 1, title: 'Visit Client Michael Reynolds', address: '2464 Royal Ln. Mesa, New Jersey 45463' },
  { id: 2, title: 'Visit Client Sarah Thompson', address: '2118 Thornridge Cir. Syracuse, Connecticut 35624' },
  { id: 3, title: 'Follow Up Aaliyah Lovato', address: 'nathan.roberts@example.com' }
]

const filteredAppointments = computed(() => appointments)

const sampleListings = [
  {
    id: 1,
    title: 'Maison Sterling',
    location: 'New York, Albany',
    type: 'House',
    units: 14,
    cost: '$2.5M',
    leadAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    ],
    leadCount: 42,
    views: 145,
    status: '8/12 Occupied',
    statusClass: 'bg-orange-100 text-orange-800'
  },
  {
    id: 2,
    title: 'The Orchid',
    location: 'Ohio, Columbus',
    type: 'Villa',
    units: 8500,
    cost: '$420K',
    leadAvatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    ],
    leadCount: 25,
    views: 985,
    status: 'Available',
    statusClass: 'bg-orange-100 text-orange-800'
  },
  {
    id: 3,
    title: 'Echelon West',
    location: 'Ohio, Columbus',
    type: 'House',
    units: 20,
    cost: '$900K',
    leadAvatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
    ],
    leadCount: 70,
    views: 555,
    status: 'Available',
    statusClass: 'bg-orange-100 text-orange-800'
  },
  {
    id: 4,
    title: 'La Residence',
    location: 'Ohio, Columbus',
    type: 'Apartment',
    units: 19,
    cost: '$400K',
    leadAvatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
    ],
    leadCount: 11,
    views: 521,
    status: 'Sold Out',
    statusClass: 'bg-rose-100 text-rose-700'
  }
]

const filteredActiveListings = computed(() => {
  if (!tableSearchQuery.value) return sampleListings
  const q = tableSearchQuery.value.toLowerCase()
  return sampleListings.filter(l => l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q) || l.type.toLowerCase().includes(q))
})

onMounted(async () => {
  await refreshData()
})

async function refreshData() {
  await Promise.all([
    propertyStore.fetchProperties(),
    projectStore.fetchProjects(),
    fetchFAQs()
  ])
}

async function fetchFAQs() {
  const res = await faqStore.fetchFAQs()
  if (res.success) {
    faqs.value = res.data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  }
}

function openFAQModal(f = null) {
  if (f) {
    modalMode.value = 'edit'
    selectedFaqId.value = f.id
    faqForm.value = { question: f.question, answer: f.answer, sort_order: f.sort_order || 0 }
  } else {
    modalMode.value = 'create'
    faqForm.value = { question: '', answer: '', sort_order: 0 }
  }
  showFAQModal.value = true
}

async function handleSaveFAQ() {
  try {
    if (modalMode.value === 'create') {
      const res = await faqStore.addFAQ(faqForm.value)
      if (res.success) {
        showFAQModal.value = false
        fetchFAQs()
      }
    } else {
      const res = await faqStore.updateFAQ(selectedFaqId.value, faqForm.value)
      if (res.success) {
        showFAQModal.value = false
        fetchFAQs()
      }
    }
  } catch (err) {
    console.error('FAQ save error:', err)
  }
}

async function handleDeleteFAQ(id) {
  if (!confirm('Delete this FAQ?')) return
  const res = await faqStore.deleteFAQ(id)
  if (res.success) fetchFAQs()
}
</script>

<style scoped>
.admin-dashboard {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
</style>
