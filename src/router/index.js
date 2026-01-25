import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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
    path: '/all-properties',
    name: 'PropertyList',
    component: () => import('../views/PropertyList.vue')
  },
  // PROPERTY DETAIL ROUTE:
  {
    path: '/property/:id',
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
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/AdminLogin.vue')
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/AdminDashboard.vue'),
    meta: { requiresAuth: true }
  },
  // ADMIN ROUTES:
  {
    path: '/admin/properties',
    name: 'AdminProperties',
    component: () => import('../components/admin/AdminPropertyList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/bookings',
    name: 'AdminBookings',
    component: () => import('../components/admin/AdminBookings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/property/add',
    name: 'AddProperty',
    component: () => import('../components/admin/AdminPropertyForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/property/edit/:id',
    name: 'EditProperty',
    component: () => import('../components/admin/AdminPropertyForm.vue'),
    props: true,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Authentication check function
const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true'
}

// Route guard for protected routes
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (isAuthenticated()) {
      next()
    } else {
      // Redirect to login if not authenticated
      next('/admin/login')
    }
  } else {
    next()
  }
})

export default router