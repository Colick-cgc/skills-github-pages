import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * 打字机效果：逐字显示 text。
 * @param {string} text 要打出的文本
 * @param {object} [opts]
 * @param {number} [opts.speed=70]   每个字符间隔（毫秒）
 * @param {number} [opts.delay=400]  开始前停顿（毫秒）
 */
export function useTypewriter(text, { speed = 70, delay = 400 } = {}) {
  const typed = ref('')
  const done = ref(false)
  let timer = null

  function run() {
    let i = 0
    typed.value = ''
    done.value = false
    const tick = () => {
      if (i <= text.length) {
        typed.value = text.slice(0, i)
        i += 1
        timer = setTimeout(tick, speed)
      } else {
        done.value = true
      }
    }
    timer = setTimeout(tick, delay)
  }

  onMounted(run)
  onBeforeUnmount(() => clearTimeout(timer))

  return { typed, done }
}
