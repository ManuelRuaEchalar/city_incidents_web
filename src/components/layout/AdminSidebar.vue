<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { BaseButton } from '@/components/ui'
import logoImage from '@/assets/images/city_incident_reports_icon_app.png'
import logoutIcon from '@/assets/icons/logout.svg'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/incidents', label: 'Incidentes', icon: '🚨' },
  { path: '/admin/cities', label: 'Ciudades', icon: '🏙️' },
  { path: '/admin/categories', label: 'Categorías', icon: '📁' },
  { path: '/admin/statuses', label: 'Estados', icon: '📋' },
  { path: '/admin/profile', label: 'Mi Perfil', icon: '👤' },
]

const currentPath = computed(() => route.path)

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-screen w-64 bg-primary text-white flex flex-col shadow-2xl z-40"
  >
    <!-- Logo Section -->
    <div class="p-6 border-b border-white/10">
      <div class="flex items-center gap-3">
        <img :src="logoImage" alt="Logo" class="w-12 h-12 rounded-xl" />
        <div>
          <h1 class="text-lg font-bold">Incidentes</h1>
          <p class="text-xs text-white/60">Panel Admin</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-4 overflow-y-auto">
      <ul class="space-y-1 px-3">
        <li v-for="item in navItems" :key="item.path">
          <RouterLink
            :to="item.path"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
              currentPath === item.path
                ? 'bg-white/20 text-white font-semibold'
                : 'text-white/70 hover:bg-white/10 hover:text-white',
            ]"
          >
            <span class="text-xl">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- User Section -->
    <div class="p-4 border-t border-white/10">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <span class="text-white font-bold">
            {{ authStore.username?.charAt(0)?.toUpperCase() || 'A' }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ authStore.username || 'Admin' }}</p>
          <p class="text-xs text-white/60">Administrador</p>
        </div>
      </div>

      <BaseButton
        variant="danger"
        size="sm"
        full-width
        class="!bg-logout hover:!bg-logout/80"
        @click="handleLogout"
      >
        <img :src="logoutIcon" alt="Logout" class="w-4 h-4 mr-2" />
        Cerrar Sesión
      </BaseButton>
    </div>
  </aside>
</template>
