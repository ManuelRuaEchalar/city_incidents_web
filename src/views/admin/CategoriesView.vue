<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCatalogsStore } from '@/stores/catalogs'
import { BaseButton, BaseInput, BaseModal, LoadingSpinner } from '@/components/ui'
import type { Category } from '@/types'

const catalogsStore = useCatalogsStore()

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedCategory = ref<Category | null>(null)
const isProcessing = ref(false)

// Form state
const formData = ref({
  name: '',
  description: '',
})
const formErrors = ref<{ name?: string }>({})

onMounted(async () => {
  await catalogsStore.fetchCategories()
})

// Form validation
function validateForm(): boolean {
  formErrors.value = {}

  if (!formData.value.name.trim()) {
    formErrors.value.name = 'El nombre es requerido'
  } else if (formData.value.name.length > 100) {
    formErrors.value.name = 'El nombre no puede exceder 100 caracteres'
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

function openEditModal(category: Category) {
  selectedCategory.value = category
  formData.value = { name: category.name, description: category.description }
  showEditModal.value = true
}

function openDeleteModal(category: Category) {
  selectedCategory.value = category
  showDeleteModal.value = true
}

async function handleCreate() {
  if (!validateForm()) return

  isProcessing.value = true
  try {
    await catalogsStore.createCategory({
      name: formData.value.name,
      description: formData.value.description || undefined,
    })
    showCreateModal.value = false
    resetForm()
  } catch (error) {
    console.error('Error creating category:', error)
  } finally {
    isProcessing.value = false
  }
}

async function handleUpdate() {
  if (!validateForm() || !selectedCategory.value) return

  isProcessing.value = true
  try {
    await catalogsStore.updateCategory(selectedCategory.value.category_id, {
      name: formData.value.name,
      description: formData.value.description || undefined,
    })
    showEditModal.value = false
    selectedCategory.value = null
    resetForm()
  } catch (error) {
    console.error('Error updating category:', error)
  } finally {
    isProcessing.value = false
  }
}

async function handleDelete() {
  if (!selectedCategory.value) return

  isProcessing.value = true
  try {
    await catalogsStore.deleteCategory(selectedCategory.value.category_id)
    showDeleteModal.value = false
    selectedCategory.value = null
  } catch (error) {
    console.error('Error deleting category:', error)
  } finally {
    isProcessing.value = false
  }
}

function closeModals() {
  showCreateModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  selectedCategory.value = null
  resetForm()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-primary">Gestión de Categorías</h1>
        <p class="text-gray-600">Administra las categorías de incidentes</p>
      </div>
      <BaseButton variant="success" @click="openCreateModal">
        + Agregar Categoría
      </BaseButton>
    </div>

    <!-- Loading -->
    <div v-if="catalogsStore.isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Categories Table -->
    <div v-else class="bg-surface rounded-xl shadow-md overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Nombre</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Descripción</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Incidentes</th>
            <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="category in catalogsStore.categories" :key="category.category_id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-600">{{ category.category_id }}</td>
            <td class="px-6 py-4 text-sm font-medium text-primary">{{ category.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{{ category.description || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ category._count?.incidents || 0 }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-center gap-2">
                <BaseButton variant="ghost" size="sm" @click="openEditModal(category)">
                  Editar
                </BaseButton>
                <BaseButton variant="danger" size="sm" @click="openDeleteModal(category)">
                  Eliminar
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="catalogsStore.categories.length === 0" class="p-8 text-center text-gray-500">
        No hay categorías registradas.
      </div>
    </div>

    <!-- Create Modal -->
    <BaseModal :show="showCreateModal" title="Agregar Categoría" size="md" @close="closeModals">
      <form class="space-y-4" @submit.prevent="handleCreate">
        <BaseInput
          v-model="formData.name"
          label="Nombre"
          placeholder="Nombre de la categoría"
          :error="formErrors.name"
          required
        />
        <div>
          <label class="block text-sm font-medium text-primary mb-1">Descripción (opcional)</label>
          <textarea
            v-model="formData.description"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows="3"
            placeholder="Descripción de la categoría"
          />
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="ghost" @click="closeModals">Cancelar</BaseButton>
          <BaseButton variant="primary" :loading="isProcessing" @click="handleCreate">
            Crear Categoría
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Edit Modal -->
    <BaseModal :show="showEditModal" title="Editar Categoría" size="md" @close="closeModals">
      <form class="space-y-4" @submit.prevent="handleUpdate">
        <BaseInput
          v-model="formData.name"
          label="Nombre"
          placeholder="Nombre de la categoría"
          :error="formErrors.name"
          required
        />
        <div>
          <label class="block text-sm font-medium text-primary mb-1">Descripción (opcional)</label>
          <textarea
            v-model="formData.description"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows="3"
            placeholder="Descripción de la categoría"
          />
        </div>
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
        ¿Estás seguro de que deseas eliminar la categoría
        <strong>{{ selectedCategory?.name }}</strong>?
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
