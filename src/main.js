import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import { initTheme } from './composables/useTheme'

// 应用主题（深色为默认，读 localStorage 覆盖）
// 注意：首页已改为纯 CSS 网格 + 光晕背景，不再加载粒子库，
// 首屏体积从 ~340KB 降到 ~90KB。
initTheme()

createApp(App).use(router).mount('#app')