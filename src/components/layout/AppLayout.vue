<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { MessageCircle } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import ChatPanel from './ChatPanel.vue'
import PagePreloader from '@/components/common/PagePreloader.vue'
import { useRefresh } from '@/composables/useRefresh'

const router = useRouter()
const isMobile = ref(false)
const sidebarCollapsed = ref(false)
const chatOpen = ref(false)
const pageLoading = ref(true)
const preloaderTop = ref('64px')

const { isRefreshing } = useRefresh()

watch(isRefreshing, (val) => {
  if (val) {
    preloaderTop.value = '64px'
    pageLoading.value = true
  } else {
    setTimeout(() => { pageLoading.value = false }, 400)
  }
})

router.beforeEach(() => {
  preloaderTop.value = '64px'
  pageLoading.value = true
})
router.afterEach(() => {
  setTimeout(() => {
    pageLoading.value = false
  }, 400)
})

function toggleChat() {
  chatOpen.value = !chatOpen.value
}

function checkBreakpoint() {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth < 768

  if (wasMobile && !isMobile.value) {
    sidebarCollapsed.value = false
  }
  if (!wasMobile && isMobile.value) {
    sidebarCollapsed.value = true
  }
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

onMounted(() => {
  checkBreakpoint()
  if (isMobile.value) {
    sidebarCollapsed.value = true
  }
  window.addEventListener('resize', checkBreakpoint)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkBreakpoint)
})
</script>

<template>
  <div class="min-h-screen bg-surface-50 premium-mesh">
    <!-- Sidebar -->
    <AppSidebar
      :collapsed="sidebarCollapsed"
      :mobile="isMobile"
      @toggle="toggleSidebar"
    />

    <!-- Main area -->
    <div
      :class="[
        'transition-[margin] duration-300 ease-out min-h-screen flex flex-col relative',
        isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-[64px]' : 'ml-[260px]',
      ]"
    >
      <PagePreloader
        :visible="pageLoading"
        :left="isMobile ? '0px' : sidebarCollapsed ? '64px' : '260px'"
        :top="preloaderTop"
      />
      <AppHeader @toggle-sidebar="toggleSidebar" />

      <main class="flex-1 p-5 md:p-8 lg:p-10">
        <RouterView v-slot="{ Component, route }">
          <Transition name="page">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </main>
      <AppFooter />
    </div>

    <!-- FAB: Chat button (bottom-right) -->
    <Transition name="fab">
      <button
        v-if="!chatOpen"
        class="fixed z-40 bottom-6 right-6 hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer"
        aria-label="Открыть ИИ-ассистент"
        @click="toggleChat"
      >
        <img src="/iframe-mini-widget.png" alt="Чат" class="w-16 h-16 object-contain" />
      </button>
    </Transition>

    <!-- Chat Panel -->
    <ChatPanel :open="chatOpen" @close="chatOpen = false" />
  </div>
</template>

<style scoped>
.premium-mesh {
  background:
    radial-gradient(ellipse 80% 60% at 10% 0%, rgba(99, 102, 241, 0.04) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 90% 10%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse 50% 40% at 50% 100%, rgba(59, 130, 246, 0.025) 0%, transparent 50%),
    linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.page-enter-active {
  transition: opacity 0.2s ease;
}
.page-leave-active {
  transition: opacity 0.1s ease;
  position: absolute;
  width: 100%;
}
.page-enter-from {
  opacity: 0;
}
.page-leave-to {
  opacity: 0;
}

/* FAB animation */
.fab-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.fab-leave-active {
  transition: all 0.2s ease-in;
}
.fab-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(-90deg);
}
.fab-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(90deg);
}
</style>
