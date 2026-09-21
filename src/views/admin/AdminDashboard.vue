<template>
  <div class="admin-dashboard space-y-6 max-w-[1600px] mx-auto text-slate-800 font-sans">
    
    <!-- ── 1. Sub-Header: Title & Far-Right Action Icon Group ──── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
      <!-- Title & Subtitle (Clean Far-Left Title without Back Arrow) -->
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight font-sans">Estate Management</h1>
        <p class="text-xs text-slate-500 font-normal">Live Operation Metrics & Property Control System</p>
      </div>

      <!-- Action Button Group (Aligned Far Right) -->
      <div class="flex items-center gap-2">
        <button @click="refreshData" class="w-9 h-9 rounded-lg bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-2xs" title="Refresh Live Data">
          <svg class="w-4 h-4" :class="{'animate-spin': loadingData}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
        </button>
        <router-link to="/dashboard/admin/properties/new" class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          <span>Add Property</span>
        </router-link>
        <button @click="openFAQModal()" class="w-9 h-9 rounded-lg bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-2xs" title="Manage FAQs">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.01" /></svg>
        </button>
      </div>
    </div>

    <!-- ── 2. Standardized KPI Metric Bar (Routed & Clickable SaaS Tiles) ──── -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- Card 1: Total Properties (Routes to /dashboard/admin/properties) -->
      <div
        @click="router.push('/dashboard/admin/properties')"
        class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-sm flex items-center justify-between cursor-pointer group transition-all"
        title="View All Property Listings"
      >
        <div class="space-y-0.5">
          <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block group-hover:text-slate-700 transition">Total Properties</span>
          <p class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">{{ livePropertiesCount }}</p>
          <p class="text-xs font-normal text-slate-500 pt-0.5">{{ livePropertiesCount }} Total &bull; 0 Added this month</p>
        </div>
        <div class="w-9 h-9 rounded-lg bg-slate-100/80 text-slate-600 group-hover:text-slate-900 group-hover:bg-slate-200/80 flex items-center justify-center border border-slate-200/60 flex-shrink-0 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5v3m-6 0h6" />
          </svg>
        </div>
      </div>

      <!-- Card 2: Viewing Bookings (Opens Interactive Schedule Modal) -->
      <div
        @click="showBookingsModal = true"
        class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-sm flex items-center justify-between cursor-pointer group transition-all"
        title="Manage Viewing Appointments"
      >
        <div class="space-y-0.5">
          <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block group-hover:text-slate-700 transition">Viewing Bookings</span>
          <p class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">{{ liveBookingsCount }}</p>
          <p class="text-xs font-normal text-slate-500 pt-0.5">{{ liveBookingsCount }} Bookings &bull; {{ pendingBookingsCount }} Pending review</p>
        </div>
        <div class="w-9 h-9 rounded-lg bg-slate-100/80 text-slate-600 group-hover:text-slate-900 group-hover:bg-slate-200/80 flex items-center justify-center border border-slate-200/60 flex-shrink-0 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>
      </div>

      <!-- Card 3: Ongoing Projects (Routes to /dashboard/admin/projects) -->
      <div
        @click="router.push('/dashboard/admin/projects')"
        class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-sm flex items-center justify-between cursor-pointer group transition-all"
        title="View All Development Projects"
      >
        <div class="space-y-0.5">
          <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block group-hover:text-slate-700 transition">Ongoing Projects</span>
          <p class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">{{ liveProjectsCount }}</p>
          <p class="text-xs font-normal text-slate-500 pt-0.5">{{ liveProjectsCount }} Projects &bull; {{ activeProjectsCount }} In development</p>
        </div>
        <div class="w-9 h-9 rounded-lg bg-slate-100/80 text-slate-600 group-hover:text-slate-900 group-hover:bg-slate-200/80 flex items-center justify-center border border-slate-200/60 flex-shrink-0 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 01-3.586 0 2.548 2.548 0 010-3.586l5.653-4.655m3.788-3.412a4.5 4.5 0 00-6.364-6.364l1.757 1.757m13.356 13.356l1.757 1.757" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Alert Notification Banner -->
    <div v-if="alertMsg" :class="['p-4 rounded-xl border text-xs font-medium flex items-center justify-between shadow-2xs transition-all', alertIsError ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800']">
      <div class="flex items-center gap-2.5">
        <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ alertMsg }}</span>
      </div>
      <button @click="alertMsg = ''" class="text-slate-400 hover:text-slate-700">&times;</button>
    </div>

    <!-- ── 3. Main Dashboard Layout (Linear/SaaS Style) ────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- ── LEFT COLUMN (Analytics, Marquee, Property Directory) ── -->
      <div class="lg:col-span-7 xl:col-span-8 space-y-6">
        
        <!-- 1. Sales Analytics Dual-Line Chart Card -->
        <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 class="text-base font-semibold text-slate-900 font-sans">Valuation & Sales Analytics</h3>
              <p class="text-xs text-slate-500 font-normal">Quarterly inquiry volume and revenue metrics</p>
            </div>
            <div class="flex items-center gap-3">
              <!-- Header Dynamic Legend Pill -->
              <div class="hidden sm:flex items-center gap-3 text-xs font-medium bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span class="text-slate-500">Revenue:</span>
                  <span class="text-slate-900 font-semibold">{{ currentPeriodMetrics.revenue }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span class="text-slate-500">Inquiries:</span>
                  <span class="text-slate-900 font-semibold">{{ currentPeriodMetrics.inquiries }}</span>
                </div>
              </div>
              <div class="relative">
                <select v-model="analyticsPeriod" class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none cursor-pointer hover:bg-slate-100 transition">
                  <option value="last_month">Last Month</option>
                  <option value="this_quarter">This Quarter</option>
                  <option value="this_year">This Year</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Dual-Line SVG Chart Container -->
          <div class="relative pt-2 pb-2">
            <svg class="w-full h-48 sm:h-56 overflow-visible" viewBox="0 0 700 200">
              <defs>
                <linearGradient id="incomeGradKSA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f96816" stop-opacity="0.08"/>
                  <stop offset="100%" stop-color="#f96816" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="expenseGradKSA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2563eb" stop-opacity="0.06"/>
                  <stop offset="100%" stop-color="#2563eb" stop-opacity="0"/>
                </linearGradient>
              </defs>

              <line x1="0" y1="20" x2="700" y2="20" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3 3" />
              <line x1="0" y1="70" x2="700" y2="70" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3 3" />
              <line x1="0" y1="120" x2="700" y2="120" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3 3" />
              <line x1="0" y1="170" x2="700" y2="170" stroke="#e2e8f0" stroke-width="1" />

              <path :d="currentPeriodMetrics.revPath" fill="url(#incomeGradKSA)" />
              <path :d="currentPeriodMetrics.inqPath" fill="url(#expenseGradKSA)" />

              <path :d="currentPeriodMetrics.revPathStroke" fill="none" stroke="#f96816" stroke-width="2" stroke-linecap="round" />
              <path :d="currentPeriodMetrics.inqPathStroke" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" />

              <circle :cx="currentPeriodMetrics.dotX" :cy="currentPeriodMetrics.dotY" r="4" fill="#f96816" stroke="#ffffff" stroke-width="2" />
            </svg>

            <div class="flex justify-between text-[11px] font-medium text-slate-400 pt-2 px-1">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span class="text-slate-900 font-semibold">Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        <!-- 2. Multi-Tile Horizontal Slider Marquee Card -->
        <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-semibold text-slate-900 flex items-center gap-2">
                <span>Featured Property Marquee</span>
                <span class="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded-md">Interactive</span>
              </h3>
              <p class="text-xs text-slate-500 font-normal">Auto-glide ticker with pause-on-hover & manual navigation</p>
            </div>
            <!-- Slider Controls with Lucide Icons -->
            <div class="flex items-center gap-1.5">
              <button
                @click="toggleMarqueePause"
                class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition flex items-center gap-1.5"
                :title="isMarqueePaused ? 'Resume Auto-Glide' : 'Pause Auto-Glide'"
              >
                <svg v-if="isMarqueePaused" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                <span>{{ isMarqueePaused ? 'Play' : 'Pause' }}</span>
              </button>
              <button @click="scrollMarqueeLeft" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition" title="Scroll Left">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
              <button @click="scrollMarqueeRight" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition" title="Scroll Right">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
          </div>

          <!-- Slider Container with Soft Edge Fade Masks -->
          <div class="relative group">
            <!-- Edge Fade Masks -->
            <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <!-- Scrollable Track -->
            <div
              ref="marqueeTrack"
              @mouseenter="isHovered = true"
              @mouseleave="isHovered = false"
              class="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 cursor-grab active:cursor-grabbing"
            >
              <div
                v-for="prop in activeDisplayProperties"
                :key="prop.id"
                @click="router.push(`/dashboard/admin/properties/edit/${prop.id}`)"
                class="min-w-[270px] max-w-[290px] bg-white border border-slate-200/80 rounded-xl p-3.5 flex-shrink-0 hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all space-y-2.5"
              >
                <div class="relative rounded-lg overflow-hidden h-36 bg-slate-100">
                  <img :src="prop.image_url || prop.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'" class="w-full h-full object-cover" />
                  <span class="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-white font-medium text-[10px] rounded-md">
                    {{ prop.status || 'For Sale' }}
                  </span>
                  <span class="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-900/90 text-white font-semibold text-xs rounded-md shadow-2xs">
                    {{ prop.price || 'Contact for Price' }}
                  </span>
                </div>
                <div>
                  <h4 class="text-xs font-semibold text-slate-900 truncate">{{ prop.title }}</h4>
                  <p class="text-[11px] text-slate-500 truncate">{{ prop.location || 'Lekki Phase 1, Lagos' }}</p>
                </div>
                <!-- Clean Lucide SVG Specs -->
                <div class="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100 font-medium">
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2 12h20M2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6M4 12V8a2 2 0 012-2h12a2 2 0 012 2v4M8 12v-2a1 1 0 011-1h6a1 1 0 011 1v2" /></svg>
                    {{ prop.bedrooms || 4 }} Beds
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M6 12V6a2 2 0 012-2h8a2 2 0 012 2v6" /></svg>
                    {{ prop.bathrooms || 3 }} Baths
                  </span>
                  <span class="text-slate-900 font-semibold flex items-center gap-1 hover:text-orange-600 transition">
                    View
                    <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Active Listings Table Card -->
        <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 class="text-base font-semibold text-slate-900">Active Property Directory</h3>
              <p class="text-xs text-slate-500 font-normal">Manage live properties directly from PostgreSQL state</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="relative">
                <input
                  type="text"
                  v-model="tableSearchQuery"
                  placeholder="Search listings..."
                  class="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-300 focus:bg-white transition w-48"
                />
                <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              </div>
              <router-link to="/dashboard/admin/properties" class="p-1.5 text-slate-500 hover:text-slate-900 transition" title="View Full Property Directory">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              </router-link>
            </div>
          </div>

          <!-- Table Container -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-200/80 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  <th class="py-2.5 px-2">Property</th>
                  <th class="py-2.5 px-2">Type</th>
                  <th class="py-2.5 px-2">Price</th>
                  <th class="py-2.5 px-2">Status</th>
                  <th class="py-2.5 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs">
                <tr v-for="item in filteredActiveListings" :key="item.id" class="hover:bg-slate-50/60 transition-colors cursor-pointer" @click="router.push(`/dashboard/admin/properties/edit/${item.id}`)">
                  <td class="py-3 px-2 flex items-center gap-3">
                    <img :src="item.image_url || item.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80'" class="w-9 h-9 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                    <div>
                      <span class="font-semibold text-slate-900 block leading-tight">{{ item.title }}</span>
                      <span class="text-[11px] text-slate-400 block">{{ item.location || 'Lekki Phase 1, Lagos' }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-2 text-slate-600 font-medium">{{ item.type || 'Residential' }}</td>
                  <td class="py-3 px-2 font-semibold text-slate-900">{{ item.price || '₦150M' }}</td>
                  <td class="py-3 px-2">
                    <span :class="['px-2.5 py-0.5 rounded-md text-[10px] font-medium inline-block border', item.status === 'For Sale' ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-blue-50 text-blue-700 border-blue-200/60']">
                      {{ item.status || 'Active' }}
                    </span>
                  </td>
                  <td class="py-3 px-2 text-right" @click.stop>
                    <router-link :to="`/dashboard/admin/properties/edit/${item.id}`" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-medium transition">
                      Edit
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- ── RIGHT COLUMN (Appointments, FAQ Database) ────────── -->
      <div class="lg:col-span-5 xl:col-span-4 space-y-6">
        
        <!-- 1. Upcoming Viewing Appointments -->
        <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-slate-900">Viewing Appointments</h3>
            <button @click="showBookingsModal = true" class="px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-[11px] font-medium rounded-md transition" title="Open Schedule Manager">
              Live Schedule &rarr;
            </button>
          </div>

          <!-- Appointments List with Lucide Icons -->
          <div class="space-y-2.5">
            <div
              v-for="app in liveBookingsList"
              :key="app.id"
              @click="toggleBookingStatus(app)"
              class="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/60 space-y-1.5 hover:border-slate-300 transition-all cursor-pointer"
              title="Click to toggle status (Pending / Confirmed)"
            >
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-semibold text-slate-900">{{ app.name || app.title || 'Site Tour Appointment' }}</h4>
                <span :class="['px-2 py-0.5 rounded-md text-[10px] font-medium border uppercase tracking-wider', app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60']">
                  {{ app.status || 'pending' }}
                </span>
              </div>
              <p class="text-xs text-slate-500 font-normal leading-tight">{{ app.email || app.address || 'client@ksavaluers.com' }}</p>
              <div class="text-[11px] font-medium text-slate-400 pt-1 flex items-center gap-3">
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                  {{ app.booking_date || '2026-09-25' }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {{ app.preferred_time || '10:00 AM' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. FAQ Directory Management Card -->
        <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-semibold text-slate-900">FAQ Management</h3>
              <p class="text-xs text-slate-500 font-normal">Support question database</p>
            </div>
            <button @click="openFAQModal()" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-2xs transition-colors">
              + Add FAQ
            </button>
          </div>

          <div class="divide-y divide-slate-100 max-h-56 overflow-y-auto">
            <div v-for="f in faqs" :key="f.id" class="py-2.5 flex items-center justify-between text-xs">
              <div class="truncate max-w-[200px]">
                <span class="font-semibold text-slate-900 block truncate">{{ f.question }}</span>
                <span class="text-[11px] text-slate-500 truncate block">{{ f.answer }}</span>
              </div>
              <div class="flex items-center gap-1.5 flex-shrink-0">
                <button @click="openFAQModal(f)" class="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-medium transition">Edit</button>
                <button @click="handleDeleteFAQ(f.id)" class="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 rounded-md text-[11px] font-medium transition">Delete</button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- ── Interactive Viewing Bookings Schedule Modal Overlay ── -->
    <div v-if="showBookingsModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 border border-slate-200 space-y-4">
        <div class="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base font-semibold text-slate-900">Viewing Appointments Manager</h3>
            <p class="text-xs text-slate-500 font-normal">Review and change appointment statuses</p>
          </div>
          <button @click="showBookingsModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div v-for="app in liveBookingsList" :key="app.id" class="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h4 class="text-xs font-semibold text-slate-900">{{ app.name || app.title }}</h4>
                <span :class="['px-2 py-0.5 rounded-md text-[10px] font-medium border uppercase', app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60']">
                  {{ app.status || 'pending' }}
                </span>
              </div>
              <p class="text-xs text-slate-500">{{ app.email }} &bull; {{ app.booking_date || '2026-09-25' }} at {{ app.preferred_time || '10:00 AM' }}</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                @click="toggleBookingStatus(app)"
                class="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition shadow-2xs"
              >
                {{ app.status === 'confirmed' ? 'Mark Pending' : 'Approve & Confirm' }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-2 border-t border-slate-100">
          <button @click="showBookingsModal = false" class="px-4 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-200 transition">
            Close Schedule
          </button>
        </div>
      </div>
    </div>

    <!-- FAQ Modal Overlay -->
    <div v-if="showFAQModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
        <div class="flex justify-between items-center pb-3 border-b border-slate-100">
          <h3 class="text-sm font-semibold text-slate-900">{{ modalMode === 'create' ? 'Create FAQ Entry' : 'Edit FAQ Entry' }}</h3>
          <button @click="showFAQModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>
        <form @submit.prevent="handleSaveFAQ" class="space-y-3 text-xs">
          <div>
            <label class="block font-medium text-slate-700 mb-1 uppercase tracking-wider text-[10px]">Question</label>
            <input type="text" v-model="faqForm.question" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-300 focus:bg-white transition" />
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1 uppercase tracking-wider text-[10px]">Answer</label>
            <textarea v-model="faqForm.answer" required rows="3" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-300 focus:bg-white transition resize-none"></textarea>
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1 uppercase tracking-wider text-[10px]">Sort Order</label>
            <input type="number" v-model="faqForm.sort_order" min="0" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-300 focus:bg-white transition" />
          </div>
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" @click="showFAQModal = false" class="px-3.5 py-1.5 bg-slate-100 text-slate-700 font-medium rounded-lg text-xs">Cancel</button>
            <button type="submit" class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs shadow-2xs">Save FAQ</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/propertyStore'
import { useProjectStore } from '@/stores/projectStore'
import { useBookingStore } from '@/stores/bookingStore'
import { useFaqStore } from '@/stores/faqStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const propertyStore = usePropertyStore()
const projectStore = useProjectStore()
const bookingStore = useBookingStore()
const faqStore = useFaqStore()
const authStore = useAuthStore()

const loadingData = ref(false)
const analyticsPeriod = ref('last_month')
const tableSearchQuery = ref('')

const alertMsg = ref('')
const alertIsError = ref(false)

const showFAQModal = ref(false)
const showBookingsModal = ref(false)
const modalMode = ref('create')
const selectedFaqId = ref(null)
const faqForm = ref({ question: '', answer: '', sort_order: 0 })
const faqs = ref([])

// Marquee Control State (Rule [user_global])
const marqueeTrack = ref(null)
const isHovered = ref(false)
const isMarqueePaused = ref(false)
let marqueeInterval = null

// Live Data Computeds
const livePropertiesCount = computed(() => propertyStore.properties?.length || 0)
const liveBookingsCount = computed(() => bookingStore.bookings?.length || 0)
const liveProjectsCount = computed(() => projectStore.projects?.length || 0)

const pendingBookingsCount = computed(() => {
  const list = bookingStore.bookings?.length ? bookingStore.bookings : fallbackBookings
  return list.filter(b => b.status === 'pending').length
})

const activeProjectsCount = computed(() => {
  return projectStore.projects?.filter(p => p.status === 'ongoing' || p.status === 'active').length || 0
})

// Dynamic Reactive Analytics Metrics based on selected Period
const currentPeriodMetrics = computed(() => {
  if (analyticsPeriod.value === 'this_quarter') {
    return {
      revenue: '₦1.42B',
      inquiries: '3,890',
      dotX: 550,
      dotY: 40,
      revPath: 'M 0,160 Q 100,80 200,90 T 400,30 T 600,40 L 700,45 L 700,170 L 0,170 Z',
      inqPath: 'M 0,170 Q 100,130 200,140 T 400,90 T 600,110 L 700,120 L 700,170 L 0,170 Z',
      revPathStroke: 'M 0,160 Q 100,80 200,90 T 400,30 T 600,40 L 700,45',
      inqPathStroke: 'M 0,170 Q 100,130 200,140 T 400,90 T 600,110 L 700,120'
    }
  } else if (analyticsPeriod.value === 'this_year') {
    return {
      revenue: '₦5.68B',
      inquiries: '14,250',
      dotX: 620,
      dotY: 15,
      revPath: 'M 0,170 Q 100,100 200,60 T 400,40 T 600,15 L 700,20 L 700,170 L 0,170 Z',
      inqPath: 'M 0,175 Q 100,140 200,110 T 400,80 T 600,50 L 700,55 L 700,170 L 0,170 Z',
      revPathStroke: 'M 0,170 Q 100,100 200,60 T 400,40 T 600,15 L 700,20',
      inqPathStroke: 'M 0,175 Q 100,140 200,110 T 400,80 T 600,50 L 700,55'
    }
  }
  // default last_month
  return {
    revenue: '₦485.2M',
    inquiries: '1,240',
    dotX: 400,
    dotY: 20,
    revPath: 'M 0,140 Q 100,60 200,70 T 400,20 T 600,60 L 700,65 L 700,170 L 0,170 Z',
    inqPath: 'M 0,160 Q 100,120 200,130 T 400,110 T 600,130 L 700,140 L 700,170 L 0,170 Z',
    revPathStroke: 'M 0,140 Q 100,60 200,70 T 400,20 T 600,60 L 700,65',
    inqPathStroke: 'M 0,160 Q 100,120 200,130 T 400,110 T 600,130 L 700,140'
  }
})

const activeDisplayProperties = computed(() => {
  if (propertyStore.properties && propertyStore.properties.length > 0) {
    return propertyStore.properties
  }
  return fallbackProperties
})

const liveBookingsList = computed(() => {
  if (bookingStore.bookings && bookingStore.bookings.length > 0) {
    return bookingStore.bookings.slice(0, 5)
  }
  return fallbackBookings
})

const filteredActiveListings = computed(() => {
  const list = activeDisplayProperties.value
  if (!tableSearchQuery.value) return list
  const q = tableSearchQuery.value.toLowerCase()
  return list.filter(p => (p.title || '').toLowerCase().includes(q) || (p.location || '').toLowerCase().includes(q))
})

// Fallback Mock Data for Empty Databases
const fallbackProperties = [
  { id: 1, title: 'Maison Sterling Duplex', location: 'Ikoyi, Lagos', type: 'Duplex', price: '₦350,000,000', status: 'For Sale', bedrooms: 5, bathrooms: 6 },
  { id: 2, title: 'The Orchid Residence', location: 'Lekki Phase 1, Lagos', type: 'Apartment', price: '₦120,000,000', status: 'For Sale', bedrooms: 3, bathrooms: 3 },
  { id: 3, title: 'Echelon West Penthouse', location: 'Victoria Island, Lagos', type: 'Penthouse', price: '₦450,000,000', status: 'For Sale', bedrooms: 4, bathrooms: 5 },
  { id: 4, title: 'La Residence Heights', location: 'Banana Island, Lagos', type: 'Villa', price: '₦850,000,000', status: 'For Sale', bedrooms: 6, bathrooms: 7 }
]

const fallbackBookings = [
  { id: 1, name: 'Michael Reynolds', email: 'm.reynolds@example.com', title: 'Site Visit: Maison Sterling', booking_date: '2026-09-24', preferred_time: '11:00 AM', status: 'confirmed' },
  { id: 2, name: 'Sarah Thompson', email: 'sarah.t@example.com', title: 'Virtual Tour: The Orchid', booking_date: '2026-09-25', preferred_time: '02:00 PM', status: 'pending' },
  { id: 3, name: 'Aaliyah Lovato', email: 'a.lovato@example.com', title: 'Listing Appraisal Meeting', booking_date: '2026-09-26', preferred_time: '10:00 AM', status: 'confirmed' }
]

onMounted(async () => {
  await refreshData()
  startMarqueeTicker()
})

onUnmounted(() => {
  if (marqueeInterval) clearInterval(marqueeInterval)
})

async function refreshData() {
  loadingData.value = true
  try {
    await Promise.all([
      propertyStore.fetchProperties(),
      projectStore.fetchProjects(),
      bookingStore.loadBookings(),
      fetchFAQs()
    ])
  } catch (err) {
    console.error('Error refreshing dashboard data:', err)
  } finally {
    loadingData.value = false
  }
}

function toggleBookingStatus(app) {
  app.status = app.status === 'confirmed' ? 'pending' : 'confirmed'
}

// Marquee Auto-Glide Ticker Implementation
function startMarqueeTicker() {
  marqueeInterval = setInterval(() => {
    if (!isHovered.value && !isMarqueePaused.value && marqueeTrack.value) {
      marqueeTrack.value.scrollLeft += 1
      if (marqueeTrack.value.scrollLeft >= marqueeTrack.value.scrollWidth - marqueeTrack.value.clientWidth - 2) {
        marqueeTrack.value.scrollLeft = 0
      }
    }
  }, 30)
}

function scrollMarqueeLeft() {
  if (marqueeTrack.value) marqueeTrack.value.scrollLeft -= 260
}

function scrollMarqueeRight() {
  if (marqueeTrack.value) marqueeTrack.value.scrollLeft += 260
}

function toggleMarqueePause() {
  isMarqueePaused.value = !isMarqueePaused.value
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
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
