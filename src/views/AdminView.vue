<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  token,
  user,
  setToken,
  logout,
  verifyToken,
  readJson,
  writeFile,
  writeBinary,
} from '@/composables/useGithub.js'
import ItemForm from '@/components/admin/ItemForm.vue'
import { shortDate } from '@/utils/format.js'

const route = useRoute()

const TYPES = [
  { key: 'papers', label: '论文研读', path: 'src/data/papers.json' },
  { key: 'journal', label: '随笔日记', path: 'src/data/journal.json' },
  { key: 'reading', label: '读书观影', path: 'src/data/reading.json' },
  { key: 'travel', label: '旅行回忆', path: 'src/data/travel.json' },
]

const hasToken = computed(() => !!token.value)

const loginToken = ref('')
const busy = ref(false)
const error = ref('')
const notice = ref('')

const active = ref('papers')
const items = ref([])
const loading = ref(false)

const editing = ref(null) // { type, item }  item 为 null 表示新增
const saving = ref(false)

function currentType() {
  return TYPES.find((t) => t.key === active.value)
}

async function doLogin() {
  busy.value = true
  error.value = ''
  setToken(loginToken.value.trim())
  try {
    await verifyToken()
    loginToken.value = ''
    await load()
  } catch (e) {
    error.value = '令牌无效：' + (e.message || '请检查后重试')
    setToken('')
  } finally {
    busy.value = false
  }
}

function doLogout() {
  logout()
  items.value = []
  editing.value = null
}

async function load() {
  if (!hasToken.value) return
  const t = currentType()
  loading.value = true
  error.value = ''
  try {
    const { data } = await readJson(t.path)
    items.value = data
  } catch (e) {
    error.value = '读取失败：' + e.message
    items.value = []
  } finally {
    loading.value = false
  }
}

function openNew() {
  editing.value = { type: active.value, item: null }
}
function openEdit(item) {
  editing.value = { type: active.value, item }
}
function closeEditor() {
  editing.value = null
}

async function onSave({ type, data, uploads }) {
  saving.value = true
  error.value = ''
  notice.value = ''
  try {
    // 1. 先上传新图片（日记是单图、旅行是多图）
    for (const u of uploads) {
      await writeBinary(u.targetPath, u.base64, `upload ${u.jsonPath}`)
      if (type === 'journal') data.image = u.jsonPath
      else data.images.push(u.jsonPath)
    }
    // 2. 重新读取最新内容与 sha，避免覆盖他人/上次修改
    const t = TYPES.find((x) => x.key === type)
    const { data: arr, sha } = await readJson(t.path)
    const idx = arr.findIndex((x) => x.id === data.id)
    const next = idx >= 0 ? arr.map((x, i) => (i === idx ? data : x)) : [...arr, data]
    await writeFile(t.path, JSON.stringify(next, null, 2), sha, `update ${type}: ${data.title}`)
    notice.value = '✅ 已保存！GitHub 正在自动重新部署，约 1–2 分钟后上线。'
    closeEditor()
    await load()
  } catch (e) {
    error.value = '保存失败：' + e.message
  } finally {
    saving.value = false
  }
}

async function onDelete(item) {
  if (!window.confirm(`确定删除「${item.title}」？此操作会提交到仓库。`)) return
  const t = currentType()
  error.value = ''
  notice.value = ''
  try {
    const { data: arr, sha } = await readJson(t.path)
    const next = arr.filter((x) => x.id !== item.id)
    await writeFile(t.path, JSON.stringify(next, null, 2), sha, `delete ${active.value}: ${item.title}`)
    notice.value = '已删除，正在重新部署…'
    await load()
  } catch (e) {
    error.value = '删除失败：' + e.message
  }
}

function itemTitle(item) {
  return item.title || item.date || item.id || '（无标题）'
}

watch(active, () => load())

onMounted(async () => {
  if (hasToken.value) {
    try {
      await verifyToken()
    } catch (e) {
      setToken('')
    }
  }
  const q = route.query.new
  if (q && TYPES.some((t) => t.key === q)) {
    active.value = q
    if (hasToken.value) openNew()
  }
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 pb-24 pt-28 sm:pt-32">
    <h1 class="text-2xl font-semibold tracking-tight">内容管理</h1>
    <p class="mt-2 text-sm text-secondary">
      在这里增删改内容并上传图片，保存后自动提交到仓库并重新上线。
    </p>

    <!-- 未登录：输入令牌 -->
    <div v-if="!hasToken" class="card mt-8 p-6">
      <h2 class="text-lg font-semibold">登录</h2>
      <p class="mt-2 text-sm text-secondary">
        需要一个能写入这个仓库的 GitHub 令牌（<strong>只存在你浏览器本地</strong>，不上传）。
        建议用<strong>细粒度令牌</strong>，只授权本仓库的 <code>Contents: Read and write</code>。
      </p>
      <div class="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          v-model="loginToken"
          type="password"
          class="admin-input flex-1"
          placeholder="粘贴 ghp_ 或 github_pat_ 开头的令牌"
          @keyup.enter="doLogin"
        />
        <button class="rounded-xl bg-accent px-5 py-2 text-sm font-medium text-white" :disabled="busy" @click="doLogin">
          {{ busy ? '验证中…' : '登录' }}
        </button>
      </div>
      <p class="mt-3 text-xs text-muted">
        创建令牌：GitHub → Settings → Developer settings → Personal access tokens →
        <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noopener" class="text-accent underline">Fine-grained tokens</a>
      </p>
      <p v-if="error" class="mt-3 text-sm text-red-400">{{ error }}</p>
    </div>

    <!-- 已登录 -->
    <template v-else>
      <div class="mt-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img v-if="user && user.avatar_url" :src="user.avatar_url" class="h-7 w-7 rounded-full" alt="" />
          <span class="text-sm text-secondary">{{ user ? user.login : '' }}</span>
        </div>
        <button class="text-sm text-muted hover:text-primary" @click="doLogout">退出</button>
      </div>

      <!-- 栏目切换 -->
      <div class="mt-5 flex flex-wrap gap-2">
        <button
          v-for="t in TYPES"
          :key="t.key"
          class="rounded-full px-4 py-1.5 text-sm transition"
          :class="active === t.key ? 'bg-accent text-white' : 'bg-surface-2 text-secondary hover:text-primary'"
          @click="active = t.key"
        >
          {{ t.label }}
        </button>
      </div>

      <div v-if="error" class="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400">{{ error }}</div>
      <div v-if="notice" class="mt-4 rounded-xl bg-accent-soft p-3 text-sm text-accent">{{ notice }}</div>

      <!-- 列表 -->
      <div class="mt-6 flex flex-col gap-3">
        <p v-if="loading" class="py-8 text-center text-sm text-muted">加载中…</p>
        <div
          v-for="item in items"
          :key="item.id"
          class="card flex items-center justify-between gap-3 p-4"
        >
          <div class="min-w-0">
            <p class="truncate font-medium">{{ itemTitle(item) }}</p>
            <p class="text-xs text-muted">{{ shortDate(item.date) }}</p>
          </div>
          <div class="flex shrink-0 gap-2">
            <button class="text-sm text-accent hover:underline" @click="openEdit(item)">编辑</button>
            <button class="text-sm text-red-400 hover:underline" @click="onDelete(item)">删除</button>
          </div>
        </div>
        <p v-if="!loading && !items.length" class="py-8 text-center text-sm text-muted">暂无内容</p>
      </div>

      <button
        class="mt-6 w-full rounded-2xl border border-dashed border-border-strong py-4 text-sm text-secondary transition hover:text-primary"
        @click="openNew"
      >
        ＋ 新增{{ currentType().label }}
      </button>
    </template>

    <!-- 编辑弹窗 -->
    <Teleport to="body">
      <div
        v-if="editing"
        class="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8"
        @click.self="closeEditor"
      >
        <div class="card w-full max-w-2xl p-6">
          <ItemForm
            :type="editing.type"
            :initial="editing.item"
            @submit="onSave"
            @cancel="closeEditor"
          />
          <p v-if="saving" class="mt-3 text-center text-sm text-muted">保存中…</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>
