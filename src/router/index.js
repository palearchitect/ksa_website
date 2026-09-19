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
  // Admin Routes (Handles Website Content Assets for Admins & Webadmins)
  {
    path: '/dashboard/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, allowedRoles: ['admin', 'webadmin'] },
    children: [
      { path: '', name: 'AdminDashboard', component: () => import('../views/admin/AdminDashboard.vue') },
      { path: 'slides', name: 'AdminSlideList', component: () => import('../views/admin/AdminSlideList.vue') },
      { path: 'slides/new', name: 'AdminSlideForm', component: () => import('../views/admin/AdminSlideForm.vue') },
      { path: 'slides/:id', name: 'AdminSlideEdit', component: () => import('../views/admin/AdminSlideForm.vue'), props: true },
      { path: 'team', name: 'AdminTeamList', component: () => import('../views/admin/AdminTeamList.vue') },
      { path: 'team/new', name: 'AdminTeamForm', component: () => import('../views/admin/AdminTeamForm.vue') },
      { path: 'team/:id', name: 'AdminTeamEdit', component: () => import('../views/admin/AdminTeamForm.vue'), props: true },
      { path: 'properties', name: 'AdminPropertyList', component: () => import('../views/admin/AdminPropertyList.vue') },
      { path: 'properties/new', name: 'AdminPropertyForm', component: () => import('../views/admin/AdminPropertyForm.vue') },
      { path: 'properties/:id', name: 'AdminPropertyEdit', component: () => import('../views/admin/AdminPropertyForm.vue'), props: true },
      { path: 'projects', name: 'AdminProjectList', component: () => import('../views/admin/AdminProjectList.vue') },
      { path: 'projects/new', name: 'AdminProjectForm', component: () => import('../views/admin/AdminProjectForm.vue') },
      { path: 'projects/:id', name: 'AdminProjectEdit', component: () => import('../views/admin/AdminProjectForm.vue'), props: true }
    ]
  },
  // Admin login and Clerk Auth sub-routes (SSO Callbacks, Verify Email Address, Factor One, etc.)
  {
    path: '/admin/login/:pathMatch(.*)*',
    name: 'AdminLoginSub',
    component: () => import('../views/admin/AdminLogin.vue')
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/AdminLogin.vue')
  },
  {
    path: '/sso-callback',
    name: 'SSOCallback',
    component: () => import('../views/admin/AdminLogin.vue')
  },
  {
    path: '/dashboard/admin/login/:pathMatch(.*)*',
    redirect: to => `/admin/login/${to.params.pathMatch || ''}`
  },
  {
    path: '/dashboard/webadmin',
    redirect: '/dashboard/admin'
  },
  {
    path: '/dashboard/webadmin/:catchAll(.*)',
    redirect: to => `/dashboard/admin/${to.params.catchAll}`
  },
  {
    path: '/admin',
    redirect: '/dashboard/admin'
  },
  {
    path: '/admin/:catchAll(.*)',
    redirect: to => `/dashboard/admin/${to.params.catchAll}`
  },

  // Auth Routes
  {
    path: '/login',
    redirect: '/admin/login'
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
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('../views/auth/Onboarding.vue')
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: () => import('../views/auth/VerifyEmail.vue')
  },

  // Profile and Settings (Accessible by all logged in roles)
  {
    path: '/dashboard/profile',
    name: 'UserProfile',
    component: () => import('../views/auth/Profile.vue'),
    meta: { requiresAuth: true, title: 'My Profile Settings' }
  },

  // Privacy Policy and Terms of Service
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import('../views/PrivacyPolicy.vue')
  },
  {
    path: '/terms-of-service',
    name: 'TermsOfService',
    component: () => import('../views/TermsOfService.vue')
  },
  {
    path: '/sentry-test',
    name: 'SentryTest',
    component: {
      render() { return null },
      mounted() {
        import('@sentry/vue').then(Sentry => {
          Sentry.captureMessage('KSA Valuers Verification Test Event');
          console.log('🧪 Triggering Sentry verification exception...');
          window.myUndefinedFunction();
        });
      }
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
  admin:         '/dashboard/admin',
  webadmin:      '/dashboard/admin',
  manager:       '/',
  management:    '/',
  propertyowner: '/',
  tenant:        '/',
}

import { useAuthStore } from '../stores/authStore'

// One-time session load flag to avoid re-hitting /api/v1/auth/me on every nav
let _sessionLoaded = false

// Route guard with auth store
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Only call loadSession once per app lifecycle
  if (!_sessionLoaded) {
    _sessionLoaded = true
    if (to.meta.requiresAuth) {
      await authStore.loadSession()
    } else {
      // Trigger in background for public pages without blocking navigation
      authStore.loadSession().catch(() => {})
    }
  }

  const isAuth   = authStore.isAuthenticated
  const userRole = authStore.user?.role

  // Suspended Account Check (instant deboarding redirection)
  if (isAuth && authStore.user?.status === 'suspended') {
    await authStore.logout()
    next('/admin/login?error=suspended')
    return
  }

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

// Set page titles & track analytics
router.afterEach((to) => {
  // Use meta title or generate from route name
  const title = to.meta?.title || 
    (to.name ? to.name.replace(/([A-Z])/g, ' $1').trim() : 'Page')
  
  const suffix = to.path.startsWith('/admin') ? 'KSA Valuers Admin' : 'KSA Valuers'
  document.title = `${title} | ${suffix}`

  // PostHog Pageview tracking
  try {
    import('../plugins/posthog').then(({ captureEvent }) => {
      captureEvent('$pageview', {
        $current_url: window.location.href,
        path: to.path,
        name: to.name,
        params: to.params,
        query: to.query
      })
    })
  } catch (e) {
    // Non-blocking telemetry failure
  }
})

export default router