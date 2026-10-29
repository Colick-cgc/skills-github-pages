<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TagBadge from '@/components/TagBadge.vue'
import { formatDate } from '@/utils/format.js'
import reading from '@/data/reading.json'

const route = useRoute()
const entry = computed(() => reading.find((r) => r.id === route.params.id))

function stars(n) {
  return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n)
}
</script>

<template>
  <article class="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
    <router-link
      to="/reading"
      class="mono inline-flex items-center gap-1.5 text-[11px] text-secondary transition hover:text-accent"
    >
      ← 返回读书与观影
    </router-link>

    <template v-if="entry">
      <header class="mt-8 border-b border-border pb-8">
        <span class="chip">{{ entry.category === 'book' ? '读书心得' : '视频与纪录片' }}</span>
        <h1 class="mt-4 text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-[1.2] tracking-tight">
          {{ entry.title }}
        </h1>
        <p class="mt-3 text-[13.5px] text-secondary">{{ entry.type }} · {{ entry.creator }}</p>
        <p class="mono mt-2 flex items-center gap-2 text-[10.5px] text-muted">
          <span>{{ formatDate(entry.date) }}</span>
          <span class="text-border-strong">/</span>
          <span class="text-accent">{{ stars(entry.rating) }}</span>
        </p>
        <div v-if="entry.tags && entry.tags.length" class="mt-5 flex flex-wrap gap-2">
          <TagBadge v-for="t in entry.tags" :key="t" :label="t" />
        </div>
      </header>

      <div class="mt-10 flex flex-col gap-10">
        <section>
          <h2 class="mono-label">梗概</h2>
          <p class="mt-3 text-[15.5px] leading-[1.9] text-primary">{{ entry.synopsis }}</p>
        </section>

        <section v-if="entry.thoughts">
          <h2 class="mono-label">我的思考</h2>
          <p class="mt-3 whitespace-pre-line text-[15.5px] leading-[1.9] text-primary">
            {{ entry.thoughts }}
          </p>
        </section>

        <blockquote
          v-if="entry.quote || entry.memorableScene"
          class="rounded-2xl border-l-2 border-accent bg-surface-2 p-6"
        >
          <p class="mono-label">{{ entry.category === 'book' ? '摘抄' : '印象最深的片段' }}</p>
          <p class="mt-3 text-[15.5px] italic leading-[1.9] text-secondary">
            {{ entry.category === 'book' ? entry.quote : entry.memorableScene }}
          </p>
        </blockquote>
      </div>
    </template>

    <p v-else class="mt-16 text-center text-muted">这条记录不存在。</p>
  </article>
</template>