import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { User, LoginDto } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const username = computed(() => user.value?.username ?? '')

  // Actions
  async function login(credentials: LoginDto): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      // API sets the authentication cookie
      await api.post('/auth/signin', credentials)

      // Fetch user profile after successful login
      await fetchUserProfile()

      // Verify user is admin
      if (!isAdmin.value) {
        await logout()
        throw new Error('Acceso denegado: Solo administradores pueden acceder.')
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Error al iniciar sesión. Verifique sus credenciales.'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUserProfile(): Promise<void> {
    try {
      const response = await api.get<User>('/users/me')
      user.value = response.data
    } catch (err) {
      user.value = null
      throw err
    }
  }

  async function logout(): Promise<void> {
    try {
      // Optional: Call backend logout endpoint if it exists
      // await api.post('/auth/logout')
    } catch {
      // Ignore logout errors
    } finally {
      // Clear local state
      user.value = null
      error.value = null
    }
  }

  async function checkAuth(): Promise<boolean> {
    try {
      await fetchUserProfile()
      return isAuthenticated.value && isAdmin.value
    } catch {
      return false
    }
  }

  function clearError(): void {
    error.value = null
  }

  return {
    // State
    user,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    username,
    // Actions
    login,
    logout,
    fetchUserProfile,
    checkAuth,
    clearError,
  }
})
