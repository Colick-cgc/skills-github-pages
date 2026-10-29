<script setup>
import { computed } from 'vue'

/**
 * 能力条：实心部分 = 现在，浅色部分 = 这轮想达到的位置。
 * now / target 都用 0–5 的档位表示，和简历上的自评对齐。
 */
const props = defineProps({
  name: { type: String, required: true },
  now: { type: Number, default: 0 },
  target: { type: Number, default: 5 },
  max: { type: Number, default: 5 },
  note: { type: String, default: '' },
})

const nowPct = computed(() => (Math.min(props.now, props.max) / props.max) * 100)
const targetPct = computed(() => (Math.min(props.target, props.max) / props.max) * 100)
</script>

<template>
  <div>
    <div class="flex items-baseline justify-between gap-3">
      <span class="text-[13.5px] font-medium text-primary">{{ name }}</span>
      <span class="mono shrink-0 text-[11px] text-muted">
        {{ now.toFixed(1) }}
        <span class="text-border-strong">/</span>
        <span class="text-accent">{{ target.toFixed(1) }}</span>
      </span>
    </div>
    <div class="meter mt-2">
      <div class="meter-target" :style="{ width: targetPct + '%' }"></div>
      <div class="meter-fill" :style="{ width: nowPct + '%' }"></div>
    </div>
    <p v-if="note" class="mt-1.5 text-[11.5px] leading-relaxed text-muted">{{ note }}</p>
  </div>
</template>