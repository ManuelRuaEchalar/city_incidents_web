<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCatalogsStore } from '@/stores/catalogs'
import { BaseButton, BaseInput, BaseModal, LoadingSpinner } from '@/components/ui'
import type { City } from '@/types'

const catalogsStore = useCatalogsStore()

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedCity = ref<City | null>(null)
const isProcessing = ref(false)

// Form state
const formData = ref({
  name: '',
  code: '',
})
const formErrors = ref<{ name?: string; code?: string }>({})

onMounted(async () => {
  await catalogsStore.fetchCities()
})

// Form validation
function validateForm(): boolean {
  formErrors.value = {}

  if (!formData.value.name.trim()) {
    formErrors.value.name = 'El nombre es requerido'
  } else if (formData.value.name.length > 100) {
    formErrors.value.name = 'El nombre no puede exceder 100 caracteres'
  }

  if (formData.value.code && formData.value.code.length > 20) {
    formErrors.value.code = 'El código no puede exceder 20 caracteres'
  }

  return Object.keys(formErrors.value).length === 0
}

// Reset form
function resetForm() {
  formData.value = { name: '', code: '' }
  formErrors.value = {}
}

// Handlers
function openCreateModal() {
  resetForm()
  showCreateModal.value = true
}

function openEditModal(city: City) {
  selectedCity.value = city
  formData.value = { name: city.name, code: city.code }
  showEditModal.value = true
}

function openDeleteModal(city: City) {
  selectedCity.value = city
  showDeleteModal.value = true
}

async function handleCreate() {
  if (!validateForm()) return

  isProcessing.value = true
  try {
    await catalogsStore.createCity({
      name: formData.value.name,
      code: formData.value.code || undefined,
    })
    showCreateModal.value = false
    resetForm()
  } catch (error) {
    console.error('Error creating city:', error)
  } finally {
    isProcessing.value = false
  }
}

async function handleUpdate() {
  if (!validateForm() || !selectedCity.value) return

  isProcessing.value = true
  try {
    await catalogsStore.updateCity(selectedCity.value.city_id, {
      name: formData.value.name,
      code: formData.value.code || undefined,
    })
    showEditModal.value = false
    selectedCity.value = null
    resetForm()
  } catch (error) {
    console.error('Error updating city:', error)
  } finally {
    isProcessing.value = false
  }
}

async function handleDelete() {
  if (!selectedCity.value) return

  isProcessing.value = true
  try {
    await catalogsStore.deleteCity(selectedCity.value.city_id)
    showDeleteModal.value = false
    selectedCity.value = null
  } catch (error) {
    console.error('Error deleting city:', error)
  } finally {
    isProcessing.value = false
  }
}

function closeModals() {
  showCreateModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  selectedCity.value = null
  resetForm()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-primary">Gestión de Ciudades</h1>
        <p class="text-gray-600">Administra las ciudades del sistema</p>
      </div>
      <BaseButton variant="success" @click="openCreateModal">
        + Agregar Ciudad
      </BaseButton>
    </div>

    <!-- Loading -->
    <div v-if="catalogsStore.isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Cities Table -->
    <div v-else class="bg-surface rounded-xl shadow-md overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Nombre</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Código</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Incidentes</th>
            <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="city in catalogsStore.cities" :key="city.city_id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-600">{{ city.city_id }}</td>
            <td class="px-6 py-4 text-sm font-medium text-primary">{{ city.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ city.code || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ city._count?.incidents || 0 }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-center gap-2">
                <BaseButton variant="ghost" size="sm" @click="openEditModal(city)">
                  Editar
                </BaseButton>
                <BaseButton variant="danger" size="sm" @click="openDeleteModal(city)">
                  Eliminar
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="catalogsStore.cities.length === 0" class="p-8 text-center text-gray-500">
        No hay ciudades registradas.
      </div>
    </div>

    <!-- Create Modal -->
    <BaseModal :show="showCreateModal" title="Agregar Ciudad" size="md" @close="closeModals">
      <form class="space-y-4" @submit.prevent="handleCreate">
        <BaseInput
          v-model="formData.name"
          label="Nombre"
          placeholder="Nombre de la ciudad"
          :error="formErrors.name"
          required
        />
        <BaseInput
          v-model="formData.code"
          label="Código (opcional)"
          placeholder="Ej: CBBA"
          :error="formErrors.code"
        />
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="ghost" @click="closeModals">Cancelar</BaseButton>
          <BaseButton variant="primary" :loading="isProcessing" @click="handleCreate">
            Crear Ciudad
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Edit Modal -->
    <BaseModal :show="showEditModal" title="Editar Ciudad" size="md" @close="closeModals">
      <form class="space-y-4" @submit.prevent="handleUpdate">
        <BaseInput
          v-model="formData.name"
          label="Nombre"
          placeholder="Nombre de la ciudad"
          :error="formErrors.name"
          required
        />
        <BaseInput
          v-model="formData.code"
          label="Código (opcional)"
          placeholder="Ej: CBBA"
          :error="formErrors.code"
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
        ¿Estás seguro de que deseas eliminar la ciudad
        <strong>{{ selectedCity?.name }}</strong>?
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
