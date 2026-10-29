<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import site from '@/data/site.json'

const { isDark, toggleTheme } = useTheme()

const scrolled = ref(false)
const menuOpen = ref(false)
const progress = ref(0)

function onScroll() {
  scrolled.value = window.scrollY > 16
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0
}
function closeMenu() {
  menuOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})

const solid = computed(() => scrolled.value || menuOpen.value)
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
    :class="solid ? 'glass border-b border-border' : 'bg-transparent'"
  >
    <nav class="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:px-8">
      <!-- 站名 -->
      <router-link to="/" class="group flex items-center gap-2.5" @click="closeMenu">
        <span class="h-1.5 w-1.5 rounded-full bg-accent transition-transform group-hover:scale-125"></span>
        <span class="mono text-[13px] font-semibold tracking-[0.18em] text-primary">
          {{ site.siteName }}
        </span>
      </router-link>

      <!-- 桌面端导航 -->
      <div class="hidden items-center gap-7 md:flex">
        <router-link
          v-for="item in site.nav"
          :key="item.to"
          :to="item.to"
          class="nav-link text-[13px]"
        >
          {{ item.label }}
        </router-link>

        <span class="h-4 w-px bg-border"></span>

        <button
          class="flex h-8 w-8 items-center justify-center rounded-full border border-border text-secondary transition hover:border-border-strong hover:text-primary"
          :aria-label="isDark ? '切换浅色模式' : '切换深色模式'"
          @click="toggleTheme"
        >
          <svg
            v-if="isDark"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
      </div>

      <!-- 移动端 -->
      <button
        class="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
        :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
        @click="menuOpen = !menuOpen"
      >
        <span
          class="h-[1.5px] w-4.5 bg-primary transition-all duration-200"
          :class="menuOpen ? 'translate-y-[6.5px] rotate-45' : ''"
        ></span>
        <span
          class="h-[1.5px] w-4.5 bg-primary transition-all duration-200"
          :class="menuOpen ? 'opacity-0' : ''"
        ></span>
        <span
          class="h-[1.5px] w-4.5 bg-primary transition-all duration-200"
          :class="menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''"
        ></span>
      </button>
    </nav>

    <!-- 阅读进度细线 -->
    <div
      class="h-px bg-accent/70 transition-opacity duration-300"
      :class="solid ? 'opacity-100' : 'opacity-0'"
      :style="{ width: progress + '%' }"
    ></div>

    <!-- 移动端菜单 -->
    <Transition name="menu">
      <div v-if="menuOpen" class="border-t border-border md:hidden">
        <div class="flex flex-col px-5 py-3">
          <router-link
            v-for="item in site.nav"
            :key="item.to"
            :to="item.to"
            class="rounded-lg px-3 py-2.5 text-[14px] text-secondary transition hover:bg-surface-2 hover:text-primary"
            @click="closeMenu"
          >
            {{ item.label }}
          </router-link>
          <button
            class="mt-1 rounded-lg px-3 py-2.5 text-left text-[14px] text-secondary transition hover:bg-surface-2 hover:text-primary"
            @click="toggleTheme"
          >
            切换为{{ isDark ? '浅色' : '深色' }}模式
          </button>
        </div>
      </div>
    </Transition>
  </header>
</template>