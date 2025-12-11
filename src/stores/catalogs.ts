import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type {
  Category,
  City,
  Status,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateCityDto,
  UpdateCityDto,
  CreateStatusDto,
  UpdateStatusDto,
} from '@/types'

export const useCatalogsStore = defineStore('catalogs', () => {
  // State
  const categories = ref<Category[]>([])
  const cities = ref<City[]>([])
  const statuses = ref<Status[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ==================== CATEGORIES ====================
  async function fetchCategories(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get<Category[]>('/categories')
      categories.value = response.data
    } catch (err) {
      error.value = 'Error al cargar las categorías'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createCategory(data: CreateCategoryDto): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await api.post('/categories', data)
      await fetchCategories()
    } catch (err) {
      error.value = 'Error al crear la categoría'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateCategory(id: number, data: UpdateCategoryDto): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await api.patch(`/categories/${id}`, data)
      await fetchCategories()
    } catch (err) {
      error.value = 'Error al actualizar la categoría'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteCategory(id: number): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await api.delete(`/categories/${id}`)
      categories.value = categories.value.filter((c) => c.category_id !== id)
    } catch (err) {
      error.value = 'Error al eliminar la categoría'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ==================== CITIES ====================
  async function fetchCities(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get<City[]>('/cities')
      cities.value = response.data
    } catch (err) {
      error.value = 'Error al cargar las ciudades'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createCity(data: CreateCityDto): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await api.post('/cities', data)
      await fetchCities()
    } catch (err) {
      error.value = 'Error al crear la ciudad'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateCity(id: number, data: UpdateCityDto): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await api.patch(`/cities/${id}`, data)
      await fetchCities()
    } catch (err) {
      error.value = 'Error al actualizar la ciudad'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteCity(id: number): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await api.delete(`/cities/${id}`)
      cities.value = cities.value.filter((c) => c.city_id !== id)
    } catch (err) {
      error.value = 'Error al eliminar la ciudad'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ==================== STATUSES ====================
  async function fetchStatuses(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get<Status[]>('/statuses')
      statuses.value = response.data
    } catch (err) {
      error.value = 'Error al cargar los estados'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createStatus(data: CreateStatusDto): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await api.post('/statuses', data)
      await fetchStatuses()
    } catch (err) {
      error.value = 'Error al crear el estado'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateStatus(id: number, data: UpdateStatusDto): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await api.patch(`/statuses/${id}`, data)
      await fetchStatuses()
    } catch (err) {
      error.value = 'Error al actualizar el estado'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteStatus(id: number): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await api.delete(`/statuses/${id}`)
      statuses.value = statuses.value.filter((s) => s.status_id !== id)
    } catch (err) {
      error.value = 'Error al eliminar el estado'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ==================== HELPERS ====================
  async function fetchAllCatalogs(): Promise<void> {
    await Promise.all([fetchCategories(), fetchCities(), fetchStatuses()])
  }

  function clearError(): void {
    error.value = null
  }

  function getCategoryById(id: number): Category | undefined {
    return categories.value.find((c) => c.category_id === id)
  }

  function getCityById(id: number): City | undefined {
    return cities.value.find((c) => c.city_id === id)
  }

  function getStatusById(id: number): Status | undefined {
    return statuses.value.find((s) => s.status_id === id)
  }

  return {
    // State
    categories,
    cities,
    statuses,
    isLoading,
    error,
    // Category Actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    // City Actions
    fetchCities,
    createCity,
    updateCity,
    deleteCity,
    // Status Actions
    fetchStatuses,
    createStatus,
    updateStatus,
    deleteStatus,
    // Helpers
    fetchAllCatalogs,
    clearError,
    getCategoryById,
    getCityById,
    getStatusById,
  }
})
