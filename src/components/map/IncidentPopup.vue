<script setup lang="ts">
import type { Incident } from '@/types'
import { useIconMapper, useFormatDate } from '@/composables'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import defaultIncidentImage from '@/assets/icons/default_incident_image.svg'

interface Props {
  incident: Incident
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'viewDetails'): void
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
  <div class="min-w-[250px] max-w-[280px]">
    <!-- Image -->
    <div class="relative h-32 rounded-lg overflow-hidden mb-3 bg-gray-100">
      <img
        v-if="incident.photo_url"
        :src="incident.photo_url"
        alt="Incidente"
        class="w-full h-full object-cover"
        loading="lazy"
        @error="($event.target as HTMLImageElement).src = defaultIncidentImage"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <img :src="defaultIncidentImage" alt="Sin imagen" class="w-16 h-16 opacity-50" />
      </div>

      <!-- Status badge -->
      <BaseBadge :variant="getStatusVariant(incident.status_id)" size="sm" class="absolute top-2 right-2">
        {{ incident.status?.name || 'Pendiente' }}
      </BaseBadge>
    </div>

    <!-- Content -->
    <div class="space-y-2">
      <!-- Category and date -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img
            :src="getCardIcon(incident.category?.name || '')"
            alt="Categoría"
            class="w-5 h-5"
          />
          <span class="text-sm font-medium text-primary">
            {{ incident.category?.name || 'Sin categoría' }}
          </span>
        </div>
        <span class="text-xs text-gray-500">
          {{ formatShortDateTime(incident.created_at) }}
        </span>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-600 line-clamp-2">
        {{ incident.description || 'Sin descripción' }}
      </p>

      <!-- City -->
      <p v-if="incident.city" class="text-xs text-secondary">
        📍 {{ incident.city.name }}
      </p>

      <!-- View more button -->
      <BaseButton variant="primary" size="sm" full-width @click="emit('viewDetails')">
        Ver detalles
      </BaseButton>
    </div>
  </div>
</template>
