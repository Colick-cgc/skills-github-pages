<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
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
  <article class="mx-auto max-w-2xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
    <router-link
      to="/journal"
      class="mono inline-flex items-center gap-1.5 text-[11px] text-secondary transition hover:text-accent"
    >
      ← 返回随笔
    </router-link>

    <template v-if="entry">
      <header class="mt-8 border-b border-border pb-8">
        <div class="mono flex items-center gap-3 text-[10.5px] text-muted">
          <time>{{ formatDate(entry.date) }}</time>
          <span v-if="entry.mood">· {{ entry.mood }}</span>
        </div>
        <h1 class="mt-4 text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-[1.2] tracking-tight">
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
        <p
          v-for="(p, i) in paragraphs"
          :key="i"
          class="text-[16.5px] leading-[1.95] text-primary/95"
        >
          {{ p }}
        </p>
      </div>
    </template>

    <p v-else class="mt-16 text-center text-muted">这篇随笔不存在。</p>
  </article>
</template>