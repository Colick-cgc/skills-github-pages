# KARMA 的站

一个围绕「读论文 + 找实习」搭起来的个人主页，也是我的作品集入口。

- **日常学习**：两周一循环的论文精读节奏（选题 → 精读 → 收纳 → 复现与组会）
- **实习计划**：十二周的 SQL / Excel / Pandas 路线、项目、简历与投递安排
- **项目展示**：三个参考仓库、我的作品进度、一个项目要交付的四样东西
- **记录**：随笔、读书观影、旅行（放在 `/records` 里）

## 技术栈

- **Vite** + **Vue 3**（JavaScript，无 TypeScript）
- **Tailwind CSS**（v4，CSS-first 配置，无 tailwind.config.js）
- **vue-router**（hash 路由，适配 GitHub Pages 静态托管）
- 动效：原生 **IntersectionObserver + CSS transition**（不再依赖动效库）
- 无后端、无数据库：所有内容都在 `src/data/*.json` 里

> `motion-v` 与 `@tsparticles/*` 目前仍写在 `package.json` 里但已不再被引用
> （改版后首页换成 CSS 网格背景，入场动画换成 CSS）。等你在本地跑一次
> `npm install` 刷新 `package-lock.json` 后，可以把它们删掉。

## 快速开始

```bash
npm install      # 首次安装依赖
npm run dev      # 本地开发（终端会打印访问地址，注意带 /skills-github-pages/）
npm run build    # 构建到 dist/
npm run preview  # 本地预览构建产物
```

## 部署

推送到 `main` 分支后，GitHub Actions（`.github/workflows/deploy.yml`）会自动构建并发布到
`gh-pages` 分支，一两分钟后生效：
<https://colick-cgc.github.io/skills-github-pages/>

## 维护

计划类内容（学习节奏、实习周计划、项目清单）直接改 `src/data/*.json`；
论文笔记、日记、读书、旅行可以用网页内的「内容管理」编辑器增删改。

详见 **[《网站日常维护文档.md》](./网站日常维护文档.md)**。