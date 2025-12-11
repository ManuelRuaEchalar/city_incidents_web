<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import { ref, onMounted, watch, nextTick } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup, LIcon, LControlZoom } from '@vue-leaflet/vue-leaflet'
import type { Incident } from '@/types'
import { useIconMapper } from '@/composables'
import IncidentPopup from './IncidentPopup.vue'
import miLocationIcon from '@/assets/icons/mi_location.svg'

interface Props {
  incidents: Incident[]
  selectedIncidentId?: number | null
  showUserLocation?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedIncidentId: null,
  showUserLocation: true,
})

const emit = defineEmits<{
  (e: 'markerClick', incident: Incident): void
  (e: 'viewDetails', incident: Incident): void
  (e: 'locationError', message: string): void
}>()

const { getMarkerIcon } = useIconMapper()

// Map state
const mapInstance = ref<InstanceType<typeof LMap> | null>(null)
const zoom = ref(13)
const center = ref<[number, number]>([-17.3895, -66.157]) // Default: Cochabamba, Bolivia
const userLocation = ref<[number, number] | null>(null)
const locationPermissionDenied = ref(false)

// Function to get user location
function getUserLocation(highAccuracy: boolean = true): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: highAccuracy,
      timeout: highAccuracy ? 15000 : 30000,
      maximumAge: 60000, // Cache for 1 minute
    })
  })
}

async function fetchUserLocation() {
  if (!navigator.geolocation) {
    emit('locationError', 'Tu navegador no soporta geolocalización')
    return false
  }

  try {
    // Try with high accuracy first
    const position = await getUserLocation(true)
    const lat = position.coords.latitude
    const lng = position.coords.longitude
    userLocation.value = [lat, lng]
    locationPermissionDenied.value = false
    return true
  } catch (error: any) {
    // If timeout, try without high accuracy
    if (error.code === error.TIMEOUT) {
      try {
        const position = await getUserLocation(false)
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        userLocation.value = [lat, lng]
        locationPermissionDenied.value = false
        return true
      } catch (fallbackError: any) {
        console.warn('Error getting location (fallback):', fallbackError.message)
      }
    }
    
    console.warn('Error getting location:', error.message)
    locationPermissionDenied.value = true
    
    if (error.code === error.PERMISSION_DENIED) {
      emit('locationError', 'Permiso de ubicación denegado. Puedes habilitarlo en la configuración del navegador.')
    } else if (error.code === error.TIMEOUT) {
      emit('locationError', 'No se pudo obtener tu ubicación. Intenta de nuevo.')
    }
    return false
  }
}

// Get user's current location on mount
onMounted(async () => {
  if (props.showUserLocation) {
    const success = await fetchUserLocation()
    if (success && userLocation.value) {
      nextTick(() => {
        setTimeout(() => {
          if (mapInstance.value) {
            const leafletMap = (mapInstance.value as any).leafletObject
            if (leafletMap) {
              leafletMap.setView(userLocation.value, 15, { animate: true })
            }
          }
        }, 100)
      })
    }
  }
})

// Center on selected incident (from watcher)
watch(
  () => props.selectedIncidentId,
  (id) => {
    if (id) {
      const incident = props.incidents.find((i) => i.incident_id === id)
      if (incident) {
        centerOnIncident(incident.latitude, incident.longitude)
      }
    }
  }
)

// Exposed method for parent to call directly
function centerOnIncident(lat: number, lng: number, targetZoom: number = 17) {
  nextTick(() => {
    center.value = [lat, lng]
    zoom.value = targetZoom
    
    // Also try to use the Leaflet map instance directly for more reliable centering
    if (mapInstance.value) {
      const leafletMap = (mapInstance.value as any).leafletObject
      if (leafletMap) {
        leafletMap.setView([lat, lng], targetZoom, { animate: true })
      }
    }
  })
}

async function centerOnUser(): Promise<boolean> {
  // If we don't have the location yet, try to get it
  if (!userLocation.value) {
    const success = await fetchUserLocation()
    if (!success) {
      return false
    }
  }
  
  if (userLocation.value) {
    centerOnIncident(userLocation.value[0], userLocation.value[1], 15)
    return true
  }
  return false
}

// Expose method for parent component
defineExpose({
  centerOnIncident,
  centerOnUser,
})
</script>

<template>
  <div class="relative w-full h-full">
    <LMap
      ref="mapInstance"
      v-model:zoom="zoom"
      v-model:center="center"
      :use-global-leaflet="false"
      class="w-full h-full z-0"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <LControlZoom position="bottomright" />

      <!-- User location marker -->
      <LMarker v-if="userLocation" :lat-lng="userLocation">
        <LIcon :icon-size="[32, 32]" :icon-anchor="[16, 16]">
          <div
            class="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white"
          >
            <img :src="miLocationIcon" alt="Tu ubicación" class="w-5 h-5" />
          </div>
        </LIcon>
        <LPopup>
          <span class="font-medium text-primary">Tu ubicación</span>
        </LPopup>
      </LMarker>

      <!-- Incident markers -->
      <LMarker
        v-for="incident in incidents"
        :key="incident.incident_id"
        :lat-lng="[incident.latitude, incident.longitude]"
        @click="emit('markerClick', incident)"
      >
        <LIcon :icon-size="[40, 40]" :icon-anchor="[20, 40]" :popup-anchor="[0, -40]">
          <img
            :src="getMarkerIcon(incident.category?.name || '')"
            alt="Incidente"
            class="w-10 h-10 drop-shadow-lg"
          />
        </LIcon>
        <LPopup :options="{ maxWidth: 300 }">
          <IncidentPopup :incident="incident" @view-details="emit('viewDetails', incident)" />
        </LPopup>
      </LMarker>
    </LMap>

    <!-- Center on user button -->
    <button
      v-if="userLocation"
      class="absolute bottom-24 right-4 z-10 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
      title="Centrar en mi ubicación"
      @click="centerOnUser"
    >
      <img :src="miLocationIcon" alt="Mi ubicación" class="w-6 h-6" />
    </button>
  </div>
</template>
