<script setup>
import { motion } from 'motion-v'

/**
 * 滚动进入视口时渐显的通用包装。
 * 用法：<Reveal :delay="0.1"><div>…</div></Reveal>
 * 所有入场/滚动动画都由 motion-v（Framer Motion 的 Vue 版）驱动。
 */
defineProps({
  delay: { type: Number, default: 0 },
  y: { type: Number, default: 24 },
  once: { type: Boolean, default: true },
  amount: { type: Number, default: 0.2 },
})
</script>

<template>
  <motion.div
    :initial="{ opacity: 0, y }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :viewport="{ once, amount }"
    :transition="{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }"
  >
    <slot />
  </motion.div>
</template>
