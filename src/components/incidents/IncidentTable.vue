<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Incident } from '@/types'
import { useFormatDate } from '@/composables'
import { BaseBadge, BaseButton, BaseSelect } from '@/components/ui'
import editIcon from '@/assets/icons/edit_account.svg'
import defaultIncidentImage from '@/assets/icons/default_incident_image.svg'

interface Props {
  incidents: Incident[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'edit', incident: Incident): void
  (e: 'delete', incident: Incident): void
  (e: 'updateStatus', id: number, statusId: number): void
}>()

const { formatDateTime } = useFormatDate()

// Sorting and filtering
const sortBy = ref<'date' | 'status' | 'category'>('date')
const sortOrder = ref<'asc' | 'desc'>('desc')
const filterStatus = ref<string>('')

const sortedIncidents = computed(() => {
  let result = [...props.incidents]

  // Filter by status
  if (filterStatus.value) {
    result = result.filter((i) => i.status_id === parseInt(filterStatus.value))
  }

  // Sort
  result.sort((a, b) => {
    let comparison = 0

    switch (sortBy.value) {
      case 'date':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        break
      case 'status':
        comparison = a.status_id - b.status_id
        break
      case 'category':
        comparison = (a.category?.name || '').localeCompare(b.category?.name || '')
        break
    }

    return sortOrder.value === 'asc' ? comparison : -comparison
  })

  return result
})

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

function toggleSort(column: 'date' | 'status' | 'category') {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'desc'
  }
}

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: '1', label: 'Pendiente' },
  { value: '2', label: 'En Proceso' },
  { value: '3', label: 'Resuelto' },
]
</script>

<template>
  <div class="bg-surface rounded-xl shadow-md overflow-hidden">
    <!-- Table Header with filters -->
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-primary">Gestión de Incidentes</h3>
      <div class="flex items-center gap-4">
        <BaseSelect v-model="filterStatus" :options="statusOptions" placeholder="Filtrar por estado" />
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="p-8 text-center text-gray-500">
      Cargando incidentes...
    </div>

    <!-- Empty state -->
    <div
      v-else-if="sortedIncidents.length === 0"
      class="p-8 text-center text-gray-500"
    >
      No hay incidentes para mostrar.
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
              ID
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
              Imagen
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-primary"
              @click="toggleSort('category')"
            >
              Categoría
              <span v-if="sortBy === 'category'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
              Ciudad
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-primary"
              @click="toggleSort('date')"
            >
              Fecha
              <span v-if="sortBy === 'date'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-primary"
              @click="toggleSort('status')"
            >
              Estado
              <span v-if="sortBy === 'status'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="incident in sortedIncidents"
            :key="incident.incident_id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3 text-sm text-gray-600">
              #{{ incident.incident_id }}
            </td>
            <td class="px-4 py-3">
              <img
                v-if="incident.photo_url"
                :src="incident.photo_url"
                alt="Incidente"
                class="w-12 h-12 rounded-lg object-cover"
                @error="($event.target as HTMLImageElement).src = defaultIncidentImage"
              />
              <div
                v-else
                class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center"
              >
                <img :src="defaultIncidentImage" alt="Sin imagen" class="w-8 h-8 opacity-40" />
              </div>
            </td>
            <td class="px-4 py-3 text-sm font-medium text-primary">
              {{ incident.category?.name || 'N/A' }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ incident.city?.name || 'N/A' }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ formatDateTime(incident.created_at) }}
            </td>
            <td class="px-4 py-3">
              <BaseBadge :variant="getStatusVariant(incident.status_id)" size="sm">
                {{ incident.status?.name || 'Pendiente' }}
              </BaseBadge>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-center gap-2">
                <button
                  class="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                  title="Editar incidente"
                  @click="emit('edit', incident)"
                >
                  <img :src="editIcon" alt="Editar" class="w-5 h-5" />
                </button>
                <BaseButton variant="danger" size="sm" @click="emit('delete', incident)">
                  Eliminar
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer with count -->
    <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
      Mostrando {{ sortedIncidents.length }} de {{ incidents.length }} incidentes
    </div>
  </div>
</template>
