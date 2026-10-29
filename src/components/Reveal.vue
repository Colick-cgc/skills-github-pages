<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * 滚动进入视口的渐显包装
 * ------------------------------------------------------------------
 * 之前用动效库的 whileInView，出现过「元素一直停在 opacity:0」的情况
 * （无头浏览器、很慢的设备、观察器回调没派发都会这样）。
 * 这里改成原生 IntersectionObserver + CSS 过渡，并加两条保底：
 *   1. 首屏内（已经可见）的元素立即显示，不等滚动；
 *   2. 1.5 秒内必须显示 —— 内容可见性永远优先于动效。
 */
const props = defineProps({
  delay: { type: Number, default: 0 },
  amount: { type: Number, default: 0.12 },
})

const el = ref(null)
const shown = ref(false)
let observer = null
let timer = null

function cleanup() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

function show() {
  if (shown.value) return
  shown.value = true
  cleanup()
}

onMounted(() => {
  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduced || !('IntersectionObserver' in window) || !el.value) {
    show()
    return
  }

  // 首屏里已经可见的元素：直接进入最终状态
  const rect = el.value.getBoundingClientRect()
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    show()
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) show()
    },
    { threshold: props.amount },
  )
  observer.observe(el.value)

  // 保底：无论观察器是否正常，1.5 秒后都要显示
  timer = setTimeout(show, 1500)
})

onBeforeUnmount(cleanup)
</script>

<template>
  <div
    ref="el"
    class="transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
    :style="{ transitionDelay: delay + 's' }"
    :class="shown ? 'translate-y-0 opacity-100' : 'opacity-0 translate-y-[18px]'"
  >
    <slot />
  </div>
</template>