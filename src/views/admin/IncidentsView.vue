<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useIncidentsStore } from '@/stores/incidents'
import { useCatalogsStore } from '@/stores/catalogs'
import { IncidentTable, IncidentEditModal } from '@/components/incidents'
import { BaseModal, BaseButton } from '@/components/ui'
import type { Incident } from '@/types'

const incidentsStore = useIncidentsStore()
const catalogsStore = useCatalogsStore()

// Modal states
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedIncident = ref<Incident | null>(null)
const isDeleting = ref(false)

onMounted(async () => {
  await Promise.all([
    incidentsStore.fetchAllIncidents(),
    catalogsStore.fetchAllCatalogs(),
  ])
})

// Handlers
function handleEdit(incident: Incident) {
  console.log('handleEdit called with:', incident)
  console.log('statuses:', catalogsStore.statuses)
  selectedIncident.value = incident
  showEditModal.value = true
  console.log('showEditModal:', showEditModal.value)
}

function handleDelete(incident: Incident) {
  selectedIncident.value = incident
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!selectedIncident.value) return

  isDeleting.value = true
  try {
    await incidentsStore.deleteIncident(selectedIncident.value.incident_id)
    showDeleteModal.value = false
    selectedIncident.value = null
  } catch (error) {
    console.error('Error deleting incident:', error)
  } finally {
    isDeleting.value = false
  }
}

async function handleSaveStatus(id: number, statusId: number) {
  try {
    await incidentsStore.updateIncidentStatus(id, statusId)
    showEditModal.value = false
    selectedIncident.value = null
  } catch (error) {
    console.error('Error updating incident status:', error)
  }
}

function closeEditModal() {
  showEditModal.value = false
  selectedIncident.value = null
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedIncident.value = null
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-primary">Gestión de Incidentes</h1>
      <p class="text-gray-600">Administra todos los incidentes reportados</p>
    </div>

    <!-- Incidents Table -->
    <IncidentTable
      :incidents="incidentsStore.incidents"
      :loading="incidentsStore.isLoading"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Edit Modal -->
    <IncidentEditModal
      :show="showEditModal"
      :incident="selectedIncident"
      :statuses="catalogsStore.statuses"
      :loading="incidentsStore.isLoading"
      @close="closeEditModal"
      @save="handleSaveStatus"
    />

    <!-- Delete Confirmation Modal -->
    <BaseModal :show="showDeleteModal" title="Confirmar Eliminación" size="sm" @close="closeDeleteModal">
      <p class="text-gray-600">
        ¿Estás seguro de que deseas eliminar el incidente
        <strong>#{{ selectedIncident?.incident_id }}</strong>?
      </p>
      <p class="text-sm text-error mt-2">Esta acción no se puede deshacer.</p>

      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="ghost" @click="closeDeleteModal">
            Cancelar
          </BaseButton>
          <BaseButton variant="danger" :loading="isDeleting" @click="confirmDelete">
            Eliminar
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
