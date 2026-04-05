<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import {
  FileText,
  Download,
  FileSpreadsheet,
  Mail,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from 'lucide-vue-next'
import {
  topics,
  categoryLabels,
  categoryColors,
  reports,
  type Category,
} from '@/data/mockData'

/* ── Report builder state ───────────────────────── */
const dateFrom = ref('2026-03-28')
const dateTo = ref('2026-04-04')
const selectedCategories = ref<Category[]>(['zhkh', 'transport', 'health', 'ecology'])
const selectedRegion = ref('all')
const reportType = ref('full')

const allCategories = Object.entries(categoryLabels) as [Category, string][]

const regions = [
  { value: 'all', label: 'Все регионы' },
  { value: 'samara', label: 'г. Самара' },
  { value: 'tolyatti', label: 'г. Тольятти' },
  { value: 'novokuibyshevsk', label: 'г. Новокуйбышевск' },
  { value: 'syzran', label: 'г. Сызрань' },
  { value: 'kinel', label: 'г. Кинель' },
]

const reportTypes = [
  { value: 'full', label: 'Полная сводка' },
  { value: 'top10', label: 'Топ-10' },
  { value: 'category', label: 'По категориям' },
  { value: 'region', label: 'По регионам' },
]

function toggleCategory(cat: Category) {
  const idx = selectedCategories.value.indexOf(cat)
  if (idx >= 0) selectedCategories.value.splice(idx, 1)
  else selectedCategories.value.push(cat)
}

/* ── Preview mock data ──────────────────────────── */
const previewTopics = computed(() => topics.slice(0, 3))
const totalMentions = computed(() => topics.reduce((s, t) => s + t.mentionsCount, 0))
const totalSources = computed(() => topics.reduce((s, t) => s + t.sourcesCount, 0))

/* ── Recent reports ─────────────────────────────── */
const recentReports = reports
</script>

<template>
  <div class="space-y-8 animate-slide-up">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <span class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600">
        <FileText :size="22" />
      </span>
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Отчёты</h1>
        <p class="text-surface-500 text-sm mt-1">
          Генерация аналитических отчётов для руководства. Выберите параметры и сформируйте документ.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Report builder -->
      <div class="xl:col-span-2 space-y-6">
        <BaseCard>
          <template #header>
            <h2 class="text-sm font-semibold text-surface-700">Конструктор отчёта</h2>
          </template>

          <!-- Period -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-xs font-medium text-surface-500 mb-1.5">Дата начала</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
                  <Calendar :size="14" />
                </span>
                <input
                  v-model="dateFrom"
                  type="date"
                  class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-sm text-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors"
                />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-surface-500 mb-1.5">Дата окончания</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
                  <Calendar :size="14" />
                </span>
                <input
                  v-model="dateTo"
                  type="date"
                  class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-sm text-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors"
                />
              </div>
            </div>
          </div>

          <!-- Categories -->
          <div class="mb-6">
            <label class="block text-xs font-medium text-surface-500 mb-2">Категории</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="[key, label] in allCategories"
                :key="key"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer"
                :class="
                  selectedCategories.includes(key)
                    ? 'border-primary-300 bg-primary-50 text-primary-700'
                    : 'border-surface-200 bg-white text-surface-500 hover:bg-surface-50'
                "
                @click="toggleCategory(key)"
              >
                <span
                  class="w-3 h-3 rounded border-2 flex items-center justify-center transition-colors"
                  :class="
                    selectedCategories.includes(key)
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-surface-300'
                  "
                >
                  <CheckCircle2
                    v-if="selectedCategories.includes(key)"
                    :size="10"
                    class="text-white"
                  />
                </span>
                <span
                  class="w-2 h-2 rounded-full"
                  :style="{ backgroundColor: categoryColors[key] }"
                />
                {{ label }}
              </button>
            </div>
          </div>

          <!-- Region & Type -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-xs font-medium text-surface-500 mb-1.5">Регион</label>
              <select
                v-model="selectedRegion"
                class="w-full px-3 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-sm text-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors"
              >
                <option v-for="r in regions" :key="r.value" :value="r.value">{{ r.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-surface-500 mb-1.5">Тип отчёта</label>
              <select
                v-model="reportType"
                class="w-full px-3 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-sm text-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors"
              >
                <option v-for="rt in reportTypes" :key="rt.value" :value="rt.value">{{ rt.label }}</option>
              </select>
            </div>
          </div>

          <!-- Export buttons -->
          <div class="flex flex-wrap gap-3">
            <BaseButton>
              <Download :size="16" />
              Скачать PDF
            </BaseButton>
            <BaseButton variant="secondary">
              <FileSpreadsheet :size="16" />
              Скачать Excel
            </BaseButton>
            <BaseButton variant="ghost">
              <Mail :size="16" />
              Отправить на email
            </BaseButton>
          </div>
        </BaseCard>
      </div>

      <!-- Preview area -->
      <div class="space-y-6">
        <BaseCard class="relative overflow-hidden">
          <!-- Gradient accent -->
          <div class="absolute top-0 left-0 right-0 h-1 gradient-primary" />

          <h2 class="text-sm font-semibold text-surface-700 mb-4 pt-2">Предпросмотр</h2>

          <div class="border border-surface-100 rounded-xl p-4 bg-surface-50/50">
            <!-- Report title -->
            <div class="mb-4">
              <p class="text-sm font-bold text-surface-800">
                {{ reportTypes.find((r) => r.value === reportType)?.label }}
              </p>
              <p class="text-xs text-surface-400 mt-0.5">{{ dateFrom }} — {{ dateTo }}</p>
            </div>

            <!-- Summary stats -->
            <div class="grid grid-cols-3 gap-3 mb-4">
              <div class="text-center p-2 bg-white rounded-lg border border-surface-100">
                <p class="text-lg font-bold text-primary-600">{{ topics.length }}</p>
                <p class="text-[10px] text-surface-400">Тем</p>
              </div>
              <div class="text-center p-2 bg-white rounded-lg border border-surface-100">
                <p class="text-lg font-bold text-primary-600">{{ totalMentions.toLocaleString() }}</p>
                <p class="text-[10px] text-surface-400">Упоминаний</p>
              </div>
              <div class="text-center p-2 bg-white rounded-lg border border-surface-100">
                <p class="text-lg font-bold text-primary-600">{{ totalSources }}</p>
                <p class="text-[10px] text-surface-400">Источников</p>
              </div>
            </div>

            <!-- Top 3 -->
            <div>
              <p class="text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-2">Топ-3 темы</p>
              <div class="space-y-2">
                <div
                  v-for="(topic, i) in previewTopics"
                  :key="topic.id"
                  class="flex items-start gap-2 text-xs"
                >
                  <span class="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {{ i + 1 }}
                  </span>
                  <div class="min-w-0">
                    <p class="text-surface-700 font-medium truncate">{{ topic.title }}</p>
                    <p class="text-surface-400">{{ topic.mentionsCount }} упоминаний</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Recent reports -->
    <BaseCard>
      <template #header>
        <h2 class="text-sm font-semibold text-surface-700">Последние отчёты</h2>
      </template>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-surface-100">
              <th class="text-left text-xs font-medium text-surface-400 uppercase tracking-wider pb-3 pr-4">Название</th>
              <th class="text-left text-xs font-medium text-surface-400 uppercase tracking-wider pb-3 pr-4">Тип</th>
              <th class="text-left text-xs font-medium text-surface-400 uppercase tracking-wider pb-3 pr-4">Дата</th>
              <th class="text-left text-xs font-medium text-surface-400 uppercase tracking-wider pb-3 pr-4">Статус</th>
              <th class="text-right text-xs font-medium text-surface-400 uppercase tracking-wider pb-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="report in recentReports"
              :key="report.id"
              class="border-b border-surface-50 hover:bg-surface-50/50 transition-colors cursor-pointer"
            >
              <td class="py-3.5 pr-4">
                <RouterLink :to="`/reports/${report.id}`" class="font-medium text-surface-800 hover:text-primary-600 transition-colors">
                  {{ report.title }}
                </RouterLink>
              </td>
              <td class="py-3.5 pr-4">
                <span class="text-surface-500">{{ report.typeLabel }}</span>
              </td>
              <td class="py-3.5 pr-4">
                <span class="text-surface-500">{{ report.date }}</span>
              </td>
              <td class="py-3.5 pr-4">
                <BaseBadge color="#22c55e" size="sm">
                  <span class="flex items-center gap-1">
                    <CheckCircle2 :size="12" />
                    Готов
                  </span>
                </BaseBadge>
              </td>
              <td class="py-3.5 text-right flex items-center justify-end gap-2">
                <BaseButton variant="ghost" size="sm">
                  <Download :size="14" />
                  Скачать
                </BaseButton>
                <RouterLink :to="`/reports/${report.id}`">
                  <BaseButton variant="ghost" size="sm">
                    <ArrowRight :size="14" />
                  </BaseButton>
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>
