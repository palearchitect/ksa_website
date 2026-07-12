<template>
  <!-- Desktop Navigation -->
  <nav v-if="!mobile" class="desktop-nav">
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
  manager:       '/',
  management:    '/',
  propertyowner: '/',
  tenant:        '/',
}

const portalPath = computed(() => roleDashboardMap[userRole.value] || '/admin')

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
/* Desktop Navigation - FIXED Z-INDEX */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
  z-index: 30;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  color: #4b5563;
  font-weight: 500;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s;
  text-decoration: none;
  cursor: pointer;
  position: relative;
}

.nav-link:hover {
  color: #1b4d84;
  background-color: #f3f4f6;
}

.nav-link-active {
  color: #1b4d84;
  background-color: #e8eff8;
  font-weight: 600;
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
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  margin-left: 4px;
  transition: transform 0.2s ease;
}

.dropdown-arrow-open {
  transform: rotate(180deg);
}

.nav-dropdown-group {
  position: relative;
  z-index: 35;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: 200px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 6px 0;
  z-index: 40;
  animation: fadeIn 0.15s ease-out;
}

.dropdown-link {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  color: #4b5563;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.dropdown-link:hover {
  color: #1b4d84;
  background-color: #f8fafc;
}

.dropdown-link-active {
  color: #1b4d84;
  background-color: #e8eff8;
  font-weight: 600;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.nav-cta {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: linear-gradient(135deg, #1b4d84, #0f294a);
  color: white;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  margin-left: 8px;
  position: relative;
  z-index: 9999; /* Increased from 100 */
}

.nav-cta:hover {
  background: linear-gradient(135deg, #0f294a, #0a1d35);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(27, 77, 132, 0.3);
}

.nav-cta-active {
  background: linear-gradient(135deg, #0f294a, #0a1d35);
}

.nav-admin {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  color: #7c3aed;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  margin-left: 8px;
  position: relative;
  z-index: 9999; /* Increased from 100 */
}

.nav-admin:hover {
  background-color: #f5f3ff;
}

.nav-admin-active {
  background-color: #f5f3ff;
  font-weight: 600;
}

/* Mobile Navigation */
.mobile-nav {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  position: relative;
  z-index: 50;
}

.mobile-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.mobile-nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.mobile-nav-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  position: relative;
}

.mobile-section {
  margin-bottom: 4px;
  position: relative;
}

.mobile-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #4b5563;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.mobile-link:hover {
  background-color: #f3f4f6;
}

.mobile-link-active {
  color: #1b4d84;
  background-color: #e8eff8;
  font-weight: 600;
}

.mobile-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
}

.mobile-dropdown {
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: white;
}

.mobile-dropdown-header {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: #4b5563;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
  z-index: 5;
}

.mobile-dropdown-header:hover {
  background-color: #f3f4f6;
}

.mobile-dropdown-arrow {
  width: 16px;
  height: 16px;
  margin-left: auto;
  transition: transform 0.2s ease;
}

.mobile-dropdown-arrow-open {
  transform: rotate(180deg);
}

.mobile-dropdown-content {
  padding: 8px 0 8px 48px;
  background-color: #f9fafb;
  position: relative;
  z-index: 1;
  animation: slideDown 0.2s ease-out;
}

.mobile-dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: #6b7280;
  font-size: 14px;
  text-decoration: none;
  border-radius: 6px;
  margin: 2px 0;
  transition: all 0.2s ease;
  position: relative;
}

.mobile-dropdown-item:hover {
  color: #1b4d84;
  background-color: white;
}

.mobile-dropdown-item-active {
  color: #1b4d84;
  background-color: white;
  font-weight: 600;
}

.mobile-dropdown-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.mobile-cta {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #1b4d84, #0f294a);
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  margin-top: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.mobile-cta:hover {
  background: linear-gradient(135deg, #0f294a, #0a1d35);
}

.mobile-cta-active {
  background: linear-gradient(135deg, #0f294a, #0a1d35);
}

.mobile-admin {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #7c3aed;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 8px;
  margin-top: 8px;
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
  position: relative;
}

.mobile-admin:hover {
  background-color: #f5f3ff;
}

.mobile-admin-active {
  background-color: #f5f3ff;
  font-weight: 600;
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