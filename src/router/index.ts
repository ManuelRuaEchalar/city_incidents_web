import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import PublicLayout from '@/layouts/PublicLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// Public Views
import HomeView from '@/views/public/HomeView.vue'

// Auth Views
import LoginView from '@/views/auth/LoginView.vue'

// Admin Views
import DashboardView from '@/views/admin/DashboardView.vue'
import IncidentsView from '@/views/admin/IncidentsView.vue'
import CitiesView from '@/views/admin/CitiesView.vue'
import CategoriesView from '@/views/admin/CategoriesView.vue'
import StatusesView from '@/views/admin/StatusesView.vue'
import ProfileView from '@/views/admin/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes
    {
      path: '/',
      component: PublicLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
          meta: { title: 'Reporte urbano' },
        },
      ],
    },

    // Auth routes
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Iniciar Sesión', guest: true },
    },

    // Admin routes (protected)
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, role: 'ADMIN' },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard',
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: DashboardView,
          meta: { title: 'Dashboard' },
        },
        {
          path: 'incidents',
          name: 'admin-incidents',
          component: IncidentsView,
          meta: { title: 'Gestión de Incidentes' },
        },
        {
          path: 'cities',
          name: 'admin-cities',
          component: CitiesView,
          meta: { title: 'Gestión de Ciudades' },
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: CategoriesView,
          meta: { title: 'Gestión de Categorías' },
        },
        {
          path: 'statuses',
          name: 'admin-statuses',
          component: StatusesView,
          meta: { title: 'Gestión de Estados' },
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: ProfileView,
          meta: { title: 'Mi Perfil' },
        },
      ],
    },

    // Catch all - 404
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// Navigation guard
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Update document title
  document.title = to.meta.title
    ? `${to.meta.title} | Gestión de Incidentes`
    : 'Gestión de Incidentes Urbanos'

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    // Try to verify authentication
    const isAuthenticated = await authStore.checkAuth()

    if (!isAuthenticated) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    // Check role if required
    if (to.meta.role && authStore.user?.role !== to.meta.role) {
      return next({ name: 'home' })
    }
  }

  // Redirect authenticated users away from guest-only pages
  if (to.meta.guest && authStore.isAuthenticated) {
    return next({ name: 'admin-dashboard' })
  }

  next()
})

export default router
