<script setup>
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-bg text-primary">
    <TheNavbar />

    <!-- 路由切换：Vue 内置 <Transition> 做 cross-fade（页面级过渡最稳） -->
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </Transition>
      </router-view>
    </main>

    <TheFooter />
  </div>
</template>
