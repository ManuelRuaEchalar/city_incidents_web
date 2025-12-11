<script setup lang="ts">
interface Props {
  variant?: 'pending' | 'process' | 'resolved' | 'default'
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center font-medium rounded-full',
      {
        // Size variants
        'px-2 py-0.5 text-xs': size === 'sm',
        'px-3 py-1 text-sm': size === 'md',
        'px-4 py-1.5 text-base': size === 'lg',

        // Status variants
        'bg-status-pending text-primary': variant === 'pending',
        'bg-status-process text-primary': variant === 'process',
        'bg-status-resolved text-primary': variant === 'resolved',
        'bg-gray-200 text-gray-700': variant === 'default',
      },
    ]"
  >
    <slot />
  </span>
</template>
