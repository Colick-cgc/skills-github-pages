<script setup>
import site from '@/data/site.json'

const year = new Date().getFullYear()

const boards = [
  { label: '日常学习', to: '/research' },
  { label: '实习计划', to: '/internship' },
  { label: '项目展示', to: '/projects' },
]

const records = [
  { label: '随笔日记', to: '/journal' },
  { label: '读书与观影', to: '/reading' },
  { label: '旅行回忆', to: '/travel' },
]
</script>

<template>
  <footer class="mt-24 border-t border-border">
    <div class="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
        <!-- 品牌 -->
        <div>
          <div class="flex items-center gap-2.5">
            <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
            <span class="mono text-[13px] font-semibold tracking-[0.18em]">{{ site.siteName }}</span>
          </div>
          <p class="mt-3 max-w-xs text-[12.5px] leading-relaxed text-muted">
            {{ site.footer }}
          </p>
        </div>

        <!-- 板块 -->
        <div>
          <p class="mono-label">Boards</p>
          <ul class="mt-4 flex flex-col gap-2.5">
            <li v-for="b in boards" :key="b.to">
              <router-link :to="b.to" class="link-quiet text-[13px]">{{ b.label }}</router-link>
            </li>
          </ul>
        </div>

        <!-- 记录 -->
        <div>
          <p class="mono-label">Records</p>
          <ul class="mt-4 flex flex-col gap-2.5">
            <li v-for="r in records" :key="r.to">
              <router-link :to="r.to" class="link-quiet text-[13px]">{{ r.label }}</router-link>
            </li>
            <li>
              <router-link to="/about" class="link-quiet text-[13px]">关于</router-link>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col gap-2 border-t border-border pt-5 text-[11.5px] text-muted sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="mono">© {{ year }} KARMA · Build on GitHub Pages</p>
        <router-link to="/admin" class="mono transition hover:text-primary">内容管理 →</router-link>
      </div>
    </div>
  </footer>
</template>