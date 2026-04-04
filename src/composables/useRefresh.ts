import { ref } from 'vue'

const isRefreshing = ref(false)

export function useRefresh() {
  function triggerRefresh(duration = 1200) {
    if (isRefreshing.value) return
    isRefreshing.value = true
    setTimeout(() => {
      isRefreshing.value = false
    }, duration)
  }

  return { isRefreshing, triggerRefresh }
}
