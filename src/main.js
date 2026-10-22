import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import { initTheme } from './composables/useTheme'

// 首页粒子背景（@tsparticles/vue3 v4 以 Vue 插件形式注册，全局组件名为 <VueParticles>）
import Particles from '@tsparticles/vue3'
import { loadSlim } from '@tsparticles/slim'

// 应用主题（深色为默认，读 localStorage 覆盖）
initTheme()

// 粒子引擎初始化回调必须是「模块级稳定引用」，插件内部会做一致性校验
async function particlesInit(engine) {
  await loadSlim(engine)
}

createApp(App)
  .use(router)
  .use(Particles, { init: particlesInit })
  .mount('#app')
