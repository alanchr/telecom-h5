<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { useAppStore } from '@/stores/app'
import { login } from '@/api'

/**
 * 登录页
 * 模拟支付宝扫码进入，一键登录
 */
const router = useRouter()
const store = useAppStore()

/** 登录加载状态 */
const loading = ref(false)

/**
 * 点击一键登录
 * 调用Mock登录接口，成功后跳转授权页
 */
async function handleLogin() {
  if (loading.value) return
  loading.value = true
  showLoadingToast({
    message: '登录中...',
    forbidClick: true,
    duration: 0
  })

  try {
    const userInfo = await login()
    store.setLoginInfo(userInfo)
    closeToast()
    showToast({ message: '登录成功', type: 'success' })
    router.push('/auth')
  } catch (err) {
    closeToast()
    const msg = err instanceof Error ? err.message : '登录失败，请重试'
    showToast({ message: msg, type: 'fail' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <!-- 动态背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-blob bg-blob-1"></div>
      <div class="bg-blob bg-blob-2"></div>
      <div class="bg-blob bg-blob-3"></div>
      <div class="bg-grid"></div>
    </div>

    <!-- 顶部品牌区域 -->
    <div class="brand-section">
      <div class="brand-badge animate-fade-in">
        <span class="badge-text">5G</span>
        <div class="badge-glow"></div>
      </div>
      <h1 class="brand-title animate-slide-up" style="animation-delay: 0.05s">电信测评办理</h1>
      <p class="brand-subtitle animate-slide-up" style="animation-delay: 0.1s">畅享5G套餐 · 灵活测评方案</p>
    </div>

    <!-- 功能亮点 -->
    <div class="features-section">
      <div class="feature-card animate-slide-up" style="animation-delay: 0.15s">
        <div class="feature-icon">⚡</div>
        <div class="feature-content">
          <h3 class="feature-title">快速测评</h3>
          <p class="feature-desc">30秒获取智能推荐方案</p>
        </div>
      </div>
      <div class="feature-card animate-slide-up" style="animation-delay: 0.2s">
        <div class="feature-icon">🛡️</div>
        <div class="feature-content">
          <h3 class="feature-title">安全保障</h3>
          <p class="feature-desc">身份认证，信息加密</p>
        </div>
      </div>
      <div class="feature-card animate-slide-up" style="animation-delay: 0.25s">
        <div class="feature-icon">🎁</div>
        <div class="feature-content">
          <h3 class="feature-title">灵活选择</h3>
          <p class="feature-desc">多种套餐方案可选</p>
        </div>
      </div>
    </div>

    <!-- 底部登录按钮 -->
    <div class="action-section">
      <button class="login-btn animate-slide-up" style="animation-delay: 0.3s" :disabled="loading" @click="handleLogin">
        <span class="btn-icon">
          <svg viewBox="0 0 24 24" fill="#1677FF">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </span>
        <span class="btn-text">{{ loading ? '登录中...' : '支付宝一键登录' }}</span>
        <span class="btn-spark" v-if="!loading">✦</span>
      </button>
      <p class="agreement animate-fade-in" style="animation-delay: 0.4s">
        登录即代表同意
        <span class="link">《用户服务协议》</span>
        和
        <span class="link">《隐私政策》</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 60%, #09387a 100%);
  padding: 0 32px;
  position: relative;
  overflow: hidden;
}

/* 动态背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  opacity: 0.12;
  filter: blur(80px);
}

.bg-blob-1 {
  width: 600px;
  height: 600px;
  background: rgba(255,255,255,0.4);
  top: -200px;
  right: -120px;
  animation: blobFloat 10s ease-in-out infinite;
}

.bg-blob-2 {
  width: 350px;
  height: 350px;
  background: rgba(147, 197, 253, 0.5);
  top: 180px;
  left: -80px;
  animation: blobFloat 7s ease-in-out infinite reverse;
}

.bg-blob-3 {
  width: 250px;
  height: 250px;
  background: rgba(191, 219, 254, 0.4);
  bottom: 280px;
  right: 30px;
  animation: blobFloat 6s ease-in-out infinite;
}

@keyframes blobFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-15px) scale(1.05);
  }
}

.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 48px 48px;
}

/* 品牌区域 */
.brand-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 64px;
}

.brand-badge {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  position: relative;
  border: 1px solid rgba(255,255,255,0.1);
}

.badge-glow {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.1);
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

.badge-text {
  font-size: 32px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2px;
  position: relative;
  z-index: 1;
}

.brand-title {
  font-size: 56px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -1.5px;
  margin-bottom: 12px;
  line-height: 1.15;
}

.brand-subtitle {
  font-size: 26px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.3px;
}

/* 功能亮点 */
.features-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 64px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-xl);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid rgba(255,255,255,0.08);
  transition: all var(--transition-normal);
}

.feature-card:active {
  transform: scale(0.96);
  background: rgba(255, 255, 255, 0.08);
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 12px;
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.feature-card:nth-child(2) .feature-icon {
  animation-delay: 0.3s;
}

.feature-card:nth-child(3) .feature-icon {
  animation-delay: 0.6s;
}

.feature-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feature-title {
  font-size: 26px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.feature-desc {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.65);
}

/* 底部登录按钮 */
.action-section {
  margin-top: auto;
  margin-bottom: 40px;
  padding-bottom: env(safe-area-inset-bottom);
}

.login-btn {
  width: 100%;
  height: 104px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.98);
  color: var(--color-primary);
  font-size: 34px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(22, 119, 255, 0.05), transparent);
  transition: left 0.6s ease;
}

.login-btn:active:not(:disabled)::before {
  left: 100%;
}

.login-btn:active:not(:disabled) {
  transform: scale(0.96);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.login-btn:disabled {
  opacity: 0.7;
}

.btn-icon svg {
  width: 40px;
  height: 40px;
}

.btn-spark {
  font-size: 20px;
  color: var(--color-warning);
  animation: sparkFloat 1.5s ease-in-out infinite;
}

@keyframes sparkFloat {
  0%, 100% {
    opacity: 0.6;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-4px);
  }
}

.agreement {
  margin-top: 28px;
  text-align: center;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.65);
}

.link {
  color: #fff;
  text-decoration: underline;
}
</style>
