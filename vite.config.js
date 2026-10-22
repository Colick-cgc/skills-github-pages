import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages「项目站」部署在子路径下：
//   最终地址 = https://colick-cgc.github.io/skills-github-pages/
// base 必须写成这个子路径（带尾斜杠），否则构建产物里的 js/css/图片会 404。
// 如果以后把仓库改名或换成 <用户名>.github.io 顶级域名，改这一处即可。
export default defineConfig({
  base: '/skills-github-pages/',
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
