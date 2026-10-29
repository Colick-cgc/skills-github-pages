import { ref } from 'vue'

/**
 * 本地进度存储
 * ------------------------------------------------------------------
 * 计划类页面里的「勾选」只存在浏览器 localStorage，不上传、不需要登录。
 * 换浏览器 / 清缓存会丢，这是刻意的：它只是帮你看今天该做什么。
 */
const PREFIX = 'karma.v1.'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}

function persist(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (e) {
    /* 隐私模式下写入失败，忽略即可 */
  }
}

/** 勾选清单：done 形如 { taskId: true } */
export function useChecklist(storageKey) {
  const done = ref(read(storageKey, {}))

  function toggle(id) {
    const next = { ...done.value }
    if (next[id]) delete next[id]
    else next[id] = true
    done.value = next
    persist(storageKey, next)
  }

  function has(id) {
    return !!done.value[id]
  }

  function count(ids) {
    return ids.filter((id) => done.value[id]).length
  }

  return { done, toggle, has, count }
}

/** 任意可持久化的单个值（当前阶段、当前周次等） */
export function useStoredRef(key, initial) {
  const value = ref(read(key, initial))
  function set(next) {
    value.value = next
    persist(key, next)
  }
  return { value, set }
}