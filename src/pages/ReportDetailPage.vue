<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import MetricCard from '@/components/common/MetricCard.vue'
import { ArrowLeft, Download, FileText, Calendar, MapPin, Tag, CheckCircle2, MessageSquare, Newspaper, Globe } from 'lucide-vue-next'
import { categoryLabels, categoryColors, type Category } from '@/data/mockData'
import { reports as reportsApi } from '@/services/api'

const route = useRoute()
const report = ref<any>(null)

onMounted(async () => {
  const id = route.params.id as string
  report.value = await reportsApi.detail(id).catch(() => null)
})

const regionLabel = computed(() => {
  if (!report.value) return ''
  const map: Record<string, string> = {
    all: 'Все регионы',
  }
  return map[report.value.region] ?? report.value.region
})

const filteredTopics = computed(() => {
  if (!report.value) return []
  return report.value.topics || []
})
</script>

<template>
  <div v-if="report" class="space-y-8 animate-slide-up">

    <!-- Header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-3">
        <RouterLink to="/reports" class="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-100 text-surface-500 hover:bg-surface-200 hover:text-surface-700 transition-colors">
          <ArrowLeft :size="18" />
        </RouterLink>
        <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600 shrink-0">
          <FileText :size="22" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-surface-900 leading-tight">{{ report.title }}</h1>
          <p class="text-surface-500 text-sm mt-0.5">{{ report.typeLabel }} · {{ report.date }}</p>
        </div>
      </div>
      <BaseButton>
        <Download :size="16" />
        Скачать PDF
      </BaseButton>
    </div>

    <!-- Metrics -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <MetricCard
        title="Упоминаний"
        :value="report.mentionsTotal.toLocaleString('ru-RU')"
        trend="up"
        :delta="18"
        icon="MessageSquare"
      />
      <MetricCard
        title="Тем"
        :value="report.topicsCount"
        icon="Newspaper"
      />
      <MetricCard
        title="Источников"
        :value="report.sourcesCount"
        icon="Globe"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">

      <!-- Main: topics -->
      <div class="xl:col-span-2">
        <BaseCard>
          <template #header>
            <h2 class="text-sm font-semibold text-surface-700">Темы в отчёте</h2>
          </template>
          <div class="space-y-3">
            <RouterLink
              v-for="topic in filteredTopics"
              :key="topic.id"
              :to="`/topics/${topic.id}`"
              class="flex items-center gap-3 p-3 rounded-xl border border-surface-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200 group"
            >
              <span
                class="flex-shrink-0 w-2 h-2 rounded-full"
                :style="{ backgroundColor: categoryColors[topic.category] }"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-surface-800 group-hover:text-primary-700 truncate transition-colors">{{ topic.title }}</p>
                <p class="text-xs text-surface-400 mt-0.5">{{ topic.mentionsCount.toLocaleString('ru-RU') }} упом. · {{ categoryLabels[topic.category] }}</p>
              </div>
              <BaseBadge
                :color="topic.severity === 'critical' ? '#dc2626' : topic.severity === 'high' ? '#f97316' : topic.severity === 'medium' ? '#f59e0b' : '#22c55e'"
                size="sm"
              >
                {{ topic.severity === 'critical' ? 'Крит.' : topic.severity === 'high' ? 'Высокий' : topic.severity === 'medium' ? 'Средний' : 'Низкий' }}
              </BaseBadge>
            </RouterLink>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar: params -->
      <div class="space-y-5">
        <BaseCard>
          <template #header>
            <h2 class="text-sm font-semibold text-surface-700">Параметры отчёта</h2>
          </template>
          <div class="space-y-4 text-sm">
            <div class="flex items-start gap-2.5">
              <Calendar :size="15" class="text-surface-400 mt-0.5 shrink-0" />
              <div>
                <p class="text-xs text-surface-400 mb-0.5">Период</p>
                <p class="font-medium text-surface-800">{{ report.from }} — {{ report.to }}</p>
              </div>
            </div>
            <div class="flex items-start gap-2.5">
              <MapPin :size="15" class="text-surface-400 mt-0.5 shrink-0" />
              <div>
                <p class="text-xs text-surface-400 mb-0.5">Регион</p>
                <p class="font-medium text-surface-800">{{ regionLabel }}</p>
              </div>
            </div>
            <div class="flex items-start gap-2.5">
              <Tag :size="15" class="text-surface-400 mt-0.5 shrink-0" />
              <div>
                <p class="text-xs text-surface-400 mb-1">Категории</p>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="cat in report.categories"
                    :key="cat"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-surface-100 text-surface-600"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: categoryColors[cat as Category] }" />
                    {{ categoryLabels[cat as Category] }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-start gap-2.5">
              <CheckCircle2 :size="15" class="text-accent-500 mt-0.5 shrink-0" />
              <div>
                <p class="text-xs text-surface-400 mb-0.5">Статус</p>
                <p class="font-medium text-accent-600">Готов</p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

    </div>
  </div>

  <!-- Not found -->
  <div v-else class="flex flex-col items-center justify-center py-32 gap-4 text-center">
    <FileText :size="48" class="text-surface-200" />
    <p class="text-surface-500 text-lg font-medium">Отчёт не найден</p>
    <RouterLink to="/reports">
      <BaseButton variant="secondary">
        <ArrowLeft :size="16" />
        К отчётам
      </BaseButton>
    </RouterLink>
  </div>
</template>
