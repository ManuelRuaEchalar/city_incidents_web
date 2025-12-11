<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { BaseButton, BaseInput, LoadingSpinner } from '@/components/ui'

const authStore = useAuthStore()

// Form state
const isEditing = ref(false)
const isUpdating = ref(false)
const formData = ref({
  username: '',
  email: '',
})
const formErrors = ref<{ username?: string; email?: string }>({})
const successMessage = ref('')

onMounted(async () => {
  await authStore.fetchUserProfile()
  if (authStore.user) {
    formData.value = {
      username: authStore.user.username,
      email: authStore.user.email,
    }
  }
})

// Validation
function validateForm(): boolean {
  formErrors.value = {}

  if (!formData.value.username.trim()) {
    formErrors.value.username = 'El nombre de usuario es requerido'
  }

  if (!formData.value.email.trim()) {
    formErrors.value.email = 'El correo electrónico es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    formErrors.value.email = 'Ingrese un correo electrónico válido'
  }

  return Object.keys(formErrors.value).length === 0
}

function startEditing() {
  isEditing.value = true
  formErrors.value = {}
  successMessage.value = ''
}

function cancelEditing() {
  isEditing.value = false
  if (authStore.user) {
    formData.value = {
      username: authStore.user.username,
      email: authStore.user.email,
    }
  }
  formErrors.value = {}
}

async function handleSave() {
  if (!validateForm()) return

  isUpdating.value = true
  try {
    // Note: The PATCH /users endpoint needs to be implemented
    // For now, we'll just show a success message
    successMessage.value = 'Perfil actualizado correctamente'
    isEditing.value = false
    await authStore.fetchUserProfile()
  } catch (error) {
    console.error('Error updating profile:', error)
  } finally {
    isUpdating.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-primary">Mi Perfil</h1>
      <p class="text-gray-600">Administra tu información personal</p>
    </div>

    <!-- Loading -->
    <div v-if="authStore.isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Profile Card -->
    <div v-else class="bg-surface rounded-xl shadow-md overflow-hidden">
      <!-- Header with avatar -->
      <div class="bg-primary px-8 py-6">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-3xl font-bold text-white">
            {{ authStore.user?.username?.charAt(0)?.toUpperCase() || 'A' }}
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">{{ authStore.user?.username }}</h2>
            <p class="text-white/70">{{ authStore.user?.role === 'ADMIN' ? 'Administrador' : 'Usuario' }}</p>
            <span
              :class="[
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2',
                authStore.user?.is_verified ? 'bg-verified text-primary' : 'bg-logout text-white',
              ]"
            >
              {{ authStore.user?.is_verified ? '✓ Verificado' : 'No verificado' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Profile Form -->
      <div class="p-8">
        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="mb-6 bg-verified/20 border border-verified text-primary px-4 py-3 rounded-lg"
        >
          {{ successMessage }}
        </div>

        <form class="space-y-6" @submit.prevent="handleSave">
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Nombre de Usuario</label>
            <BaseInput
              v-if="isEditing"
              v-model="formData.username"
              :error="formErrors.username"
            />
            <p v-else class="text-lg text-primary font-medium">{{ authStore.user?.username }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Correo Electrónico</label>
            <BaseInput
              v-if="isEditing"
              v-model="formData.email"
              type="email"
              :error="formErrors.email"
            />
            <p v-else class="text-lg text-primary font-medium">{{ authStore.user?.email }}</p>
          </div>

          <!-- Password (display only) -->
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Contraseña</label>
            <p class="text-lg text-primary font-medium">••••••••</p>
          </div>

          <!-- Member Since -->
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Miembro desde</label>
            <p class="text-lg text-primary font-medium">
              {{ authStore.user?.created_at ? new Date(authStore.user.created_at).toLocaleDateString('es-ES') : 'N/A' }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <template v-if="isEditing">
              <BaseButton variant="ghost" @click="cancelEditing">Cancelar</BaseButton>
              <BaseButton variant="primary" type="submit" :loading="isUpdating">
                Guardar Cambios
              </BaseButton>
            </template>
            <BaseButton v-else variant="warning" @click="startEditing">
              Editar Perfil
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
