<script setup lang="ts">
// ВАЖНО: не используем boolean для padding из-за Vue 3 boolean casting
// (absent boolean prop → false). Вместо этого: noPadding=true означает "без отступов"
defineProps<{
  noPadding?: boolean
  hover?: boolean
  glass?: boolean
}>()
</script>

<template>
  <div
    :class="[
      'rounded-2xl transition-all duration-300 overflow-hidden',
      glass ? 'glass' : 'bg-white',
      hover ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : 'shadow-sm',
      'border border-surface-100',
    ]"
  >
    <!-- Header slot: собственная секция с фиксированным padding и разделителем -->
    <div
      v-if="$slots.header"
      style="padding: 1.25rem 1.75rem; border-bottom: 1px solid #f1f5f9"
    >
      <slot name="header" />
    </div>
    <!-- Контент: padding всегда есть, если не передан noPadding -->
    <div :style="!noPadding ? 'padding: 1.75rem' : ''">
      <slot />
    </div>
  </div>
</template>
