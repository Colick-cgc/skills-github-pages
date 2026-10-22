<script setup>
/**
 * 首页轻量粒子背景。
 * VueParticles 是 @tsparticles/vue3（v4）插件注册的全局组件，
 * 引擎初始化在 src/main.js 里通过 app.use(Particles, { init }) 完成。
 * 只在首页使用，其它页面不引入，避免视觉疲劳。
 */
const options = {
  fullScreen: { enable: false },
  fpsLimit: 60,
  detectRetina: true,
  particles: {
    number: { value: 40, density: { enable: true } },
    color: { value: ['#2997ff', '#6e6e73'] },
    opacity: { value: { min: 0.05, max: 0.25 } },
    size: { value: { min: 1, max: 3 } },
    move: { enable: true, speed: 0.35, outModes: 'out' },
  },
}
</script>

<template>
  <VueParticles
    id="home-particles"
    class="pointer-events-none absolute inset-0"
    :options="options"
  />
</template>
