<script setup>
import { ref, computed } from 'vue'
import Reveal from '@/components/Reveal.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import TagBadge from '@/components/TagBadge.vue'
import { shortDate, collectTags } from '@/utils/format.js'
import journal from '@/data/journal.json'

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
  <div class="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
    <SectionHeader
      eyebrow="Journal"
      title="随笔日记"
      lead="私人日常、情绪与生活碎片。没有分享按钮，只有自己。"
    />

    <div class="mt-8 flex flex-wrap items-center gap-2">
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
      <router-link to="/admin?new=journal" class="chip ml-auto is-active no-print">＋ 写日记</router-link>
    </div>

    <!-- 按年归档 -->
    <div v-for="[year, entries] in grouped" :key="year" class="mt-14">
      <div class="flex items-baseline gap-3 border-b border-border pb-3">
        <span class="mono text-[12px] text-secondary">{{ year }}</span>
        <span class="mono text-[10px] text-muted">{{ entries.length }} 篇</span>
      </div>

      <div class="mt-5 flex flex-col gap-3">
        <Reveal v-for="(j, i) in entries" :key="j.id" :delay="Math.min(i, 8) * 0.04">
          <router-link :to="`/journal/${j.id}`" class="card block p-5">
            <div class="flex items-center gap-3">
              <time class="mono text-[10.5px] text-accent">{{ shortDate(j.date) }}</time>
              <span v-if="j.mood" class="mono text-[10px] text-muted">{{ j.mood }}</span>
            </div>
            <h2 class="mt-2.5 text-[15.5px] font-semibold tracking-tight">{{ j.title }}</h2>
            <p class="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-secondary">{{ j.summary }}</p>
            <div v-if="j.tags && j.tags.length" class="mt-3.5 flex flex-wrap gap-1.5">
              <TagBadge v-for="t in j.tags" :key="t" :label="t" />
            </div>
          </router-link>
        </Reveal>
      </div>
    </div>

    <p v-if="!filtered.length" class="py-16 text-center text-muted">还没有随笔。</p>
  </div>
</template>