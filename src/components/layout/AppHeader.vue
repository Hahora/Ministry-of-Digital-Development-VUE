<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, LogOut, RefreshCw } from 'lucide-vue-next'
import { auth } from '@/auth/mockAuth'
import { useRefresh } from '@/composables/useRefresh'

const emit = defineEmits<{ 'toggle-sidebar': [] }>()

const route = useRoute()
const router = useRouter()

const pageTitle = computed(() => (route.meta?.title as string) ?? 'Минцифры')
const user = computed(() => auth.currentUser())

const todayDate = computed(() =>
  new Date().toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })
)

const { isRefreshing, triggerRefresh } = useRefresh()
const lastUpdated = ref<Date | null>(null)

const lastUpdatedLabel = computed(() => {
  if (!lastUpdated.value) return null
  const diff = Math.floor((Date.now() - lastUpdated.value.getTime()) / 60000)
  if (diff < 1) return null
  if (diff < 60) return `${diff} мин назад`
  return lastUpdated.value.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
})

function refresh() {
  triggerRefresh(1400)
  lastUpdated.value = new Date()
}

function logout() {
  auth.logout()
  router.replace('/login')
}
</script>

<template>
  <header
    class="sticky top-0 z-30 h-16 flex items-center justify-between gap-4 px-4 md:px-6 glass border-b border-surface-200/60 shadow-sm shadow-surface-900/5"
  >
    <!-- Left: hamburger + title -->
    <div class="flex items-center gap-3">
      <button
        class="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-surface-700 transition-colors duration-150"
        aria-label="Открыть меню"
        @click="emit('toggle-sidebar')"
      >
        <Menu :size="20" />
      </button>

      <div>
        <h1 class="text-lg font-semibold text-surface-900 tracking-tight">{{ pageTitle }}</h1>
        <p class="text-[11px] text-surface-400 -mt-0.5 hidden sm:block capitalize">{{ todayDate }}</p>
      </div>

      <!-- Refresh -->
      <button
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-surface-200 bg-white text-xs font-medium text-surface-500 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all duration-200"
        :class="isRefreshing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'"
        :title="lastUpdatedLabel ? 'Обновлено: ' + lastUpdatedLabel : 'Обновить'"
        :disabled="isRefreshing"
        @click="refresh"
      >
        <RefreshCw :size="13" :class="isRefreshing ? 'animate-spin' : ''" />
        <span class="hidden sm:inline">{{ isRefreshing ? 'Обновление...' : 'Обновить' }}</span>
        <span v-if="lastUpdatedLabel" class="hidden sm:inline text-surface-300">{{ lastUpdatedLabel }}</span>
      </button>
    </div>

    <!-- Right: user + logout -->
    <div class="flex items-center gap-3">
      <!-- User info -->
      <div v-if="user" class="hidden sm:flex flex-col items-end leading-tight">
        <span class="text-sm font-medium text-surface-800">{{ user.name }}</span>
        <span class="text-[11px] text-surface-400">{{ user.role }}</span>
      </div>

      <!-- Avatar -->
      <div
        class="flex items-center justify-center w-9 h-9 rounded-full gradient-primary text-white text-sm font-semibold shadow-md shadow-primary-500/20 select-none"
      >
        {{ user?.initials ?? '?' }}
      </div>

      <!-- Logout -->
      <button
        class="flex items-center justify-center w-9 h-9 rounded-lg text-surface-400 hover:bg-surface-100 hover:text-danger-500 transition-colors duration-150"
        title="Выйти"
        aria-label="Выйти"
        @click="logout"
      >
        <LogOut :size="18" />
      </button>
    </div>
  </header>
</template>
