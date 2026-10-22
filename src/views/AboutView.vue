<script setup>
import { motion } from 'motion-v'
import TagBadge from '@/components/TagBadge.vue'
import profile from '@/data/about.json'

const easing = [0.22, 1, 0.36, 1]

const infoRows = [
  ['姓名', profile.realName],
  ['学校', profile.school],
  ['现居', profile.location],
  ['星座', profile.constellation],
  ['MBTI', profile.mbti],
].filter(([, v]) => v)
</script>

<template>
  <div class="mx-auto max-w-5xl px-6 pb-24 pt-28 sm:pt-32">
    <!-- 顶部介绍 -->
    <div class="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
      <motion.div
        :initial="{ opacity: 0, scale: 0.9 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.6, ease: easing }"
        class="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent-soft text-3xl font-semibold text-accent"
      >
        {{ profile.name.slice(0, 1) }}
      </motion.div>

      <motion.div
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.1, ease: easing }"
      >
        <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">{{ profile.name }}</h1>
        <p class="mt-2 text-secondary">{{ profile.role }}</p>
      </motion.div>
    </div>

    <motion.p
      :initial="{ opacity: 0, y: 16 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6, delay: 0.2, ease: easing }"
      class="mt-8 max-w-2xl text-lg leading-relaxed text-secondary"
    >
      {{ profile.intro }}
    </motion.p>

    <!-- 分栏：左个人信息 / 右技能与兴趣 -->
    <div class="mt-12 grid gap-6 md:grid-cols-2">
      <motion.section
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :viewport="{ once: true }"
        :transition="{ duration: 0.6, ease: easing }"
        class="card p-6"
      >
        <h2 class="text-lg font-semibold tracking-tight">基本信息</h2>
        <dl class="mt-4 flex flex-col gap-3">
          <div v-for="[label, value] in infoRows" :key="label" class="flex items-baseline gap-3">
            <dt class="w-14 shrink-0 text-sm text-muted">{{ label }}</dt>
            <dd class="text-sm text-primary">{{ value }}</dd>
          </div>
        </dl>
      </motion.section>

      <motion.section
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :viewport="{ once: true }"
        :transition="{ duration: 0.6, delay: 0.1, ease: easing }"
        class="card p-6"
      >
        <h2 class="text-lg font-semibold tracking-tight">研究方向</h2>
        <div class="mt-4 flex flex-wrap gap-2">
          <TagBadge v-for="r in profile.research" :key="r" :label="r" />
        </div>

        <h2 class="mt-7 text-lg font-semibold tracking-tight">技能</h2>
        <div class="mt-4 flex flex-wrap gap-2">
          <TagBadge v-for="s in profile.skills" :key="s" :label="s" />
        </div>

        <h2 class="mt-7 text-lg font-semibold tracking-tight">兴趣</h2>
        <div class="mt-4 flex flex-wrap gap-2">
          <TagBadge v-for="i in profile.interests" :key="i" :label="i" />
        </div>
      </motion.section>
    </div>

    <!-- 建站目的 + 网站使用说明 -->
    <motion.section
      :initial="{ opacity: 0, y: 20 }"
      :while-in-view="{ opacity: 1, y: 0 }"
      :viewport="{ once: true }"
      :transition="{ duration: 0.6, ease: easing }"
      class="card mt-6 p-6"
    >
      <h2 class="text-lg font-semibold tracking-tight">关于这个站</h2>
      <p class="mt-3 text-[15px] leading-relaxed text-secondary">{{ profile.purpose }}</p>
      <p class="mt-4 rounded-xl bg-surface-2 p-4 text-sm leading-relaxed text-muted">
        {{ profile.siteNote }}
      </p>
    </motion.section>
  </div>
</template>
