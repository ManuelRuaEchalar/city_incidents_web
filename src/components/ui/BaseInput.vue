<script setup lang="ts">
interface Props {
  modelValue: string
  type?: 'text' | 'email' | 'password' | 'number' | 'search'
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputId = props.id || `input-${Math.random().toString(36).substring(2, 9)}`
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-primary mb-1">
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="[
        'w-full px-4 py-2 rounded-lg border transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
        {
          'border-gray-300 hover:border-primary/50': !error,
          'border-error focus:ring-error/50': error,
        },
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <p v-if="error" class="mt-1 text-sm text-error">
      {{ error }}
    </p>
  </div>
</template>
