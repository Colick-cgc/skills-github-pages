import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

// 使用 hash 路由（地址形如 /#/research）：
// GitHub Pages 是静态托管，无法为任意路径返回 index.html，
// hash 路由不需要服务端配置，刷新 / 直接打开深层链接都不会 404。
const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: '首页' } },

  // 三个主板块
  {
    path: '/research',
    name: 'research',
    component: () => import('@/views/ResearchView.vue'),
    meta: { title: '日常学习' },
  },
  {
    path: '/internship',
    name: 'internship',
    component: () => import('@/views/InternshipView.vue'),
    meta: { title: '实习计划' },
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: { title: '项目展示' },
  },

  // 生活记录
  {
    path: '/records',
    name: 'records',
    component: () => import('@/views/RecordsView.vue'),
    meta: { title: '记录' },
  },
  {
    path: '/journal',
    name: 'journal',
    component: () => import('@/views/JournalView.vue'),
    meta: { title: '随笔日记' },
  },
  {
    path: '/journal/:id',
    name: 'journal-detail',
    component: () => import('@/views/JournalDetailView.vue'),
    meta: { title: '随笔' },
  },
  {
    path: '/reading',
    name: 'reading',
    component: () => import('@/views/ReadingView.vue'),
    meta: { title: '读书与观影' },
  },
  {
    path: '/reading/:id',
    name: 'reading-detail',
    component: () => import('@/views/ReadingDetailView.vue'),
    meta: { title: '读书观影' },
  },
  {
    path: '/travel',
    name: 'travel',
    component: () => import('@/views/TravelView.vue'),
    meta: { title: '旅行回忆' },
  },
  {
    path: '/travel/:id',
    name: 'travel-detail',
    component: () => import('@/views/TravelDetailView.vue'),
    meta: { title: '旅行' },
  },

  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: '关于' },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { title: '内容管理' },
  },

  // 旧链接：论文研读并入「日常学习」
  { path: '/papers', redirect: '/research' },

  // 未知路径一律回首页
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    // 每次切换路由回到顶部
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · KARMA` : 'KARMA'
})

export default router