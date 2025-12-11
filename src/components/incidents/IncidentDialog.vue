<script setup lang="ts">
import type { IncidentDetail } from '@/types'
import { useIconMapper, useFormatDate } from '@/composables'
import { BaseModal, BaseBadge } from '@/components/ui'
import defaultIncidentImage from '@/assets/icons/default_incident_image.svg'

interface Props {
  show: boolean
  incident: IncidentDetail | null
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { getCardIcon } = useIconMapper()
const { formatDateTime } = useFormatDate()

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
  <BaseModal :show="show" size="lg" @close="emit('close')">
    <template v-if="incident">
      <div class="space-y-6">
        <!-- Header with category and city -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img
              :src="getCardIcon(incident.category?.name || '')"
              alt="Categoría"
              class="w-8 h-8"
            />
            <div>
              <h3 class="text-lg font-semibold text-primary">
                {{ incident.category?.name || 'Sin categoría' }}
              </h3>
              <p class="text-sm text-secondary">
                {{ incident.city?.name || 'Sin ciudad' }}
              </p>
            </div>
          </div>
          <BaseBadge :variant="getStatusVariant(incident.status_id)" size="md">
            {{ incident.status?.name || 'Pendiente' }}
          </BaseBadge>
        </div>

        <!-- Image -->
        <div class="relative rounded-xl overflow-hidden bg-gray-100 aspect-video">
          <img
            v-if="incident.photo_url"
            :src="incident.photo_url"
            alt="Foto del incidente"
            class="w-full h-full object-cover"
            @error="($event.target as HTMLImageElement).src = defaultIncidentImage"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <img :src="defaultIncidentImage" alt="Sin imagen" class="w-24 h-24 opacity-40" />
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Coordinates -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-xs font-medium text-gray-500 uppercase mb-1">Coordenadas</h4>
            <p class="text-sm font-mono text-primary">
              {{ Number(incident.latitude).toFixed(6) }}, {{ Number(incident.longitude).toFixed(6) }}
            </p>
          </div>

          <!-- Date -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-xs font-medium text-gray-500 uppercase mb-1">Fecha de reporte</h4>
            <p class="text-sm text-primary">
              {{ formatDateTime(incident.created_at) }}
            </p>
          </div>
        </div>

        <!-- Description -->
        <div class="overflow-hidden">
          <h4 class="text-sm font-semibold text-primary mb-2">Descripción</h4>
          <p class="text-gray-600 leading-relaxed break-words whitespace-pre-wrap">
            {{ incident.description || 'Sin descripción proporcionada.' }}
          </p>
        </div>

        <!-- Address Reference -->
        <div v-if="incident.address_ref">
          <h4 class="text-sm font-semibold text-primary mb-2">Referencia de dirección</h4>
          <p class="text-gray-600">
            {{ incident.address_ref }}
          </p>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
