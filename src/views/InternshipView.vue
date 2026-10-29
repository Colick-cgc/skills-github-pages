<script setup>
import { computed, ref } from 'vue'
import Reveal from '@/components/Reveal.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import CheckList from '@/components/CheckList.vue'
import Meter from '@/components/Meter.vue'
import { useStoredRef } from '@/composables/useProgress'
import internship from '@/data/internship.json'

const { value: currentWeek, set: setWeek } = useStoredRef(
  'internship.week',
  internship.currentWeek,
)

const openWeek = ref(currentWeek.value)

function selectWeek(w) {
  currentWeek.value = w
  setWeek(w)
  openWeek.value = openWeek.value === w ? null : w
}

const rhythmTotal = computed(
  () => internship.rhythm.reduce((sum, r) => sum + r.minutes, 0) / 60,
)
const rhythmMax = computed(() => Math.max(...internship.rhythm.map((r) => r.minutes)))
const capacity = 12

const currentWeekData = computed(
  () => internship.weeks.find((w) => w.w === currentWeek.value) || internship.weeks[0],
)
</script>

<template>
  <div class="board-career">
    <div class="mx-auto max-w-[1180px] px-5 pb-8 pt-28 sm:px-8 sm:pt-36">
      <SectionHeader
        index="02"
        eyebrow="Internship"
        title="十二周，把学过的东西变成能投的简历"
        lead="科研不停，每周只拿 9–12 小时准备实习：SQL 和 Excel 先补硬技能，Pandas 够用就行，然后做项目、写简历、第 5 周开始投。"
      >
        <div class="mt-8 flex flex-wrap items-center gap-2">
          <span class="chip is-active">{{ internship.positioning.target }}</span>
          <span class="chip">每周 {{ internship.positioning.hoursPerWeek }} h</span>
          <span class="chip">{{ internship.positioning.weeks }} 周路线</span>
          <span class="chip">第 {{ internship.applications.startWeek }} 周开始投递</span>
        </div>
      </SectionHeader>

      <!-- ========== 01 定位与现状 ========== -->
      <section class="mt-16 sm:mt-20">
        <div class="flex items-end justify-between gap-6 border-b border-border pb-4">
          <div class="flex items-baseline gap-3">
            <span class="mono-label">01</span>
            <h2 class="text-[17px] font-semibold tracking-tight">先看清起点</h2>
          </div>
          <p class="mono hidden text-[11px] text-muted sm:block">{{ internship.positioning.window }}</p>
        </div>

        <div class="mt-6 grid gap-4 lg:grid-cols-3">
          <div class="card card-static p-6">
            <p class="mono-label">目标</p>
            <p class="mt-3 text-[15px] font-semibold leading-snug">
              {{ internship.positioning.target }}
            </p>
            <p class="mt-3 text-[12.5px] leading-relaxed text-secondary">
              {{ internship.positioning.summary }}
            </p>
            <dl class="mt-6 flex flex-col divide-y divide-border border-t border-border">
              <div class="flex items-baseline justify-between gap-3 py-2.5">
                <dt class="text-[11.5px] text-muted">每周可投入</dt>
                <dd class="mono text-[12px]">{{ internship.positioning.hoursPerWeek }} 小时</dd>
              </div>
              <div class="flex items-baseline justify-between gap-3 py-2.5">
                <dt class="text-[11.5px] text-muted">路线长度</dt>
                <dd class="mono text-[12px]">{{ internship.positioning.weeks }} 周</dd>
              </div>
              <div class="flex items-baseline justify-between gap-3 py-2.5">
                <dt class="text-[11.5px] text-muted">当前进度</dt>
                <dd class="mono text-[12px] text-accent">
                  第 {{ currentWeek }} / {{ internship.positioning.weeks }} 周
                </dd>
              </div>
            </dl>
          </div>

          <div class="card card-static p-6 lg:col-span-2">
            <div class="flex items-center justify-between">
              <p class="mono-label">现状 → 目标</p>
              <p class="mono text-[10px] text-muted">0 – 5 档</p>
            </div>
            <div class="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <Meter
                v-for="s in internship.skills"
                :key="s.name"
                :name="s.name"
                :now="s.now"
                :target="s.target"
                :note="s.note"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- ========== 02 12 周路线 ========== -->
      <section class="mt-16 sm:mt-20">
        <div class="flex items-end justify-between gap-6 border-b border-border pb-4">
          <div class="flex items-baseline gap-3">
            <span class="mono-label">02</span>
            <h2 class="text-[17px] font-semibold tracking-tight">十二周，三段</h2>
          </div>
          <p class="mono hidden text-[11px] text-muted sm:block">点一周，设为当前</p>
        </div>

        <!-- 三个阶段 -->
        <div class="mt-6 grid gap-3 md:grid-cols-3">
          <Reveal v-for="(p, i) in internship.phases" :key="p.key" :delay="i * 0.06" class="h-full">
            <div class="card card-static flex h-full flex-col p-5">
              <div class="flex items-center justify-between">
                <span class="mono text-[10.5px] text-muted">{{ p.weeks }}</span>
                <span class="mono text-[10px] text-muted">0{{ i + 1 }}</span>
              </div>
              <h3 class="mt-3 text-[14px] font-semibold">{{ p.name }}</h3>
              <p class="mt-1.5 text-[11.5px] text-accent">{{ p.focus }}</p>
              <p class="mt-3 text-[11.5px] leading-relaxed text-muted">{{ p.goal }}</p>
            </div>
          </Reveal>
        </div>

        <!-- 每周 -->
        <div class="panel mt-4 divide-y divide-border">
          <div v-for="w in internship.weeks" :key="w.w">
            <button
              class="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-surface sm:gap-4 sm:px-5"
              @click="selectWeek(w.w)"
            >
              <span
                class="mono shrink-0 text-[11px]"
                :class="w.w === currentWeek ? 'text-accent' : 'text-muted'"
              >
                W{{ String(w.w).padStart(2, '0') }}
              </span>
              <span
                class="h-1.5 w-1.5 shrink-0 rounded-full"
                :class="w.w === currentWeek ? 'bg-accent' : 'bg-border-strong'"
              ></span>
              <span
                class="min-w-0 flex-1 truncate text-[13px]"
                :class="w.w === currentWeek ? 'font-medium text-primary' : 'text-secondary'"
              >
                {{ w.title }}
              </span>
              <span class="chip hidden shrink-0 sm:inline-flex">
                {{ w.phase }}
              </span>
              <span class="mono shrink-0 text-[10px] text-muted">{{ w.hours }}h</span>
              <svg
                class="shrink-0 text-muted transition-transform duration-300"
                :class="openWeek === w.w ? 'rotate-180' : ''"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <Transition name="expand">
              <div v-if="openWeek === w.w" class="border-t border-border bg-surface/40 p-5 sm:px-6">
                <div class="grid gap-6 lg:grid-cols-[1.4fr_0.85fr]">
                  <div>
                    <p class="mono-label">本周任务</p>
                    <div class="mt-3">
                      <CheckList
                        :items="w.tasks.map((t, i) => ({ id: 'w' + w.w + '-' + i, title: t }))"
                        :storage-key="'internship.w' + w.w"
                      />
                    </div>
                  </div>
                  <div class="flex flex-col gap-3">
                    <div class="panel p-4">
                      <p class="mono-label">交付</p>
                      <p class="mt-2 text-[12.5px] leading-relaxed text-primary">
                        {{ w.deliverable }}
                      </p>
                    </div>
                    <div class="panel p-4">
                      <p class="mono-label">周投入</p>
                      <p class="mt-2 mono text-[12.5px]">{{ w.hours }} 小时</p>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </section>

      <!-- ========== 03 每周节奏 ========== -->
      <section class="mt-16 sm:mt-20">
        <div class="flex items-end justify-between gap-6 border-b border-border pb-4">
          <div class="flex items-baseline gap-3">
            <span class="mono-label">03</span>
            <h2 class="text-[17px] font-semibold tracking-tight">一周怎么排</h2>
          </div>
          <p class="mono text-[11px] text-muted">
            {{ rhythmTotal.toFixed(1) }} / {{ capacity }} h
          </p>
        </div>

        <div class="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div class="card card-static p-6">
            <div
              v-for="r in internship.rhythm"
              :key="r.day"
              class="flex items-center gap-4 border-b border-border py-3 first:pt-0 last:border-0 last:pb-0"
            >
              <span class="mono w-9 shrink-0 text-[11px] text-secondary">{{ r.day }}</span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-[12.5px] text-primary">{{ r.task }}</span>
                <span class="mt-1.5 block h-[3px] overflow-hidden rounded-full bg-border">
                  <span
                    class="block h-full rounded-full bg-accent transition-all duration-700"
                    :style="{ width: (r.minutes / rhythmMax) * 100 + '%' }"
                  ></span>
                </span>
              </span>
              <span class="mono w-10 shrink-0 text-right text-[10.5px] text-muted">
                {{ r.minutes }}′
              </span>
            </div>

            <div class="mt-5 flex items-baseline justify-between border-t border-border pt-4">
              <span class="text-[12px] text-secondary">合计</span>
              <span class="mono text-[13px] font-semibold text-accent">
                {{ rhythmTotal.toFixed(1) }} h / 周
              </span>
            </div>
            <p class="mt-2 text-[11px] leading-relaxed text-muted">
              工作日每天一小时左右，周末留给项目和投递。低于 9 小时不要补，高于 12 小时砍任务。
            </p>
          </div>

          <div class="flex flex-col gap-3">
            <div class="panel p-5">
              <p class="mono-label">当前这一周</p>
              <p class="mt-2 text-[13px] font-medium">W{{ currentWeekData.w }} · {{ currentWeekData.title }}</p>
              <p class="mt-1.5 text-[11.5px] leading-relaxed text-muted">
                {{ currentWeekData.deliverable }}
              </p>
            </div>
            <div class="panel p-5">
              <p class="mono-label">和科研的关系</p>
              <p class="mt-2 text-[11.5px] leading-relaxed text-muted">
                周日下午的精读收纳不挪，实习任务排进工作日晚上和周六。两边合计 18–21 小时，
                已经接近上限，不要再加课。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== 04 投递 ========== -->
      <section class="mt-16 sm:mt-20">
        <div class="flex items-end justify-between gap-6 border-b border-border pb-4">
          <div class="flex items-baseline gap-3">
            <span class="mono-label">04</span>
            <h2 class="text-[17px] font-semibold tracking-tight">第 {{ internship.applications.startWeek }} 周开始投</h2>
          </div>
          <p class="mono hidden text-[11px] text-muted sm:block">{{ internship.applications.cadence }}</p>
        </div>

        <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal
            v-for="(s, i) in internship.applications.steps"
            :key="s.name"
            :delay="i * 0.05"
            class="h-full"
          >
            <div class="card card-static flex h-full flex-col p-5">
              <div class="flex items-center gap-2">
                <span class="mono text-[10px] text-muted">0{{ i + 1 }}</span>
                <span class="h-3 w-px bg-border-strong"></span>
                <span class="text-[12.5px] font-medium">{{ s.name }}</span>
              </div>
              <p class="mt-3 text-[11.5px] leading-relaxed text-muted">{{ s.desc }}</p>
            </div>
          </Reveal>
        </div>

        <div class="panel mt-4 flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-[12.5px] text-primary">
            投递节奏：{{ internship.applications.cadence }}
          </p>
          <p class="mono text-[11px] text-muted">
            从 W{{ internship.applications.startWeek }} 起，每周固定一天集中投
          </p>
        </div>
      </section>

      <!-- ========== 05 不做清单 ========== -->
      <section class="mt-16 sm:mt-20">
        <div class="flex items-end justify-between gap-6 border-b border-border pb-4">
          <div class="flex items-baseline gap-3">
            <span class="mono-label">05</span>
            <h2 class="text-[17px] font-semibold tracking-tight">不做什么</h2>
          </div>
          <p class="mono hidden text-[11px] text-muted sm:block">防止任务变多</p>
        </div>

        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <div
            v-for="r in internship.rules"
            :key="r.id"
            class="flex items-start gap-3 rounded-xl border border-border p-4"
          >
            <svg
              class="mt-0.5 shrink-0 text-muted"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            <div>
              <p class="text-[12.5px] font-medium text-primary">{{ r.title }}</p>
              <p class="mt-1 text-[11.5px] leading-relaxed text-muted">{{ r.text }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>