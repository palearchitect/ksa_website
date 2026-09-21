<template>
  <!-- Desktop Navigation -->
  <nav v-if="!mobile" class="desktop-nav">
    <!-- Brand Logo (No Pill Container) -->
    <router-link
      to="/"
      class="nav-brand-logo flex items-center pl-2 pr-3 py-1 transition-opacity hover:opacity-85 flex-shrink-0"
      title="KSA Valuers"
      @click="handleNavigate"
    >
      <img
        src="@/assets/images/logo.png"
        class="h-7 lg:h-8 w-auto filter drop-shadow-sm brightness-110"
        alt="KSA Valuers Logo"
      />
    </router-link>

    <div class="h-4 w-[1px] bg-white/20 mr-1.5 hidden lg:block"></div>

    <router-link
      to="/"
      class="nav-link"
      :class="{ 'nav-link-active': isActiveRoute('/') }"
      @click="handleNavigate"
    >
      <HomeIcon class="nav-icon" />
      Home
    </router-link>

    <!-- About Dropdown -->
    <div class="nav-dropdown-group" @mouseenter="openDropdown('about')" @mouseleave="closeDropdown('about')">
      <button class="nav-link nav-link-with-arrow">
        <InformationCircleIcon class="nav-icon" />
        About
        <ChevronDownIcon class="dropdown-arrow" :class="{ 'dropdown-arrow-open': openDropdownId === 'about' }" />
      </button>
      
      <div v-show="openDropdownId === 'about'" class="dropdown-menu">
        <router-link 
          to="/about-us" 
          class="dropdown-link" 
          :class="{ 'dropdown-link-active': isActiveRoute('/about-us') }" 
          @click="handleNavigate"
        >
          About Overview
        </router-link>
        <router-link 
          to="/team" 
          class="dropdown-link" 
          :class="{ 'dropdown-link-active': isActiveRoute('/team') }" 
          @click="handleNavigate"
        >
          <UserGroupIcon class="dropdown-icon" />
          Our Team
        </router-link>
        <router-link 
          to="/principal-partner" 
          class="dropdown-link" 
          :class="{ 'dropdown-link-active': isActiveRoute('/principal-partner') }" 
          @click="handleNavigate"
        >
          <UsersIcon class="dropdown-icon" />
          Principal Partner
        </router-link>
        <router-link 
          to="/faq" 
          class="dropdown-link" 
          :class="{ 'dropdown-link-active': isActiveRoute('/faq') }" 
          @click="handleNavigate"
        >
          <QuestionMarkCircleIcon class="dropdown-icon" />
          FAQ
        </router-link>
      </div>
    </div>

    <!-- Projects Dropdown -->
    <div class="nav-dropdown-group" @mouseenter="openDropdown('projects')" @mouseleave="closeDropdown('projects')">
      <button class="nav-link nav-link-with-arrow">
        <BuildingOfficeIcon class="nav-icon" />
        Projects
        <ChevronDownIcon class="dropdown-arrow" :class="{ 'dropdown-arrow-open': openDropdownId === 'projects' }" />
      </button>
      
      <div v-show="openDropdownId === 'projects'" class="dropdown-menu">
        <router-link 
          to="/projects" 
          class="dropdown-link" 
          :class="{ 'dropdown-link-active': isActiveRoute('/projects') }" 
          @click="handleNavigate"
        >
          Projects Overview
        </router-link>
        <router-link 
          to="/properties" 
          class="dropdown-link" 
          :class="{ 'dropdown-link-active': isActiveRoute('/properties') }"
          @click="handleNavigate"
        >
          <BuildingStorefrontIcon class="dropdown-icon" />
          All Properties
        </router-link>
        <router-link 
          to="/ongoing-projects" 
          class="dropdown-link" 
          :class="{ 'dropdown-link-active': isActiveRoute('/ongoing-projects') }" 
          @click="handleNavigate"
        >
          <CheckCircleIcon class="dropdown-icon" />
          Ongoing Projects
        </router-link>
      </div>
    </div>

    <!-- Blog -->
    <router-link
      to="/blog"
      class="nav-link"
      :class="{ 'nav-link-active': isActiveRoute('/blog') }"
      @click="handleNavigate"
    >
      <NewspaperIcon class="nav-icon" />
      Blog
    </router-link>

    <!-- Book Tour (CTA) -->
    <router-link
      to="/book-a-tour"
      class="nav-cta"
      :class="{ 'nav-cta-active': isActiveRoute('/book-a-tour') }"
      @click="handleNavigate"
    >
      <CalendarDaysIcon class="nav-icon" />
      Book Tour
    </router-link>

    <!-- Contact -->
    <router-link
      to="/contact-us"
      class="nav-link"
      :class="{ 'nav-link-active': isActiveRoute('/contact-us') }"
      @click="handleNavigate"
    >
      <EnvelopeIcon class="nav-icon" />
      Contact
    </router-link>

    <!-- Portal / Sign In (Dynamic) -->
    <router-link
      v-if="isAuthenticated"
      :to="portalPath"
      class="nav-admin"
      :class="{ 'nav-admin-active': isActiveRoute(portalPath) }"
      @click="handleNavigate"
    >
      <Cog6ToothIcon class="nav-icon" />
      My Portal
    </router-link>
    <router-link
      v-else
      to="/login"
      class="nav-admin"
      :class="{ 'nav-admin-active': isActiveRoute('/login') }"
      @click="handleNavigate"
    >
      <Cog6ToothIcon class="nav-icon" />
      Sign In
    </router-link>
  </nav>

  <!-- Mobile Navigation -->
  <nav v-else class="mobile-nav">
    <!-- Mobile Header -->
    <div class="mobile-nav-header">
      <h3 class="mobile-nav-title">Navigation</h3>
      <slot name="close-button"></slot>
    </div>

    <div class="mobile-nav-content">
      <div v-for="section in mobileSections" :key="section.id" class="mobile-section">
        <!-- Standalone Mobile Links -->
        <router-link
          v-if="section.type === 'link'"
          :to="section.to"
          class="mobile-link"
          :class="{ 'mobile-link-active': isActiveRoute(section.to) }"
          @click="handleNavigate"
        >
          <component :is="section.icon" class="mobile-icon" />
          {{ section.label }}
        </router-link>

        <!-- Dropdown Sections -->
        <div v-else-if="section.type === 'dropdown'" class="mobile-dropdown">
          <button
            @click="toggleMobileDropdown(section.id)"
            class="mobile-dropdown-header"
          >
            <component :is="section.icon" class="mobile-icon" />
            {{ section.label }}
            <ChevronDownIcon class="mobile-dropdown-arrow" :class="{ 'mobile-dropdown-arrow-open': openMobileDropdownId === section.id }" />
          </button>
          
          <div v-show="openMobileDropdownId === section.id" class="mobile-dropdown-content">
            <router-link
              v-for="item in section.children"
              :key="item.to"
              :to="item.to"
              class="mobile-dropdown-item"
              :class="{ 'mobile-dropdown-item-active': isActiveRoute(item.to) }"
              @click="handleNavigate"
            >
              <component v-if="item.icon" :is="item.icon" class="mobile-dropdown-icon" />
              {{ item.label }}
            </router-link>
          </div>
        </div>

        <!-- CTA Button -->
        <router-link
          v-else-if="section.type === 'cta'"
          :to="section.to"
          class="mobile-cta"
          :class="{ 'mobile-cta-active': isActiveRoute(section.to) }"
          @click="handleNavigate"
        >
          <component :is="section.icon" class="mobile-icon" />
          {{ section.label }}
        </router-link>
      </div>

      <!-- Mobile Portal / Sign In (Dynamic) -->
      <router-link
        v-if="isAuthenticated"
        :to="portalPath"
        class="mobile-admin"
        :class="{ 'mobile-admin-active': isActiveRoute(portalPath) }"
        @click="handleNavigate"
      >
        <Cog6ToothIcon class="mobile-icon" />
        My Portal
      </router-link>
      <router-link
        v-else
        to="/login"
        class="mobile-admin"
        :class="{ 'mobile-admin-active': isActiveRoute('/login') }"
        @click="handleNavigate"
      >
        <Cog6ToothIcon class="mobile-icon" />
        Sign In
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const userRole = computed(() => authStore.user?.role)

const roleDashboardMap = {
  admin:         '/dashboard/admin',
  webadmin:      '/dashboard/admin',
  manager:       '/dashboard/admin',
  management:    '/dashboard/admin',
  propertyowner: '/dashboard/admin',
  tenant:        '/dashboard/admin',
}

const portalPath = computed(() => roleDashboardMap[userRole.value] || '/admin/login')

// Import Heroicons
import {
  HomeIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  UserGroupIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  NewspaperIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  mobile: {
    type: Boolean,
    default: false
  },
  showAdmin: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['navigate'])
const route = useRoute()

// State
const openDropdownId = ref(null)
const openMobileDropdownId = ref(null)

// Improved route matching function
const isActiveRoute = (path) => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

// Mobile navigation structure
const mobileSections = computed(() => [
  {
    id: 'home',
    type: 'link',
    label: 'Home',
    to: '/',
    icon: HomeIcon
  },
  {
    id: 'about',
    type: 'dropdown',
    label: 'About',
    icon: InformationCircleIcon,
    children: [
      { to: '/about-us', label: 'About Overview' },
      { to: '/team', label: 'Our Team', icon: UserGroupIcon },
      { to: '/principal-partner', label: 'Principal Partner', icon: UsersIcon },
      { to: '/faq', label: 'FAQ', icon: QuestionMarkCircleIcon }
    ]
  },
  {
    id: 'projects',
    type: 'dropdown',
    label: 'Projects',
    icon: BuildingOfficeIcon,
    children: [
      { to: '/projects', label: 'Projects Overview' },
      { to: '/properties', label: 'All Properties', icon: BuildingStorefrontIcon },
      { to: '/ongoing-projects', label: 'Ongoing Projects', icon: CheckCircleIcon }
    ]
  },
  {
    id: 'blog',
    type: 'link',
    label: 'Blog',
    to: '/blog',
    icon: NewspaperIcon
  },
  {
    id: 'book-tour',
    type: 'cta',
    label: 'Book Tour',
    to: '/book-a-tour',
    icon: CalendarDaysIcon
  },
  {
    id: 'contact',
    type: 'link',
    label: 'Contact',
    to: '/contact-us',
    icon: EnvelopeIcon
  }
])

// Desktop dropdown functions
const openDropdown = (id) => {
  openDropdownId.value = id
}

const closeDropdown = (id) => {
  if (openDropdownId.value === id) {
    openDropdownId.value = null
  }
}

// Mobile dropdown functions
const toggleMobileDropdown = (id) => {
  openMobileDropdownId.value = openMobileDropdownId.value === id ? null : id
}

// Navigation handler
const handleNavigate = () => {
  emit('navigate')
  openDropdownId.value = null
  openMobileDropdownId.value = null
}

// Close dropdown when clicking outside (for desktop)
const handleClickOutside = (event) => {
  if (!event.target.closest('.nav-dropdown-group') && openDropdownId.value) {
    openDropdownId.value = null
  }
}

// Listen for click outside on mount
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>

<style scoped>
/* Desktop Pill Navigation */
.desktop-nav {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 4px 6px;
  background: rgba(3, 8, 16, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.4), 0 0 15px rgba(27, 77, 132, 0.15);
  position: relative;
  z-index: 40;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 6px 14px;
  color: #e2e8f0; /* Off-white text */
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.01em;
  border-radius: 9999px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
  cursor: pointer;
  position: relative;
}

.nav-link:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.12);
}

.nav-link-active {
  color: #ffffff;
  background: linear-gradient(135deg, rgba(27, 77, 132, 0.85) 0%, rgba(37, 99, 235, 0.85) 100%);
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.nav-link-with-arrow {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-family: inherit;
  cursor: pointer;
}

.nav-icon {
  width: 15px;
  height: 15px;
  margin-right: 6px;
  opacity: 0.85;
}

.dropdown-arrow {
  width: 14px;
  height: 14px;
  margin-left: 4px;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0.7;
}

.dropdown-arrow-open {
  transform: rotate(180deg);
}

.nav-dropdown-group {
  position: relative;
  z-index: 45;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  min-width: 210px;
  background: rgba(3, 8, 16, 0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1.25rem;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.15);
  padding: 8px;
  z-index: 50;
  animation: dropdownIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes dropdownIn {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dropdown-link {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  color: #cbd5e1; /* Off-white */
  font-size: 13px;
  font-weight: 500;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.dropdown-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(2px);
}

.dropdown-link-active {
  color: #f97316;
  background-color: rgba(249, 115, 22, 0.12);
  font-weight: 600;
}

.dropdown-icon {
  width: 15px;
  height: 15px;
  margin-right: 8px;
  color: #f96816;
}

.nav-cta {
  display: flex;
  align-items: center;
  padding: 6px 16px;
  background: linear-gradient(135deg, #f96816 0%, #ea580c 50%, #1b4d84 120%);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-decoration: none;
  border-radius: 9999px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  margin-left: 4px;
  box-shadow: 0 4px 14px rgba(249, 104, 22, 0.35);
  position: relative;
  z-index: 45;
}

.nav-cta:hover {
  background: linear-gradient(135deg, #ea580c 0%, #c2410c 50%, #123966 120%);
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 6px 20px rgba(249, 104, 22, 0.45);
}

.nav-cta-active {
  background: linear-gradient(135deg, #0f294a, #0a1d35);
}

.nav-admin {
  display: flex;
  align-items: center;
  padding: 6px 14px;
  color: #f1f5f9;
  font-size: 13px;
  font-weight: 600;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
  margin-left: 2px;
}

.nav-admin:hover {
  border-color: rgba(249, 104, 22, 0.5);
  background: rgba(249, 104, 22, 0.15);
  color: #fb923c;
}

.nav-admin-active {
  background: linear-gradient(135deg, #0f172a 0%, #1b4d84 100%);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

/* Mobile Frosted Bento Drawer */
.mobile-nav {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  max-width: 85vw;
  height: 100vh;
  background: rgba(7, 19, 36, 0.95);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  z-index: 100;
  box-shadow: -15px 0 40px rgba(0, 0, 0, 0.6);
}

.mobile-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.mobile-nav-title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #f8fafc;
}

.mobile-nav-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mobile-section {
  position: relative;
}

.mobile-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
  position: relative;
}

.mobile-link:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.07);
}

.mobile-link-active {
  color: #ffffff;
  background: linear-gradient(135deg, rgba(27, 77, 132, 0.6) 0%, rgba(249, 104, 22, 0.4) 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-weight: 700;
}

.mobile-icon {
  width: 18px;
  height: 18px;
  margin-right: 12px;
  color: #f96816;
}

.mobile-dropdown {
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.mobile-dropdown-header {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
  z-index: 5;
}

.mobile-dropdown-header:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.05);
}

.mobile-dropdown-arrow {
  width: 14px;
  height: 14px;
  margin-left: auto;
  transition: transform 0.25s ease;
}

.mobile-dropdown-arrow-open {
  transform: rotate(180deg);
}

.mobile-dropdown-content {
  padding: 6px 8px 8px 36px;
  background-color: rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 1;
  animation: slideDown 0.2s ease-out;
}

.mobile-dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 8px;
  margin: 2px 0;
  transition: all 0.2s ease;
  position: relative;
}

.mobile-dropdown-item:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.08);
}

.mobile-dropdown-item-active {
  color: #f97316;
  font-weight: 600;
}

.mobile-dropdown-icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
}

.mobile-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f96816 0%, #ea580c 50%, #1b4d84 100%);
  color: white;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  border-radius: 9999px;
  margin-top: 12px;
  box-shadow: 0 4px 16px rgba(249, 104, 22, 0.35);
  transition: all 0.2s ease;
  position: relative;
}

.mobile-cta:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}

.mobile-admin {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 9999px;
  margin-top: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.mobile-admin:hover {
  border-color: rgba(249, 104, 22, 0.5);
  color: #f97316;
}

.mobile-admin-active {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 500px;
  }
}

/* Focus States */
.nav-link:focus,
.nav-link-with-arrow:focus,
.nav-cta:focus,
.nav-admin:focus,
.mobile-link:focus,
.mobile-dropdown-header:focus,
.mobile-dropdown-item:focus,
.mobile-cta:focus,
.mobile-admin:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Responsive */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  
  .mobile-nav {
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100vh;
    z-index: 110;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
  }
}

@media (min-width: 769px) {
  .mobile-nav {
    display: none;
  }
}

/* Scrollbar for mobile */
.mobile-nav-content::-webkit-scrollbar {
  width: 6px;
}

.mobile-nav-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.mobile-nav-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.mobile-nav-content::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Keep header stack simple and predictable */
</style>