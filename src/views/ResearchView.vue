<script setup>
import { ref, computed } from 'vue'
import Reveal from '@/components/Reveal.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import CheckList from '@/components/CheckList.vue'
import { formatDate, shortDate } from '@/utils/format.js'
import { useStoredRef } from '@/composables/useProgress'
import research from '@/data/research.json'
import papers from '@/data/papers.json'

const { value: phaseKey, set: setPhase } = useStoredRef('research.phase', research.current.phase)

const phase = computed(
  () => research.phases.find((p) => p.key === phaseKey.value) || research.phases[0],
)

const budgetMax = computed(() => Math.max(...research.budget.items.map((i) => i.hours)))

const openPaper = ref(papers[0]?.id || null)
function togglePaper(id) {
  openPaper.value = openPaper.value === id ? null : id
}

function noteSections(p) {
  return [
    ['研究问题', p.coreProblem],
    ['方法', p.method],
    ['我的理解', p.understanding],
    ['疑问', p.questions],
    ['后续', p.nextSteps],
  ].filter(([, v]) => v)
}

const statusTone = (s) =>
  s === '已收纳' ? 'text-accent' : s === '已读' ? 'text-secondary' : 'text-muted'
</script>

<template>
  <div class="board-learn">
    <div class="mx-auto max-w-[1180px] px-5 pb-8 pt-28 sm:px-8 sm:pt-36">
      <SectionHeader
        index="01"
        eyebrow="Daily Study"
        title="论文精读的两周循环"
        lead="从导师给的论文里只挑一篇精读，配一两篇外部阅读；第一周周日下午收纳，第二周深化、复现、准备组会。"
      >
        <div class="mt-8 flex flex-wrap items-center gap-2">
          <span class="chip">第 {{ research.current.round }} 轮</span>
          <span class="chip">一轮一篇</span>
          <span class="chip">周日下午收纳</span>
          <span class="chip">复现先评估</span>
          <router-link to="/admin?new=papers" class="chip is-active no-print">＋ 新增笔记</router-link>
        </div>
      </SectionHeader>

      <!-- ========== 01 循环骨架 ========== -->
      <section class="mt-16 sm:mt-20">
        <div class="flex items-end justify-between gap-6 border-b border-border pb-4">
          <div class="flex items-baseline gap-3">
            <span class="mono-label">01</span>
            <h2 class="text-[17px] font-semibold tracking-tight">循环骨架</h2>
          </div>
          <p class="mono hidden text-[11px] text-muted sm:block">{{ research.cycle.name }}</p>
        </div>

        <p class="mt-4 max-w-2xl text-[13px] leading-relaxed text-secondary">
          {{ research.cycle.summary }}
        </p>

        <!-- 四个阶段（点一下切换到该阶段，右侧详情跟着变） -->
        <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal v-for="(p, i) in research.phases" :key="p.key" :delay="i * 0.05">
            <button
              type="button"
              class="card w-full p-5 text-left"
              :class="p.key === phaseKey ? 'border-accent/60 bg-accent-soft/40' : ''"
              @click="setPhase(p.key)"
            >
              <div class="flex items-start justify-between">
                <span
                  class="mono text-[22px] font-semibold leading-none"
                  :class="p.key === phaseKey ? 'text-accent' : 'text-border-strong'"
                >
                  {{ p.key }}
                </span>
                <span class="mono text-[10px] text-muted">{{ p.hours }} h</span>
              </div>
              <h3 class="mt-4 text-[13.5px] font-semibold">{{ p.name }}</h3>
              <p class="mono-label mt-1.5 normal-case tracking-normal">{{ p.when }}</p>
              <p class="mt-3 line-clamp-3 text-[11.5px] leading-relaxed text-muted">
                {{ p.goal }}
              </p>
              <div class="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span class="mono text-[9px] text-muted">{{ p.tasks.length }} 项任务</span>
                <span v-if="p.key === phaseKey" class="mono text-[9px] text-accent">当前阶段</span>
                <span v-else class="mono text-[9px] text-muted">—</span>
              </div>
            </button>
          </Reveal>
        </div>

        <!-- 当前阶段详情 -->
        <Reveal :delay="0.1">
          <div class="card card-static mt-4 p-6 sm:p-8">
            <div class="grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
              <div>
                <div class="flex items-center gap-3">
                  <span class="chip is-active">阶段 {{ phase.key }}</span>
                  <span class="mono-label">{{ phase.when }}</span>
                </div>
                <h3 class="mt-4 text-[18px] font-semibold tracking-tight">{{ phase.name }}</h3>
                <p class="mt-2 text-[13px] leading-relaxed text-secondary">{{ phase.goal }}</p>

                <div class="mt-6">
                  <CheckList
                    :items="phase.tasks"
                    :storage-key="'research.' + phase.key"
                  />
                </div>
              </div>

              <div class="flex flex-col gap-3">
                <div class="panel p-5">
                  <p class="mono-label">本阶段产出</p>
                  <p class="mt-2 text-[13px] leading-relaxed text-primary">{{ phase.output }}</p>
                </div>
                <div class="panel p-5">
                  <p class="mono-label">时间约定</p>
                  <p class="mt-2 mono text-[13px] text-primary">{{ phase.hours }} 小时</p>
                  <p class="mt-1 text-[11.5px] leading-relaxed text-muted">
                    这条时间上限比任务更重要：超时就停，剩下的下一轮再说。
                  </p>
                </div>
                <div class="panel p-5">
                  <p class="mono-label">勾选说明</p>
                  <p class="mt-2 text-[11.5px] leading-relaxed text-muted">
                    勾选只保存在你这台设备的浏览器里，刷新不会丢，换设备不会同步。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <!-- ========== 02 时间预算 ========== -->
      <section class="mt-16 sm:mt-20">
        <div class="flex items-end justify-between gap-6 border-b border-border pb-4">
          <div class="flex items-baseline gap-3">
            <span class="mono-label">02</span>
            <h2 class="text-[17px] font-semibold tracking-tight">一周的时间花在哪</h2>
          </div>
          <p class="mono text-[11px] text-muted">{{ research.budget.total }} {{ research.budget.unit }}</p>
        </div>

        <div class="mt-6 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div class="card card-static p-6">
            <div
              v-for="b in research.budget.items"
              :key="b.label"
              class="border-b border-border py-3.5 first:pt-0 last:border-0 last:pb-0"
            >
              <div class="flex items-baseline justify-between gap-4">
                <span class="text-[13px] text-primary">{{ b.label }}</span>
                <span class="mono text-[12px] text-secondary">{{ b.hours }} h</span>
              </div>
              <div class="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border">
                <div
                  class="h-full rounded-full bg-accent transition-all duration-700"
                  :style="{ width: (b.hours / budgetMax) * 100 + '%' }"
                ></div>
              </div>
              <p class="mt-1.5 text-[11px] text-muted">{{ b.note }}</p>
            </div>

            <div class="mt-5 flex items-baseline justify-between border-t border-border pt-4">
              <span class="text-[12.5px] text-secondary">合计</span>
              <span class="mono text-[14px] font-semibold text-accent">
                {{ research.budget.total }} h / 周
              </span>
            </div>
            <p class="mt-3 text-[11.5px] leading-relaxed text-muted">{{ research.budget.note }}</p>
          </div>

          <div class="flex flex-col gap-3">
            <div
              v-for="c in research.cycle.constraints"
              :key="c.id"
              class="panel border-l-2 border-l-accent p-4"
            >
              <p class="text-[12.5px] font-medium text-primary">{{ c.title }}</p>
              <p class="mt-1.5 text-[11.5px] leading-relaxed text-muted">{{ c.text }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== 03 精读论文 ========== -->
      <section class="mt-16 sm:mt-20">
        <div class="flex items-end justify-between gap-6 border-b border-border pb-4">
          <div class="flex items-baseline gap-3">
            <span class="mono-label">03</span>
            <h2 class="text-[17px] font-semibold tracking-tight">本轮的论文</h2>
          </div>
          <router-link to="/admin?new=papers" class="mono text-[11px] text-accent hover:underline">
            编辑笔记 →
          </router-link>
        </div>

        <div class="mt-6 flex flex-col gap-3">
          <article v-for="p in papers" :key="p.id" class="card overflow-hidden">
            <button
              class="flex w-full items-start justify-between gap-5 p-5 text-left sm:p-6"
              @click="togglePaper(p.id)"
            >
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span v-if="p.round" class="chip">{{ p.round }}</span>
                  <span class="chip" :class="p.status === '精读中' ? 'is-active' : ''">
                    {{ p.status }}
                  </span>
                </div>
                <h3 class="mt-3 text-[15px] font-semibold leading-snug tracking-tight">
                  {{ p.title }}
                </h3>
                <p class="mt-1.5 text-[11.5px] text-muted">
                  {{ (p.authors || []).join('、') || '作者待填' }}
                  <template v-if="p.venue"> · {{ p.venue }}</template>
                  <template v-if="!p.venue"> · 期刊待填</template>
                </p>
              </div>

              <div class="flex shrink-0 flex-col items-end gap-2">
                <time class="mono text-[10.5px] text-muted">{{ shortDate(p.date) }}</time>
                <svg
                  class="text-muted transition-transform duration-300"
                  :class="openPaper === p.id ? 'rotate-180' : ''"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </button>

            <Transition name="expand">
              <div v-if="openPaper === p.id" class="border-t border-border p-5 sm:p-6">
                <p v-if="p.summary" class="text-[13px] leading-relaxed text-secondary">
                  {{ p.summary }}
                </p>

                <dl class="mt-5 grid gap-5 sm:grid-cols-2">
                  <div v-for="[label, value] in noteSections(p)" :key="label">
                    <dt class="mono-label">{{ label }}</dt>
                    <dd
                      class="mt-2 whitespace-pre-line text-[13px] leading-[1.85] text-secondary"
                    >
                      {{ value }}
                    </dd>
                  </div>
                </dl>

                <div v-if="p.links && p.links.length" class="mt-6 border-t border-border pt-4">
                  <p class="mono-label">链接</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <a
                      v-for="l in p.links"
                      :key="l.url"
                      :href="l.url"
                      target="_blank"
                      rel="noopener"
                      class="chip is-active"
                    >
                      {{ l.label || l.url }}
                    </a>
                  </div>
                </div>
              </div>
            </Transition>
          </article>
        </div>
      </section>

      <!-- ========== 04 外部阅读 ========== -->
      <section class="mt-16 sm:mt-20">
        <div class="flex items-end justify-between gap-6 border-b border-border pb-4">
          <div class="flex items-baseline gap-3">
            <span class="mono-label">04</span>
            <h2 class="text-[17px] font-semibold tracking-tight">外部阅读</h2>
          </div>
          <p class="mono hidden text-[11px] text-muted sm:block">少量 · 有目的 · 读完才收纳</p>
        </div>

        <div class="panel mt-6 divide-y divide-border">
          <div
            v-for="(e, i) in research.externalReadings"
            :key="e.id"
            class="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-5"
          >
            <span class="mono shrink-0 pt-0.5 text-[10px] text-muted">
              E{{ String(i + 1).padStart(2, '0') }}
            </span>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <p class="text-[13px] font-medium text-primary">{{ e.title }}</p>
                <span v-if="e.example" class="chip scale-90">示例</span>
              </div>
              <p class="mt-1.5 text-[11.5px] leading-relaxed text-muted">{{ e.reason }}</p>
              <div class="mt-2.5 flex flex-wrap items-center gap-2">
                <span class="chip">{{ e.type }}</span>
                <span class="chip">{{ e.source }}</span>
              </div>
            </div>

            <div class="flex shrink-0 items-center gap-2 sm:pt-0.5">
              <span class="h-1.5 w-1.5 rounded-full" :class="statusTone(e.status) === 'text-accent' ? 'bg-accent' : 'bg-border-strong'"></span>
              <span class="mono text-[10.5px]" :class="statusTone(e.status)">{{ e.status }}</span>
            </div>
          </div>
        </div>

        <p class="mt-3 text-[11px] text-muted">
          示例条目在 <span class="mono text-secondary">src/data/research.json</span> 里，换成你真实的文献即可。
        </p>
      </section>

      <!-- ========== 05 收纳 ========== -->
      <section class="mt-16 sm:mt-20">
        <div class="flex items-end justify-between gap-6 border-b border-border pb-4">
          <div class="flex items-baseline gap-3">
            <span class="mono-label">05</span>
            <h2 class="text-[17px] font-semibold tracking-tight">周日下午的三件套</h2>
          </div>
          <p class="mono hidden text-[11px] text-muted sm:block">阶段 C 只做这三件事</p>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-3">
          <Reveal
            v-for="(o, i) in research.outputs"
            :key="o.id"
            :delay="i * 0.06"
            class="h-full"
          >
            <div class="card card-static flex h-full flex-col p-6">
              <span class="mono text-[11px] text-muted">0{{ i + 1 }}</span>
              <h3 class="mt-3 text-[14px] font-semibold">{{ o.title }}</h3>
              <p class="mt-2 flex-1 text-[12px] leading-relaxed text-secondary">{{ o.desc }}</p>
            </div>
          </Reveal>
        </div>

        <div class="card card-static mt-4 p-6">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="mono-label">Weekly Check</p>
              <p class="mt-2 text-[13px] text-primary">本周收纳做了吗</p>
              <p class="mt-1 text-[11.5px] text-muted">
                没读完的文献不进对比表；精读论文等 D 阶段收尾后再收。
              </p>
            </div>
            <div class="w-full max-w-[320px]">
              <CheckList
                :items="[
                  { id: 'file1', title: '方法对比表加行' },
                  { id: 'file2', title: '研究问题图更新' },
                  { id: 'file3', title: '文献关系补线' },
                ]"
                storage-key="research.weekly-file"
              />
            </div>
          </div>
        </div>

        <p class="mt-6 text-[11px] text-muted">
          最近更新：{{ formatDate(papers[0]?.date) }}
        </p>
      </section>
    </div>
  </div>
</template>