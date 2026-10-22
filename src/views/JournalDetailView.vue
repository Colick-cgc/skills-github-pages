<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { motion } from 'motion-v'
import TagBadge from '@/components/TagBadge.vue'
import { formatDate } from '@/utils/format.js'
import { asset } from '@/utils/asset.js'
import journal from '@/data/journal.json'

const route = useRoute()
const entry = computed(() => journal.find((j) => j.id === route.params.id))
// 正文按空行分段（JSON 里用 \n\n 分隔段落）
const paragraphs = computed(() => (entry.value?.content || '').split('\n\n').filter(Boolean))
</script>

<template>
  <!-- 长文阅读模式：窄栏、背景柔和、减少干扰 -->
  <article class="mx-auto max-w-2xl px-6 pb-24 pt-28 sm:pt-32">
    <router-link
      to="/journal"
      class="inline-flex items-center gap-1.5 text-sm text-secondary transition hover:text-primary"
    >
      ← 返回随笔
    </router-link>

    <template v-if="entry">
      <header class="mt-8">
        <div class="flex items-center gap-3 text-sm text-muted">
          <time>{{ formatDate(entry.date) }}</time>
          <span v-if="entry.mood">· {{ entry.mood }}</span>
        </div>
        <h1 class="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {{ entry.title }}
        </h1>
        <div v-if="entry.tags && entry.tags.length" class="mt-5 flex flex-wrap gap-2">
          <TagBadge v-for="t in entry.tags" :key="t" :label="t" />
        </div>
      </header>

      <div v-if="entry.image" class="img-frame mt-8 aspect-[16/9]">
        <img :src="asset(entry.image)" :alt="entry.title" />
      </div>

      <div class="mt-10 flex flex-col gap-6">
        <motion.p
          v-for="(p, i) in paragraphs"
          :key="i"
          :initial="{ opacity: 0, y: 12 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.5, delay: Math.min(i, 5) * 0.08, ease: [0.22, 1, 0.36, 1] }"
          class="text-[17px] leading-[1.85] text-primary"
        >
          {{ p }}
        </motion.p>
      </div>
    </template>

    <p v-else class="mt-16 text-center text-muted">这篇随笔不存在。</p>
  </article>
</template>
