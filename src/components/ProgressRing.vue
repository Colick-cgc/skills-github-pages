<script setup>
import { computed } from 'vue'

/**
 * 进度环：用于「我的作品」「本轮完成度」这类需要一眼看进度的位置。
 * value 取 0–100。
 */
const props = defineProps({
  value: { type: Number, default: 0 },
  size: { type: Number, default: 56 },
  stroke: { type: Number, default: 3 },
  label: { type: String, default: '' },
})

const radius = computed(() => (props.size - props.stroke) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const center = computed(() => props.size / 2)
const offset = computed(
  () => circumference.value * (1 - Math.min(100, Math.max(0, props.value)) / 100),
)
</script>

<template>
  <div
    class="relative inline-flex shrink-0 items-center justify-center"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <svg :width="size" :height="size" class="-rotate-90">
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="var(--border)"
        :stroke-width="stroke"
      />
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="var(--accent)"
        :stroke-width="stroke"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        style="transition: stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1)"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center leading-none">
      <span class="mono text-[11px] font-semibold tabular-nums">
        {{ Math.round(value) }}<span class="text-[8px] text-muted">%</span>
      </span>
      <span v-if="label" class="mono-label mt-1 text-[7px]">{{ label }}</span>
    </div>
  </div>
</template>