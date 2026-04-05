<script setup lang="ts">
import { computed, ref, onMounted, type Component } from 'vue'
import IconVK from '@/components/icons/IconVK.vue'
import IconTelegram from '@/components/icons/IconTelegram.vue'
import { useRoute, RouterLink } from 'vue-router'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import MetricCard from '@/components/common/MetricCard.vue'
import {
  ArrowLeft,
  MapPin,
  MessageSquare,
  Newspaper,
  ExternalLink,
  X,
  TrendingUp,
  Info,
  CheckCircle2,
  BarChart3,
  Clock,
  Search,
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
  categoryLabels,
  categoryColors,
  severityLabels,
  severityColors,
  type Category,
} from '@/data/mockData'
import { topics as topicsApi } from '@/services/api'

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

const route = useRoute()

const topic = ref<any>(null)

onMounted(async () => {
  const id = route.params.id as string
  topic.value = await topicsApi.detail(id).catch(() => null)
})

const sourceTypeLabels: Record<string, string> = {
  vk: 'ВКонтакте',
  telegram: 'Telegram',
}

const sourceTypeColors: Record<string, string> = {
  vk: '#0077FF',
  telegram: '#26A5E4',
}

const sourceIconMap: Record<string, Component> = {
  vk: IconVK,
  telegram: IconTelegram,
}

const showSourcesModal = ref(false)

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function formatNumber(n: number): string {
  return n.toLocaleString('ru-RU')
}

interface SentimentComments {
  aggression?: number
  anxiety?: number
  neutral?: number
  positive?: number
  sarcasm?: number
}

const sentimentConfig = [
  { key: 'aggression', label: 'Агрессия',  emoji: '😡', color: '#dc2626' },
  { key: 'anxiety',    label: 'Тревога',   emoji: '😰', color: '#f97316' },
  { key: 'sarcasm',    label: 'Сарказм',   emoji: '😏', color: '#a855f7' },
  { key: 'neutral',    label: 'Нейтрально',emoji: '😐', color: '#94a3b8' },
  { key: 'positive',   label: 'Позитив',   emoji: '😊', color: '#22c55e' },
]

function sentimentItems(topic: { comment_sentiments?: SentimentComments; sentiment?: number }) {
  const raw = topic.comment_sentiments ?? {
    aggression: Math.round(Math.abs(Math.min(topic.sentiment ?? 0, 0)) * 5),
    anxiety:    Math.round(Math.abs(Math.min(topic.sentiment ?? 0, 0)) * 3),
    neutral:    2,
    positive:   Math.round(Math.max(topic.sentiment ?? 0, 0) * 5),
    sarcasm:    1,
  }
  const total = Object.values(raw).reduce((a, b) => a + (b ?? 0), 0) || 1
  return sentimentConfig.map(c => ({
    ...c,
    value: raw[c.key as keyof SentimentComments] ?? 0,
    pct: Math.round(((raw[c.key as keyof SentimentComments] ?? 0) / total) * 100),
  })).sort((a, b) => b.value - a.value)
}

function sentimentLabel(s: number): string {
  if (s <= -0.6) return 'Резко негативная'
  if (s <= -0.3) return 'Негативная'
  if (s <= 0.3) return 'Нейтральная'
  if (s <= 0.6) return 'Позитивная'
  return 'Резко позитивная'
}

function sentimentColor(s: number): string {
  if (s <= -0.6) return '#dc2626'
  if (s <= -0.3) return '#f97316'
  if (s <= 0.3) return '#94a3b8'
  if (s <= 0.6) return '#22c55e'
  return '#16a34a'
}

const trendChartOptions = computed(() => {
  if (!topic.value || !topic.value.trendData?.length) return {}
  const dataLength = topic.value.trendData.length
  const labels = Array.from({ length: dataLength }, (_, i) => {
    const daysAgo = dataLength - 1 - i
    if (daysAgo === 0) return 'Сегодня'
    if (daysAgo === 1) return 'Вчера'
    return `${daysAgo} дн. назад`
  })
  return {
    chart: {
      type: 'area',
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'Inter, system-ui, sans-serif',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
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
    stroke: {
      curve: 'smooth' as const,
      width: 3,
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: labels,
      labels: {
        style: { colors: '#94a3b8', fontSize: '11px' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '11px' },
        formatter: (val: number) => val.toLocaleString('ru-RU'),
      },
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4,
      padding: { left: 8, right: 8, top: 0, bottom: 0 },
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val: number) => `${val.toLocaleString('ru-RU')} упоминаний`,
      },
    },
  }
})

const trendChartSeries = computed(() => {
  if (!topic.value) return []
  return [
    {
      name: 'Упоминания',
      data: topic.value.trendData,
    },
  ]
})
</script>

<template>
  <!-- 404 State -->
  <div v-if="!topic" class="flex flex-col items-center justify-center py-32 animate-fade-in">
    <div class="w-20 h-20 rounded-full bg-surface-100 flex items-center justify-center mb-6">
      <Search :size="40" class="text-surface-300" />
    </div>
    <h2 class="text-xl font-bold text-surface-700 mb-2">Тема не найдена</h2>
    <p class="text-surface-400 mb-6">Запрашиваемая тема не существует или была удалена</p>
    <RouterLink to="/topics">
      <BaseButton variant="primary">
        <ArrowLeft :size="16" />
        Вернуться к ленте
      </BaseButton>
    </RouterLink>
  </div>

  <!-- Detail content -->
  <div v-else class="animate-fade-in">
    <!-- Back button -->
    <RouterLink
      to="/topics"
      class="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-primary-600 transition-colors duration-200 mb-6 group"
    >
      <ArrowLeft :size="16" class="group-hover:-translate-x-0.5 transition-transform" />
      Назад к ленте событий
    </RouterLink>

    <!-- Header card with gradient top border -->
    <div class="header-card-wrapper mb-6">
      <BaseCard class="!border-t-0 !rounded-t-none relative">
        <div class="flex items-center gap-2 mb-4 flex-wrap">
          <BaseBadge :color="severityColors[topic.severity]" variant="solid" size="md">
            {{ severityLabels[topic.severity] }}
          </BaseBadge>
          <BaseBadge :color="categoryColors[topic.category]" :icon="categoryIconMap[topic.category]" size="md">
            {{ categoryLabels[topic.category] }}
          </BaseBadge>
        </div>

        <h1 class="text-xl sm:text-2xl font-bold text-surface-900 leading-snug mb-3">
          {{ topic.title }}
        </h1>

        <div class="flex items-center gap-3 text-sm text-surface-500 flex-wrap">
          <span class="inline-flex items-center gap-1.5">
            <MapPin :size="16" class="text-surface-400" />
            {{ topic.municipality }}, {{ topic.region }}
          </span>
          <span class="text-surface-300">|</span>
          <span class="text-surface-400">
            Создано: {{ formatShortDate(topic.createdAt) }}
          </span>
        </div>

        <p class="text-surface-600 leading-relaxed mt-4 text-sm">
          {{ topic.summary }}
        </p>
      </BaseCard>
    </div>

    <!-- Metrics row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <MetricCard
        title="Упоминания"
        :value="formatNumber(topic.mentionsCount)"
        :delta="topic.mentionsDelta"
        :icon="MessageSquare"
      />
      <MetricCard
        title="Источники"
        :value="topic.sourcesCount"
        :icon="Newspaper"
      />
      <div class="bg-white rounded-2xl border border-surface-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden" style="padding: 1.25rem">
        <div class="flex items-start justify-between mb-3">
          <span class="text-[11px] font-semibold text-surface-400 uppercase tracking-wide leading-none">Тональность</span>
          <BarChart3 :size="16" class="text-surface-300" />
        </div>

        <!-- Dominant -->
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl leading-none">{{ sentimentItems(topic)[0]?.emoji }}</span>
          <div>
            <p class="text-base font-bold text-surface-900 leading-tight">{{ sentimentItems(topic)[0]?.label }}</p>
            <p class="text-xs text-surface-400">{{ sentimentItems(topic)[0]?.value }} упом.</p>
          </div>
        </div>

        <!-- Segmented bar -->
        <div class="flex rounded-full overflow-hidden h-1.5 mb-3 gap-px">
          <div
            v-for="s in sentimentItems(topic).filter(s => s.value > 0)"
            :key="s.key"
            class="h-full transition-all duration-700"
            :style="{ width: s.pct + '%', backgroundColor: s.color }"
          />
        </div>

        <!-- Rest as dots -->
        <div class="flex flex-wrap gap-x-3 gap-y-1">
          <span
            v-for="s in sentimentItems(topic).slice(1)"
            :key="s.key"
            class="flex items-center gap-1 text-[11px] text-surface-500"
          >
            <span class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: s.color, opacity: s.value > 0 ? 1 : 0.25 }" />
            {{ s.emoji }} {{ s.label }} <span class="font-semibold" :style="{ color: s.color, opacity: s.value > 0 ? 1 : 0.4 }">{{ s.value }}</span>
          </span>
        </div>
      </div>
      <MetricCard
        title="Обновлено"
        :value="formatShortDate(topic.updatedAt)"
        :icon="Clock"
      />
    </div>

    <!-- Why in top -->
    <BaseCard class="mb-6 !border-primary-200 !bg-primary-50/50">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
          <Info :size="20" class="text-primary-600" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-primary-900 mb-1">Почему в топе</h3>
          <p class="text-sm text-primary-800 leading-relaxed">{{ topic.whyInTop }}</p>
        </div>
      </div>
    </BaseCard>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Key facts -->
      <BaseCard>
        <template #header>
          <h3 class="text-sm font-bold text-surface-900 flex items-center gap-2">
            <CheckCircle2 :size="20" class="text-accent-500" />
            Ключевые факты
          </h3>
        </template>
        <ol class="space-y-3">
          <li
            v-for="(fact, index) in topic.facts"
            :key="index"
            class="flex items-start gap-3 animate-slide-right"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <span class="fact-number w-6 h-6 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              {{ index + 1 }}
            </span>
            <span class="text-sm text-surface-700 leading-relaxed">{{ fact }}</span>
          </li>
        </ol>
      </BaseCard>

      <!-- Sources list -->
      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between w-full">
            <h3 class="text-sm font-bold text-surface-900 flex items-center gap-2">
              <Newspaper :size="20" class="text-primary-500" />
              Источники
              <span class="text-xs font-normal text-surface-400">({{ topic.sources.length }})</span>
            </h3>
            <button
              v-if="topic.sources.length > 4"
              class="text-xs font-medium text-primary-500 hover:text-primary-700 transition-colors"
              @click="showSourcesModal = true"
            >
              Все {{ topic.sources.length }} &rarr;
            </button>
          </div>
        </template>
        <div class="space-y-2.5">
          <div
            v-for="(source, index) in topic.sources.slice(0, 4)"
            :key="source.id"
            class="source-item flex items-center gap-3 p-3 rounded-xl bg-surface-50 hover:bg-surface-100 border border-transparent hover:border-surface-200 transition-all duration-200 cursor-pointer"
            :style="{ animationDelay: `${index * 80}ms` }"
          >
            <component :is="sourceIconMap[source.type]" :size="16" :style="{ color: sourceTypeColors[source.type] }" class="shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-surface-800 truncate">{{ source.name }}</p>
              <p class="text-xs text-surface-400">{{ sourceTypeLabels[source.type] }} · {{ formatShortDate(source.publishedAt) }}</p>
            </div>
            <a :href="source.url" target="_blank" class="text-surface-400 hover:text-primary-500 transition-colors shrink-0 p-1.5 rounded-lg hover:bg-primary-50">
              <ExternalLink :size="14" />
            </a>
          </div>
          <button
            v-if="topic.sources.length > 4"
            class="w-full py-2 text-xs font-medium text-primary-500 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-colors"
            @click="showSourcesModal = true"
          >
            + ещё {{ topic.sources.length - 4 }} источников
          </button>
        </div>
      </BaseCard>
    </div>

    <!-- Trend chart -->
    <BaseCard class="mb-6">
      <template #header>
        <h3 class="text-sm font-bold text-surface-900 flex items-center gap-2">
          <TrendingUp :size="20" class="text-primary-500" />
          Динамика обсуждений
        </h3>
      </template>
      <apexchart
        v-if="topic?.trendData?.length"
        type="area"
        height="280"
        :options="trendChartOptions"
        :series="trendChartSeries"
      />
      <p v-else class="text-sm text-surface-400 py-8 text-center">Нет данных о динамике</p>
    </BaseCard>

    <!-- Sources modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSourcesModal && topic" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" @click="showSourcesModal = false" />
          <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <!-- Header -->
            <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Newspaper :size="18" class="text-primary-500" />
                <h3 class="text-base font-semibold text-surface-900">Все источники</h3>
                <span class="text-sm text-surface-400">({{ topic.sources.length }})</span>
              </div>
              <button class="w-8 h-8 flex items-center justify-center rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors" @click="showSourcesModal = false">
                <X :size="18" />
              </button>
            </div>
            <!-- Body -->
            <div style="padding: 1rem; max-height: 60vh; overflow-y: auto" class="space-y-2">
              <div
                v-for="source in topic.sources"
                :key="source.id"
                class="flex items-center gap-3 p-3 rounded-xl bg-surface-50 hover:bg-surface-100 border border-transparent hover:border-surface-200 transition-all duration-150"
              >
                <component :is="sourceIconMap[source.type]" :size="18" :style="{ color: sourceTypeColors[source.type] }" class="shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-surface-800 truncate">{{ source.name }}</p>
                  <p class="text-xs text-surface-400">{{ sourceTypeLabels[source.type] }} · {{ formatShortDate(source.publishedAt) }}</p>
                </div>
                <a :href="source.url" target="_blank" class="text-surface-400 hover:text-primary-500 transition-colors shrink-0 p-1.5 rounded-lg hover:bg-primary-50">
                  <ExternalLink :size="14" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.header-card-wrapper {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
}

.header-card-wrapper::before {
  content: '';
  display: block;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa);
  border-radius: 1rem 1rem 0 0;
}

.fact-number {
  animation: pulse-subtle 2s ease-in-out infinite;
}

@keyframes pulse-subtle {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

.source-item {
  will-change: transform;
}

.source-item:hover {
  transform: translateX(4px);
}

.modal-enter-active { transition: opacity 0.2s ease; }
.modal-leave-active { transition: opacity 0.15s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .relative { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from .relative { transform: translateY(12px) scale(0.97); opacity: 0; }
</style>
