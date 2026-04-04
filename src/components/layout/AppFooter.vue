<template>
  <footer class="shrink-0 border-t border-surface-100 bg-white/80 backdrop-blur-sm mt-auto">
    <div class="px-5 md:px-8 lg:px-10 py-6">

      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        <!-- Левая: логотипы -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">

          <!-- Минцифры РФ -->
          <a href="https://digital.gov.ru" target="_blank" rel="noopener" class="flex items-center gap-3 group shrink-0">
            <img src="/logo.png" alt="Минцифры России" class="h-9 object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
          </a>

          <!-- Разделитель -->
          <div class="hidden sm:block w-px h-10 bg-surface-200" />

          <!-- Министерство РО -->
          <a href="https://minsvyaz.donland.ru/" target="_blank" rel="noopener" class="group shrink-0">
            <img src="/mintsifry-ro.png" alt="Министерство цифрового развития Ростовской области" class="h-10 object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        <!-- Правая: текст -->
        <div class="flex flex-col items-start md:items-end gap-1.5">
          <div class="flex items-center gap-2">
            <span class="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span class="text-[11px] font-medium text-surface-500">Система мониторинга активна</span>
          </div>
          <p class="text-[11px] text-surface-400 leading-snug md:text-right">
            Мониторинг информационного пространства<br class="hidden sm:block" />
            на основе данных ВКонтакте и Telegram
          </p>
          <p class="text-[10px] text-surface-300 mt-0.5">© 2026 Минцифры России</p>
        </div>

      </div>

    </div>
  </footer>
</template>
