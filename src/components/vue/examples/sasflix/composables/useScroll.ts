import type { Ref } from 'vue'
import { nextTick, ref } from 'vue'

export function useScroll(containerRef: Ref<HTMLDivElement | null>) {
  const scrollPositions = ref<{ [key: string]: number }>({})

  const saveScrollPosition = (route: string) => {
    if (containerRef.value) {
      scrollPositions.value[route] = containerRef.value.scrollTop
    }
  }

  const restoreScrollPosition = async (route: string) => {
    // Wait for the DOM to be updated
    await nextTick()
    // Add small delay to ensure content is rendered
    setTimeout(() => {
      if (containerRef.value && scrollPositions.value[route] !== undefined) {
        containerRef.value.scrollTop = scrollPositions.value[route]
      }
    }, 100)
  }

  const scrollToTop = () => {
    if (containerRef.value) {
      containerRef.value.scrollTop = 0
    }
  }

  return {
    saveScrollPosition,
    restoreScrollPosition,
    scrollToTop
  }
}
