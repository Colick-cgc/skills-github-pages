# KARMA 的站

一个私人个人记录站，用于长期记录**论文阅读、随笔日记、读书观影、旅行回忆**。

## 技术栈

- **Vite** + **Vue 3**（JavaScript，无 TypeScript）
- **Tailwind CSS**（v4，CSS-first 配置）
- **Motion for Vue**（`motion-v`，即 Framer Motion 的官方 Vue 移植版）
- **@tsparticles/vue3**（首页轻量粒子背景）
- **vue-router**（hash 路由，适配 GitHub Pages 静态托管）

## 快速开始

```bash
npm install      # 首次安装依赖
npm run dev      # 本地开发（终端会打印访问地址）
npm run build    # 构建到 dist/
npm run preview  # 本地预览构建产物
```

## 部署

推送到 `main` 分支后，GitHub Actions 会自动构建并部署到 `gh-pages` 分支，
线上地址：<https://colick-cgc.github.io/skills-github-pages/>

## 维护

所有内容都在 `src/data/*.json` 里，新增内容只需复制 JSON 模板填字段，
无需改动页面代码。详见 **[《网站日常维护文档.md》](./网站日常维护文档.md)**。
