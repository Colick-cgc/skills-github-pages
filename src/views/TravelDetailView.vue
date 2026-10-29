<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TagBadge from '@/components/TagBadge.vue'
import { formatDate } from '@/utils/format.js'
import { asset } from '@/utils/asset.js'
import travel from '@/data/travel.json'

const route = useRoute()
const entry = computed(() => travel.find((t) => t.id === route.params.id))

// 首图作为主图，其余进图库
const hero = computed(() => entry.value?.images?.[0] || '')
const gallery = computed(() => entry.value?.images?.slice(1) || [])
const paragraphs = computed(() => (entry.value?.text || '').split('\n\n').filter(Boolean))
</script>

<template>
  <article class="mx-auto max-w-4xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
    <router-link
      to="/travel"
      class="mono inline-flex items-center gap-1.5 text-[11px] text-secondary transition hover:text-accent"
    >
      ← 返回旅行回忆
    </router-link>

    <template v-if="entry">
      <!-- 主图：进入时缓慢放大（Ken Burns） -->
      <div v-if="hero" class="img-frame mt-8 aspect-[16/9]">
        <img
          :src="asset(hero)"
          :alt="entry.title"
          style="animation: kenburns 14s ease-out forwards"
        />
      </div>

      <header class="mt-8 border-b border-border pb-8">
        <h1 class="text-[clamp(1.8rem,4vw,2.6rem)] font-semibold tracking-tight">{{ entry.title }}</h1>
        <div class="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-muted">
          <span v-if="entry.location">📍 {{ entry.location }}</span>
          <span class="text-border-strong">/</span>
          <time class="mono">{{ formatDate(entry.date) }}</time>
        </div>
        <div v-if="entry.tags && entry.tags.length" class="mt-4 flex flex-wrap gap-2">
          <TagBadge v-for="t in entry.tags" :key="t" :label="t" />
        </div>
      </header>

      <!-- 回忆文字 -->
      <div class="mt-8 flex flex-col gap-5">
        <p v-for="(p, i) in paragraphs" :key="i" class="text-[15.5px] leading-[1.95] text-primary">
          {{ p }}
        </p>
      </div>

      <!-- 图库 -->
      <div v-if="gallery.length" class="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div v-for="img in gallery" :key="img" class="img-frame aspect-square">
          <img :src="asset(img)" :alt="entry.title" loading="lazy" />
        </div>
      </div>
    </template>

    <p v-else class="mt-16 text-center text-muted">这条旅行记录不存在。</p>
  </article>
</template>