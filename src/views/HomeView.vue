<script setup>
import { computed } from 'vue'
import { motion } from 'motion-v'
import ParticlesBg from '@/components/ParticlesBg.vue'
import TagBadge from '@/components/TagBadge.vue'
import { useTypewriter } from '@/composables/useTypewriter'
import { formatDate, lastDaysActivity } from '@/utils/format.js'
import site from '@/data/site.json'
import papers from '@/data/papers.json'
import journal from '@/data/journal.json'
import reading from '@/data/reading.json'
import travel from '@/data/travel.json'

const { typed } = useTypewriter(site.hero.tagline)

// 统一的缓动曲线（苹果风：快起、慢落）
const easing = [0.22, 1, 0.36, 1]

// 最近更新：汇总四类内容，按日期倒序取前 6 条
const feed = computed(() => {
  const items = [
    ...journal.map((j) => ({
      kind: '随笔',
      title: j.title,
      summary: j.summary || '',
      date: j.date,
      tags: j.tags || [],
      to: `/journal/${j.id}`,
    })),
    ...papers.map((p) => ({
      kind: '论文',
      title: p.title,
      summary: p.summary || p.coreProblem || '',
      date: p.date,
      tags: p.tags || [],
      to: '/papers',
    })),
    ...reading.map((r) => ({
      kind: r.category === 'book' ? '读书' : '观影',
      title: r.title,
      summary: r.synopsis || r.thoughts || '',
      date: r.date,
      tags: r.tags || [],
      to: `/reading/${r.id}`,
    })),
    ...travel.map((t) => ({
      kind: '旅行',
      title: t.title,
      summary: t.text || '',
      date: t.date,
      tags: t.tags || [],
      to: `/travel/${t.id}`,
    })),
  ]
  return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
})

// 最近 7 天更新频率（柱状概览）
const activity = computed(() =>
  lastDaysActivity([...papers, ...journal, ...reading, ...travel], 7),
)
const activityMax = computed(() => Math.max(1, ...activity.value))
const dayLabels = computed(() => {
  const out = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    out.push(['日', '一', '二', '三', '四', '五', '六'][d.getDay()])
  }
  return out
})
</script>

<template>
  <div>
    <!-- ===== Hero：标语 + 粒子背景 ===== -->
    <section class="relative overflow-hidden">
      <ParticlesBg />
      <div class="relative mx-auto max-w-5xl px-6 pb-16 pt-28 text-center sm:pb-24 sm:pt-40">
        <motion.p
          :initial="{ opacity: 0, y: 12 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, ease: easing }"
          class="text-sm text-secondary"
        >
          {{ site.hero.eyebrow }}
        </motion.p>

        <h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          {{ typed }}<span class="type-cursor"></span>
        </h1>

        <motion.p
          :initial="{ opacity: 0, y: 12 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.4, ease: easing }"
          class="mx-auto mt-6 max-w-xl text-lg text-secondary"
        >
          {{ site.hero.subtitle }}
        </motion.p>

        <motion.div
          :initial="{ opacity: 0, y: 12 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.6, ease: easing }"
          class="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <router-link to="/papers" class="pill-btn">论文研读</router-link>
          <router-link to="/journal" class="pill-btn">随笔日记</router-link>
          <router-link to="/about" class="pill-btn">关于我</router-link>
        </motion.div>
      </div>
    </section>

    <!-- ===== 最近更新 + 继续学习 + 时间概览 ===== -->
    <section class="mx-auto max-w-5xl px-6 pb-24">
      <div class="grid gap-10 lg:grid-cols-3">
        <!-- 左：最近更新信息流 -->
        <div class="lg:col-span-2">
          <motion.h2
            :initial="{ opacity: 0, y: 16 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :viewport="{ once: true }"
            :transition="{ duration: 0.6, ease: easing }"
            class="text-xl font-semibold tracking-tight"
          >
            最近更新
          </motion.h2>

          <div class="mt-6 flex flex-col gap-4">
            <motion.div
              v-for="(item, i) in feed"
              :key="item.kind + item.title + item.date"
              :initial="{ opacity: 0, y: 20 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true, amount: 0.2 }"
              :transition="{ duration: 0.5, delay: Math.min(i, 6) * 0.06, ease: easing }"
            >
              <router-link :to="item.to" class="card block p-5">
                <div class="flex items-center gap-3">
                  <span class="chip">{{ item.kind }}</span>
                  <time class="text-xs text-muted">{{ formatDate(item.date) }}</time>
                </div>
                <h3 class="mt-3 text-lg font-semibold tracking-tight">{{ item.title }}</h3>
                <p class="mt-2 line-clamp-2 text-sm text-secondary">{{ item.summary }}</p>
                <div v-if="item.tags.length" class="mt-4 flex flex-wrap gap-2">
                  <TagBadge v-for="t in item.tags" :key="t" :label="t" />
                </div>
              </router-link>
            </motion.div>
          </div>
        </div>

        <!-- 右：继续学习 + 最近 7 天 -->
        <div class="flex flex-col gap-6">
          <motion.aside
            :initial="{ opacity: 0, y: 20 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :viewport="{ once: true }"
            :transition="{ duration: 0.6, delay: 0.1, ease: easing }"
            class="card p-6"
          >
            <h3 class="text-lg font-semibold tracking-tight">{{ site.nowLearning.title }}</h3>
            <p class="mt-2 text-sm font-medium text-accent">{{ site.nowLearning.topic }}</p>
            <ul class="mt-4 flex flex-col gap-2.5">
              <li
                v-for="it in site.nowLearning.items"
                :key="it"
                class="flex items-start gap-2 text-sm text-secondary"
              >
                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
                <span>{{ it }}</span>
              </li>
            </ul>
            <p class="mt-4 border-t border-border pt-4 text-sm text-muted">
              {{ site.nowLearning.note }}
            </p>
          </motion.aside>

          <motion.aside
            :initial="{ opacity: 0, y: 20 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :viewport="{ once: true }"
            :transition="{ duration: 0.6, delay: 0.2, ease: easing }"
            class="card p-6"
          >
            <h3 class="text-lg font-semibold tracking-tight">最近 7 天</h3>
            <p class="mt-1 text-xs text-muted">更新频率</p>
            <div class="mt-5 flex h-24 items-end gap-2">
              <div
                v-for="(c, i) in activity"
                :key="i"
                class="flex flex-1 flex-col items-center gap-1.5"
              >
                <div
                  class="w-full max-w-[28px] rounded-[3px] transition-all duration-500"
                  :class="c ? 'bg-accent' : 'bg-border'"
                  :style="{ height: Math.max(4, (c / activityMax) * 80) + 'px' }"
                ></div>
                <span class="text-[10px] text-muted">{{ dayLabels[i] }}</span>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  </div>
</template>
