<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { BaseButton, BaseInput } from '@/components/ui'
import logoImage from '@/assets/images/city_incident_reports_icon_app.png'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Form state
const email = ref('')
const password = ref('')
const errors = ref<{ email?: string; password?: string }>({})

// Validation
function validateForm(): boolean {
  errors.value = {}

  if (!email.value) {
    errors.value.email = 'El correo electrónico es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Ingrese un correo electrónico válido'
  }

  if (!password.value) {
    errors.value.password = 'La contraseña es requerida'
  } else if (password.value.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  return Object.keys(errors.value).length === 0
}

// Handle login
async function handleLogin() {
  if (!validateForm()) return

  try {
    await authStore.login({ email: email.value, password: password.value })

    // Redirect to dashboard or original destination
    const redirect = route.query.redirect as string
    router.push(redirect || '/admin/dashboard')
  } catch {
    // Error is handled in store
  }
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <!-- Login Card -->
    <div class="w-full max-w-md">
      <div class="bg-surface rounded-2xl shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="bg-primary px-8 py-6 text-center">
          <img :src="logoImage" alt="Logo" class="w-20 h-20 mx-auto rounded-2xl mb-4" />
          <h1 class="text-2xl font-bold text-white">Panel Administrativo</h1>
          <p class="text-white/70 text-sm mt-1">Gestión de Incidentes Urbanos</p>
        </div>

        <!-- Form -->
        <form class="px-8 py-6 space-y-5" @submit.prevent="handleLogin">
          <!-- Error Message -->
          <div
            v-if="authStore.error"
            class="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg text-sm"
          >
            {{ authStore.error }}
          </div>

          <!-- Email -->
          <BaseInput
            v-model="email"
            type="email"
            label="Correo Electrónico"
            placeholder="admin@ejemplo.com"
            :error="errors.email"
            required
          />

          <!-- Password -->
          <BaseInput
            v-model="password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            :error="errors.password"
            required
          />

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            variant="warning"
            size="lg"
            full-width
            :loading="authStore.isLoading"
          >
            Iniciar Sesión
          </BaseButton>

          <!-- Info message -->
          <p class="text-center text-xs text-gray-500">
            Solo administradores pueden acceder a este panel.
          </p>
        </form>

        <!-- Footer -->
        <div class="px-8 py-4 bg-gray-50 text-center">
          <button class="text-sm text-secondary hover:text-primary transition-colors" @click="goBack">
            ← Volver al mapa público
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
