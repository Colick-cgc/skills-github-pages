<script setup>
// 标签胶囊。active 时高亮（用于标签筛选）。
defineProps({
  label: { type: String, required: true },
  active: { type: Boolean, default: false },
})
</script>

<template>
  <span class="chip" :class="{ 'is-active': active }">{{ label }}</span>
</template>
