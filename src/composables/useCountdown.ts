import { ref, onUnmounted } from 'vue'

/**
 * 倒计时composable
 * 用于验证码发送后的60秒倒计时
 * @param duration 倒计时秒数，默认60秒
 */
export function useCountdown(duration = 60) {
  /** 当前剩余秒数 */
  const count = ref(0)
  /** 是否正在倒计时 */
  const isCounting = ref(false)
  /** 定时器引用 */
  let timer: ReturnType<typeof setInterval> | null = null

  /**
   * 开始倒计时
   */
  function start() {
    if (isCounting.value) return
    count.value = duration
    isCounting.value = true
    timer = setInterval(() => {
      count.value--
      if (count.value <= 0) {
        stop()
      }
    }, 1000)
  }

  /**
   * 停止倒计时
   */
  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    count.value = 0
    isCounting.value = false
  }

  // 组件卸载时清除定时器
  onUnmounted(() => {
    stop()
  })

  return {
    count,
    isCounting,
    start,
    stop
  }
}
