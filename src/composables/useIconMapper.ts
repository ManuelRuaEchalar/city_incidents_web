// Icon imports - Category standard icons (for cards/popups)
import garbageIcon from '@/assets/icons/garbage.svg'
import lightIcon from '@/assets/icons/light.svg'
import roadIcon from '@/assets/icons/road.svg'
import trafficLightsIcon from '@/assets/icons/traffic-lights-fill.svg'
import buildingIcon from '@/assets/icons/building.svg'
import otherIcon from '@/assets/icons/other_option.svg'

// Local icons (for stats panel / markers)
import localBasuraIcon from '@/assets/icons/local_basura.svg'
import localLuzIcon from '@/assets/icons/local_luz.svg'
import localViaIcon from '@/assets/icons/local_via.svg'
import localSemaforoIcon from '@/assets/icons/local_semaforo.svg'
import localEdificioIcon from '@/assets/icons/local_edificio.svg'

// Option icons (for forms)
import garbageOptionIcon from '@/assets/icons/garbage_option.svg'
import lightOptionIcon from '@/assets/icons/light_option.svg'
import roadOptionIcon from '@/assets/icons/road_option.svg'
import trafficLightsOptionIcon from '@/assets/icons/traffic_lights_option.svg'

type IconType = 'card' | 'local' | 'option' | 'marker'

interface IconSet {
  card: string    // Normal icons for cards (garbage.svg, light.svg, etc.)
  local: string   // Local icons for stats panel (local_basura.svg, etc.)
  option: string  // Option icons for forms
  marker: string  // Marker icons for map
}

const iconMap: Record<string, IconSet> = {
  // Limpieza y Residuos (category_id: 4)
  basura: {
    card: garbageIcon,
    local: localBasuraIcon,
    option: garbageOptionIcon,
    marker: localBasuraIcon,
  },
  garbage: {
    card: garbageIcon,
    local: localBasuraIcon,
    option: garbageOptionIcon,
    marker: localBasuraIcon,
  },
  limpieza: {
    card: garbageIcon,
    local: localBasuraIcon,
    option: garbageOptionIcon,
    marker: localBasuraIcon,
  },
  residuo: {
    card: garbageIcon,
    local: localBasuraIcon,
    option: garbageOptionIcon,
    marker: localBasuraIcon,
  },
  // Alumbrado Público (category_id: 3)
  alumbrado: {
    card: lightIcon,
    local: localLuzIcon,
    option: lightOptionIcon,
    marker: localLuzIcon,
  },
  luz: {
    card: lightIcon,
    local: localLuzIcon,
    option: lightOptionIcon,
    marker: localLuzIcon,
  },
  light: {
    card: lightIcon,
    local: localLuzIcon,
    option: lightOptionIcon,
    marker: localLuzIcon,
  },
  publico: {
    card: lightIcon,
    local: localLuzIcon,
    option: lightOptionIcon,
    marker: localLuzIcon,
  },
  // Vías y calzadas (category_id: 1)
  via: {
    card: roadIcon,
    local: localViaIcon,
    option: roadOptionIcon,
    marker: localViaIcon,
  },
  vias: {
    card: roadIcon,
    local: localViaIcon,
    option: roadOptionIcon,
    marker: localViaIcon,
  },
  calzada: {
    card: roadIcon,
    local: localViaIcon,
    option: roadOptionIcon,
    marker: localViaIcon,
  },
  road: {
    card: roadIcon,
    local: localViaIcon,
    option: roadOptionIcon,
    marker: localViaIcon,
  },
  // Señalización y Semáforos (category_id: 2)
  semaforo: {
    card: trafficLightsIcon,
    local: localSemaforoIcon,
    option: trafficLightsOptionIcon,
    marker: localSemaforoIcon,
  },
  senalizacion: {
    card: trafficLightsIcon,
    local: localSemaforoIcon,
    option: trafficLightsOptionIcon,
    marker: localSemaforoIcon,
  },
  traffic: {
    card: trafficLightsIcon,
    local: localSemaforoIcon,
    option: trafficLightsOptionIcon,
    marker: localSemaforoIcon,
  },
  // Otro (category_id: 5)
  otro: {
    card: buildingIcon,
    local: localEdificioIcon,
    option: buildingIcon,
    marker: localEdificioIcon,
  },
  edificio: {
    card: buildingIcon,
    local: localEdificioIcon,
    option: buildingIcon,
    marker: localEdificioIcon,
  },
  building: {
    card: buildingIcon,
    local: localEdificioIcon,
    option: buildingIcon,
    marker: localEdificioIcon,
  },
}

const defaultIcons: IconSet = {
  card: buildingIcon,
  local: localEdificioIcon,
  option: otherIcon,
  marker: localEdificioIcon,
}

export function useIconMapper() {
  /**
   * Get the appropriate icon for a category name
   * @param categoryName - The name of the category
   * @param type - The type of icon to return (card, local, option, marker)
   * @returns The path to the icon SVG
   */
  function getIcon(categoryName: string, type: IconType = 'card'): string {
    const normalized = categoryName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    // Find matching icon set
    for (const [key, icons] of Object.entries(iconMap)) {
      if (normalized.includes(key)) {
        return icons[type]
      }
    }

    return defaultIcons[type]
  }

  /**
   * Get the card icon for a category (garbage.svg, light.svg, etc.) - for incident cards/lists
   */
  function getCardIcon(categoryName: string): string {
    return getIcon(categoryName, 'card')
  }

  /**
   * Get the marker icon for a category - for map markers
   */
  function getMarkerIcon(categoryName: string): string {
    return getIcon(categoryName, 'marker')
  }

  /**
   * Get the local icon for a category (local_basura.svg, etc.) - for stats panel
   */
  function getLocalIcon(categoryName: string): string {
    return getIcon(categoryName, 'local')
  }

  /**
   * Get the option/form icon for a category
   */
  function getOptionIcon(categoryName: string): string {
    return getIcon(categoryName, 'option')
  }

  return {
    getIcon,
    getCardIcon,
    getMarkerIcon,
    getLocalIcon,
    getOptionIcon,
  }
}

