<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useIncidentsStore } from '@/stores/incidents'
import { useCatalogsStore } from '@/stores/catalogs'
import { MapContainer } from '@/components/map'
import { StatsPanel, IncidentListPanel } from '@/components/layout'
import { IncidentDialog } from '@/components/incidents'
import { BaseButton, ToastNotification } from '@/components/ui'
import type { Incident, IncidentDetail } from '@/types'
import miLocationIcon from '@/assets/icons/mi_location.svg'

const router = useRouter()
const incidentsStore = useIncidentsStore()
const catalogsStore = useCatalogsStore()

// Refs
const mapRef = ref<InstanceType<typeof MapContainer> | null>(null)

// State
const selectedIncidentId = ref<number | null>(null)
const showIncidentDialog = ref(false)
const selectedIncidentDetail = ref<IncidentDetail | null>(null)
const selectedCityId = ref<number>(1) // Default city for stats
const isLoadingDetail = ref(false)

// Toast notifications state
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')

function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    incidentsStore.fetchAllIncidents(),
    catalogsStore.fetchCities(),
    incidentsStore.fetchCityStats(selectedCityId.value),
  ])
})

// Handlers
function handleMarkerClick(incident: Incident) {
  selectedIncidentId.value = incident.incident_id
}

async function handleViewDetails(incident: Incident) {
  isLoadingDetail.value = true
  try {
    const detail = await incidentsStore.fetchIncidentById(incident.incident_id)
    selectedIncidentDetail.value = detail
    showIncidentDialog.value = true
  } catch (error) {
    console.error('Error fetching incident details:', error)
    showNotification('Error al cargar los detalles del incidente', 'error')
  } finally {
    isLoadingDetail.value = false
  }
}

function handleViewLocation(incident: Incident) {
  // Force re-center by first clearing, then setting
  if (mapRef.value) {
    mapRef.value.centerOnIncident(incident.latitude, incident.longitude)
    showNotification('Mapa centrado en el incidente', 'info')
  }
}

async function handleCenterOnUser() {
  if (mapRef.value) {
    const success = await mapRef.value.centerOnUser()
    if (success) {
      showNotification('Mapa centrado en tu ubicación', 'info')
    }
    // Error notifications are handled by the map component via locationError event
  } else {
    showNotification('Mapa no disponible', 'error')
  }
}

function handleCloseDialog() {
  showIncidentDialog.value = false
  selectedIncidentDetail.value = null
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="relative h-screen w-full overflow-hidden">
    <!-- Map Container -->
    <MapContainer
      ref="mapRef"
      :incidents="incidentsStore.incidents"
      :selected-incident-id="selectedIncidentId"
      @marker-click="handleMarkerClick"
      @view-details="handleViewDetails"
      @location-error="(msg) => showNotification(msg, 'error')"
    />

    <!-- Login Button (Top Right) -->
    <div class="absolute top-4 right-4 z-20">
      <BaseButton variant="primary" @click="goToLogin">
        🔐 Login Admin
      </BaseButton>
    </div>

    <!-- Stats Panel and My Location Button (Left Side) -->
    <div class="absolute top-24 left-4 z-20 flex flex-col gap-3">
      <StatsPanel
        :stats="incidentsStore.cityStats"
        :cities="catalogsStore.cities"
        :selected-city-id="selectedCityId"
        :loading="incidentsStore.isLoading"
        @change-city="(id) => { selectedCityId = id; incidentsStore.fetchCityStats(id) }"
      />
      
      <!-- My Location Button -->
      <button
        class="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl shadow-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-xl group"
        title="Centrar en mi ubicación"
        @click="handleCenterOnUser"
      >
        <img :src="miLocationIcon" alt="Mi ubicación" class="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span class="text-sm font-medium">Mi ubicación</span>
      </button>
    </div>

    <!-- Incident List Panel (Right Side) -->
    <div class="absolute top-20 right-4 z-10">
      <IncidentListPanel
        :incidents="incidentsStore.incidents"
        :loading="incidentsStore.isLoading"
        @view-details="handleViewDetails"
        @view-location="handleViewLocation"
      />
    </div>

    <!-- Incident Detail Dialog -->
    <IncidentDialog
      :show="showIncidentDialog"
      :incident="selectedIncidentDetail"
      @close="handleCloseDialog"
    />

    <!-- Loading overlay for detail fetch -->
    <div
      v-if="isLoadingDetail"
      class="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 shadow-xl flex items-center gap-3">
        <div class="animate-spin w-6 h-6 border-3 border-primary border-t-transparent rounded-full"></div>
        <span class="text-primary font-medium">Cargando detalles...</span>
      </div>
    </div>

    <!-- Toast Notification -->
    <ToastNotification
      :show="showToast"
      :message="toastMessage"
      :type="toastType"
      @close="showToast = false"
    />

    <!-- Download Mobile App Button (Bottom Left) -->
    <a
      href="https://github.com/ManuelRuaEchalar/city_incidents_mobile"
      target="_blank"
      rel="noopener noreferrer"
      class="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm text-primary text-sm rounded-lg shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 border border-gray-200/50"
    >
      <span class="text-lg">📱</span>
      <span class="font-medium">Descargar app móvil</span>
    </a>
  </div>
</template>
