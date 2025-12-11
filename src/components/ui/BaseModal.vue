<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import cancelIcon from '@/assets/icons/cancel.svg'

interface Props {
  show: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closable) {
    emit('close')
  }
}

function handleBackdropClick() {
  if (props.closable) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleBackdropClick"
        ></div>

        <!-- Modal Content -->
        <div
          :class="[
            'relative bg-surface rounded-2xl shadow-2xl',
            'transform transition-all duration-300',
            'max-h-[90vh] overflow-hidden flex flex-col',
            {
              'w-full max-w-sm': size === 'sm',
              'w-full max-w-md': size === 'md',
              'w-full max-w-lg': size === 'lg',
              'w-full max-w-2xl': size === 'xl',
            },
          ]"
        >
          <!-- Header -->
          <div
            v-if="title || closable"
            class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
          >
            <h2 v-if="title" class="text-xl font-semibold text-primary">
              {{ title }}
            </h2>
            <button
              v-if="closable"
              class="p-1 rounded-full hover:bg-gray-100 transition-colors"
              @click="emit('close')"
            >
              <img :src="cancelIcon" alt="Cerrar" class="w-6 h-6" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-6 py-4">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
