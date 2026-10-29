<script setup>
import { ref, computed } from 'vue'
import Reveal from '@/components/Reveal.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import TagBadge from '@/components/TagBadge.vue'
import { formatDate } from '@/utils/format.js'
import reading from '@/data/reading.json'

const cat = ref('all')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'book', label: '读书心得' },
  { key: 'video', label: '视频与纪录片' },
]

const filtered = computed(() =>
  reading
    .filter((r) => cat.value === 'all' || r.category === cat.value)
    .sort((a, b) => b.date.localeCompare(a.date)),
)

// 卡片上展示的摘录 / 片段
function snippet(r) {
  return r.category === 'book' ? r.quote || '' : r.memorableScene || ''
}
function stars(n) {
  return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n)
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
    <SectionHeader
      eyebrow="Reading &amp; Media"
      title="读书与观影"
      lead="读过的书、看过的片，以及它们留下的痕迹。"
    />

    <div class="mt-8 flex flex-wrap items-center gap-3">
      <!-- 横向分类切换 -->
      <div class="inline-flex rounded-full border border-border bg-surface p-1">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="rounded-full px-4 py-1.5 text-[12.5px] transition-all duration-300"
          :class="cat === t.key ? 'bg-accent text-[color:var(--on-accent)]' : 'text-secondary hover:text-primary'"
          @click="cat = t.key"
        >
          {{ t.label }}
        </button>
      </div>
      <router-link to="/admin?new=reading" class="chip is-active no-print">＋ 新增</router-link>
    </div>

    <!-- 列表（key 绑定分类，切换时重新做交错渐入） -->
    <div :key="cat" class="mt-8 flex flex-col gap-4">
      <Reveal v-for="(r, i) in filtered" :key="r.id" :delay="Math.min(i, 8) * 0.04">
        <router-link :to="`/reading/${r.id}`" class="card block p-5">
          <div class="flex items-center gap-2.5">
            <span class="chip">{{ r.category === 'book' ? '读书' : '观影' }}</span>
            <span class="text-[11px] text-muted">{{ r.type }}</span>
            <span class="mono ml-auto text-[11px] text-accent">{{ stars(r.rating) }}</span>
          </div>
          <h2 class="mt-3 text-[15.5px] font-semibold tracking-tight">{{ r.title }}</h2>
          <p class="mt-1 text-[12px] text-secondary">{{ r.creator }}</p>
          <p class="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-secondary">{{ r.synopsis }}</p>

          <div v-if="snippet(r)" class="mt-4 rounded-xl border border-border bg-surface-2 p-4">
            <p class="mono text-[9.5px] text-muted">
              {{ r.category === 'book' ? '摘录' : '印象最深的片段' }}
            </p>
            <p class="mt-1.5 text-[12.5px] italic leading-relaxed text-secondary">{{ snippet(r) }}</p>
          </div>

          <div class="mt-4 flex flex-wrap items-center gap-2">
            <TagBadge v-for="t in r.tags" :key="t" :label="t" />
            <time class="mono ml-auto text-[10px] text-muted">{{ formatDate(r.date) }}</time>
          </div>
        </router-link>
      </Reveal>

      <p v-if="!filtered.length" class="py-16 text-center text-muted">这个分类下还没有记录。</p>
    </div>
  </div>
</template>