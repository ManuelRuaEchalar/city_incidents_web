<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  show: boolean
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

// Auto-close after duration
watch(
  () => props.show,
  (isVisible) => {
    if (isVisible && props.duration > 0) {
      setTimeout(() => {
        emit('close')
      }, props.duration)
    }
  }
)

function getTypeClasses() {
  switch (props.type) {
    case 'success':
      return 'bg-verified text-primary border-green-500'
    case 'error':
      return 'bg-error text-white border-red-700'
    case 'info':
    default:
      return 'bg-primary text-white border-secondary'
  }
}

function getIcon() {
  switch (props.type) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'info':
    default:
      return 'ℹ'
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div
        v-if="show"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] min-w-[280px] max-w-[400px]"
      >
        <div
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border-l-4',
            getTypeClasses()
          ]"
        >
          <span class="text-lg font-bold">{{ getIcon() }}</span>
          <span class="text-sm font-medium flex-1">{{ message }}</span>
          <button
            class="opacity-70 hover:opacity-100 transition-opacity text-inherit"
            @click="emit('close')"
          >
            ✕
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
