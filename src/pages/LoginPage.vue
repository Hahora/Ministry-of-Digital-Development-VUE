<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/auth/mockAuth'
import { Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()

const login = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  if (!login.value || !password.value) {
    error.value = 'Введите логин и пароль'
    return
  }
  loading.value = true
  const user = await auth.login(login.value, password.value)
  loading.value = false
  if (!user) {
    error.value = 'Неверный логин или пароль'
    return
  }
  router.replace('/')
}

function onFocus(e: Event) {
  const el = e.target as HTMLElement
  el.style.borderColor = '#4224FD'
  el.style.background = '#fff'
  el.style.boxShadow = '0 0 0 3px #4224FD14'
}
function onBlur(e: Event) {
  const el = e.target as HTMLElement
  el.style.borderColor = '#e2e8f0'
  el.style.background = '#f8fafc'
  el.style.boxShadow = 'none'
}
</script>

<template>
  <div class="min-h-screen flex" style="background: #f5f6fa">

    <!-- ══════════════════════════════════════
         LEFT PANEL — приветствие
    ══════════════════════════════════════ -->
    <div class="hidden lg:flex lg:w-[52%] xl:w-[56%] flex-col items-center justify-center px-16 py-12 relative overflow-hidden">

      <!-- Лёгкий фоновый паттерн -->
      <div class="absolute inset-0 opacity-[0.4]"
        style="background-image: radial-gradient(#4224FD18 1.5px, transparent 1.5px); background-size: 28px 28px;"
      />

      <!-- Контент -->
      <div class="relative w-full max-w-lg">
        <!-- Логотип вверху -->
        <div class="mb-10">
          <img src="/logo.png" alt="Минцифры" class="h-11 object-contain" />
        </div>

        <!-- Иллюстрация -->
        <div class="mb-10 flex justify-center">
          <img
            src="/group-2.png"
            alt="Добро пожаловать"
            class="w-full max-w-md object-contain drop-shadow-xl"
            style="max-height: 340px"
          />
        </div>

        <!-- Текст -->
        <div>
          <h2 class="text-3xl font-bold leading-snug mb-3" style="color: #0a0f3c">
            Добро пожаловать в систему<br />мониторинга
          </h2>
          <p class="text-base leading-relaxed" style="color: #64748b">
            Аналитика общественного мнения и медиапространства Ростовской области в режиме реального времени
          </p>
        </div>

        <!-- Фичи -->
        <div class="mt-8 flex flex-wrap gap-3">
          <span v-for="tag in ['ВКонтакте', 'Telegram', 'ИИ-анализ', 'Отчёты']" :key="tag"
            class="px-3 py-1.5 rounded-full text-xs font-semibold leading-none"
            style="background: #4224FD10; color: #4224FD; border: 1px solid #4224FD20"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         RIGHT PANEL — форма
    ══════════════════════════════════════ -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 py-12 relative" style="background: #fff; box-shadow: -1px 0 0 0 #e2e8f0">

      <!-- Мобильный логотип -->
      <div class="lg:hidden mb-8">
        <img src="/logo.png" alt="Минцифры" class="h-9 object-contain" />
      </div>

      <div class="w-full max-w-sm">

        <!-- Заголовок -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold leading-tight" style="color: #0a0f3c">Войти в систему</h1>
          <p class="text-sm mt-1.5" style="color: #94a3b8">Введите учётные данные для доступа</p>
        </div>

        <!-- Форма -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Логин -->
          <div>
            <label class="block text-sm font-medium mb-1.5 leading-none" style="color: #334155">Логин</label>
            <input
              v-model="login"
              type="text"
              placeholder="Введите логин"
              autocomplete="username"
              class="w-full h-12 px-4 rounded-xl border outline-none transition-all duration-200 placeholder:text-slate-400"
              style="border-color: #e2e8f0; background: #f8fafc; font-size: 15px; color: #0f172a"
              @focus="onFocus"
              @blur="onBlur"
            />
          </div>

          <!-- Пароль -->
          <div>
            <label class="block text-sm font-medium mb-1.5 leading-none" style="color: #334155">Пароль</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Введите пароль"
                autocomplete="current-password"
                class="w-full h-12 px-4 pr-12 rounded-xl border outline-none transition-all duration-200 placeholder:text-slate-400"
                style="border-color: #e2e8f0; background: #f8fafc; font-size: 15px; color: #0f172a"
                @focus="onFocus"
                @blur="onBlur"
              />
              <button
                type="button"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style="color: #94a3b8"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" :size="18" />
                <Eye v-else :size="18" />
              </button>
            </div>
          </div>

          <!-- Ошибка -->
          <Transition name="err">
            <div
              v-if="error"
              class="flex items-center gap-2.5 text-sm rounded-xl px-4 py-3 leading-none"
              style="color: #dc2626; background: #fef2f2; border: 1px solid #fecaca"
            >
              <span class="w-1.5 h-1.5 rounded-full shrink-0" style="background: #dc2626" />
              {{ error }}
            </div>
          </Transition>

          <!-- Кнопка -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full h-12 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2 leading-none active:scale-[0.98]"
            style="background: #4224FD; box-shadow: 0 4px 24px #4224FD35"
          >
            <span v-if="loading" class="w-4 h-4 border-2 rounded-full animate-spin" style="border-color: rgba(255,255,255,0.3); border-top-color: #fff" />
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            {{ loading ? 'Вход...' : 'Войти' }}
          </button>
        </form>


        <p class="text-center text-xs mt-8" style="color: #cbd5e1">
          Министерство цифрового развития · 2026
        </p>
      </div>
    </div>

  </div>
</template>

<style scoped>
.err-enter-active { transition: all 0.25s ease-out; }
.err-leave-active { transition: all 0.15s ease-in; }
.err-enter-from { opacity: 0; transform: translateY(-4px); }
.err-leave-to { opacity: 0; }
</style>
