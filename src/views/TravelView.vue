<script setup>
import { computed } from 'vue'
import { motion } from 'motion-v'
import SectionHeader from '@/components/SectionHeader.vue'
import { formatDate } from '@/utils/format.js'
import { asset } from '@/utils/asset.js'
import travel from '@/data/travel.json'

const easing = [0.22, 1, 0.36, 1]

const sorted = computed(() => [...travel].sort((a, b) => b.date.localeCompare(a.date)))

// 到过的地方（地点标签）
const places = computed(() => {
  const set = new Set()
  travel.forEach((t) => t.location && set.add(t.location))
  return [...set]
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-6 pb-24 pt-28 sm:pt-32">
    <SectionHeader
      eyebrow="Travel"
      title="旅行回忆"
      subtitle="走过的路、看过的风景，和那些还想再去的地方。"
    />

    <div class="mt-6 flex justify-end">
      <router-link to="/admin?new=travel" class="pill-btn">＋ 新增旅行</router-link>
    </div>

    <!-- 地图式地点标签（非真实地图） -->
    <div v-if="places.length" class="mt-8 flex flex-wrap gap-2">
      <span
        v-for="p in places"
        :key="p"
        class="chip"
      >
        📍 {{ p }}
      </span>
    </div>

    <!-- 相册网格 -->
    <div class="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3">
      <motion.div
        v-for="(t, i) in sorted"
        :key="t.id"
        :initial="{ opacity: 0, y: 20, scale: 0.98 }"
        :while-in-view="{ opacity: 1, y: 0, scale: 1 }"
        :viewport="{ once: true, amount: 0.1 }"
        :transition="{ duration: 0.5, delay: Math.min(i, 9) * 0.05, ease: easing }"
      >
        <router-link :to="`/travel/${t.id}`" class="group block">
          <div v-if="t.images && t.images.length" class="img-frame aspect-[4/3]">
            <img :src="asset(t.images[0])" :alt="t.title" loading="lazy" />
          </div>
          <div
            v-else
            class="flex aspect-[4/3] items-center justify-center rounded-2xl bg-surface-2 text-muted"
          >
            <span class="text-sm">暂无照片</span>
          </div>
          <h2 class="mt-3 text-base font-semibold tracking-tight">{{ t.title }}</h2>
          <div class="mt-1 flex items-center justify-between text-xs text-muted">
            <span>{{ t.location }}</span>
            <time>{{ formatDate(t.date) }}</time>
          </div>
        </router-link>
      </motion.div>
    </div>

    <p v-if="!sorted.length" class="py-16 text-center text-muted">还没有旅行记录。</p>
  </div>
</template>
