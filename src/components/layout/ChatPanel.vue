<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { X, Send, Bot, User, Sparkles, ArrowRight } from 'lucide-vue-next'
import { chat } from '@/services/api'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
  time: string
}

const input = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement>()
let msgId = 0

function now() {
  return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

const messages = ref<Message[]>([
  {
    id: msgId++,
    role: 'assistant',
    text: 'Здравствуйте! Я Макс — аналитический бот. Помогу разобраться в событиях, трендах и настроениях в регионе.',
    time: now(),
  },
])

const quickQuestions = [
  { icon: '🔥', text: 'Главные проблемы' },
  { icon: '🏠', text: 'Ситуация с ЖКХ' },
  { icon: '📈', text: 'Тренды за неделю' },
  { icon: '⚠️', text: 'Критические темы' },
  { icon: '📍', text: 'По районам' },
  { icon: '📊', text: 'Динамика упоминаний' },
]

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sessionId = ref<string>()

async function sendMessage(text?: string) {
  const msg = text || input.value.trim()
  if (!msg) return
  messages.value.push({ id: msgId++, role: 'user', text: msg, time: now() })
  input.value = ''
  scrollToBottom()
  isTyping.value = true
  scrollToBottom()
  try {
    const res = await chat.send(msg, sessionId.value)
    sessionId.value = res.session_id
    isTyping.value = false
    messages.value.push({ id: msgId++, role: 'assistant', text: res.reply, time: now() })
  } catch {
    isTyping.value = false
    messages.value.push({ id: msgId++, role: 'assistant', text: 'Ошибка при обращении к ИИ-ассистенту. Попробуйте позже.', time: now() })
  }
  scrollToBottom()
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
}

watch(() => props.open, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
  if (val) scrollToBottom()
})

// ── Resizable panel (desktop only) ─────────────────
const STORAGE_KEY = 'chat_panel_width'
const MIN_W = 320
const MAX_W = 760
const panelWidth = ref(parseInt(localStorage.getItem(STORAGE_KEY) || '420'))
const isResizing = ref(false)

function startResize(e: MouseEvent) {
  if (window.innerWidth < 640) return
  isResizing.value = true
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'ew-resize'

  const startX = e.clientX
  const startW = panelWidth.value

  function onMove(ev: MouseEvent) {
    const delta = startX - ev.clientX
    panelWidth.value = Math.min(MAX_W, Math.max(MIN_W, startW + delta))
  }

  function onUp() {
    isResizing.value = false
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    localStorage.setItem(STORAGE_KEY, String(panelWidth.value))
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) panelWidth.value = Math.min(MAX_W, Math.max(MIN_W, parseInt(saved)))
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Transition name="backdrop">
    <div v-if="open" class="fixed inset-0 z-50 bg-surface-900/20 backdrop-blur-sm" @click="emit('close')" />
  </Transition>

  <Transition name="chat">
    <div
      v-if="open"
      class="chat-panel fixed z-50 right-0 bottom-0 w-full sm:inset-y-0 flex flex-col bg-white overflow-hidden"
      :style="{ width: `min(100vw, ${panelWidth}px)` }"
    >
      <!-- Resize handle (desktop only) -->
      <div
        class="resize-handle absolute left-0 top-0 bottom-0 w-1 hidden sm:flex items-center justify-center cursor-ew-resize z-10 group"
        @mousedown="startResize"
      >
        <div class="w-1 h-12 rounded-full bg-surface-200 group-hover:bg-primary-400 transition-colors duration-150" :class="isResizing ? 'bg-primary-500' : ''" />
      </div>

      <!-- Subtle mesh background -->
      <div class="absolute inset-0 pointer-events-none chat-bg" />

      <!-- ── HEADER ── -->
      <div class="relative shrink-0 flex items-center justify-between px-5 h-16 border-b border-surface-100">
        <!-- Gradient accent line top -->
        <div class="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-500 via-violet-500 to-indigo-400" />

        <div class="flex items-center gap-3">
          <!-- Maxi avatar -->
          <div class="relative w-9 h-9 shrink-0">
            <img src="/maxi-logo.svg" alt="Макс" class="w-9 h-9 rounded-xl object-contain" />
            <span class="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" style="animation-duration:2s" />
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border-2 border-white" />
            </span>
          </div>
          <div>
            <h2 class="text-sm font-bold text-surface-900 leading-tight">Макс</h2>
            <p class="text-[11px] text-emerald-500 font-medium leading-tight">● Онлайн</p>
          </div>
        </div>

        <button class="close-btn flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150" @click="emit('close')">
          <X :size="17" />
        </button>
      </div>

      <!-- ── MESSAGES ── -->
      <div ref="messagesContainer" class="relative flex-1 overflow-y-auto px-4 py-5 space-y-4 scroll-smooth overscroll-contain">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['flex gap-2.5 animate-chat-msg', msg.role === 'user' ? 'flex-row-reverse' : '']"
        >
          <!-- Avatar -->
          <div class="shrink-0 mt-0.5">
            <div v-if="msg.role === 'assistant'" class="w-7 h-7 rounded-xl overflow-hidden shrink-0">
              <img src="/maxi-logo.svg" alt="Макс" class="w-full h-full object-contain" />
            </div>
            <div v-else class="w-7 h-7 rounded-xl bg-surface-100 flex items-center justify-center">
              <User :size="13" class="text-surface-500" />
            </div>
          </div>

          <!-- Bubble -->
          <div :class="['max-w-[82%] flex flex-col', msg.role === 'user' ? 'items-end' : 'items-start']">
            <div
              v-if="msg.role === 'assistant'"
              class="assistant-bubble rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-surface-700"
              v-html="formatMarkdown(msg.text)"
            />
            <div
              v-else
              class="user-bubble rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed text-white"
              v-html="formatMarkdown(msg.text)"
            />
            <span class="text-[10px] text-surface-400 mt-1 px-1">{{ msg.time }}</span>
          </div>
        </div>

        <!-- Typing -->
        <div v-if="isTyping" class="flex gap-2.5 animate-chat-msg">
          <div class="w-7 h-7 rounded-xl overflow-hidden shrink-0 mt-0.5">
            <img src="/maxi-logo.svg" alt="Макс" class="w-full h-full object-contain" />
          </div>
          <div class="assistant-bubble rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-2.5">
            <span class="flex gap-1 items-end" style="height:14px">
              <span class="typing-dot" style="animation-delay:0ms" />
              <span class="typing-dot" style="animation-delay:160ms" />
              <span class="typing-dot" style="animation-delay:320ms" />
            </span>
            <span class="text-xs text-surface-400">Анализирую...</span>
          </div>
        </div>
      </div>

      <!-- ── QUICK QUESTIONS ── -->
      <div class="relative shrink-0 px-4 pt-3 pb-2 border-t border-surface-100 bg-surface-50/50">
        <div class="flex items-center gap-1.5 mb-2">
          <ArrowRight :size="11" class="text-primary-400" />
          <span class="text-[10px] font-semibold uppercase tracking-widest text-primary-400">Быстрые вопросы</span>
        </div>
        <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
          <button
            v-for="q in quickQuestions"
            :key="q.text"
            class="quick-chip shrink-0 snap-start flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-150 active:scale-95"
            @click="sendMessage(q.text)"
          >
            <span>{{ q.icon }}</span>
            <span>{{ q.text }}</span>
          </button>
        </div>
      </div>

      <!-- ── INPUT ── -->
      <div class="relative shrink-0 px-4 py-3 border-t border-surface-100 bg-white chat-input-area">
        <div class="flex items-end gap-2">
          <div class="flex-1 input-wrap rounded-xl overflow-hidden">
            <textarea
              v-model="input"
              rows="1"
              placeholder="Задайте вопрос..."
              class="w-full resize-none bg-transparent px-4 py-3 text-[16px] sm:text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none leading-relaxed"
              style="max-height: 96px"
              @keydown="handleKeydown"
            />
          </div>
          <button
            class="send-btn shrink-0 flex items-center justify-center rounded-xl transition-all duration-150 active:scale-95 disabled:cursor-not-allowed"
            style="width: 46px; height: 46px; min-width: 46px"
            :disabled="!input.trim()"
            @click="sendMessage()"
          >
            <Send :size="17" class="text-white" style="margin-left: 1px" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.chat-panel {
  height: 92dvh;
  border-radius: 1.5rem 1.5rem 0 0;
  box-shadow: 0 -8px 40px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15,23,42,0.04);
  /* Поднимаем над клавиатурой на iOS */
  bottom: env(keyboard-inset-height, 0px);
}
@media (min-width: 640px) {
  .chat-panel {
    height: 100%;
    border-radius: 0;
    top: 0;
    bottom: 0;
    box-shadow: -8px 0 40px rgba(15, 23, 42, 0.1);
    width: var(--panel-width, 420px);
  }
}

.resize-handle {
  width: 8px;
  left: -4px;
}
.resize-handle:hover .w-1 {
  width: 3px;
}

.chat-bg {
  background:
    radial-gradient(ellipse 80% 40% at 50% 0%, rgba(99,102,241,0.04) 0%, transparent 70%),
    radial-gradient(ellipse 60% 30% at 100% 100%, rgba(139,92,246,0.03) 0%, transparent 60%);
}

/* Bubbles */
.assistant-bubble {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(15,23,42,0.04);
}

.user-bubble {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  box-shadow: 0 4px 16px rgba(99,102,241,0.28);
}

/* Quick chips */
.quick-chip {
  background: white;
  border: 1.5px solid #e2e8f0;
  color: #475569;
  box-shadow: 0 1px 3px rgba(15,23,42,0.06);
}
.quick-chip:hover {
  border-color: #a5b4fc;
  background: #eef2ff;
  color: #4338ca;
  box-shadow: 0 2px 8px rgba(99,102,241,0.15);
  transform: translateY(-1px);
}

/* Input */
.input-wrap {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input-wrap:focus-within {
  border-color: #a5b4fc;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  background: white;
}

/* Send */
.send-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: 0 4px 14px rgba(99,102,241,0.35);
}
.send-btn:not(:disabled):hover {
  box-shadow: 0 6px 20px rgba(99,102,241,0.45);
  transform: translateY(-1px);
}
.send-btn:disabled {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: none;
  opacity: 0.35;
}

/* Close */
.close-btn {
  color: #94a3b8;
}
.close-btn:hover {
  background: #f1f5f9;
  color: #475569;
}

/* Typing dots */
.typing-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 9999px;
  background: #a5b4fc;
  animation: typingBounce 1.2s ease-in-out infinite;
}
@keyframes typingBounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-5px); opacity: 1; }
}

/* Safe area */
.chat-input-area {
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}

/* Scrollbar */
.scrollbar-none { scrollbar-width: none; }
.scrollbar-none::-webkit-scrollbar { display: none; }

/* Backdrop */
.backdrop-enter-active { transition: opacity 0.25s ease; }
.backdrop-leave-active { transition: opacity 0.2s ease; }
.backdrop-enter-from, .backdrop-leave-to { opacity: 0; }

/* Panel slide */
.chat-enter-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.chat-leave-active { transition: transform 0.25s cubic-bezier(0.4, 0, 1, 1), opacity 0.2s ease; }
.chat-enter-from { transform: translateY(100%); opacity: 0.6; }
.chat-leave-to   { transform: translateY(100%); opacity: 0; }
@media (min-width: 640px) {
  .chat-enter-from { transform: translateX(100%); opacity: 0.8; }
  .chat-leave-to   { transform: translateX(100%); opacity: 0; }
}

/* Message pop-in */
.animate-chat-msg {
  animation: chatMsg 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes chatMsg {
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
