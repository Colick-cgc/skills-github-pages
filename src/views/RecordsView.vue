<script setup>
import SectionHeader from '@/components/SectionHeader.vue'
import Reveal from '@/components/Reveal.vue'
import { shortDate } from '@/utils/format.js'
import journal from '@/data/journal.json'
import reading from '@/data/reading.json'
import travel from '@/data/travel.json'

function latest(list) {
  return [...list].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
}

const groups = [
  {
    to: '/journal',
    label: '随笔日记',
    desc: '日常、情绪、想过又怕忘的事。',
    count: journal.length,
    latest: latest(journal),
  },
  {
    to: '/reading',
    label: '读书与观影',
    desc: '读过的书、看过的片，留下的痕迹。',
    count: reading.length,
    latest: latest(reading),
  },
  {
    to: '/travel',
    label: '旅行回忆',
    desc: '去过的地方，和当时的心情。',
    count: travel.length,
    latest: latest(travel),
  },
]
</script>

<template>
  <div>
    <div class="mx-auto max-w-[1180px] px-5 pb-8 pt-28 sm:px-8 sm:pt-36">
      <SectionHeader
        index="04"
        eyebrow="Records"
        title="生活记录"
        lead="论文、实习、项目之外的部分都在这里：随笔、读过的书、看过的片，和去过的地方。"
      />

      <div class="mt-14 grid gap-4 md:grid-cols-3">
        <Reveal v-for="(g, i) in groups" :key="g.to" :delay="i * 0.06" class="h-full">
          <router-link :to="g.to" class="block h-full">
            <article class="card group flex h-full flex-col p-6">
              <div class="flex items-start justify-between">
                <span class="mono text-[11px] text-muted">{{ String(g.count).padStart(2, '0') }} 条</span>
                <svg
                  class="text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </div>

              <h2 class="mt-7 text-[17px] font-semibold tracking-tight">{{ g.label }}</h2>
              <p class="mt-2 text-[12.5px] leading-relaxed text-secondary">{{ g.desc }}</p>

              <ul class="mt-6 flex flex-1 flex-col gap-2.5 border-t border-border pt-4">
                <li
                  v-for="item in g.latest"
                  :key="item.id"
                  class="flex items-baseline gap-2.5 text-[12px]"
                >
                  <time class="mono shrink-0 text-[10px] text-muted">{{ shortDate(item.date) }}</time>
                  <span class="truncate text-secondary">{{ item.title }}</span>
                </li>
                <li v-if="!g.latest.length" class="text-[12px] text-muted">还没有记录</li>
              </ul>
            </article>
          </router-link>
        </Reveal>
      </div>

      <p class="mt-8 max-w-xl text-[11.5px] leading-relaxed text-muted">
        这三个栏目是公开页面，写之前先想一下：真实的住址、证件、联系方式不要往上放。
      </p>
    </div>
  </div>
</template>