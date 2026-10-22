import { ref } from 'vue'

const THEME_KEY = 'karma-theme'

// 深色为默认。模块级 ref，全局共享同一个状态。
const isDark = ref(true)

function apply() {
  const el = document.documentElement
  el.classList.toggle('dark', isDark.value)
  try {
    localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
  } catch (e) {
    /* localStorage 不可用时静默失败，只影响记忆，不影响本次显示 */
  }
}

/**
 * 在应用挂载时调用一次：读取用户上次的选择并应用。
 * 首次访问（无记录）默认深色。
 */
export function initTheme() {
  try {
    isDark.value = localStorage.getItem(THEME_KEY) !== 'light'
  } catch (e) {
    isDark.value = true
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
