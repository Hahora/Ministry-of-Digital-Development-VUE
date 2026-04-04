<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
    <div class="w-full max-w-sm mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 358 216" class="w-full h-auto">
        <path fill="#4224FD" d="M346.4 0H141.2v10.8h205.2V0ZM119.6 43.2H54.8V54h64.8V43.2ZM216.8 172.8h-86.4v10.8h86.4v-10.8ZM54.8 172.8H.8v10.8h54v-10.8ZM335.6 129.6H130.4v10.8h205.2v-10.8ZM98 64.8H76.4v10.8H98V64.8ZM76.4 75.6H65.6V108h10.8V75.6ZM22.4 86.4H11.6v10.8h10.8V86.4ZM33.2 75.6H22.4v10.8h10.8V75.6ZM44 64.8H33.2v10.8H44V64.8ZM54.8 54H44v10.8h10.8V54ZM11.6 97.2H.8V108h10.8V97.2ZM44 140.4H33.2v10.8H44v-10.8ZM108.8 129.6H98v10.8h10.8v-10.8ZM87.2 183.6H76.4v10.8h10.8v-10.8Z"></path>
        <path fill="#4224FD" d="M98 172.8H76.4v10.8H98v-10.8ZM260 183.6h-10.8v10.8H260v-10.8Z"></path>
        <path fill="#4224FD" d="M270.8 172.8h-21.6v10.8h21.6v-10.8ZM11.6 118.8H.8v54h10.8v-54ZM54.8 64.8H44V108h10.8V64.8ZM108.8 64.8H98V108h10.8V64.8ZM108.8 108H65.6v10.8h43.2V108ZM54.8 108H.8v10.8h54V108Z"></path>
        <path fill="#4224FD" d="M33.2 129.6H11.6v10.8h21.6v-10.8ZM33.2 151.2H11.6V162h21.6v-10.8ZM335.6 194.4h-32.4v10.8h32.4v-10.8ZM162.8 194.4h-32.4v10.8h32.4v-10.8ZM357.2 172.8h-54v10.8h54v-10.8ZM324.8 140.4H314V162h10.8v-21.6ZM346.4 10.8h-10.8v129.6h10.8V10.8ZM238.4 162h-10.8v43.2h10.8V162ZM292.4 162h-10.8v43.2h10.8V162ZM238.4 151.2V162h43.2v-10.8h-43.2ZM238.4 205.2V216h43.2v-10.8h-43.2ZM65.6 162H54.8v43.2h10.8V162ZM119.6 162h-10.8v43.2h10.8V162ZM65.6 151.2V162h43.2v-10.8H65.6ZM65.6 205.2V216h43.2v-10.8H65.6ZM130.4 54h-10.8v97.2h10.8V54ZM152 10.8h-10.8v129.6H152V10.8ZM249.2 64.8h-10.8v10.8h10.8V64.8ZM281.6 32.4h-10.8v10.8h10.8V32.4ZM227.6 54h-10.8v32.4h10.8V54ZM270.8 54H260v43.2h10.8V54ZM260 43.2h-43.2V54H260V43.2ZM260 86.4h-43.2v10.8H260V86.4Z"></path>
      </svg>
    </div>

    <h1 class="text-2xl font-bold text-surface-900 mb-2">Страница не найдена</h1>
    <p class="text-surface-500 text-sm mb-8 max-w-xs">
      Скорее всего, она переехала или такого адреса никогда не существовало.
    </p>

    <button
      class="px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 active:scale-95 transition-all duration-200 cursor-pointer"
      @click="router.push('/')"
    >
      Перейти на дашборд
    </button>
  </div>
</template>
