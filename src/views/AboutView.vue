<script setup>
import SectionHeader from '@/components/SectionHeader.vue'
import Reveal from '@/components/Reveal.vue'
import TagBadge from '@/components/TagBadge.vue'
import profile from '@/data/about.json'

const infoRows = [
  ['学校', profile.school],
  ['现居', profile.location],
  ['星座', profile.constellation],
  ['MBTI', profile.mbti],
].filter(([, v]) => v)

const boards = [
  { label: '日常学习', to: '/research', desc: '两周一循环的精读节奏' },
  { label: '实习计划', to: '/internship', desc: '十二周的数据分析准备' },
  { label: '项目展示', to: '/projects', desc: '三个仓库与我的作品' },
]
</script>

<template>
  <div>
    <div class="mx-auto max-w-[1180px] px-5 pb-8 pt-28 sm:px-8 sm:pt-36">
      <SectionHeader index="05" eyebrow="About" title="关于我" :lead="profile.intro" />

      <div class="mt-14 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <!-- 左：身份 + 基本信息 -->
        <Reveal>
          <div class="flex flex-col gap-4">
            <div class="card card-static p-6">
              <div class="flex items-center gap-4">
                <div
                  class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface-2 text-[20px] font-semibold text-accent"
                >
                  {{ profile.name.slice(0, 1) }}
                </div>
                <div>
                  <h2 class="text-[19px] font-semibold tracking-tight">{{ profile.name }}</h2>
                  <p class="mt-0.5 text-[12.5px] text-secondary">{{ profile.role }}</p>
                </div>
              </div>

              <dl class="mt-6 flex flex-col divide-y divide-border border-t border-border">
                <div
                  v-for="[label, value] in infoRows"
                  :key="label"
                  class="flex items-baseline justify-between gap-4 py-2.5"
                >
                  <dt class="text-[11.5px] text-muted">{{ label }}</dt>
                  <dd class="text-[12.5px] text-primary">{{ value }}</dd>
                </div>
              </dl>
            </div>

            <div class="panel p-5">
              <p class="mono-label">Notebook</p>
              <p class="mt-2 text-[11.5px] leading-relaxed text-muted">
                这个站是纯静态的：所有内容写在仓库的 JSON 里，没有后端和数据库。
                计划页上的勾选只存在你这台设备的浏览器里。
              </p>
            </div>
          </div>
        </Reveal>

        <!-- 右：研究 / 技能 / 兴趣 + 建站目的 -->
        <Reveal :delay="0.08">
          <div class="flex flex-col gap-4">
            <div class="card card-static p-6">
              <p class="mono-label">研究方向</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <TagBadge v-for="r in profile.research" :key="r" :label="r" />
              </div>

              <p class="mono-label mt-6">工具与技能</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <TagBadge v-for="s in profile.skills" :key="s" :label="s" />
              </div>

              <p class="mono-label mt-6">兴趣</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <TagBadge v-for="i in profile.interests" :key="i" :label="i" />
              </div>
            </div>

            <div class="card card-static p-6">
              <p class="mono-label">为什么有这个站</p>
              <p class="mt-3 text-[13.5px] leading-[1.9] text-secondary">{{ profile.purpose }}</p>
              <p class="mt-5 text-[11.5px] leading-relaxed text-muted">{{ profile.siteNote }}</p>
            </div>
          </div>
        </Reveal>
      </div>

      <!-- 三个板块入口 -->
      <div class="mt-5 grid gap-4 sm:grid-cols-3">
        <router-link v-for="b in boards" :key="b.to" :to="b.to" class="group">
          <div class="panel flex items-center justify-between p-4 transition hover:border-accent/40">
            <div>
              <p class="text-[12.5px] font-medium text-primary">{{ b.label }}</p>
              <p class="mt-0.5 text-[11px] text-muted">{{ b.desc }}</p>
            </div>
            <svg
              class="text-muted transition-all group-hover:translate-x-0.5 group-hover:text-accent"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>