import { ref } from 'vue'

const THEME_KEY = 'karma-theme-v2'

// 亮色为默认（个人学习站，白天看更舒服）。模块级 ref，全局共享同一个状态。
const isDark = ref(false)

function apply() {
  const el = document.documentElement
  el.classList.toggle('dark', isDark.value)
  // 手机浏览器的地址栏颜色跟着一起变
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', isDark.value ? '#07080b' : '#f7f6f3')
  try {
    localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
  } catch (e) {
    /* localStorage 不可用时静默失败，只影响记忆，不影响本次显示 */
  }
}

/**
 * 在应用挂载时调用一次：读取用户上次的选择并应用。
 * 首次访问（无记录）默认亮色。
 */
export function initTheme() {
  try {
    isDark.value = localStorage.getItem(THEME_KEY) === 'dark'
  } catch (e) {
    isDark.value = false
  }
  apply()
}

export function toggleTheme() {
  isDark.value = !isDark.value
  apply()
}

export function useTheme() {
  return { isDark, toggleTheme }
}