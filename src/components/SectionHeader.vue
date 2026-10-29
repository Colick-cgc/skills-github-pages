<script setup>
import { computed } from 'vue'
import Reveal from './Reveal.vue'

/**
 * 栏目页顶部的统一标题区
 * 旧页面用 eyebrow/title/subtitle，新页面用 index/eyebrow/title/lead，两者都兼容。
 */
const props = defineProps({
  index: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  lead: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})

const leadText = computed(() => props.lead || props.subtitle)
</script>

<template>
  <Reveal>
    <div class="flex items-center gap-3">
      <span v-if="index" class="mono-label">{{ index }}</span>
      <span v-if="index" class="h-px w-5 bg-border-strong"></span>
      <span v-if="eyebrow" class="mono-label text-accent">{{ eyebrow }}</span>
    </div>

    <h1
      class="mt-5 max-w-3xl text-balance text-[clamp(1.85rem,3.8vw,2.7rem)] font-semibold leading-[1.2] tracking-tight"
    >
      {{ title }}
    </h1>

    <p v-if="leadText" class="mt-4 max-w-2xl text-[14.5px] leading-[1.8] text-secondary">
      {{ leadText }}
    </p>

    <slot />
  </Reveal>
</template>