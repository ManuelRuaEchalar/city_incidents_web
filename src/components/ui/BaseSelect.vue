<script setup lang="ts">
interface Props {
  modelValue: string | number
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  id?: string
  options: Array<{ value: string | number; label: string }>
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  placeholder: 'Seleccione una opción',
})

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const selectId = props.id || `select-${Math.random().toString(36).substring(2, 9)}`
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="selectId" class="block text-sm font-medium text-primary mb-1">
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </label>

    <select
      :id="selectId"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="[
        'w-full px-4 py-2 rounded-lg border transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
        'appearance-none bg-white',
        {
          'border-gray-300 hover:border-primary/50': !error,
          'border-error focus:ring-error/50': error,
        },
      ]"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <p v-if="error" class="mt-1 text-sm text-error">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>
