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
    name: 'AdminDashboard',
    component: () => import('../views/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/properties',
    name: 'AdminPropertyList',
    component: () => import('../views/admin/AdminPropertyList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/properties/new',
    name: 'AdminPropertyForm',
    component: () => import('../views/admin/AdminPropertyForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/properties/:id',
    name: 'AdminPropertyEdit',
    component: () => import('../views/admin/AdminPropertyForm.vue'),
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/admin/appointments',
    name: 'AdminAppointments',
    component: () => import('../views/admin/AdminAppointments.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/bookings',
    name: 'AdminBookings',
    component: () => import('../views/admin/AdminBookings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/projects',
    name: 'AdminProjectList',
    component: () => import('../views/admin/AdminProjectList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/projects/new',
    name: 'AdminProjectForm',
    component: () => import('../views/admin/AdminProjectForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/projects/:id',
    name: 'AdminProjectEdit',
    component: () => import('../views/admin/AdminProjectForm.vue'),
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/AdminLogin.vue')
  },

  // Auth Routes
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue')
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

// Route guard with auth store
router.beforeEach(async (to, from, next) => {
  // Dynamically import authStore to avoid circular dependencies
  const { useAuthStore } = await import('../stores/authStore')
  const authStore = useAuthStore()
  
  const isAuth = authStore.isAuthenticated
  
  // Redirect to login for protected routes
  if (to.meta.requiresAuth && !isAuth) {
    next({
      name: 'AdminLogin',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // Redirect to dashboard if already logged in and trying to access login
  if (to.name === 'AdminLogin' && isAuth) {
    next('/admin')
    return
  }
  
  // For admin routes, ensure we have authentication
  if (to.path.startsWith('/admin') && to.name !== 'AdminLogin' && !isAuth) {
    next({ name: 'AdminLogin', query: { redirect: to.fullPath } })
    return
  }
  
  next()
})

// Set page titles
router.afterEach((to) => {
  // Use meta title or generate from route name
  const title = to.meta?.title || 
    (to.name ? to.name.replace(/([A-Z])/g, ' $1').trim() : 'Page')
  
  document.title = `${title} | KSA Valuers Admin`
})

export default router