<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Incident, Status } from '@/types'
import { BaseModal, BaseButton, BaseSelect } from '@/components/ui'

interface Props {
  show: boolean
  incident: Incident | null
  statuses: Status[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', id: number, statusId: number): void
}>()

const selectedStatusId = ref<string>('')

// Status options for select
const statusOptions = computed(() =>
  props.statuses.map((s) => ({
    value: s.status_id.toString(),
    label: s.name,
  }))
)

function handleSave() {
  if (props.incident && selectedStatusId.value) {
    emit('save', props.incident.incident_id, parseInt(selectedStatusId.value))
  }
}

// Watch for show changes to reset form
watch(
  () => props.show,
  (isVisible) => {
    if (isVisible && props.incident && props.incident.status_id != null) {
      selectedStatusId.value = props.incident.status_id.toString()
    }
  }
)

// Watch for incident changes to set initial value
watch(
  () => props.incident,
  (incident) => {
    if (incident && props.show && incident.status_id != null) {
      selectedStatusId.value = incident.status_id.toString()
    }
  },
  { immediate: true }
)
</script>

<template>
  <BaseModal :show="show" title="Editar Estado del Incidente" size="md" @close="emit('close')">
    <template v-if="incident">
      <div class="space-y-4">
        <p class="text-gray-600">
          Cambia el estado del incidente <strong>#{{ incident.incident_id }}</strong>
        </p>

        <div v-if="statuses.length === 0" class="text-center text-gray-500 py-4">
          Cargando estados...
        </div>

        <BaseSelect
          v-else
          v-model="selectedStatusId"
          :options="statusOptions"
          label="Nuevo Estado"
          placeholder="Selecciona un estado"
          required
        />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton variant="ghost" @click="emit('close')">
          Cancelar
        </BaseButton>
        <BaseButton
          variant="primary"
          :loading="loading"
          :disabled="!selectedStatusId || statuses.length === 0"
          @click="handleSave"
        >
          Guardar Cambios
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

