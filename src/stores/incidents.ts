import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { Incident, IncidentDetail, CityStats, UpdateIncidentDto } from '@/types'

export const useIncidentsStore = defineStore('incidents', () => {
  // State
  const incidents = ref<Incident[]>([])
  const selectedIncident = ref<IncidentDetail | null>(null)
  const cityStats = ref<CityStats[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchAllIncidents(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get<Incident[]>('/incidents')
      incidents.value = response.data
    } catch (err) {
      error.value = 'Error al cargar los incidentes'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchIncidentById(id: number): Promise<IncidentDetail> {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get<IncidentDetail>(`/incidents/${id}`)
      selectedIncident.value = response.data
      return response.data
    } catch (err) {
      error.value = 'Error al cargar el detalle del incidente'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCityStats(cityId: number): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get<CityStats[]>(`/incidents/city-stats/${cityId}`)
      cityStats.value = response.data
    } catch (err) {
      error.value = 'Error al cargar las estadísticas de la ciudad'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateIncident(id: number, data: UpdateIncidentDto): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await api.patch(`/incidents/${id}`, data)
      // Refresh incidents list
      await fetchAllIncidents()
    } catch (err) {
      error.value = 'Error al actualizar el incidente'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateIncidentStatus(id: number, statusId: number): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await api.patch(`/incidents/${id}/status`, { status_id: statusId })
      // Refresh incidents list
      await fetchAllIncidents()
    } catch (err) {
      error.value = 'Error al actualizar el estado del incidente'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteIncident(id: number): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await api.delete(`/incidents/${id}`)
      // Remove from local state
      incidents.value = incidents.value.filter((i) => i.incident_id !== id)
    } catch (err) {
      error.value = 'Error al eliminar el incidente'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearSelectedIncident(): void {
    selectedIncident.value = null
  }

  function clearError(): void {
    error.value = null
  }

  return {
    // State
    incidents,
    selectedIncident,
    cityStats,
    isLoading,
    error,
    // Actions
    fetchAllIncidents,
    fetchIncidentById,
    fetchCityStats,
    updateIncident,
    updateIncidentStatus,
    deleteIncident,
    clearSelectedIncident,
    clearError,
  }
})
