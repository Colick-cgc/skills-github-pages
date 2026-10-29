<script setup>
import Reveal from '@/components/Reveal.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import data from '@/data/projects.json'

const refs = [...data.references].sort((a, b) => a.order - b.order)
</script>

<template>
  <div class="board-build">
    <div class="mx-auto max-w-[1180px] px-5 pb-8 pt-28 sm:px-8 sm:pt-36">
      <SectionHeader
        index="03"
        eyebrow="Portfolio"
        title="我的项目"
        lead="参考结构、参考叙事，不复刻每一行代码。第一个项目从数据分析实习面试最常问的那条链路开始：清洗 → SQL → 仪表板 → 结论。"
      >
        <div class="mt-8 flex flex-wrap items-center gap-2">
          <span class="chip">参考仓库 {{ refs.length }}</span>
          <span class="chip">我的项目 {{ data.mine.length }}</span>
          <span class="chip">交付标准 {{ data.standard.items.length }} 条</span>
          <a
            href="https://github.com/Colick-cgc"
            target="_blank"
            rel="noopener"
            class="chip is-active"
          >
            GitHub ↗
          </a>
        </div>
      </SectionHeader>

      <!-- ========== 01 参考仓库 ========== -->
      <section class="mt-16 sm:mt-20">
        <div class="flex items-end justify-between gap-6 border-b border-border pb-4">
          <div class="flex items-baseline gap-3">
            <span class="mono-label">01</span>
            <h2 class="text-[17px] font-semibold tracking-tight">三个参考仓库</h2>
          </div>
          <p class="mono hidden text-[11px] text-muted sm:block">按顺序看，不要同时开</p>
        </div>

        <div class="mt-6 flex flex-col gap-4">
          <Reveal v-for="(r, i) in refs" :key="r.id" :delay="i * 0.05">
            <article class="card card-static overflow-hidden">
              <div class="grid min-w-0 lg:grid-cols-[1.05fr_0.95fr]">
                <!-- 左：标识 + 为什么 -->
                <div class="min-w-0 p-6 sm:p-7">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex items-start gap-4">
                      <span
                        class="mono text-[26px] font-semibold leading-none text-border-strong"
                      >
                        0{{ r.order }}
                      </span>
                      <div>
                        <p class="mono-label">{{ r.stage }}</p>
                        <h3 class="mt-2 break-words text-[16px] font-semibold leading-snug tracking-tight">
                          {{ r.name }}
                        </h3>
                        <p class="mono mt-1 text-[10.5px] text-muted">by {{ r.author }}</p>
                      </div>
                    </div>

                    <div class="shrink-0 text-right">
                      <p class="mono text-[9.5px] text-muted">难度</p>
                      <div class="mt-1.5 flex justify-end gap-1">
                        <span
                          v-for="d in 3"
                          :key="d"
                          class="h-1.5 w-3.5 rounded-full"
                          :class="d <= r.level ? 'bg-accent' : 'bg-border'"
                        ></span>
                      </div>
                      <p class="mono mt-1.5 text-[9.5px] text-secondary">{{ r.difficulty }}</p>
                    </div>
                  </div>

                  <p class="mt-5 text-[12.5px] leading-relaxed text-secondary">{{ r.why }}</p>

                  <div class="mt-4 flex flex-wrap gap-1.5">
                    <span v-for="s in r.stack" :key="s" class="chip scale-95">{{ s }}</span>
                  </div>

                  <div class="mt-5 flex flex-wrap items-center gap-3">
                    <a :href="r.url" target="_blank" rel="noopener" class="pill-btn text-[12px]">
                      打开仓库
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </a>
                    <span class="mono text-[10px] text-muted">{{ r.id }}</span>
                  </div>
                </div>

                <!-- 右：重点模仿 -->
                <div
                  class="min-w-0 border-t border-border bg-surface-2/40 p-6 sm:p-7 lg:border-l lg:border-t-0"
                >
                  <p class="mono-label">重点模仿</p>
                  <ul class="mt-3 flex flex-col gap-2.5">
                    <li
                      v-for="(it, idx) in r.imitate"
                      :key="it"
                      class="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-secondary"
                    >
                      <span class="mono mt-0.5 shrink-0 text-[9.5px] text-accent">
                        {{ String(idx + 1).padStart(2, '0') }}
                      </span>
                      <span class="min-w-0 break-words">{{ it }}</span>
                    </li>
                  </ul>

                  <div v-if="r.skip" class="mt-4 rounded-lg border border-border p-3">
                    <p class="mono text-[9.5px] text-muted">现在跳过</p>
                    <p class="mt-1.5 text-[11.5px] leading-relaxed text-secondary">{{ r.skip }}</p>
                  </div>

                  <p class="mt-4 text-[11px] leading-relaxed text-muted">{{ r.note }}</p>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <!-- ========== 02 我的作品 ========== -->
      <section class="mt-16 sm:mt-20">
        <div class="flex items-end justify-between gap-6 border-b border-border pb-4">
          <div class="flex items-baseline gap-3">
            <span class="mono-label">02</span>
            <h2 class="text-[17px] font-semibold tracking-tight">我的作品</h2>
          </div>
          <p class="mono hidden text-[11px] text-muted sm:block">勾选即保存，进度留在这台设备</p>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Reveal
            v-for="(p, i) in data.mine"
            :key="p.id"
            :delay="i * 0.06"
            class="h-full"
          >
            <ProjectCard :project="p" />
          </Reveal>
        </div>
      </section>

      <!-- ========== 03 展示标准 ========== -->
      <section class="mt-16 sm:mt-20">
        <div class="flex items-end justify-between gap-6 border-b border-border pb-4">
          <div class="flex items-baseline gap-3">
            <span class="mono-label">03</span>
            <h2 class="text-[17px] font-semibold tracking-tight">怎么算「能展示」</h2>
          </div>
          <p class="mono hidden text-[11px] text-muted sm:block">{{ data.standard.title }}</p>
        </div>

        <div class="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div class="card card-static p-6">
            <div class="grid gap-4 sm:grid-cols-2">
              <div
                v-for="(it, i) in data.standard.items"
                :key="it.name"
                class="rounded-xl border border-border p-4"
              >
                <div class="flex items-center gap-2">
                  <span class="mono text-[10px] text-muted">0{{ i + 1 }}</span>
                  <span class="text-[13px] font-semibold">{{ it.name }}</span>
                </div>
                <p class="mt-2 text-[11.5px] leading-relaxed text-muted">{{ it.desc }}</p>
              </div>
            </div>
          </div>

          <div class="card card-static overflow-hidden">
            <div class="flex items-center justify-between border-b border-border p-5">
              <p class="mono-label">目录结构</p>
              <span class="mono text-[10px] text-muted">retail-analytics</span>
            </div>
            <pre class="tree overflow-x-auto p-5">{{ data.standard.structure.join('\n') }}</pre>
          </div>
        </div>

        <p class="mt-4 max-w-2xl text-[11.5px] leading-relaxed text-muted">
          这套结构来自第一个参考仓库。做项目时先照抄目录，再把内容换掉——空文件夹会逼你想清楚每一层要放什么。
        </p>
      </section>
    </div>
  </div>
</template>