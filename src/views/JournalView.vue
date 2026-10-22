<script setup>
import { ref, computed } from 'vue'
import { motion } from 'motion-v'
import SectionHeader from '@/components/SectionHeader.vue'
import TagBadge from '@/components/TagBadge.vue'
import { shortDate, collectTags } from '@/utils/format.js'
import journal from '@/data/journal.json'

const easing = [0.22, 1, 0.36, 1]

const selectedTags = ref([])
const allTags = computed(() => collectTags(journal))

const filtered = computed(() =>
  journal
    .filter((j) =>
      selectedTags.value.length ? selectedTags.value.every((t) => j.tags.includes(t)) : true,
    )
    .sort((a, b) => b.date.localeCompare(a.date)),
)

// 按年份归档分组
const grouped = computed(() => {
  const map = new Map()
  filtered.value.forEach((j) => {
    const y = j.date.slice(0, 4)
    if (!map.has(y)) map.set(y, [])
    map.get(y).push(j)
  })
  return [...map.entries()]
})

function toggleTag(t) {
  const i = selectedTags.value.indexOf(t)
  if (i >= 0) selectedTags.value.splice(i, 1)
  else selectedTags.value.push(t)
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 pb-24 pt-28 sm:pt-32">
    <SectionHeader
      eyebrow="Journal"
      title="随笔日记"
      subtitle="私人日常、情绪与生活碎片。没有分享按钮，只有自己。"
    />

    <!-- 标签筛选 -->
    <div v-if="allTags.length" class="mt-8 flex flex-wrap gap-2">
      <button
        v-for="t in allTags"
        :key="t"
        class="chip"
        :class="{ 'is-active': selectedTags.includes(t) }"
        @click="toggleTag(t)"
      >
        {{ t }}
      </button>
      <button
        v-if="selectedTags.length"
        class="chip text-muted hover:text-primary"
        @click="selectedTags = []"
      >
        清除筛选
      </button>
    </div>

    <!-- 按年归档 -->
    <div v-for="[year, entries] in grouped" :key="year" class="mt-12">
      <motion.p
        :initial="{ opacity: 0 }"
        :while-in-view="{ opacity: 1 }"
        :viewport="{ once: true }"
        :transition="{ duration: 0.6, ease: easing }"
        class="text-sm font-semibold tracking-wide text-muted"
      >
        {{ year }}
      </motion.p>

      <div class="mt-4 flex flex-col gap-4">
        <motion.div
          v-for="(j, i) in entries"
          :key="j.id"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.1 }"
          :transition="{ duration: 0.5, delay: Math.min(i, 8) * 0.05, ease: easing }"
        >
          <router-link :to="`/journal/${j.id}`" class="card block p-5">
            <div class="flex items-center gap-3">
              <time class="text-sm font-medium text-accent">{{ shortDate(j.date) }}</time>
              <span v-if="j.mood" class="text-xs text-muted">{{ j.mood }}</span>
            </div>
            <h2 class="mt-2 text-lg font-semibold tracking-tight">{{ j.title }}</h2>
            <p class="mt-2 line-clamp-2 text-sm text-secondary">{{ j.summary }}</p>
            <div v-if="j.tags && j.tags.length" class="mt-4 flex flex-wrap gap-2">
              <TagBadge v-for="t in j.tags" :key="t" :label="t" />
            </div>
          </router-link>
        </motion.div>
      </div>
    </div>

    <p v-if="!filtered.length" class="py-16 text-center text-muted">还没有随笔。</p>
  </div>
</template>
