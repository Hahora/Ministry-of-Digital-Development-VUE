<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import MetricCard from '@/components/common/MetricCard.vue'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  PieChart,
  Radar,
  Home,
  Car,
  Heart,
  GraduationCap,
  TreePine,
  Briefcase,
  Shield,
  Users,
} from 'lucide-vue-next'
import {
  topics,
  categoryLabels,
  categoryColors,
  categoryStats,
  dailyMentions,
  type Category,
} from '@/data/mockData'

const categoryIconMap: Record<string, Component> = {
  zhkh: Home,
  transport: Car,
  health: Heart,
  education: GraduationCap,
  ecology: TreePine,
  economy: Briefcase,
  safety: Shield,
  social: Users,
}

const activePeriod = ref<string>('7d')
const periods = [
  { key: '24h', label: '24 часа' },
  { key: '7d', label: '7 дней' },
  { key: '30d', label: '30 дней' },
  { key: 'quarter', label: 'Квартал' },
]

/* ── Timeline chart ─────────────────────────────── */
const timelineOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'inherit',
    animations: { enabled: true, easing: 'easeinout', speed: 600 },
  },
  stroke: { curve: 'smooth' as const, width: 3 },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [0, 100] },
  },
  colors: ['#6366f1'],
  xaxis: { categories: dailyMentions.map((d) => d.date) },
  yaxis: { labels: { style: { colors: '#94a3b8' } } },
  dataLabels: { enabled: false },
  grid: { borderColor: '#e2e8f0', strokeDashArray: 4, padding: { left: 8, right: 8, top: 0, bottom: 0 } },
  tooltip: { theme: 'light' },
}))
const timelineSeries = [{ name: 'Упоминания', data: dailyMentions.map((d) => d.count) }]

/* ── Category donut ─────────────────────────────── */
const donutOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'inherit' },
  labels: categoryStats.map((c) => categoryLabels[c.category]),
  colors: categoryStats.map((c) => categoryColors[c.category]),
  legend: { position: 'bottom' as const, fontSize: '12px' },
  plotOptions: { pie: { donut: { size: '62%' } } },
  dataLabels: { enabled: false },
  tooltip: {
    y: {
      formatter: (val: number) => {
        const total = categoryStats.reduce((s, c) => s + c.count, 0)
        return `${val} (${((val / total) * 100).toFixed(1)}%)`
      },
    },
  },
}))
const donutSeries = categoryStats.map((c) => c.count)

/* ── Regional bar chart ─────────────────────────── */
const regionBarOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
  plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: '60%' } },
  colors: ['#6366f1'],
  xaxis: { labels: { style: { colors: '#94a3b8' } } },
  yaxis: { labels: { style: { colors: '#475569', fontWeight: 600 } } },
  dataLabels: { enabled: true, style: { fontSize: '11px' } },
  grid: { borderColor: '#e2e8f0', strokeDashArray: 4, padding: { left: 4, right: 8, top: 0, bottom: 0 } },
  tooltip: { theme: 'light' },
}))

/* ── Sentiment radar ────────────────────────────── */
const sentimentByCategory = computed(() => {
  const map: Record<string, { sum: number; count: number }> = {}
  topics.forEach((t) => {
    if (!map[t.category]) map[t.category] = { sum: 0, count: 0 }
    map[t.category].sum += t.sentiment
    map[t.category].count += 1
  })
  return Object.entries(map).map(([cat, v]) => ({
    category: cat as Category,
    negative: Math.round(Math.abs(v.sum / v.count) * 100),
    neutral: Math.round((1 - Math.abs(v.sum / v.count)) * 60),
    positive: Math.round((1 - Math.abs(v.sum / v.count)) * 40),
  }))
})

const radarOptions = computed(() => ({
  chart: { type: 'radar', toolbar: { show: false }, fontFamily: 'inherit' },
  xaxis: {
    categories: sentimentByCategory.value.map((s) => categoryLabels[s.category]),
  },
  colors: ['#ef4444', '#94a3b8', '#22c55e'],
  stroke: { width: 2 },
  fill: { opacity: 0.2 },
  markers: { size: 3 },
  yaxis: { show: false },
  legend: { position: 'bottom' as const, fontSize: '12px' },
}))
const radarSeries = computed(() => [
  { name: 'Негативный', data: sentimentByCategory.value.map((s) => s.negative) },
  { name: 'Нейтральный', data: sentimentByCategory.value.map((s) => s.neutral) },
  { name: 'Позитивный', data: sentimentByCategory.value.map((s) => s.positive) },
])

/* ── Trends ─────────────────────────────────────── */
const risingTopics = computed(() => topics.filter((t) => t.trend === 'rising'))
const fallingTopics = computed(() => topics.filter((t) => t.trend === 'falling'))

function sparklineOptions(data: number[], color: string) {
  return {
    chart: { type: 'line', sparkline: { enabled: true }, animations: { enabled: false } },
    stroke: { curve: 'smooth' as const, width: 2 },
    colors: [color],
    tooltip: { enabled: false },
  }
}

</script>

<template>
  <div class="space-y-8 animate-slide-up">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600">
          <BarChart3 :size="22" />
        </span>
        <div>
          <h1 class="text-2xl font-bold text-surface-900">Аналитика</h1>
          <p class="text-surface-500 text-sm mt-1">Визуализация трендов и метрик информационного поля</p>
        </div>
      </div>
      <div class="flex gap-2 flex-wrap">
        <BaseButton
          v-for="p in periods"
          :key="p.key"
          :variant="activePeriod === p.key ? 'primary' : 'secondary'"
          size="sm"
          @click="activePeriod = p.key"
        >
          {{ p.label }}
        </BaseButton>
      </div>
    </div>

    <!-- Charts grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Timeline -->
      <BaseCard>
        <template #header>
          <h2 class="flex items-center gap-2 text-sm font-semibold text-surface-700">
            <Activity :size="16" class="text-primary-500" />
            Динамика упоминаний
          </h2>
        </template>
        <apexchart type="area" height="280" :options="timelineOptions" :series="timelineSeries" />
      </BaseCard>

      <!-- Category donut -->
      <BaseCard>
        <template #header>
          <h2 class="flex items-center gap-2 text-sm font-semibold text-surface-700">
            <PieChart :size="16" class="text-primary-500" />
            Распределение по категориям
          </h2>
        </template>
        <apexchart type="donut" height="280" :options="donutOptions" :series="donutSeries" />
      </BaseCard>


      <!-- Sentiment radar -->
      <BaseCard>
        <template #header>
          <h2 class="flex items-center gap-2 text-sm font-semibold text-surface-700">
            <Radar :size="16" class="text-primary-500" />
            Тональность по категориям
          </h2>
        </template>
        <apexchart type="radar" height="280" :options="radarOptions" :series="radarSeries" />
      </BaseCard>
    </div>

    <!-- Trends section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Rising -->
      <BaseCard>
        <template #header>
          <div class="flex items-center gap-2">
            <TrendingUp :size="14" class="text-danger-500" />
            <h2 class="text-sm font-semibold text-surface-700">Растущие темы</h2>
          </div>
        </template>
        <div class="space-y-3">
          <div
            v-for="topic in risingTopics"
            :key="topic.id"
            class="flex items-center gap-4 p-3 rounded-xl bg-surface-50 hover:bg-surface-100 transition-colors"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-surface-800 truncate">{{ topic.title }}</p>
              <div class="flex items-center gap-2 mt-1">
                <BaseBadge :color="categoryColors[topic.category]" size="sm">
                  <component :is="categoryIconMap[topic.category]" :size="12" class="mr-1 inline-block" />
                  {{ categoryLabels[topic.category] }}
                </BaseBadge>
                <span class="text-xs text-surface-400">{{ topic.mentionsCount }} упоминаний</span>
              </div>
            </div>
            <div class="w-20 h-8 shrink-0">
              <apexchart
                type="line"
                height="32"
                :options="sparklineOptions(topic.trendData, '#ef4444')"
                :series="[{ data: topic.trendData }]"
              />
            </div>
            <span class="text-xs font-semibold text-danger-600 bg-danger-50 px-2 py-0.5 rounded-full shrink-0">
              +{{ topic.mentionsDelta }}%
            </span>
          </div>
        </div>
      </BaseCard>

      <!-- Falling -->
      <BaseCard>
        <template #header>
          <div class="flex items-center gap-2">
            <TrendingDown :size="14" class="text-accent-500" />
            <h2 class="text-sm font-semibold text-surface-700">Затухающие темы</h2>
          </div>
        </template>
        <div class="space-y-3">
          <div
            v-for="topic in fallingTopics"
            :key="topic.id"
            class="flex items-center gap-4 p-3 rounded-xl bg-surface-50 hover:bg-surface-100 transition-colors"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-surface-800 truncate">{{ topic.title }}</p>
              <div class="flex items-center gap-2 mt-1">
                <BaseBadge :color="categoryColors[topic.category]" size="sm">
                  <component :is="categoryIconMap[topic.category]" :size="12" class="mr-1 inline-block" />
                  {{ categoryLabels[topic.category] }}
                </BaseBadge>
                <span class="text-xs text-surface-400">{{ topic.mentionsCount }} упоминаний</span>
              </div>
            </div>
            <div class="w-20 h-8 shrink-0">
              <apexchart
                type="line"
                height="32"
                :options="sparklineOptions(topic.trendData, '#22c55e')"
                :series="[{ data: topic.trendData }]"
              />
            </div>
            <span class="text-xs font-semibold text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full shrink-0">
              {{ topic.mentionsDelta }}%
            </span>
          </div>
          <div v-if="fallingTopics.length === 0" class="text-sm text-surface-400 text-center py-6">
            Нет затухающих тем за выбранный период
          </div>
        </div>
      </BaseCard>
    </div>

  </div>
</template>
