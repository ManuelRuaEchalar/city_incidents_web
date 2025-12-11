<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCatalogsStore } from '@/stores/catalogs'
import { BaseButton, BaseInput, BaseModal, LoadingSpinner } from '@/components/ui'
import type { Status } from '@/types'

const catalogsStore = useCatalogsStore()

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedStatus = ref<Status | null>(null)
const isProcessing = ref(false)

// Form state
const formData = ref({
  name: '',
  description: '',
})
const formErrors = ref<{ name?: string; description?: string }>({})

onMounted(async () => {
  await catalogsStore.fetchStatuses()
})

// Form validation
function validateForm(): boolean {
  formErrors.value = {}

  if (!formData.value.name.trim()) {
    formErrors.value.name = 'El nombre es requerido'
  } else if (formData.value.name.length > 50) {
    formErrors.value.name = 'El nombre no puede exceder 50 caracteres'
  }

  if (!formData.value.description.trim()) {
    formErrors.value.description = 'La descripción es requerida'
  } else if (formData.value.description.length > 150) {
    formErrors.value.description = 'La descripción no puede exceder 150 caracteres'
  }

  return Object.keys(formErrors.value).length === 0
}

// Reset form
function resetForm() {
  formData.value = { name: '', description: '' }
  formErrors.value = {}
}

// Handlers
function openCreateModal() {
  resetForm()
  showCreateModal.value = true
}

function openEditModal(status: Status) {
  selectedStatus.value = status
  formData.value = { name: status.name, description: status.description }
  showEditModal.value = true
}

function openDeleteModal(status: Status) {
  selectedStatus.value = status
  showDeleteModal.value = true
}

async function handleCreate() {
  if (!validateForm()) return

  isProcessing.value = true
  try {
    await catalogsStore.createStatus({
      name: formData.value.name,
      description: formData.value.description,
    })
    showCreateModal.value = false
    resetForm()
  } catch (error) {
    console.error('Error creating status:', error)
  } finally {
    isProcessing.value = false
  }
}

async function handleUpdate() {
  if (!validateForm() || !selectedStatus.value) return

  isProcessing.value = true
  try {
    await catalogsStore.updateStatus(selectedStatus.value.status_id, {
      name: formData.value.name,
      description: formData.value.description,
    })
    showEditModal.value = false
    selectedStatus.value = null
    resetForm()
  } catch (error) {
    console.error('Error updating status:', error)
  } finally {
    isProcessing.value = false
  }
}

async function handleDelete() {
  if (!selectedStatus.value) return

  isProcessing.value = true
  try {
    await catalogsStore.deleteStatus(selectedStatus.value.status_id)
    showDeleteModal.value = false
    selectedStatus.value = null
  } catch (error) {
    console.error('Error deleting status:', error)
  } finally {
    isProcessing.value = false
  }
}

function closeModals() {
  showCreateModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  selectedStatus.value = null
  resetForm()
}

function getStatusColor(statusId: number): string {
  switch (statusId) {
    case 1:
      return 'bg-status-pending'
    case 2:
      return 'bg-status-process'
    case 3:
      return 'bg-status-resolved'
    default:
      return 'bg-gray-200'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-primary">Gestión de Estados</h1>
        <p class="text-gray-600">Administra los estados de los incidentes</p>
      </div>
      <BaseButton variant="success" @click="openCreateModal">
        + Agregar Estado
      </BaseButton>
    </div>

    <!-- Loading -->
    <div v-if="catalogsStore.isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Statuses Table -->
    <div v-else class="bg-surface rounded-xl shadow-md overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Nombre</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Descripción</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Color</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Incidentes</th>
            <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="status in catalogsStore.statuses" :key="status.status_id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-600">{{ status.status_id }}</td>
            <td class="px-6 py-4 text-sm font-medium text-primary">{{ status.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{{ status.description }}</td>
            <td class="px-6 py-4">
              <div :class="['w-8 h-8 rounded-full', getStatusColor(status.status_id)]" />
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ status._count?.incidents || 0 }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-center gap-2">
                <BaseButton variant="ghost" size="sm" @click="openEditModal(status)">
                  Editar
                </BaseButton>
                <BaseButton variant="danger" size="sm" @click="openDeleteModal(status)">
                  Eliminar
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="catalogsStore.statuses.length === 0" class="p-8 text-center text-gray-500">
        No hay estados registrados.
      </div>
    </div>

    <!-- Create Modal -->
    <BaseModal :show="showCreateModal" title="Agregar Estado" size="md" @close="closeModals">
      <form class="space-y-4" @submit.prevent="handleCreate">
        <BaseInput
          v-model="formData.name"
          label="Nombre"
          placeholder="Nombre del estado"
          :error="formErrors.name"
          required
        />
        <BaseInput
          v-model="formData.description"
          label="Descripción"
          placeholder="Descripción del estado"
          :error="formErrors.description"
          required
        />
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="ghost" @click="closeModals">Cancelar</BaseButton>
          <BaseButton variant="primary" :loading="isProcessing" @click="handleCreate">
            Crear Estado
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Edit Modal -->
    <BaseModal :show="showEditModal" title="Editar Estado" size="md" @close="closeModals">
      <form class="space-y-4" @submit.prevent="handleUpdate">
        <BaseInput
          v-model="formData.name"
          label="Nombre"
          placeholder="Nombre del estado"
          :error="formErrors.name"
          required
        />
        <BaseInput
          v-model="formData.description"
          label="Descripción"
          placeholder="Descripción del estado"
          :error="formErrors.description"
          required
        />
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="ghost" @click="closeModals">Cancelar</BaseButton>
          <BaseButton variant="primary" :loading="isProcessing" @click="handleUpdate">
            Guardar Cambios
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Delete Modal -->
    <BaseModal :show="showDeleteModal" title="Confirmar Eliminación" size="sm" @close="closeModals">
      <p class="text-gray-600">
        ¿Estás seguro de que deseas eliminar el estado
        <strong>{{ selectedStatus?.name }}</strong>?
      </p>
      <p class="text-sm text-error mt-2">Esta acción no se puede deshacer.</p>

      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="ghost" @click="closeModals">Cancelar</BaseButton>
          <BaseButton variant="danger" :loading="isProcessing" @click="handleDelete">
            Eliminar
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
