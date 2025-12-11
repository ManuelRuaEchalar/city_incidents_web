<script setup lang="ts">
import { ref } from 'vue'
import type { Incident } from '@/types'
import { useIconMapper, useFormatDate } from '@/composables'
import { LoadingSpinner } from '@/components/ui'
import chevronUpIcon from '@/assets/icons/chevron_up.svg'
import chevronDownIcon from '@/assets/icons/chevron_down.svg'
import locationIcon from '@/assets/icons/location.svg'
import defaultIncidentImage from '@/assets/icons/default_incident_image.svg'

interface Props {
  incidents: Incident[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'viewDetails', incident: Incident): void
  (e: 'viewLocation', incident: Incident): void
}>()

const isCollapsed = ref(false)
const { getCardIcon } = useIconMapper()
const { formatShortDateTime } = useFormatDate()

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div
    class="bg-surface/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out w-96"
  >
    <!-- Header -->
    <div
      class="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
      @click="toggleCollapse"
    >
      <div>
        <h2 class="text-sm font-bold text-primary">Incidentes</h2>
        <p class="text-xs text-secondary">{{ incidents.length }} reportados</p>
      </div>
      <button class="p-1 rounded-full hover:bg-gray-200 transition-colors">
        <img
          :src="isCollapsed ? chevronDownIcon : chevronUpIcon"
          alt="Toggle"
          class="w-5 h-5 opacity-60"
        />
      </button>
    </div>

    <!-- List Content -->
    <div v-show="!isCollapsed" class="bg-white">
      <div v-if="loading" class="p-6 flex justify-center">
        <LoadingSpinner size="sm" />
      </div>

      <div v-else-if="incidents.length === 0" class="p-6 text-center text-xs text-gray-400">
        No hay incidentes recientes.
      </div>

      <div v-else class="max-h-[500px] overflow-y-auto custom-scrollbar">
        <!-- Incident Card (Similar to Flutter IncidentCard) -->
        <div
          v-for="incident in incidents"
          :key="incident.incident_id"
          class="h-[120px] mx-2 my-1 bg-white border-b-2 border-secondary flex"
        >
          <!-- Image Section -->
          <div class="w-20 h-full flex-shrink-0 ml-1">
            <div class="h-full w-full p-1">
              <img
                v-if="incident.photo_url"
                :src="incident.photo_url"
                alt="Incidente"
                class="w-full h-full object-cover rounded-lg"
                loading="lazy"
                @error="($event.target as HTMLImageElement).src = defaultIncidentImage"
              />
              <div
                v-else
                class="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <img :src="defaultIncidentImage" alt="Sin imagen" class="w-8 h-8 opacity-40" />
              </div>
            </div>
          </div>

          <!-- Content Section -->
          <div class="flex-1 p-2 flex flex-col min-w-0">
            <!-- Category Header Badge -->
            <div class="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-md self-start max-w-full">
              <img
                :src="getCardIcon(incident.category?.name || '')"
                alt="Categoría"
                class="w-3.5 h-3.5 flex-shrink-0 brightness-0 invert"
              />
              <span class="text-[11px] font-semibold text-white truncate">
                {{ incident.category?.name || 'Sin categoría' }}
              </span>
            </div>

            <!-- Date -->
            <span class="text-[8px] text-gray-500 mt-1">
              {{ formatShortDateTime(incident.created_at) }}
            </span>

            <!-- Description -->
            <p class="text-[10px] font-light text-primary line-clamp-2 mt-0.5 flex-1">
              {{ incident.description || 'Sin descripción' }}
            </p>

            <!-- Action Buttons -->
            <div class="flex gap-1.5 mt-1">
              <button
                class="flex-1 h-7 bg-btn-yellow text-primary text-[10px] font-medium rounded hover:opacity-90 transition-opacity"
                @click.stop="emit('viewDetails', incident)"
              >
                Ver más
              </button>
              <button
                class="flex-1 h-7 bg-error text-white text-[10px] font-medium rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                @click.stop="emit('viewLocation', incident)"
              >
                <img :src="locationIcon" alt="" class="w-2.5 h-2.5 brightness-0 invert" />
                <span>Ubicación</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
