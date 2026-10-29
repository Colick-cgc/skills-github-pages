<script setup>
import { computed } from 'vue'
import { useChecklist } from '@/composables/useProgress'

/**
 * 可勾选的任务清单
 * items: [{ id, title, detail? }]
 * 进度存在 localStorage，刷新不丢。
 */
const props = defineProps({
  items: { type: Array, required: true },
  storageKey: { type: String, required: true },
  showProgress: { type: Boolean, default: true },
  dense: { type: Boolean, default: false },
})

const { has, toggle, count } = useChecklist(props.storageKey)

const ids = computed(() => props.items.map((i) => i.id))
const doneCount = computed(() => count(ids.value))
const pct = computed(() =>
  ids.value.length ? Math.round((doneCount.value / ids.value.length) * 100) : 0,
)
</script>

<template>
  <div>
    <div v-if="showProgress" class="mb-3 flex items-center gap-3">
      <div class="h-[3px] flex-1 overflow-hidden rounded-full bg-border">
        <div
          class="h-full rounded-full bg-accent transition-all duration-500"
          :style="{ width: pct + '%' }"
        ></div>
      </div>
      <span class="mono shrink-0 text-[11px] text-muted">
        {{ doneCount }} / {{ items.length }}
      </span>
    </div>

    <ul class="flex flex-col" :class="dense ? 'gap-0.5' : 'gap-1'">
      <li v-for="item in items" :key="item.id">
        <button
          type="button"
          class="group -mx-2 flex w-[calc(100%+1rem)] items-start gap-3 rounded-lg px-2 text-left transition hover:bg-surface-2"
          :class="dense ? 'py-1.5' : 'py-2'"
          :aria-pressed="has(item.id)"
          @click="toggle(item.id)"
        >
          <span class="tick" :class="{ 'is-done': has(item.id) }">
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M2.5 6.2 4.8 8.5 9.5 3.6" />
            </svg>
          </span>
          <span class="min-w-0 flex-1">
            <span
              class="block text-[13.5px] leading-relaxed transition-colors"
              :class="has(item.id) ? 'text-muted line-through' : 'text-primary'"
            >
              {{ item.title }}
            </span>
            <span v-if="item.detail" class="mt-0.5 block text-[12px] leading-relaxed text-muted">
              {{ item.detail }}
            </span>
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>