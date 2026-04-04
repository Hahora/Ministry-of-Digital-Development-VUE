<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, Newspaper, BarChart3, FileText, Globe, ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
  collapsed?: boolean
  mobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  mobile: false,
})

const emit = defineEmits<{ toggle: [] }>()

const route = useRoute()
const router = useRouter()

const navItems: { path: string; label: string; icon: Component; name: string }[] = [
  { path: '/', label: 'Дашборд', icon: LayoutDashboard, name: 'dashboard' },
  { path: '/topics', label: 'Лента событий', icon: Newspaper, name: 'topics' },
  { path: '/analytics', label: 'Аналитика', icon: BarChart3, name: 'analytics' },
  { path: '/reports', label: 'Отчёты', icon: FileText, name: 'reports' },
  { path: '/sources', label: 'Источники', icon: Globe, name: 'sources' },
]

function isActive(item: (typeof navItems)[number]): boolean {
  if (item.path === '/') return route.path === '/'
  return route.path.startsWith(item.path)
}

function navigate(path: string) {
  router.push(path)
  if (props.mobile) emit('toggle')
}

const sidebarWidth = computed(() => {
  if (props.mobile) return 'w-[260px]'
  return props.collapsed ? 'w-[64px]' : 'w-[260px]'
})

const sidebarTranslate = computed(() => {
  if (props.mobile) return props.collapsed ? '-translate-x-full' : 'translate-x-0'
  return 'translate-x-0'
})
</script>

<template>
  <!-- Backdrop mobile -->
  <Transition name="fade">
    <div
      v-if="mobile && !collapsed"
      class="fixed inset-0 z-40 bg-surface-900/40 backdrop-blur-sm"
      @click="emit('toggle')"
    />
  </Transition>

  <!-- Sidebar -->
  <aside
    :class="[sidebarWidth, sidebarTranslate, 'fixed inset-y-0 left-0 z-40 flex flex-col glass-strong border-r border-surface-200/60 shadow-xl shadow-surface-900/5 sidebar-glow transition-all duration-300 ease-out']"
  >
    <!-- Logo area -->
    <div class="flex items-center h-16 shrink-0 border-b border-surface-200/50 relative" :class="collapsed && !mobile ? 'justify-center px-2' : 'px-6'">
      <Transition name="logo">
        <a v-if="!collapsed || mobile" href="https://digital.gov.ru/news-feed" target="_blank" rel="noopener">
          <img src="/logo.png" alt="Логотип" class="h-9 object-contain" />
        </a>
        <a v-else href="https://digital.gov.ru/news-feed" target="_blank" rel="noopener">
          <img src="/Mintsifry.svg2.png" alt="Логотип" class="w-8 h-8 object-contain" />
        </a>
      </Transition>

      <!-- Collapse toggle (desktop) -->
      <button
        v-if="!mobile"
        class="toggle-btn absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-surface-200 shadow-md flex items-center justify-center text-surface-400 hover:text-primary-600 hover:border-primary-300 transition-all duration-200 z-50"
        :title="collapsed ? 'Развернуть' : 'Свернуть'"
        @click="emit('toggle')"
      >
        <ChevronLeft v-if="!collapsed" :size="13" />
        <ChevronRight v-else :size="13" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden py-4" :class="collapsed && !mobile ? 'px-2' : 'px-3'">
      <div class="space-y-1">
        <button
          v-for="item in navItems"
          :key="item.path"
          :title="collapsed && !mobile ? item.label : ''"
          :class="[
            'group flex items-center w-full rounded-xl text-sm font-medium transition-all duration-200 ease-out relative',
            collapsed && !mobile ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5',
            isActive(item)
              ? 'bg-primary-50 text-primary-700 shadow-sm shadow-primary-500/10'
              : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900',
          ]"
          @click="navigate(item.path)"
        >
          <div v-if="isActive(item) && (!collapsed || mobile)" class="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-primary-500" />
          <span
            :class="[
              'flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-all duration-200',
              isActive(item)
                ? 'bg-primary-100 text-primary-600'
                : 'text-surface-400 group-hover:text-surface-600 group-hover:bg-surface-200/60',
            ]"
          >
            <component :is="item.icon" :size="18" />
          </span>
          <span v-if="!collapsed || mobile" class="truncate">{{ item.label }}</span>
          <div v-if="isActive(item) && (!collapsed || mobile)" class="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
        </button>
      </div>
    </nav>

    <!-- Status (above border) -->
    <div class="shrink-0 px-6 py-2 flex items-center gap-2" :class="collapsed && !mobile ? 'flex-col justify-center px-2' : ''">
      <span class="relative flex h-2 w-2 shrink-0">
        <span class="relative inline-flex rounded-full h-2 w-2 bg-accent-500" />
      </span>
      <span v-if="!collapsed || mobile" class="text-[11px] text-surface-400 truncate">Обновлено: <span class="font-medium text-surface-500">5 мин назад</span></span>
      <span v-else class="text-[9px] font-medium text-surface-400 text-center leading-tight">5 мин<br>назад</span>
    </div>

    <!-- Footer -->
    <div class="shrink-0 border-t border-surface-200/50" :class="collapsed && !mobile ? 'px-2 py-3' : 'px-4 py-3'">
      <!-- Credits -->
      <div class="px-2">
        <template v-if="!collapsed || mobile">
          <p class="text-[10px] text-surface-300 leading-tight">Разработано командой</p>
          <a href="https://t.me/m2SYNDICATE" target="_blank" class="text-[10px] font-semibold text-surface-400 hover:text-primary-500 transition-colors duration-150">HDD [M2 СИНДИКАТ]</a>
        </template>
        <a v-else href="https://t.me/m2SYNDICATE" target="_blank" class="flex items-center justify-center text-[9px] font-bold text-surface-300 hover:text-primary-500 transition-colors duration-150 leading-tight text-center">HDD<br>[M2]</a>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.logo-enter-active, .logo-leave-active { transition: opacity 0.15s ease; }
.logo-enter-from, .logo-leave-to { opacity: 0; }

.sidebar-glow {
  box-shadow:
    1px 0 0 0 rgba(99, 102, 241, 0.04),
    4px 0 16px -2px rgba(99, 102, 241, 0.06);
}
</style>
