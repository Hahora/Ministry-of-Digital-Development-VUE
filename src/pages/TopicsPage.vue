<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import { RouterLink } from 'vue-router'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import {
  Search,
  MapPin,
  MessageSquare,
  Newspaper,
  TrendingUp,
  TrendingDown,
  ArrowRight,
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
  type Topic,
  type Category,
} from '@/data/mockData'
import { topics as topicsApi } from '@/services/api'
import { onMounted } from 'vue'

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

const topics = ref<any[]>([])

onMounted(async () => {
  topics.value = await topicsApi.list({ limit: 50 }).catch(() => [])
})

const searchQuery = ref('')
const selectedCategory = ref<Category | 'all'>('all')
const selectedSeverity = ref<string>('all')
const sortBy = ref<'severity' | 'date' | 'mentions'>('severity')

const sortOptions: { key: 'severity' | 'date' | 'mentions'; label: string }[] = [
  { key: 'severity', label: 'По важности' },
  { key: 'date', label: 'По дате' },
  { key: 'mentions', label: 'По упоминаниям' },
]

const categories = computed(() => {
  const cats = Object.keys(categoryLabels) as Category[]
  return cats.map(c => ({
    key: c,
    label: categoryLabels[c],
    color: categoryColors[c],
  }))
})

const severityOrder: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

const severityFilters = [
  { key: 'all', label: 'Все' },
  { key: 'critical', label: 'Критический', color: severityColors.critical },
  { key: 'high', label: 'Высокий', color: severityColors.high },
  { key: 'medium', label: 'Средний', color: severityColors.medium },
  { key: 'low', label: 'Низкий', color: severityColors.low },
]

const filteredTopics = computed(() => {
  let result = [...topics.value]

  if (selectedCategory.value !== 'all') {
    result = result.filter(t => t.category === selectedCategory.value)
  }

  if (selectedSeverity.value !== 'all') {
    result = result.filter(t => t.severity === selectedSeverity.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    result = result.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.municipality.toLowerCase().includes(q)
    )
  }

  if (sortBy.value === 'severity') {
    result.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
  } else if (sortBy.value === 'date') {
    result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  } else if (sortBy.value === 'mentions') {
    result.sort((a, b) => b.mentionsCount - a.mentionsCount)
  }

  return result
})

const trendColors: Record<string, string> = {
  rising: 'text-danger-500',
  stable: 'text-surface-400',
  falling: 'text-accent-500',
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function formatNumber(n: number): string {
  return n.toLocaleString('ru-RU')
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- Page header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-surface-900 flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
          <Newspaper :size="20" />
        </div>
        Лента событий
      </h1>
      <p class="text-surface-500 mt-1.5 ml-[46px]">
        {{ filteredTopics.length }} из {{ topics.length }} тем
      </p>
    </div>

    <!-- Filters -->
    <BaseCard class="mb-6 sticky-filters !rounded-2xl !shadow-md !border-surface-100/80 backdrop-blur-sm">
      <!-- Search -->
      <div class="relative mb-3">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
          <Search :size="15" />
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по темам..."
          class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all duration-200"
        />
      </div>

      <!-- Sort -->
      <div class="flex gap-0.5 bg-surface-100 rounded-xl p-1 mb-5">
        <button
          v-for="opt in sortOptions"
          :key="opt.key"
          @click="sortBy = opt.key"
          :class="[
            'flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer text-center',
            sortBy === opt.key
              ? 'bg-white text-primary-700 shadow-sm ring-1 ring-surface-200/50'
              : 'text-surface-500 hover:text-surface-700 hover:bg-white/60',
          ]"
        >
          {{ opt.label }}
        </button>
      </div>

      <!-- Category pills -->
      <div class="mb-4">
        <p class="text-xs font-medium text-surface-400 uppercase tracking-wider mb-2">Категория</p>
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectedCategory = 'all'"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer border',
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300',
            ]"
          >
            Все
          </button>
          <button
            v-for="cat in categories"
            :key="cat.key"
            @click="selectedCategory = cat.key"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer border inline-flex items-center gap-1.5',
              selectedCategory === cat.key
                ? 'text-white shadow-sm'
                : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300',
            ]"
            :style="selectedCategory === cat.key ? { backgroundColor: cat.color, borderColor: cat.color } : {}"
          >
            <component :is="categoryIconMap[cat.key]" :size="14" />
            <span>{{ cat.label }}</span>
          </button>
        </div>
      </div>

      <!-- Severity pills -->
      <div>
        <p class="text-xs font-medium text-surface-400 uppercase tracking-wider mb-2">Уровень важности</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="sev in severityFilters"
            :key="sev.key"
            @click="selectedSeverity = sev.key"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer border',
              selectedSeverity === sev.key
                ? 'text-white shadow-sm'
                : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300',
            ]"
            :style="
              selectedSeverity === sev.key
                ? { backgroundColor: sev.color || '#4f46e5', borderColor: sev.color || '#4f46e5' }
                : {}
            "
          >
            {{ sev.label }}
          </button>
        </div>
      </div>
    </BaseCard>

    <!-- Topics grid -->
    <TransitionGroup
      name="topic-list"
      tag="div"
      class="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <RouterLink
        v-for="(topic, index) in filteredTopics"
        :key="topic.id"
        :to="`/topics/${topic.id}`"
        class="block group"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <div
          class="topic-card bg-white rounded-2xl border border-surface-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-surface-200 transition-all duration-300 overflow-hidden animate-slide-up"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <div class="flex">
            <!-- Severity left border -->
            <div
              class="w-1.5 shrink-0 rounded-l-2xl transition-all duration-300 group-hover:w-2"
              :style="{ backgroundColor: severityColors[topic.severity] }"
            />

            <div class="flex-1 p-5">
              <!-- Top row: badges -->
              <div class="flex items-center gap-2 mb-2.5 flex-wrap">
                <BaseBadge :color="severityColors[topic.severity]" size="sm">
                  {{ severityLabels[topic.severity] }}
                </BaseBadge>
                <BaseBadge :color="categoryColors[topic.category]" :icon="categoryIconMap[topic.category]" size="sm">
                  {{ categoryLabels[topic.category] }}
                </BaseBadge>
              </div>

              <!-- Title -->
              <h3 class="text-sm font-bold text-surface-900 group-hover:text-primary-600 transition-colors duration-200 mb-2 leading-snug">
                {{ topic.title }}
              </h3>

              <!-- Summary -->
              <p class="text-xs text-surface-500 leading-relaxed mb-3 line-clamp-2">
                {{ topic.summary }}
              </p>

              <!-- Bottom row: meta -->
              <div class="flex items-center gap-3 flex-wrap text-xs text-surface-400" style="line-height:1">
                <span class="inline-flex items-center gap-1" style="line-height:1">
                  <MapPin :size="12" class="shrink-0 translate-y-px" />
                  {{ topic.municipality }}
                </span>

                <span class="inline-flex items-center gap-1 font-medium" style="line-height:1">
                  <MessageSquare :size="12" class="shrink-0 translate-y-px" />
                  {{ formatNumber(topic.mentionsCount) }}
                  <span :class="['font-semibold', topic.mentionsDelta > 0 ? 'text-danger-500' : 'text-accent-500']">
                    {{ topic.mentionsDelta > 0 ? '+' : '' }}{{ topic.mentionsDelta }}%
                  </span>
                </span>

                <span class="inline-flex items-center gap-1" style="line-height:1">
                  <Newspaper :size="12" class="shrink-0 translate-y-px" />
                  {{ topic.sourcesCount }} ист.
                </span>

                <span :class="['inline-flex items-center gap-0.5 font-bold', trendColors[topic.trend]]" style="line-height:1">
                  <TrendingUp v-if="topic.trend === 'rising'" :size="12" class="shrink-0" />
                  <TrendingDown v-else-if="topic.trend === 'falling'" :size="12" class="shrink-0" />
                  <ArrowRight v-else :size="12" class="shrink-0" />
                  {{ topic.trend === 'rising' ? 'Растёт' : topic.trend === 'stable' ? 'Стабильно' : 'Снижается' }}
                </span>

                <span class="ml-auto text-surface-300" style="line-height:1">
                  {{ formatDate(topic.updatedAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </RouterLink>
    </TransitionGroup>

    <!-- Empty state -->
    <div
      v-if="filteredTopics.length === 0"
      class="flex flex-col items-center justify-center py-20 animate-fade-in"
    >
      <div class="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mb-4">
        <Search :size="32" class="text-surface-300" />
      </div>
      <p class="text-surface-500 font-medium mb-1">Нет результатов</p>
      <p class="text-surface-400 text-sm">Попробуйте изменить фильтры или поисковый запрос</p>
      <BaseButton
        variant="ghost"
        size="sm"
        class="mt-4"
        @click="searchQuery = ''; selectedCategory = 'all'; selectedSeverity = 'all'"
      >
        Сбросить фильтры
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.sticky-filters {
  background: rgba(255,255,255,0.92);
}

.topic-card {
  will-change: transform, box-shadow;
}

.topic-list-enter-active {
  transition: all 0.4s ease-out;
}
.topic-list-leave-active {
  transition: all 0.3s ease-in;
}
.topic-list-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.topic-list-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
.topic-list-move {
  transition: transform 0.4s ease;
}
</style>
