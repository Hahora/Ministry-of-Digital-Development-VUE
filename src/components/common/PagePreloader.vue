<script setup lang="ts">
defineProps<{ visible: boolean; left?: string; top?: string }>()
</script>

<template>
  <Transition name="preloader">
    <div v-if="visible" class="page-preloader" :style="{ left: left ?? '0px', top: top ?? '0px' }">
      <img src="/preloader.gif" alt="Загрузка..." class="preloader-gif" />
    </div>
  </Transition>
</template>

<style scoped>
.page-preloader {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preloader-gif {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.preloader-enter-active {
  transition: opacity 0.15s ease;
}
.preloader-leave-active {
  transition: opacity 0.3s ease;
}
.preloader-enter-from,
.preloader-leave-to {
  opacity: 0;
}
</style>
