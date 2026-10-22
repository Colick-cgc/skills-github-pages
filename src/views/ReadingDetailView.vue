<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { motion } from 'motion-v'
import TagBadge from '@/components/TagBadge.vue'
import { formatDate } from '@/utils/format.js'
import reading from '@/data/reading.json'

const route = useRoute()
const entry = computed(() => reading.find((r) => r.id === route.params.id))

function stars(n) {
  return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n)
}

const easing = [0.22, 1, 0.36, 1]
</script>

<template>
  <article class="mx-auto max-w-3xl px-6 pb-24 pt-28 sm:pt-32">
    <router-link
      to="/reading"
      class="inline-flex items-center gap-1.5 text-sm text-secondary transition hover:text-primary"
    >
      ← 返回读书与观影
    </router-link>

    <template v-if="entry">
      <motion.header
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, ease: easing }"
        class="mt-8"
      >
        <span class="chip">{{ entry.category === 'book' ? '读书心得' : '视频与纪录片' }}</span>
        <h1 class="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {{ entry.title }}
        </h1>
        <p class="mt-3 text-secondary">{{ entry.type }} · {{ entry.creator }}</p>
        <p class="mt-1.5 text-sm text-muted">
          {{ formatDate(entry.date) }} · 评分 {{ stars(entry.rating) }}
        </p>
        <div v-if="entry.tags && entry.tags.length" class="mt-5 flex flex-wrap gap-2">
          <TagBadge v-for="t in entry.tags" :key="t" :label="t" />
        </div>
      </motion.header>

      <div class="mt-10 flex flex-col gap-10">
        <motion.section
          :initial="{ opacity: 0, y: 16 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.2 }"
          :transition="{ duration: 0.5, ease: easing }"
        >
          <h2 class="text-xs font-semibold uppercase tracking-[0.15em] text-muted">梗概</h2>
          <p class="mt-3 text-[16px] leading-[1.85]">{{ entry.synopsis }}</p>
        </motion.section>

        <motion.section
          v-if="entry.thoughts"
          :initial="{ opacity: 0, y: 16 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.2 }"
          :transition="{ duration: 0.5, ease: easing }"
        >
          <h2 class="text-xs font-semibold uppercase tracking-[0.15em] text-muted">我的思考</h2>
          <p class="mt-3 whitespace-pre-line text-[16px] leading-[1.85]">{{ entry.thoughts }}</p>
        </motion.section>

        <motion.blockquote
          v-if="entry.quote || entry.memorableScene"
          :initial="{ opacity: 0, y: 16 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.2 }"
          :transition="{ duration: 0.5, ease: easing }"
          class="rounded-2xl border-l-2 border-accent bg-surface-2 p-6"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
            {{ entry.category === 'book' ? '摘抄' : '印象最深的片段' }}
          </p>
          <p class="mt-3 text-[16px] italic leading-[1.85] text-secondary">
            {{ entry.category === 'book' ? entry.quote : entry.memorableScene }}
          </p>
        </motion.blockquote>
      </div>
    </template>

    <p v-else class="mt-16 text-center text-muted">这条记录不存在。</p>
  </article>
</template>
