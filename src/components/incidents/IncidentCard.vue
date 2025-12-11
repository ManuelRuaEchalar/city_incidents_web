<script setup lang="ts">
import type { Incident } from '@/types'
import { useIconMapper, useFormatDate } from '@/composables'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import locationIcon from '@/assets/icons/location.svg'
import defaultIncidentImage from '@/assets/icons/default_incident_image.svg'

interface Props {
  incident: Incident
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'viewDetails'): void
  (e: 'viewLocation'): void
}>()

const { getCardIcon } = useIconMapper()
const { formatShortDateTime } = useFormatDate()

function getStatusVariant(statusId: number): 'pending' | 'process' | 'resolved' {
  switch (statusId) {
    case 1:
      return 'pending'
    case 2:
      return 'process'
    case 3:
      return 'resolved'
    default:
      return 'pending'
  }
}
</script>

<template>
  <div
    class="bg-surface rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
    @click="emit('viewDetails')"
  >
    <!-- Image Section -->
    <div class="relative h-36 bg-gray-100">
      <img
        v-if="incident.photo_url"
        :src="incident.photo_url"
        alt="Incidente"
        class="w-full h-full object-cover"
        loading="lazy"
        @error="($event.target as HTMLImageElement).src = defaultIncidentImage"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <img :src="defaultIncidentImage" alt="Sin imagen" class="w-16 h-16 opacity-40" />
      </div>

      <!-- Status Badge -->
      <BaseBadge
        :variant="getStatusVariant(incident.status_id)"
        size="sm"
        class="absolute top-3 right-3"
      >
        {{ incident.status?.name || 'Pendiente' }}
      </BaseBadge>
    </div>

    <!-- Content Section -->
    <div class="p-4 space-y-3">
      <!-- Category and Date Row -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img
            :src="getCardIcon(incident.category?.name || '')"
            alt="Categoría"
            class="w-5 h-5"
          />
          <span class="text-sm font-semibold text-primary">
            {{ incident.category?.name || 'Sin categoría' }}
          </span>
        </div>
        <span class="text-xs text-gray-400">
          {{ formatShortDateTime(incident.created_at) }}
        </span>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
        {{ incident.description || 'Sin descripción disponible' }}
      </p>

      <!-- Footer Row -->
      <div class="flex items-center justify-between pt-2 border-t border-gray-100">
        <!-- City -->
        <span v-if="incident.city" class="text-xs text-secondary font-medium">
          📍 {{ incident.city.name }}
        </span>
        <span v-else class="text-xs text-gray-400">
          Sin ciudad asignada
        </span>

        <!-- Location Button -->
        <button
          class="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Ver ubicación en el mapa"
          @click.stop="emit('viewLocation')"
        >
          <img :src="locationIcon" alt="Ubicación" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
