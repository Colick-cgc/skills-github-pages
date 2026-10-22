import { ref } from 'vue'

/**
 * GitHub API 封装 —— 供「网页编辑器」使用。
 * 原理：在网页上填写内容 → 用用户的 GitHub 令牌把内容提交回仓库 →
 *       GitHub Actions 自动重新构建上线（约 1–2 分钟生效）。
 *
 * 令牌只存在浏览器 localStorage（key: karma-github-token），
 * 不进代码、不上传到公开站点。
 */
const OWNER = 'Colick-cgc'
const REPO = 'skills-github-pages'
const BRANCH = 'main'
const TOKEN_KEY = 'karma-github-token'
const API = 'https://api.github.com'

const token = ref('')
const user = ref(null)

// 启动时从 localStorage 读回令牌
try {
  token.value = localStorage.getItem(TOKEN_KEY) || ''
} catch (e) {
  token.value = ''
}

function setToken(t) {
  token.value = t || ''
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t)
    else localStorage.removeItem(TOKEN_KEY)
  } catch (e) {
    /* localStorage 不可用时静默失败 */
  }
}

function logout() {
  setToken('')
  user.value = null
}

// UTF-8 字符串 → base64（GitHub API 写入内容用；btoa 不认中文，需先转字节）
function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin)
}

// base64 → UTF-8 字符串（读回文件内容用）
function base64ToUtf8(b64) {
  const bin = atob(String(b64).replace(/\s/g, ''))
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

async function api(path, options = {}) {
  const headers = {
    Authorization: `Bearer ${token.value}`,
    Accept: 'application/vnd.github+json',
  }
  if (options.body) headers['Content-Type'] = 'application/json'
  const res = await fetch(API + path, {
    cache: 'no-store',
    ...options,
    headers: { ...headers, ...options.headers },
  })
  if (!res.ok) {
    let msg = `GitHub API ${res.status}`
    try {
      const body = await res.json()
      msg = body.message || msg
    } catch (e) {
      /* ignore */
    }
    const err = new Error(msg)
    err.status = res.status
    throw err
  }
  return res.json()
}

/** 校验令牌，成功则返回当前登录用户信息 */
function verifyToken() {
  return api('/user').then((u) => {
    user.value = u
    return u
  })
}

/** 读取文本文件，返回 { content: 字符串, sha } */
async function readFile(path) {
  const d = await api(`/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`)
  return { content: base64ToUtf8(d.content), sha: d.sha }
}

/** 读取 JSON 文件，返回 { data: 解析后的对象, sha } */
async function readJson(path) {
  const { content, sha } = await readFile(path)
  return { data: JSON.parse(content), sha }
}

/** 写入文本文件（自动 base64 编码）；sha 用于更新已有文件 */
function writeFile(path, content, sha, message) {
  const body = { message, content: utf8ToBase64(content), branch: BRANCH }
  if (sha) body.sha = sha
  return api(`/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

/** 写入二进制文件（图片）。content 传纯 base64（不含 data: 前缀） */
function writeBinary(path, base64, message) {
  return api(`/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: base64, branch: BRANCH }),
  })
}

export {
  OWNER,
  REPO,
  token,
  user,
  setToken,
  logout,
  verifyToken,
  readFile,
  readJson,
  writeFile,
  writeBinary,
}
