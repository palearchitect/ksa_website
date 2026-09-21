<template>
  <div class="admin-dashboard space-y-6 max-w-[1600px] mx-auto text-slate-800">
    
    <!-- ── Sub-Header: Title & Quick Metrics (High Contrast Editorial Style) ──── -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/85 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm">
      <!-- Title & Action Tools -->
      <div class="flex items-center gap-3 sm:gap-4 flex-wrap">
        <button @click="router.back()" class="w-10 h-10 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center transition shadow-sm" title="Go Back">
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Estate Management</h1>
          <p class="text-xs font-semibold text-slate-400">Live Operation Metrics & Property Control System</p>
        </div>

        <!-- Action Cluster Icons -->
        <div class="hidden xl:flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-2xl border border-slate-200/80 ml-3">
          <button @click="refreshData" class="p-1.5 text-slate-600 hover:text-orange-600 rounded-xl hover:bg-white transition" title="Refresh Live Data">
            <svg class="w-4 h-4" :class="{'animate-spin': loadingData}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
          </button>
          <router-link to="/dashboard/admin/properties/new" class="p-1.5 text-slate-600 hover:text-orange-600 rounded-xl hover:bg-white transition" title="Add New Property">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </router-link>
          <button @click="showFAQModal = true" class="p-1.5 text-slate-600 hover:text-orange-600 rounded-xl hover:bg-white transition" title="Manage FAQs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.01" /></svg>
          </button>
        </div>
      </div>

      <!-- Live KPI Pills -->
      <div class="flex items-center gap-3 flex-wrap sm:flex-nowrap">
        <!-- Active Properties Pill -->
        <div class="bg-slate-950 text-white px-5 py-3 rounded-2xl border border-slate-800 flex items-center gap-4 flex-1 sm:flex-initial shadow-md">
          <div class="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black text-sm">
            🏠
          </div>
          <div>
            <span class="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">Properties</span>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xl font-black text-white leading-none">{{ livePropertiesCount }}</span>
              <span class="px-2 py-0.5 bg-orange-500/20 text-orange-400 font-extrabold text-[10px] rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>

        <!-- Viewing Bookings Pill -->
        <div class="bg-white px-5 py-3 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4 flex-1 sm:flex-initial">
          <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">
            📅
          </div>
          <div>
            <span class="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">Viewing Bookings</span>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xl font-black text-slate-950 leading-none">{{ liveBookingsCount }}</span>
              <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-extrabold text-[10px] rounded-full">
                Live
              </span>
            </div>
          </div>
        </div>

        <!-- Projects Pill -->
        <div class="bg-white px-5 py-3 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4 flex-1 sm:flex-initial">
          <div class="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black text-sm">
            🏗️
          </div>
          <div>
            <span class="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">Projects</span>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xl font-black text-slate-950 leading-none">{{ liveProjectsCount }}</span>
              <span class="px-2 py-0.5 bg-orange-100 text-orange-700 font-extrabold text-[10px] rounded-full">
                Ongoing
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Notification Banner -->
    <div v-if="alertMsg" :class="['p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-sm transition-all', alertIsError ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800']">
      <div class="flex items-center gap-2.5">
        <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ alertMsg }}</span>
      </div>
      <button @click="alertMsg = ''" class="text-slate-400 hover:text-slate-700">&times;</button>
    </div>

    <!-- ── Main Bento Grid Layout (High Contrast Editorial) ────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- ── LEFT COLUMN (Sales Analytics, Multi-Tile Slider Marquee, Active Table) ── -->
      <div class="lg:col-span-7 xl:col-span-8 space-y-6">
        
        <!-- 1. Sales Analytics Dual-Line Chart Card -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-black text-slate-950">Valuation & Sales Analytics</h3>
              <p class="text-xs font-semibold text-slate-400">Quarterly inquiry volume and revenue metrics</p>
            </div>
            <div class="relative">
              <select v-model="analyticsPeriod" class="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer hover:bg-slate-100 transition">
                <option value="last_month">Last Month</option>
                <option value="this_quarter">This Quarter</option>
                <option value="this_year">This Year</option>
              </select>
            </div>
          </div>

          <!-- Dual-Line SVG Chart Container -->
          <div class="relative pt-4 pb-2">
            <!-- Floating Tooltip Legend -->
            <div class="absolute top-2 right-4 sm:right-12 bg-slate-950 text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-4 text-xs font-bold z-10">
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-orange-500"></span>
                <span class="text-slate-400">Revenue</span>
                <span class="text-white font-extrabold ml-1">₦485.2M</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-blue-500"></span>
                <span class="text-slate-400">Inquiries</span>
                <span class="text-white font-extrabold ml-1">1,240</span>
              </div>
            </div>

            <svg class="w-full h-48 sm:h-56 overflow-visible" viewBox="0 0 700 200">
              <defs>
                <linearGradient id="incomeGradKSA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f96816" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="#f96816" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="expenseGradKSA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2563eb" stop-opacity="0.2"/>
                  <stop offset="100%" stop-color="#2563eb" stop-opacity="0"/>
                </linearGradient>
              </defs>

              <line x1="0" y1="20" x2="700" y2="20" stroke="#f1f5f9" stroke-width="1.5" stroke-dasharray="4 4" />
              <line x1="0" y1="70" x2="700" y2="70" stroke="#f1f5f9" stroke-width="1.5" stroke-dasharray="4 4" />
              <line x1="0" y1="120" x2="700" y2="120" stroke="#f1f5f9" stroke-width="1.5" stroke-dasharray="4 4" />
              <line x1="0" y1="170" x2="700" y2="170" stroke="#cbd5e1" stroke-width="1.5" />

              <path d="M 0,140 Q 100,60 200,70 T 400,20 T 600,60 L 700,65 L 700,170 L 0,170 Z" fill="url(#incomeGradKSA)" />
              <path d="M 0,160 Q 100,120 200,130 T 400,110 T 600,130 L 700,140 L 700,170 L 0,170 Z" fill="url(#expenseGradKSA)" />

              <path d="M 0,140 Q 100,60 200,70 T 400,20 T 600,60 L 700,65" fill="none" stroke="#f96816" stroke-width="4" stroke-linecap="round" />
              <path d="M 0,160 Q 100,120 200,130 T 400,110 T 600,130 L 700,140" fill="none" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round" />

              <circle cx="400" cy="20" r="7" fill="#f96816" stroke="#ffffff" stroke-width="3" />
            </svg>

            <div class="flex justify-between text-[11px] font-bold text-slate-400 pt-2 px-1">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span class="text-orange-600 font-black">Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        <!-- 2. Multi-Tile Horizontal Slider Marquee Card (Mandatory Rule [user_global]) -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-black text-slate-950 flex items-center gap-2">
                <span>Featured Property Marquee</span>
                <span class="px-2.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-extrabold rounded-full">Interactive</span>
              </h3>
              <p class="text-xs font-semibold text-slate-400">Auto-glide ticker with pause-on-hover & manual navigation</p>
            </div>
            <!-- Slider Controls -->
            <div class="flex items-center gap-2">
              <button @click="toggleMarqueePause" class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition" :title="isMarqueePaused ? 'Resume Auto-Glide' : 'Pause Auto-Glide'">
                <span class="text-xs font-black">{{ isMarqueePaused ? '▶ Play' : '⏸ Pause' }}</span>
              </button>
              <button @click="scrollMarqueeLeft" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center font-bold text-sm transition shadow-sm">
                ←
              </button>
              <button @click="scrollMarqueeRight" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center font-bold text-sm transition shadow-sm">
                →
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
              class="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 cursor-grab active:cursor-grabbing"
            >
              <div
                v-for="prop in activeDisplayProperties"
                :key="prop.id"
                class="min-w-[280px] max-w-[300px] bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex-shrink-0 hover:border-orange-500 hover:shadow-md transition-all duration-300 space-y-3"
              >
                <div class="relative rounded-xl overflow-hidden h-36">
                  <img :src="prop.image_url || prop.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'" class="w-full h-full object-cover" />
                  <span class="absolute top-2 left-2 px-2.5 py-0.5 bg-slate-950/80 backdrop-blur-md text-white font-extrabold text-[10px] rounded-full">
                    {{ prop.status || 'For Sale' }}
                  </span>
                  <span class="absolute bottom-2 right-2 px-2.5 py-0.5 bg-orange-500 text-white font-black text-xs rounded-lg shadow-md">
                    {{ prop.price || 'Contact for Price' }}
                  </span>
                </div>
                <div>
                  <h4 class="text-sm font-black text-slate-950 truncate">{{ prop.title }}</h4>
                  <p class="text-[11px] font-semibold text-slate-500 truncate">{{ prop.location || 'Lekki Phase 1, Lagos' }}</p>
                </div>
                <div class="flex items-center justify-between text-[11px] font-bold text-slate-600 pt-1 border-t border-slate-200/60">
                  <span>🛏 {{ prop.bedrooms || 4 }} Beds</span>
                  <span>🚿 {{ prop.bathrooms || 3 }} Baths</span>
                  <router-link :to="`/properties/${prop.id}`" class="text-orange-600 font-extrabold hover:underline">View →</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Active Listings Table Card -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 class="text-lg font-black text-slate-950">Active Property Directory</h3>
              <p class="text-xs font-semibold text-slate-400">Manage live properties directly from PostgreSQL state</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="relative">
                <input
                  type="text"
                  v-model="tableSearchQuery"
                  placeholder="Search listings..."
                  class="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500 focus:bg-white transition w-48"
                />
                <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              </div>
              <router-link to="/dashboard/admin/properties" class="p-1.5 text-slate-600 hover:text-orange-600 transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              </router-link>
            </div>
          </div>

          <!-- Table Container -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th class="py-3 px-2">Property</th>
                  <th class="py-3 px-2">Type</th>
                  <th class="py-3 px-2">Price</th>
                  <th class="py-3 px-2">Status</th>
                  <th class="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs font-semibold">
                <tr v-for="item in filteredActiveListings" :key="item.id" class="hover:bg-slate-50 transition-colors">
                  <td class="py-3.5 px-2 flex items-center gap-3">
                    <img :src="item.image_url || item.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80'" class="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0" />
                    <div>
                      <span class="font-black text-slate-950 block leading-tight">{{ item.title }}</span>
                      <span class="text-[10px] font-medium text-slate-400 block">{{ item.location || 'Lekki Phase 1, Lagos' }}</span>
                    </div>
                  </td>
                  <td class="py-3.5 px-2 text-slate-600 font-bold">{{ item.type || 'Residential' }}</td>
                  <td class="py-3.5 px-2 font-black text-slate-950">{{ item.price || '₦150M' }}</td>
                  <td class="py-3.5 px-2">
                    <span :class="['px-3 py-1 rounded-full text-[10px] font-black inline-block', item.status === 'For Sale' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700']">
                      {{ item.status || 'Active' }}
                    </span>
                  </td>
                  <td class="py-3.5 px-2 text-right space-x-1">
                    <router-link :to="`/dashboard/admin/properties/edit/${item.id}`" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg text-[10px] font-bold transition">
                      Edit
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- ── RIGHT COLUMN (Appointments, Reminders, FAQ Database) ────────── -->
      <div class="lg:col-span-5 xl:col-span-4 space-y-6">
        
        <!-- 1. Upcoming Viewing Appointments -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-black text-slate-950">Viewing Appointments</h3>
            <span class="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-extrabold rounded-full">Live Schedule</span>
          </div>

          <!-- Appointments List -->
          <div class="space-y-3">
            <div v-for="app in liveBookingsList" :key="app.id" class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1 hover:border-orange-400 transition">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black text-slate-950">{{ app.name || app.title || 'Site Tour Appointment' }}</h4>
                <span :class="['px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase', app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700']">
                  {{ app.status || 'pending' }}
                </span>
              </div>
              <p class="text-[11px] text-slate-500 font-medium leading-tight">{{ app.email || app.address || 'client@ksavaluers.com' }}</p>
              <div class="text-[10px] font-bold text-slate-400 pt-1 flex items-center gap-2">
                <span>📅 {{ app.booking_date || '2026-09-25' }}</span>
                <span>⏰ {{ app.preferred_time || '10:00 AM' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. FAQ Directory CRUD Card -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-black text-slate-950">FAQ Management</h3>
              <p class="text-[11px] text-slate-400">Support question database</p>
            </div>
            <button @click="openFAQModal()" class="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition">
              + Add FAQ
            </button>
          </div>

          <div class="divide-y divide-slate-100 max-h-56 overflow-y-auto">
            <div v-for="f in faqs" :key="f.id" class="py-2.5 flex items-center justify-between text-xs">
              <div class="truncate max-w-[200px]">
                <span class="font-bold text-slate-950 block truncate">{{ f.question }}</span>
                <span class="text-[10px] text-slate-400 truncate block">{{ f.answer }}</span>
              </div>
              <div class="flex items-center gap-1.5 flex-shrink-0">
                <button @click="openFAQModal(f)" class="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-lg text-[10px] font-bold">Edit</button>
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
          <h3 class="text-base font-black text-slate-950">{{ modalMode === 'create' ? 'Create FAQ Entry' : 'Edit FAQ Entry' }}</h3>
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
            <button type="submit" class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md">Save FAQ</button>
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
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

