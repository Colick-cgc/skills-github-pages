<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { motion } from 'motion-v'
import TagBadge from '@/components/TagBadge.vue'
import { formatDate } from '@/utils/format.js'
import { asset } from '@/utils/asset.js'
import travel from '@/data/travel.json'

const route = useRoute()
const entry = computed(() => travel.find((t) => t.id === route.params.id))

const easing = [0.22, 1, 0.36, 1]
// 首图作为主图，其余进图库
const hero = computed(() => entry.value?.images?.[0] || '')
const gallery = computed(() => entry.value?.images?.slice(1) || [])
const paragraphs = computed(() => (entry.value?.text || '').split('\n\n').filter(Boolean))
</script>

<template>
  <article class="mx-auto max-w-4xl px-6 pb-24 pt-28 sm:pt-32">
    <router-link
      to="/travel"
      class="inline-flex items-center gap-1.5 text-sm text-secondary transition hover:text-primary"
    >
      ← 返回旅行回忆
    </router-link>

    <template v-if="entry">
      <!-- 主图：进入时缓慢放大（Ken Burns） -->
      <motion.div
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, ease: easing }"
        class="mt-8"
      >
        <div v-if="hero" class="img-frame aspect-[16/9]">
          <img
            :src="asset(hero)"
            :alt="entry.title"
            style="animation: kenburns 12s ease-out forwards"
          />
        </div>
      </motion.div>

      <motion.header
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.1, ease: easing }"
        class="mt-8"
      >
        <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">{{ entry.title }}</h1>
        <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span v-if="entry.location">📍 {{ entry.location }}</span>
          <time>{{ formatDate(entry.date) }}</time>
        </div>
        <div v-if="entry.tags && entry.tags.length" class="mt-4 flex flex-wrap gap-2">
          <TagBadge v-for="t in entry.tags" :key="t" :label="t" />
        </div>
      </motion.header>

      <!-- 回忆文字 -->
      <div class="mt-8 flex flex-col gap-5">
        <motion.p
          v-for="(p, i) in paragraphs"
          :key="i"
          :initial="{ opacity: 0, y: 12 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.5, delay: Math.min(i, 5) * 0.08, ease: easing }"
          class="text-[16px] leading-[1.85]"
        >
          {{ p }}
        </motion.p>
      </div>

      <!-- 图库 -->
      <div v-if="gallery.length" class="mt-12 grid grid-cols-2 gap-4">
        <motion.div
          v-for="(img, i) in gallery"
          :key="img"
          :initial="{ opacity: 0, y: 16 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.2 }"
          :transition="{ duration: 0.5, delay: Math.min(i, 6) * 0.06, ease: easing }"
        >
          <div class="img-frame aspect-square">
            <img :src="asset(img)" :alt="entry.title" loading="lazy" />
          </div>
        </motion.div>
      </div>
    </template>

    <p v-else class="mt-16 text-center text-muted">这条旅行记录不存在。</p>
  </article>
</template>
