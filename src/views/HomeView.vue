<script setup>
import { computed } from 'vue'
import Reveal from '@/components/Reveal.vue'
import ProgressRing from '@/components/ProgressRing.vue'
import { shortDate } from '@/utils/format.js'
import { useStoredRef } from '@/composables/useProgress'
import site from '@/data/site.json'
import research from '@/data/research.json'
import internship from '@/data/internship.json'
import projects from '@/data/projects.json'
import papers from '@/data/papers.json'
import journal from '@/data/journal.json'
import reading from '@/data/reading.json'
import travel from '@/data/travel.json'

// 当前阶段 / 当前周次与板块页共享同一个 localStorage 键，
// 在学习页点了「阶段 B」，回到这里也会跟着变。
const { value: phaseKey } = useStoredRef('research.phase', research.current.phase)
const { value: weekNo } = useStoredRef('internship.week', internship.currentWeek)

const phase = computed(
  () => research.phases.find((p) => p.key === phaseKey.value) || research.phases[0],
)
const phaseIndex = computed(() => research.phases.findIndex((p) => p.key === phase.value.key))
const week = computed(
  () => internship.weeks.find((w) => w.w === weekNo.value) || internship.weeks[0],
)
const roundPct = computed(() =>
  Math.round(((phaseIndex.value + 1) / research.phases.length) * 100),
)

// 顶部「本周」用的 ISO 周编号（避免写死日期）
function isoWeek(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = t.getUTCDay() || 7
  t.setUTCDate(t.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1))
  return Math.ceil(((t - yearStart) / 86400000 + 1) / 7)
}
const now = new Date()
const weekLabel = `${now.getFullYear()} W${String(isoWeek(now)).padStart(2, '0')}`

const boards = computed(() => [
  {
    index: '01',
    to: '/research',
    theme: 'board-learn',
    label: '日常学习',
    title: '两周一循环的精读',
    desc: '只有一个精读论文，配少量外部阅读；周日下午收纳，第二周准备组会和最小复现。',
    metrics: [
      { k: '当前阶段', v: `${phase.value.key} · ${phase.value.name}` },
      { k: '每周投入', v: `${research.budget.total} h` },
    ],
  },
  {
    index: '02',
    to: '/internship',
    theme: 'board-career',
    label: '实习计划',
    title: '十二周的数据分析准备',
    desc: 'SQL、Pandas、Excel 三线并进，两个项目做完上线，第 5 周开始投递。',
    metrics: [
      { k: '当前进度', v: `第 ${weekNo.value} / ${internship.positioning.weeks} 周` },
      { k: '每周投入', v: `${internship.positioning.hoursPerWeek} h` },
    ],
  },
  {
    index: '03',
    to: '/projects',
    theme: 'board-build',
    label: '项目展示',
    title: '三个参考项目',
    desc: '从零售看板到用户分层，只模仿结构和叙事，不复刻每一行代码。',
    metrics: [
      { k: '参考仓库', v: `${projects.references.length} 个` },
      { k: '我的项目', v: `${projects.mine.filter((m) => m.status === '进行中').length} 个进行中` },
    ],
  },
])

// 本周要做的几件事：学习取当前阶段前两条 + 产出，实习取当前周的任务
const studyFocus = computed(() => [
  ...phase.value.tasks.slice(0, 2).map((t) => t.title),
  `产出：${phase.value.output}`,
])
const workFocus = computed(() => [...week.value.tasks.slice(0, 3), `交付：${week.value.deliverable}`])

const feed = computed(() => {
  const items = [
    ...papers.map((p) => ({
      kind: '论文',
      title: p.title,
      date: p.date,
      to: '/research',
      desc: p.summary || p.coreProblem || '',
    })),
    ...journal.map((j) => ({
      kind: '随笔',
      title: j.title,
      date: j.date,
      to: `/journal/${j.id}`,
      desc: j.summary || '',
    })),
    ...reading.map((r) => ({
      kind: r.category === 'book' ? '读书' : '观影',
      title: r.title,
      date: r.date,
      to: `/reading/${r.id}`,
      desc: r.synopsis || r.thoughts || '',
    })),
    ...travel.map((t) => ({
      kind: '旅行',
      title: t.title,
      date: t.date,
      to: `/travel/${t.id}`,
      desc: t.text || '',
    })),
  ]
  return items
    .filter((i) => i.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
})
</script>

<template>
  <div>
    <!-- ================= Hero ================= -->
    <section class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0 grid-lines opacity-70"></div>
      <div
        class="pointer-events-none absolute -top-56 left-[18%] h-[440px] w-[540px] rounded-full opacity-90 blur-3xl"
        style="background: radial-gradient(circle, var(--learn-soft), transparent 68%)"
      ></div>
      <div
        class="pointer-events-none absolute -top-32 right-[-10%] h-[380px] w-[460px] rounded-full opacity-80 blur-3xl"
        style="background: radial-gradient(circle, var(--build-soft), transparent 68%)"
      ></div>

      <div class="relative mx-auto max-w-[1180px] px-5 pb-12 pt-32 sm:px-8 sm:pb-16 sm:pt-36">
        <div class="grid gap-14 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
          <!-- 左：定位 -->
          <div>
            <div class="flex items-center gap-2.5">
              <span class="live-dot"></span>
              <span class="mono-label">{{ site.hero.eyebrow }}</span>
            </div>

            <h1
              class="mt-6 text-[clamp(2.15rem,5vw,3.4rem)] font-semibold leading-[1.16] tracking-[-0.03em]"
            >
              <span v-for="line in site.hero.titleLines" :key="line" class="block">{{ line }}</span>
            </h1>

            <p class="mt-6 max-w-[560px] text-[15px] leading-[1.9] text-secondary">
              {{ site.hero.subtitle }}
            </p>

            <div class="mt-9 flex flex-wrap items-center gap-3">
              <router-link :to="site.hero.primary.to" class="pill-btn-solid">
                {{ site.hero.primary.label }}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </router-link>
              <router-link :to="site.hero.secondary.to" class="pill-btn">
                {{ site.hero.secondary.label }}
              </router-link>
            </div>

            <dl class="mt-12 grid grid-cols-1 gap-y-4 border-t border-border pt-6 sm:grid-cols-3">
              <div v-for="f in site.hero.facts" :key="f.label" class="sm:pr-6">
                <dt class="mono-label">{{ f.label }}</dt>
                <dd class="mt-1.5 text-[13px] text-primary">{{ f.value }}</dd>
              </div>
            </dl>
          </div>

          <!-- 右：本周概览 -->
          <Reveal :delay="0.15">
            <div class="card card-static p-6">
              <div class="flex items-center justify-between">
                <span class="mono-label">Now / 本周</span>
                <span class="mono text-[10.5px] text-muted">{{ weekLabel }}</span>
              </div>

              <div class="mt-6 flex items-center gap-5">
                <ProgressRing :value="roundPct" :size="62" label="RND" />
                <div class="min-w-0">
                  <p class="text-[13.5px] font-medium">
                    阶段 {{ phase.key }} · {{ phase.name }}
                  </p>
                  <p class="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-muted">
                    {{ phase.goal }}
                  </p>
                </div>
              </div>

              <dl class="mt-6 flex flex-col divide-y divide-border border-t border-border">
                <div class="flex items-baseline justify-between gap-4 py-3">
                  <dt class="text-[12.5px] text-secondary">实习计划</dt>
                  <dd class="mono text-[12px] text-primary">
                    第 {{ weekNo }} / {{ internship.positioning.weeks }} 周
                  </dd>
                </div>
                <div class="flex items-baseline justify-between gap-4 py-3">
                  <dt class="text-[12.5px] text-secondary">本轮论文</dt>
                  <dd class="mono text-[12px] text-primary">{{ papers.length }} 篇</dd>
                </div>
                <div class="flex items-baseline justify-between gap-4 py-3">
                  <dt class="text-[12.5px] text-secondary">每周总投入</dt>
                  <dd class="mono text-[12px] text-primary">18 – 21 h</dd>
                </div>
              </dl>

              <p class="mt-2 text-[11px] leading-relaxed text-muted">
                科研 {{ research.budget.total }}h + 实习
                {{ internship.positioning.hoursPerWeek }}h；超了就砍外部阅读。
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    <!-- ================= 三个板块 ================= -->
    <section class="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 sm:py-16">
      <div class="flex items-end justify-between gap-6">
        <div>
          <p class="mono-label">01 — Boards</p>
          <h2 class="mt-2 text-xl font-semibold tracking-tight">三个板块</h2>
        </div>
        <p class="hidden max-w-[280px] text-right text-[12px] leading-relaxed text-muted sm:block">
          论文是毕业的事，数据是实习的事，项目把两边串起来。
        </p>
      </div>

      <div class="mt-8 grid gap-4 md:grid-cols-3">
        <Reveal v-for="(b, i) in boards" :key="b.to" :delay="i * 0.06" class="h-full">
          <router-link :to="b.to" class="block h-full">
            <article
              class="card group flex h-full flex-col p-6"
              :class="b.theme"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-2.5">
                  <span class="mono text-[11px] text-muted">{{ b.index }}</span>
                  <span class="h-3 w-px bg-border-strong"></span>
                  <span class="text-[11.5px] text-accent">{{ b.label }}</span>
                </div>
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

              <h3 class="mt-6 text-[16px] font-semibold leading-snug tracking-tight">
                {{ b.title }}
              </h3>
              <p class="mt-2.5 flex-1 text-[12.5px] leading-relaxed text-secondary">
                {{ b.desc }}
              </p>

              <dl class="mt-6 flex flex-col gap-2 border-t border-border pt-4">
                <div
                  v-for="m in b.metrics"
                  :key="m.k"
                  class="flex items-baseline justify-between gap-3"
                >
                  <dt class="text-[11px] text-muted">{{ m.k }}</dt>
                  <dd class="mono min-w-0 truncate text-[11.5px] text-primary">{{ m.v }}</dd>
                </div>
              </dl>
            </article>
          </router-link>
        </Reveal>
      </div>
    </section>

    <!-- ================= 本周 ================= -->
    <section class="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 sm:py-16">
      <div class="rule mb-10"></div>
      <div class="flex items-end justify-between gap-6">
        <div>
          <p class="mono-label">02 — This Week</p>
          <h2 class="mt-2 text-xl font-semibold tracking-tight">本周任务</h2>
        </div>
        <p class="hidden text-[12px] text-muted sm:block">任务多了就都不做，先保这两列的前三条。</p>
      </div>

      <div class="mt-8 grid gap-4 lg:grid-cols-2">
        <!-- 学习 -->
        <Reveal class="board-learn">
          <div class="card card-static h-full p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="mono text-[10.5px] text-muted">阶段 {{ phase.key }}</span>
                <span class="chip">{{ phase.when }}</span>
              </div>
              <router-link to="/research" class="mono text-[11px] text-accent hover:underline">
                学习 →
              </router-link>
            </div>
            <h3 class="mt-5 text-[15px] font-semibold">{{ phase.name }}</h3>
            <ol class="mt-4 flex flex-col gap-3">
              <li
                v-for="(t, i) in studyFocus"
                :key="t"
                class="flex items-start gap-3 text-[13px] leading-relaxed text-secondary"
              >
                <span class="mono mt-0.5 shrink-0 text-[10px] text-muted">0{{ i + 1 }}</span>
                <span>{{ t }}</span>
              </li>
            </ol>
          </div>
        </Reveal>

        <!-- 实习 -->
        <Reveal :delay="0.08" class="board-career">
          <div class="card card-static h-full p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="mono text-[10.5px] text-muted">W{{ week.w }}</span>
                <span class="chip">{{ week.phase }}</span>
              </div>
              <router-link to="/internship" class="mono text-[11px] text-accent hover:underline">
                实习 →
              </router-link>
            </div>
            <h3 class="mt-5 text-[15px] font-semibold">{{ week.title }}</h3>
            <ol class="mt-4 flex flex-col gap-3">
              <li
                v-for="(t, i) in workFocus"
                :key="t"
                class="flex items-start gap-3 text-[13px] leading-relaxed text-secondary"
              >
                <span class="mono mt-0.5 shrink-0 text-[10px] text-muted">0{{ i + 1 }}</span>
                <span>{{ t }}</span>
              </li>
            </ol>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- ================= 最近记录 ================= -->
    <section class="mx-auto max-w-[1180px] px-5 pb-8 pt-12 sm:px-8 sm:pt-16">
      <div class="rule mb-10"></div>
      <div class="flex items-end justify-between gap-6">
        <div>
          <p class="mono-label">03 — Records</p>
          <h2 class="mt-2 text-xl font-semibold tracking-tight">最近记录</h2>
        </div>
        <router-link to="/records" class="mono text-[11px] text-accent hover:underline">
          全部记录 →
        </router-link>
      </div>

      <div class="mt-3 flex flex-col">
        <router-link
          v-for="item in feed"
          :key="item.kind + item.title"
          :to="item.to"
          class="group flex items-baseline gap-4 border-b border-border py-4 transition-colors hover:bg-surface-2/60 sm:gap-6"
        >
          <span class="mono w-[68px] shrink-0 text-[10.5px] text-muted">
            {{ shortDate(item.date) }}
          </span>
          <span class="chip shrink-0 scale-90 origin-left">{{ item.kind }}</span>
          <span class="min-w-0 flex-1 truncate text-[13.5px] text-primary transition-colors group-hover:text-accent">
            {{ item.title }}
          </span>
          <span class="hidden max-w-[38%] shrink-0 truncate text-[12px] text-muted md:block">
            {{ item.desc }}
          </span>
        </router-link>
      </div>
    </section>
  </div>
</template>