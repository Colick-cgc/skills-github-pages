<script setup>
import { ref, computed } from 'vue'
import { motion } from 'motion-v'
import SectionHeader from '@/components/SectionHeader.vue'
import TagBadge from '@/components/TagBadge.vue'
import { formatDate, collectTags } from '@/utils/format.js'
import papers from '@/data/papers.json'

const easing = [0.22, 1, 0.36, 1]

const query = ref('')
const selectedTags = ref([])
const expandedId = ref(null)

const allTags = computed(() => collectTags(papers))

// 搜索 + 标签筛选（标签是「与」关系：选多个则都要命中）
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return papers
    .filter((p) => {
      if (selectedTags.value.length && !selectedTags.value.every((t) => p.tags.includes(t)))
        return false
      if (!q) return true
      const hay = [p.title, p.venue, ...(p.authors || []), p.coreProblem, p.method]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
    .sort((a, b) => b.date.localeCompare(a.date))
})

function toggleTag(t) {
  const i = selectedTags.value.indexOf(t)
  if (i >= 0) selectedTags.value.splice(i, 1)
  else selectedTags.value.push(t)
}
function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id
}

// 展开后的结构化笔记字段
function noteSections(p) {
  return [
    ['研究问题', p.coreProblem],
    ['方法', p.method],
    ['我的理解', p.understanding],
    ['疑问', p.questions],
    ['后续计划', p.nextSteps],
  ].filter(([, v]) => v)
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-6 pb-24 pt-28 sm:pt-32">
    <SectionHeader
      eyebrow="Paper Notes"
      title="论文研读"
      subtitle="记录读过的论文：核心问题、方法、我的理解、疑问与后续计划。"
    />

    <div class="mt-6 flex justify-end">
      <router-link to="/admin?new=papers" class="pill-btn">＋ 新增论文</router-link>
    </div>

    <!-- 搜索框 + 标签筛选 -->
    <div class="mt-10">
      <input
        v-model="query"
        type="search"
        placeholder="搜索标题、作者、期刊、关键词…"
        class="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-accent focus:outline-none"
      />

      <div v-if="allTags.length" class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="t in allTags"
          :key="t"
          class="chip"
          :class="{ 'is-active': selectedTags.includes(t) }"
          @click="toggleTag(t)"
        >
          {{ t }}
        </button>
        <button
          v-if="selectedTags.length"
          class="chip text-muted hover:text-primary"
          @click="selectedTags = []"
        >
          清除筛选
        </button>
      </div>
    </div>

    <!-- 论文卡片列表 -->
    <div class="mt-8 flex flex-col gap-4">
      <motion.div
        v-for="(p, i) in filtered"
        :key="p.id"
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :viewport="{ once: true, amount: 0.1 }"
        :transition="{ duration: 0.5, delay: Math.min(i, 8) * 0.05, ease: easing }"
      >
        <article class="card overflow-hidden">
          <!-- 左标题 / 右日期与标签 -->
          <button
            class="flex w-full items-start justify-between gap-4 p-5 text-left"
            @click="toggleExpand(p.id)"
          >
            <div class="min-w-0">
              <h2 class="text-lg font-semibold leading-snug tracking-tight">{{ p.title }}</h2>
              <p class="mt-1.5 text-sm text-secondary">
                {{ (p.authors || []).join('、') }}<template v-if="p.venue"> · {{ p.venue }}</template>
              </p>
            </div>
            <div class="flex shrink-0 flex-col items-end gap-2">
              <time class="text-xs text-muted">{{ formatDate(p.date) }}</time>
              <div class="flex flex-wrap justify-end gap-1.5">
                <TagBadge v-for="t in p.tags" :key="t" :label="t" />
              </div>
            </div>
          </button>

          <!-- 展开的结构化笔记 -->
          <Transition name="expand">
            <div v-if="expandedId === p.id" class="border-t border-border p-5">
              <p v-if="p.summary" class="text-sm text-secondary">{{ p.summary }}</p>

              <dl class="mt-4 flex flex-col gap-4">
                <div v-for="[label, value] in noteSections(p)" :key="label">
                  <dt class="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    {{ label }}
                  </dt>
                  <dd class="mt-1.5 whitespace-pre-line text-[15px] leading-relaxed text-primary">
                    {{ value }}
                  </dd>
                </div>
              </dl>

              <div v-if="p.links && p.links.length" class="mt-4 border-t border-border pt-4">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-muted">相关链接</p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <a
                    v-for="l in p.links"
                    :key="l.url"
                    :href="l.url"
                    target="_blank"
                    rel="noopener"
                    class="chip text-accent hover:underline"
                  >
                    {{ l.label || l.url }}
                  </a>
                </div>
              </div>
            </div>
          </Transition>
        </article>
      </motion.div>

      <p v-if="!filtered.length" class="py-16 text-center text-muted">没有匹配的论文笔记。</p>
    </div>
  </div>
</template>
