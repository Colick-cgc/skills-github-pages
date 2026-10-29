<script setup>
import { computed } from 'vue'
import ProgressRing from './ProgressRing.vue'
import CheckList from './CheckList.vue'
import { useChecklist } from '@/composables/useProgress'

const props = defineProps({
  project: { type: Object, required: true },
})

const { count } = useChecklist('project.' + props.project.id)

const ids = computed(() => props.project.deliverables.map((d) => d.id))
const doneCount = computed(() => count(ids.value))
const pct = computed(() =>
  ids.value.length ? Math.round((doneCount.value / ids.value.length) * 100) : 0,
)

const statusClass = computed(() => {
  if (props.project.status === '已完成') return 'is-active'
  if (props.project.status === '进行中') return 'is-active'
  return ''
})
</script>

<template>
  <article class="card flex h-full flex-col p-6">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <p class="mono-label">基于 {{ project.basedOn }}</p>
        <h3 class="mt-2 text-[15px] font-semibold leading-snug tracking-tight">
          {{ project.name }}
        </h3>
      </div>
      <ProgressRing :value="pct" :size="48" />
    </div>

    <div class="mt-3 flex flex-wrap gap-1.5">
      <span v-for="s in project.stack" :key="s" class="chip scale-95">{{ s }}</span>
    </div>

    <p class="mt-3.5 text-[11.5px] leading-relaxed text-muted">{{ project.note }}</p>

    <div class="mt-4 border-t border-border pt-3">
      <CheckList
        :items="project.deliverables"
        :storage-key="'project.' + project.id"
        :show-progress="false"
        dense
      />
    </div>

    <div class="mt-auto flex items-center justify-between border-t border-border pt-4">
      <span class="chip" :class="statusClass">{{ project.status }}</span>
      <a
        v-if="project.repo"
        :href="project.repo"
        target="_blank"
        rel="noopener"
        class="mono text-[10.5px] text-accent transition hover:underline"
      >
        仓库 ↗
      </a>
      <span v-else class="mono text-[10px] text-muted">仓库待建</span>
    </div>
  </article>
</template>