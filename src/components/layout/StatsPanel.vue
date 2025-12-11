<script setup lang="ts">
import { ref, watch } from 'vue'
import type { City, CityStats } from '@/types'
import { useIconMapper } from '@/composables'
import { LoadingSpinner, BaseSelect } from '@/components/ui'
import chevronUpIcon from '@/assets/icons/chevron_up.svg'
import chevronDownIcon from '@/assets/icons/chevron_down.svg'

interface Props {
  stats: CityStats[]
  cities?: City[]
  selectedCityId?: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cities: () => [],
  loading: false,
})

const emit = defineEmits<{
  (e: 'changeCity', cityId: number): void
}>()

const isCollapsed = ref(false)
const { getLocalIcon } = useIconMapper()
const selectedCity = ref(props.selectedCityId?.toString() || '1')

// Prepare city options
const cityOptions = props.cities.map((c) => ({
  value: c.city_id.toString(),
  label: c.name,
}))

watch(selectedCity, (val) => {
  if (val) emit('changeCity', parseInt(val))
})

watch(
  () => props.selectedCityId,
  (val) => {
    if (val) selectedCity.value = val.toString()
  }
)

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div
    class="bg-surface/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out w-72"
  >
    <!-- Header (Always visible) -->
    <div
      class="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 bg-white"
      @click="toggleCollapse"
    >
      <div>
        <h2 class="text-sm font-bold text-primary">Resumen</h2>
        <p class="text-xs text-secondary font-medium">
          {{ props.cities.find(c => c.city_id === parseInt(selectedCity))?.name || 'Seleccionar ciudad' }}
        </p>
      </div>
      <button class="p-1 rounded-full hover:bg-gray-200 transition-colors">
        <img
          :src="isCollapsed ? chevronDownIcon : chevronUpIcon"
          alt="Toggle"
          class="w-5 h-5 opacity-60"
        />
      </button>
    </div>

    <!-- Content (Collapsible) -->
    <div v-show="!isCollapsed" class="px-4 pb-4 bg-white border-t border-gray-100">
      <!-- City Selector -->
      <div class="pt-3 mb-3">
        <select
          v-model="selectedCity"
          class="w-full text-xs p-2 bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-primary/20 text-gray-700"
        >
          <option v-for="city in cities" :key="city.city_id" :value="city.city_id">
            {{ city.name }}
          </option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-4 flex justify-center">
        <LoadingSpinner size="sm" />
      </div>

      <!-- Empty State -->
      <div v-else-if="stats.length === 0" class="py-4 text-center text-xs text-gray-400">
        Sin datos disponibles.
      </div>

      <!-- Minimal Stats List -->
      <div v-else class="space-y-2">
        <div
          v-for="stat in stats"
          :key="stat.category_id"
          class="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors group"
        >
          <div class="flex items-center gap-2">
            <img :src="getLocalIcon(stat.name)" alt="" class="w-5 h-5 opacity-80 group-hover:opacity-100" />
            <span class="text-xs font-medium text-gray-700">{{ stat.name }}</span>
          </div>
          <span class="text-sm font-bold text-primary">{{ stat._count.incidents }}</span>
        </div>

        <!-- Total -->
        <div class="pt-2 mt-2 border-t border-gray-100 flex justify-between items-end">
          <span class="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total</span>
          <span class="text-lg font-bold text-secondary leading-none">
            {{ stats.reduce((acc, s) => acc + s._count.incidents, 0) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
