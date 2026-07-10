import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // Public Routes
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about-us',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/Projects.vue')
  },
  {
    path: '/contact-us',
    name: 'Contact',
    component: () => import('../views/Contact.vue')
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/Blog.vue')
  },
  {
    path: '/book-a-tour',
    name: 'BookTour',
    component: () => import('../views/BookTour.vue')
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('../views/FAQ.vue')
  },
  {
    path: '/properties',
    name: 'PropertiesPage',
    component: () => import('../views/PropertiesPage.vue')
  },
  {
    path: '/properties/:id',
    name: 'PropertyDetail',
    component: () => import('../views/PropertyDetail.vue'),
    props: true
  },
  {
    path: '/ongoing-projects',
    name: 'OngoingProjects',
    component: () => import('../views/OngoingProjects.vue')
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import('../views/Team.vue')
  },
  {
    path: '/principal-partner',
    name: 'PrincipalPartner',
    component: () => import('../views/PrincipalPartner.vue')
  },
  // Admin Routes
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'AdminDashboard', component: () => import('../views/admin/AdminDashboard.vue') },
      { path: 'properties', name: 'AdminPropertyList', component: () => import('../views/admin/AdminPropertyList.vue') },
      { path: 'properties/new', name: 'AdminPropertyForm', component: () => import('../views/admin/AdminPropertyForm.vue') },
      { path: 'properties/:id', name: 'AdminPropertyEdit', component: () => import('../views/admin/AdminPropertyForm.vue'), props: true },
      { path: 'appointments', name: 'AdminAppointments', component: () => import('../views/admin/AdminAppointments.vue') },
      { path: 'bookings', name: 'AdminBookings', component: () => import('../views/admin/AdminBookings.vue') },
      { path: 'projects', name: 'AdminProjectList', component: () => import('../views/admin/AdminProjectList.vue') },
      { path: 'projects/new', name: 'AdminProjectForm', component: () => import('../views/admin/AdminProjectForm.vue') },
      { path: 'projects/:id', name: 'AdminProjectEdit', component: () => import('../views/admin/AdminProjectForm.vue'), props: true },
      { path: 'slides', name: 'AdminSlideList', component: () => import('../views/admin/AdminSlideList.vue') },
      { path: 'slides/new', name: 'AdminSlideForm', component: () => import('../views/admin/AdminSlideForm.vue') },
      { path: 'slides/:id', name: 'AdminSlideEdit', component: () => import('../views/admin/AdminSlideForm.vue'), props: true },
      { path: 'team', name: 'AdminTeamList', component: () => import('../views/admin/AdminTeamList.vue') },
      { path: 'team/new', name: 'AdminTeamForm', component: () => import('../views/admin/AdminTeamForm.vue') },
      { path: 'team/:id', name: 'AdminTeamEdit', component: () => import('../views/admin/AdminTeamForm.vue'), props: true }
    ]
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/AdminLogin.vue')
  },

  // Auth Routes
  {
    path: '/login',
    redirect: '/admin/login'
  },
  {
    path: '/register',
    redirect: '/admin/login'
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/auth/ForgotPassword.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/auth/ResetPassword.vue')
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('../views/auth/Onboarding.vue')
  },

  // User Routes
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/user/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-bookings',
    name: 'MyBookings',
    component: () => import('../views/user/MyBookings.vue'),
    meta: { requiresAuth: true }
  },
  
  
  
  // ── PMS Dashboard Routes ──────────────────────────────────────────────────
  {
    path: '/dashboard/management',
    name: 'ManagementDashboard',
    component: () => import('../views/dashboard/ManagementDashboard.vue'),
    meta: {
      requiresAuth: true,
      allowedRoles: ['admin', 'manager', 'management'],
      title: 'Management Portal'
    }
  },
  {
    path: '/dashboard/owner',
    name: 'OwnerDashboard',
    component: () => import('../views/dashboard/OwnerDashboard.vue'),
    meta: {
      requiresAuth: true,
      allowedRoles: ['propertyowner'],
      title: 'Owner Portal'
    }
  },
  {
    path: '/dashboard/tenant',
    name: 'TenantDashboard',
    component: () => import('../views/dashboard/TenantDashboard.vue'),
    meta: {
      requiresAuth: true,
      allowedRoles: ['tenant'],
      title: 'Tenant Portal'
    }
  },

  // Catch-all 404 route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Role → home dashboard mapping
const roleDashboardMap = {
  admin:         '/admin',
  manager:       '/dashboard/management',
  management:    '/dashboard/management',
  propertyowner: '/dashboard/owner',
  tenant:        '/dashboard/tenant',
}

// One-time session load flag to avoid re-hitting /api/v1/auth/me on every nav
let _sessionLoaded = false

// Route guard with auth store
router.beforeEach(async (to, from, next) => {
  const { useAuthStore } = await import('../stores/authStore')
  const authStore = useAuthStore()

  // Only call loadSession once per app lifecycle
  if (!_sessionLoaded) {
    await authStore.loadSession()
    _sessionLoaded = true
  }

  const isAuth   = authStore.isAuthenticated
  const userRole = authStore.user?.role

  // Redirect already-authenticated users away from login pages to their portal
  const loginPaths = ['/admin/login', '/login']
  if (loginPaths.includes(to.path) && isAuth) {
    next(roleDashboardMap[userRole] || '/admin')
    return
  }

  // Unauthenticated → /admin/login (always, for all protected routes)
  if (to.meta.requiresAuth && !isAuth) {
    next(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`)
    return
  }

  // Role-based access: wrong role → own dashboard
  if (to.meta.requiresAuth && to.meta.allowedRoles) {
    if (!to.meta.allowedRoles.includes(userRole)) {
      next(roleDashboardMap[userRole] || '/')
      return
    }
  }

  next()
})

// Set page titles
router.afterEach((to) => {
  // Use meta title or generate from route name
  const title = to.meta?.title || 
    (to.name ? to.name.replace(/([A-Z])/g, ' $1').trim() : 'Page')
  
  const suffix = to.path.startsWith('/admin') ? 'KSA Valuers Admin' : 'KSA Valuers'
  document.title = `${title} | ${suffix}`
})

export default router