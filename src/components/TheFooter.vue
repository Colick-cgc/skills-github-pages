<script setup>
import site from '@/data/site.json'
</script>

<template>
  <footer class="border-t border-border">
    <div class="mx-auto max-w-5xl px-6 py-10">
      <div class="flex justify-center">
        <router-link to="/admin" class="text-sm text-muted transition hover:text-primary">内容管理</router-link>
      </div>
      <p class="mt-2 text-center text-sm text-muted">{{ site.footer }}</p>
    </div>
  </footer>
</template>
