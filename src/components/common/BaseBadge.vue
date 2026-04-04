<script setup lang="ts">
import { type Component } from 'vue'

defineProps<{
  color?: string
  variant?: 'solid' | 'soft'
  size?: 'sm' | 'md'
  icon?: Component
}>()
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap leading-none',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs',
    ]"
    :style="{
      backgroundColor: variant === 'solid' ? color : (color ? color + '18' : undefined),
      color: variant === 'solid' ? '#fff' : color,
    }"
  >
    <component v-if="icon" :is="icon" :size="12" class="shrink-0" />
    <slot />
  </span>
</template>
