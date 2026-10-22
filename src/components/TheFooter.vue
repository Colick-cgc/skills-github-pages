<script setup>
import site from '@/data/site.json'
</script>

<template>
  <footer class="border-t border-border">
    <div class="mx-auto max-w-5xl px-6 py-10">
      <p class="text-center text-sm text-muted">{{ site.footer }}</p>
    </div>
  </footer>
</template>
