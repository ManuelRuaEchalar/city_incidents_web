<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useIncidentsStore } from '@/stores/incidents'
import { useCatalogsStore } from '@/stores/catalogs'
import { LoadingSpinner } from '@/components/ui'

const incidentsStore = useIncidentsStore()
const catalogsStore = useCatalogsStore()

onMounted(async () => {
  await Promise.all([
    incidentsStore.fetchAllIncidents(),
    catalogsStore.fetchAllCatalogs(),
  ])
})

// Stats
const totalIncidents = computed(() => incidentsStore.incidents.length)
const pendingIncidents = computed(
  () => incidentsStore.incidents.filter((i) => i.status_id === 1).length
)
const processIncidents = computed(
  () => incidentsStore.incidents.filter((i) => i.status_id === 2).length
)
const resolvedIncidents = computed(
  () => incidentsStore.incidents.filter((i) => i.status_id === 3).length
)

const isLoading = computed(() => incidentsStore.isLoading || catalogsStore.isLoading)
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-primary">Dashboard</h1>
      <p class="text-gray-600">Resumen general del sistema de gestión de incidentes</p>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <template v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Incidents -->
        <div class="bg-surface rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Incidentes</p>
              <p class="text-3xl font-bold text-primary">{{ totalIncidents }}</p>
            </div>
            <div class="text-4xl">🚨</div>
          </div>
        </div>

        <!-- Pending -->
        <div class="bg-surface rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Pendientes</p>
              <p class="text-3xl font-bold text-status-pending">{{ pendingIncidents }}</p>
            </div>
            <div class="text-4xl">⏳</div>
          </div>
        </div>

        <!-- In Process -->
        <div class="bg-surface rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">En Proceso</p>
              <p class="text-3xl font-bold text-status-process">{{ processIncidents }}</p>
            </div>
            <div class="text-4xl">🔄</div>
          </div>
        </div>

        <!-- Resolved -->
        <div class="bg-surface rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Resueltos</p>
              <p class="text-3xl font-bold text-btn-upload">{{ resolvedIncidents }}</p>
            </div>
            <div class="text-4xl">✅</div>
          </div>
        </div>
      </div>

      <!-- Catalogs Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Cities -->
        <div class="bg-surface rounded-xl shadow-md p-6">
          <h3 class="text-lg font-semibold text-primary mb-4">🏙️ Ciudades</h3>
          <p class="text-4xl font-bold text-secondary">{{ catalogsStore.cities.length }}</p>
          <p class="text-sm text-gray-500 mt-1">ciudades registradas</p>
        </div>

        <!-- Categories -->
        <div class="bg-surface rounded-xl shadow-md p-6">
          <h3 class="text-lg font-semibold text-primary mb-4">📁 Categorías</h3>
          <p class="text-4xl font-bold text-secondary">{{ catalogsStore.categories.length }}</p>
          <p class="text-sm text-gray-500 mt-1">categorías disponibles</p>
        </div>

        <!-- Statuses -->
        <div class="bg-surface rounded-xl shadow-md p-6">
          <h3 class="text-lg font-semibold text-primary mb-4">📋 Estados</h3>
          <p class="text-4xl font-bold text-secondary">{{ catalogsStore.statuses.length }}</p>
          <p class="text-sm text-gray-500 mt-1">estados definidos</p>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-surface rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-primary mb-4">📊 Últimos Incidentes</h3>
        <div v-if="incidentsStore.incidents.length === 0" class="text-gray-500 text-center py-4">
          No hay incidentes registrados aún.
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="incident in incidentsStore.incidents.slice(0, 5)"
            :key="incident.incident_id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="font-medium text-primary">
                {{ incident.category?.name || 'Sin categoría' }}
              </p>
              <p class="text-sm text-gray-500 truncate max-w-md">
                {{ incident.description || 'Sin descripción' }}
              </p>
            </div>
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                {
                  'bg-status-pending text-primary': incident.status_id === 1,
                  'bg-status-process text-primary': incident.status_id === 2,
                  'bg-status-resolved text-primary': incident.status_id === 3,
                },
              ]"
            >
              {{ incident.status?.name || 'Pendiente' }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
