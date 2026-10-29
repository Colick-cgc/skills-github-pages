<script setup>
import { computed } from 'vue'
import Reveal from '@/components/Reveal.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import { formatDate } from '@/utils/format.js'
import { asset } from '@/utils/asset.js'
import travel from '@/data/travel.json'

const sorted = computed(() => [...travel].sort((a, b) => b.date.localeCompare(a.date)))

// 到过的地方（地点标签）
const places = computed(() => {
  const set = new Set()
  travel.forEach((t) => t.location && set.add(t.location))
  return [...set]
})
</script>

<template>
  <div class="mx-auto max-w-[1180px] px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
    <SectionHeader
      index="04.3"
      eyebrow="Travel"
      title="旅行回忆"
      lead="走过的路、看过的风景，和那些还想再去的地方。"
    />

    <div class="mt-8 flex flex-wrap items-center gap-2">
      <span v-for="p in places" :key="p" class="chip">📍 {{ p }}</span>
      <router-link to="/admin?new=travel" class="chip is-active no-print">＋ 新增旅行</router-link>
    </div>

    <!-- 相册网格 -->
    <div class="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3">
      <Reveal v-for="(t, i) in sorted" :key="t.id" :delay="Math.min(i, 9) * 0.04">
        <router-link :to="`/travel/${t.id}`" class="group block">
          <div v-if="t.images && t.images.length" class="img-frame aspect-[4/3]">
            <img :src="asset(t.images[0])" :alt="t.title" loading="lazy" />
          </div>
          <div
            v-else
            class="img-frame flex aspect-[4/3] items-center justify-center"
          >
            <span class="mono text-[10px] text-muted">NO PHOTO</span>
          </div>
          <h2 class="mt-3 text-[14px] font-semibold tracking-tight transition-colors group-hover:text-accent">
            {{ t.title }}
          </h2>
          <div class="mt-1 flex items-center justify-between text-[11px] text-muted">
            <span>{{ t.location }}</span>
            <time class="mono">{{ formatDate(t.date) }}</time>
          </div>
        </router-link>
      </Reveal>
    </div>

    <p v-if="!sorted.length" class="py-16 text-center text-muted">还没有旅行记录。</p>
  </div>
</template>