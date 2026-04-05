<script setup lang="ts">
import { ref, computed, onMounted, type Component } from 'vue'
import { RouterLink } from 'vue-router'
import MetricCard from '@/components/common/MetricCard.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import IconVK from '@/components/icons/IconVK.vue'
import IconTelegram from '@/components/icons/IconTelegram.vue'
import {
  BarChart3,
  Flame,
  Home,
  Car,
  Heart,
  GraduationCap,
  TreePine,
  Briefcase,
  Shield,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Trophy,
  Activity,
} from 'lucide-vue-next'
import { dashboard, topics as topicsApi } from '@/services/api'
import { categoryLabels, categoryColors, severityColors } from '@/data/mockData'

const topics = ref<any[]>([])
const dailyMentions = ref<any[]>([])
const categoryStats = ref<any[]>([])
const summaryData = ref<any>({})

onMounted(async () => {
  const [sum, mentions, cats, topList] = await Promise.all([
    dashboard.summary().catch(() => ({})),
    dashboard.mentionsDaily().catch(() => ({ data: [] })),
    dashboard.categories().catch(() => ({ data: [] })),
    topicsApi.top(10).catch(() => []),
  ])
  summaryData.value = sum
  dailyMentions.value = mentions.data || []
  categoryStats.value = cats.data || []
  topics.value = topList || []
})

// --- Category icon map ---
const categoryIconComponents: Record<string, Component> = {
  zhkh: Home,
  transport: Car,
  health: Heart,
  education: GraduationCap,
  ecology: TreePine,
  economy: Briefcase,
  safety: Shield,
  social: Users,
}

// --- Trend icon resolver ---
function trendIcon(trend: string): Component {
  if (trend === 'rising') return TrendingUp
  if (trend === 'falling') return TrendingDown
  return ArrowRight
}
function trendColor(trend: string) {
  if (trend === 'rising') return 'text-danger-500'
  if (trend === 'falling') return 'text-accent-500'
  return 'text-surface-400'
}

// --- Area chart: daily mentions ---
const mentionsChartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 220,
    toolbar: { show: false },
    sparkline: { enabled: false },
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  colors: ['#6366f1'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [0, 100],
    },
  },
  stroke: { curve: 'smooth' as const, width: 2.5 },
  dataLabels: { enabled: false },
  xaxis: {
    categories: dailyMentions.value.map((d: any) => d.date),
    labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
  },
  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    padding: { left: 16, right: 24, top: 8, bottom: 8 },
  },
  tooltip: {
    theme: 'light',
    y: { formatter: (val: number) => val.toLocaleString('ru-RU') },
  },
}))

const mentionsChartSeries = computed(() => [
  { name: 'Упоминания', data: dailyMentions.value.map((d: any) => d.count) },
])

// --- Donut chart: categories ---
const categoryChartOptions = computed(() => ({
  chart: {
    type: 'donut',
    height: 240,
    fontFamily: 'Inter, system-ui, sans-serif',
    offsetY: -5,
  },
  labels: categoryStats.value.map((c: any) => categoryLabels[c.category] || c.category),
  colors: categoryStats.value.map((c: any) => categoryColors[c.category] || '#94a3b8'),
  legend: {
    position: 'bottom' as const,
    fontSize: '11px',
    labels: { colors: '#64748b' },
    markers: { size: 6, offsetX: -4 },
  },
  dataLabels: { enabled: false },
  stroke: { width: 2, colors: ['#fff'] },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Всего',
            fontSize: '12px',
            color: '#94a3b8',
            formatter: () => categoryStats.value.reduce((s: number, c: any) => s + c.count, 0).toLocaleString('ru-RU'),
          },
          value: {
            fontSize: '20px',
            fontWeight: 700,
            color: '#0f172a',
          },
        },
      },
    },
  },
  tooltip: {
    y: { formatter: (val: number) => val.toLocaleString('ru-RU') },
  },
}))

const categoryChartSeries = computed(() => categoryStats.value.map((c: any) => c.count))

// --- Mini sparkline options factory ---
function sparklineOptions(color: string) {
  return {
    chart: { type: 'line', height: 30, width: 80, sparkline: { enabled: true } },
    colors: [color],
    stroke: { curve: 'smooth' as const, width: 1.5 },
    tooltip: { enabled: false },
  }
}

</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- ============================================ -->
    <!-- GRADIENT HERO BANNER                         -->
    <!-- ============================================ -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-400 p-6 sm:p-8 text-white shadow-lg">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMCAyYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
      <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
            Дашборд
          </h1>
          <p class="text-primary-100 mt-1 text-sm sm:text-base">
            Обзор за 4 апреля 2026
          </p>
        </div>
        <div class="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium self-start">
          <span class="inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
          Мониторинг активен
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- 1. TOP METRICS ROW                           -->
    <!-- ============================================ -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <RouterLink to="/analytics" class="animate-slide-up block" style="animation-delay: 0ms">
        <MetricCard title="Всего упоминаний" :value="summaryData.total_mentions?.toLocaleString('ru-RU') || '0'" :icon="BarChart3" :delta="summaryData.mentions_delta_pct || 0" />
      </RouterLink>
      <RouterLink to="/topics" class="animate-slide-up block" style="animation-delay: 80ms">
        <MetricCard title="Активных тем" :value="summaryData.active_topics || 0" :icon="Flame" :delta="summaryData.active_topics_delta || 0" />
      </RouterLink>
      <RouterLink to="/sources" class="animate-slide-up block" style="animation-delay: 160ms">
        <MetricCard title="Каналов ВК" :value="summaryData.sources?.vk || 0" :icon="IconVK" color="#0077FF" />
      </RouterLink>
      <RouterLink to="/sources" class="animate-slide-up block" style="animation-delay: 240ms">
        <MetricCard title="Каналов Telegram" :value="summaryData.sources?.telegram || 0" :icon="IconTelegram" color="#26A5E4" />
      </RouterLink>
    </div>

    <!-- ============================================ -->
    <!-- 2. MAIN TWO-COLUMN AREA                      -->
    <!-- ============================================ -->
    <div class="grid grid-cols-1 xl:grid-cols-5 gap-8">
      <!-- LEFT COLUMN ~60% (3 of 5) -->
      <div class="xl:col-span-3">
        <BaseCard noPadding>
          <div class="p-5 pb-3 border-b border-surface-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-50 text-amber-500">
                <Trophy :size="16" />
              </span>
              <h2 class="text-lg font-semibold text-surface-800">Топ-10 проблем региона</h2>
            </div>
            <RouterLink
              to="/topics"
              class="text-xs font-medium text-primary-500 hover:text-primary-700 transition-colors"
            >
              Все темы &rarr;
            </RouterLink>
          </div>

          <ul class="divide-y divide-surface-50">
            <li
              v-for="(topic, idx) in topics"
              :key="topic.id"
              class="animate-slide-up"
              :style="{ animationDelay: `${idx * 60 + 100}ms`, animationFillMode: 'both' }"
            >
              <RouterLink
                :to="`/topics/${topic.id}`"
                :class="[
                  'flex items-center gap-3 px-5 py-3.5 transition-colors group',
                  idx < 3
                    ? 'bg-gradient-to-r from-primary-50/40 via-transparent to-transparent hover:from-primary-50/70'
                    : 'hover:bg-surface-50/70',
                ]"
              >
                <!-- Rank -->
                <span
                  class="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  :class="idx < 3 ? 'gradient-primary text-white shadow-sm' : 'bg-surface-100 text-surface-500'"
                >
                  {{ idx + 1 }}
                </span>

                <!-- Severity dot -->
                <span
                  class="shrink-0 w-2.5 h-2.5 rounded-full ring-2 ring-white"
                  :style="{ backgroundColor: severityColors[topic.severity] }"
                />

                <!-- Content -->
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-surface-800 truncate group-hover:text-primary-600 transition-colors">
                    {{ topic.title }}
                  </p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <BaseBadge :color="categoryColors[topic.category]" size="sm">
                      <component :is="categoryIconComponents[topic.category]" :size="12" class="mr-1 inline-block align-[-2px]" />
                      {{ categoryLabels[topic.category] }}
                    </BaseBadge>
                    <span class="text-[11px] text-surface-400">{{ topic.municipality }}</span>
                  </div>
                </div>

                <!-- Mentions + Trend -->
                <div class="shrink-0 text-right flex items-center gap-2">
                  <div>
                    <p class="text-sm font-semibold text-surface-800">
                      {{ topic.mentionsCount.toLocaleString('ru-RU') }}
                    </p>
                    <span
                      :class="[
                        'inline-flex items-center gap-0.5 text-[11px] font-medium',
                        trendColor(topic.trend),
                      ]"
                    >
                      <component
                        :is="trendIcon(topic.trend)"
                        :size="12"
                        :class="topic.trend === 'rising' ? 'animate-pulse' : ''"
                      />
                      {{ topic.mentionsDelta }}%
                    </span>
                  </div>
                  <!-- Mini sparkline -->
                  <div class="hidden sm:block">
                    <apexchart
                      :options="sparklineOptions(severityColors[topic.severity])"
                      :series="[{ data: topic.trendData }]"
                      type="line"
                      height="30"
                      width="80"
                    />
                  </div>
                </div>
              </RouterLink>
            </li>
          </ul>
        </BaseCard>
      </div>

      <!-- RIGHT COLUMN ~40% (2 of 5) -->
      <div class="xl:col-span-2 space-y-8">
        <!-- Daily mentions area chart -->
        <div class="animate-slide-up" style="animation-delay: 200ms; animation-fill-mode: both">
          <BaseCard>
            <template #header>
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center gap-2">
                  <Activity :size="16" class="text-primary-500" />
                  <h3 class="text-sm font-semibold text-surface-700">Динамика упоминаний</h3>
                </div>
                <RouterLink to="/analytics" class="text-xs font-medium text-primary-500 hover:text-primary-700 transition-colors">Вся аналитика &rarr;</RouterLink>
              </div>
            </template>
            <apexchart
              v-if="dailyMentions.length"
              :options="mentionsChartOptions"
              :series="mentionsChartSeries"
              type="area"
              height="220"
            />
            <p v-else class="text-sm text-surface-400 py-8 text-center">Нет данных</p>
          </BaseCard>
        </div>

        <!-- Category donut chart -->
        <div class="animate-slide-up" style="animation-delay: 320ms; animation-fill-mode: both">
          <BaseCard>
            <template #header>
              <div class="flex items-center justify-between w-full">
                <h3 class="text-sm font-semibold text-surface-700">По категориям</h3>
                <RouterLink to="/analytics" class="text-xs font-medium text-primary-500 hover:text-primary-700 transition-colors">Вся аналитика &rarr;</RouterLink>
              </div>
            </template>
            <apexchart
              v-if="categoryStats.length"
              :options="categoryChartOptions"
              :series="categoryChartSeries"
              type="donut"
              height="240"
            />
            <p v-else class="text-sm text-surface-400 py-8 text-center">Нет данных</p>
          </BaseCard>
        </div>

      </div>
    </div>

  </div>
</template>
