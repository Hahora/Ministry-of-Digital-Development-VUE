<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>()
</script>

<template>
  <button
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md':
          !variant || variant === 'primary',
        'bg-surface-100 text-surface-700 hover:bg-surface-200 active:bg-surface-300':
          variant === 'secondary',
        'bg-transparent text-surface-600 hover:bg-surface-100 active:bg-surface-200':
          variant === 'ghost',
        'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-600':
          variant === 'danger',
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-5 py-2.5 text-sm': !size || size === 'md',
        'px-6 py-3 text-base': size === 'lg',
      },
    ]"
  >
    <slot />
  </button>
</template>
