<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import MetricCard from '@/components/common/MetricCard.vue'
import IconVK from '@/components/icons/IconVK.vue'
import IconTelegram from '@/components/icons/IconTelegram.vue'
import { Globe, Plus, X, Check, Link, Copy, ClipboardPaste } from 'lucide-vue-next'
import { sources as sourcesApi } from '@/services/api'
import { onMounted } from 'vue'

const typeIconMap: Record<string, Component> = {
  vk: IconVK,
  telegram: IconTelegram,
}

const typeLabels: Record<string, string> = {
  vk: 'ВКонтакте',
  telegram: 'Telegram',
}

const typeColors: Record<string, string> = {
  vk: '#0077FF',
  telegram: '#26A5E4',
}

interface MockSource {
  url: string
  type: 'vk' | 'telegram'
  active: boolean
  custom?: boolean
}

const sources = ref<MockSource[]>([])

onMounted(async () => {
  const res = await sourcesApi.list().catch(() => ({ data: [] }))
  sources.value = (res.data || []).map((s: any) => ({ url: s.url, type: s.type, active: s.active, custom: s.custom, id: s.id }))
})

const groupedSources = computed(() => {
  const groups: Record<string, MockSource[]> = {}
  sources.value.forEach((s) => {
    if (!groups[s.type]) groups[s.type] = []
    groups[s.type].push(s)
  })
  return groups
})

function sourceKey(s: MockSource) {
  return s.url
}

const groupOrder: Array<'vk' | 'telegram'> = ['vk', 'telegram']
const typeOptions: Array<'vk' | 'telegram'> = ['vk', 'telegram']
const totalSources = computed(() => sources.value.length)

const sourceStats = computed(() => [
  { type: 'vk', name: 'ВКонтакте', count: sources.value.filter(s => s.type === 'vk').length, color: '#0077FF' },
  { type: 'telegram', name: 'Telegram', count: sources.value.filter(s => s.type === 'telegram').length, color: '#26A5E4' },
])

const PREVIEW_COUNT = 6
const showAll = ref<Record<string, boolean>>({ vk: false, telegram: false })

function visibleSources(type: string) {
  const list = groupedSources.value[type] ?? []
  return showAll.value[type] ? list : list.slice(0, PREVIEW_COUNT)
}

// ── Copy all sources ───────────────────────────────
const copied = ref(false)

function copyAll() {
  const text = sources.value
    .map(s => `${s.type}|${s.url}`)
    .join('\n')
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

// ── Add channel modal ──────────────────────────────
const showModal = ref(false)
const newType = ref<'vk' | 'telegram'>('vk')
const newUrls = ref('')
const addError = ref('')
const addCount = ref(0)
const addSuccess = ref(false)

function detectType(url: string): 'vk' | 'telegram' {
  if (url.startsWith('t.me/') || url.includes('telegram')) return 'telegram'
  return 'vk'
}

function openModal() {
  newType.value = 'vk'
  newUrls.value = ''
  addError.value = ''
  addSuccess.value = false
  addCount.value = 0
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function handleAdd() {
  addError.value = ''
  const lines = newUrls.value
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)

  if (!lines.length) {
    addError.value = 'Введите хотя бы одну ссылку'
    return
  }

  const urls = lines.map(line => {
    if (line.includes('|')) {
      const [, u] = line.split('|')
      return u || line
    }
    return line
  })

  try {
    const res = await sourcesApi.add(urls)
    addCount.value = res.added || 0
    addSuccess.value = true
    // reload sources
    const fresh = await sourcesApi.list().catch(() => ({ data: [] }))
    sources.value = (fresh.data || []).map((s: any) => ({ url: s.url, type: s.type, active: s.active, custom: s.custom, id: s.id }))
    setTimeout(() => { showModal.value = false; addSuccess.value = false }, 1400)
  } catch (e: any) {
    addError.value = e.message || 'Ошибка добавления'
  }
}
</script>

<template>
  <div>
  <div class="space-y-8 animate-slide-up">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <span class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600 shrink-0">
          <Globe :size="22" />
        </span>
        <div class="min-w-0">
          <h1 class="text-2xl font-bold text-surface-900 leading-tight">Источники данных</h1>
          <p class="text-surface-500 text-sm mt-0.5 leading-snug">
            Мониторинг {{ totalSources }} каналов · Ростовская область
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface-200 bg-white text-sm font-medium text-surface-600 hover:bg-surface-50 hover:border-surface-300 transition-all duration-200 leading-none"
          @click="copyAll"
        >
          <Check v-if="copied" :size="15" class="text-accent-500 shrink-0" />
          <Copy v-else :size="15" class="shrink-0" />
          {{ copied ? 'Скопировано!' : 'Копировать все' }}
        </button>
        <button
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl gradient-primary text-white text-sm font-semibold shadow-md shadow-primary-500/25 hover:opacity-90 active:scale-[0.98] transition-all duration-200 leading-none"
          @click="openModal"
        >
          <Plus :size="15" class="shrink-0" />
          Добавить каналы
        </button>
      </div>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-2 gap-6">
      <MetricCard
        v-for="stat in sourceStats"
        :key="stat.type"
        :title="stat.name"
        :value="stat.count"
        :color="stat.color"
        :icon="typeIconMap[stat.type]"
      />
    </div>

    <!-- Sources grouped -->
    <div class="space-y-8">
      <div v-for="type in groupOrder" :key="type">
        <div class="flex items-center gap-2 mb-4 leading-none">
          <span class="flex items-center justify-center w-6 h-6 rounded-md shrink-0" :style="{ backgroundColor: typeColors[type] + '15' }">
            <component :is="typeIconMap[type]" :size="14" :style="{ color: typeColors[type] }" />
          </span>
          <h2 class="text-sm font-semibold text-surface-700 leading-none">{{ typeLabels[type] }}</h2>
          <span class="text-xs text-surface-400 leading-none">({{ groupedSources[type]?.length ?? 0 }})</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <BaseCard v-for="source in visibleSources(type)" :key="sourceKey(source)" hover>
            <div class="flex items-center gap-2.5 leading-none">
              <span class="flex items-center justify-center w-7 h-7 rounded-lg shrink-0" :style="{ backgroundColor: typeColors[source.type] + '15' }">
                <component :is="typeIconMap[source.type]" :size="16" :style="{ color: typeColors[source.type] }" />
              </span>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-surface-700 truncate leading-none">{{ source.url }}</p>
              </div>
              <span v-if="source.custom" class="text-[10px] text-primary-500 font-medium bg-primary-50 rounded-full px-2 py-0.5 shrink-0 leading-none">свой</span>
            </div>
          </BaseCard>
        </div>

        <!-- Show all button -->
        <div v-if="(groupedSources[type]?.length ?? 0) > PREVIEW_COUNT" class="mt-4 flex justify-center">
          <button
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border"
            :class="showAll[type]
              ? 'bg-white text-surface-600 border-surface-200 hover:bg-surface-50'
              : 'bg-primary-50 text-primary-600 border-primary-100 hover:bg-primary-100'"
            @click="showAll[type] = !showAll[type]"
          >
            <span v-if="!showAll[type]">
              Показать все {{ groupedSources[type]?.length }} каналов
            </span>
            <span v-else>Свернуть</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add channel modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" @click="closeModal" />

        <!-- Dialog -->
        <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-surface-900/20 overflow-hidden">
          <!-- Header -->
          <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9" class="flex items-center justify-between">
            <h2 class="text-base font-semibold text-surface-900">Добавить канал</h2>
            <button
              class="flex items-center justify-center w-8 h-8 rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors"
              @click="closeModal"
            >
              <X :size="18" />
            </button>
          </div>

          <!-- Body -->
          <div style="padding: 1.5rem" class="space-y-4">
            <!-- URLs textarea -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-sm font-medium text-surface-700">Ссылки на каналы</label>
                <span class="text-xs text-surface-400">по одной на строку</span>
              </div>
              <textarea
                v-model="newUrls"
                rows="5"
                placeholder="vk.com/rostov_news&#10;t.me/rostov_today&#10;vk.com/taganrog_gkh&#10;..."
                class="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all duration-200 resize-none font-mono"
              />
              <p class="text-xs text-surface-400 mt-1.5 flex items-center gap-1">
                <ClipboardPaste :size="12" />
                Можно вставить скопированные источники — тип определится автоматически
              </p>
            </div>

            <!-- Error -->
            <div
              v-if="addError"
              class="flex items-center gap-2 text-sm text-danger-600 bg-danger-50 border border-danger-100 rounded-xl px-4 py-3"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-danger-500 shrink-0" />
              {{ addError }}
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-1">
              <button
                class="flex-1 h-11 rounded-xl border border-surface-200 text-sm font-medium text-surface-600 hover:bg-surface-50 transition-colors"
                @click="closeModal"
              >
                Отмена
              </button>
              <button
                class="flex-1 h-11 rounded-xl gradient-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary-500/25"
                @click="handleAdd"
              >
                <Check v-if="addSuccess" :size="18" />
                <Plus v-else :size="18" />
                {{ addSuccess ? `Добавлено ${addCount}!` : 'Добавить' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: translateY(12px) scale(0.97);
  opacity: 0;
}
</style>
