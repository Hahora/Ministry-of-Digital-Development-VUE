<script setup lang="ts">
import { type Component } from 'vue'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-vue-next'

defineProps<{
  title: string
  value: string | number
  delta?: number
  icon?: Component
  color?: string
}>()
</script>

<template>
  <div class="bg-white rounded-2xl border border-surface-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-white hover:to-surface-50/80 transition-all duration-300 group cursor-pointer" style="padding: 1.5rem">
    <div class="flex items-start justify-between mb-3">
      <span class="text-[11px] font-semibold text-surface-400 uppercase tracking-wide leading-none">{{ title }}</span>
      <span
        v-if="icon"
        class="flex items-center justify-center w-8 h-8 rounded-xl bg-primary-50 text-primary-500 group-hover:bg-primary-100 group-hover:scale-105 transition-all duration-200 shrink-0"
      >
        <component :is="icon" :size="17" />
      </span>
    </div>
    <div class="flex items-end gap-3">
      <span class="text-xl font-bold text-surface-900 leading-tight whitespace-nowrap" :style="color ? { color } : {}">{{ value }}</span>
      <span
        v-if="delta !== undefined"
        :class="[
          'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mb-1',
          delta > 0 ? 'bg-danger-50 text-danger-600' : delta < 0 ? 'bg-accent-50 text-accent-600' : 'bg-surface-100 text-surface-500',
        ]"
      >
        <TrendingUp v-if="delta > 0" :size="12" />
        <TrendingDown v-else-if="delta < 0" :size="12" />
        <ArrowRight v-else :size="12" />
        {{ Math.abs(delta) }}%
      </span>
    </div>
  </div>
</template>
