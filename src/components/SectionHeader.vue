<script setup>
import Reveal from './Reveal.vue'

// 栏目页顶部的统一标题区（小眉题 + 大标题 + 副标题）。
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <Reveal>
    <p v-if="eyebrow" class="text-xs font-medium uppercase tracking-[0.2em] text-accent">
      {{ eyebrow }}
    </p>
    <h1 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{{ title }}</h1>
    <p v-if="subtitle" class="mt-4 max-w-2xl text-secondary">{{ subtitle }}</p>
  </Reveal>
</template>
