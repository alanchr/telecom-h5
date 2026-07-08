<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { useAppStore } from '@/stores/app'

/**
 * 扫码页
 * 模拟支付宝扫码进入办理流程
 */
const router = useRouter()
const store = useAppStore()

/** 扫码中 */
const scanning = ref(false)

/**
 * 模拟扫码
 * 点击后模拟调用扫码接口，成功后跳转登录页
 */
async function handleScan() {
  scanning.value = true
  showLoadingToast({ message: '正在识别二维码...', forbidClick: true, duration: 0 })

  setTimeout(() => {
    try {
      closeToast()
      showToast({ message: '扫码成功', type: 'success' })
      store.setQrCodeScanned()
      router.push('/login')
    } catch {
      closeToast()
      showToast({ message: '扫码失败，请重试', type: 'fail' })
    } finally {
      scanning.value = false
    }
  }, 1500)
}
</script>

<template>
  <div class="scan-page">
    <!-- 动态背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-blob bg-blob-1"></div>
      <div class="bg-blob bg-blob-2"></div>
      <div class="bg-blob bg-blob-3"></div>
      <div class="bg-grid"></div>
    </div>

    <!-- 顶部标题 -->
    <div class="header">
      <div class="brand-wrapper animate-fade-in">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 12h18M12 3v18M7 12l5 5 5-5" />
          </svg>
        </div>
        <div class="brand-content">
          <h1 class="brand-title">电信测评办理</h1>
          <p class="brand-subtitle">5G套餐 · 灵活测评方案</p>
        </div>
      </div>
    </div>

    <!-- 功能说明 -->
    <div class="feature-intro animate-fade-in" style="animation-delay: 0.15s">
      <div class="intro-card">
        <div class="intro-icon">✨</div>
        <div class="intro-content">
          <div class="intro-title">扫码荐方案</div>
          <div class="intro-desc">办理前扫一扫，30秒获取系统智能推荐最合适的测评方案</div>
        </div>
      </div>
      <div class="demo-badge">
        <span class="badge-dot"></span>
        <span>以下为demo演示</span>
      </div>
    </div>

    <!-- 扫码区域 -->
    <div class="scan-section">
      <div class="scan-frame-wrapper animate-slide-up" style="animation-delay: 0.2s">
        <div class="scan-frame">
          <div class="scan-overlay"></div>
          <div class="scan-border">
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
            <div class="corner-dot top-left"></div>
            <div class="corner-dot top-right"></div>
            <div class="corner-dot bottom-left"></div>
            <div class="corner-dot bottom-right"></div>
          </div>
          <div class="scan-line" :class="{ scanning }"></div>
          <div class="scan-pulse" :class="{ active: scanning }"></div>
          <div class="scan-inner">
            <div class="qr-preview"></div>
          </div>
        </div>
        <div class="scan-reflection"></div>
      </div>
      <div class="scan-hint animate-fade-in" style="animation-delay: 0.3s">
        <span class="hint-icon">📷</span>
        <span>扫描 固定二维码，商户可打印</span>
      </div>
    </div>

    <!-- 扫码按钮 -->
    <div class="action-section">
      <button class="scan-btn animate-slide-up" style="animation-delay: 0.4s" :disabled="scanning" @click="handleScan">
        <span class="btn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 12h18M12 3v18M7 12l5 5 5-5" />
          </svg>
        </span>
        <span class="btn-text">{{ scanning ? '识别中...' : '使用支付宝扫码' }}</span>
        <span class="btn-arrow" v-if="!scanning">→</span>
      </button>
    </div>

    <!-- 底部说明 -->
    <div class="tips animate-fade-in" style="animation-delay: 0.5s">
      <div class="tip-item">
        <div class="tip-dot"></div>
        <span>点击以上按钮，进入演示流程</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scan-page {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 60%, #09387a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
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
  background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
  filter: blur(60px);
}

.bg-blob-1 {
  width: 500px;
  height: 500px;
  top: -150px;
  right: -80px;
  animation: blobFloat 8s ease-in-out infinite;
}

.bg-blob-2 {
  width: 300px;
  height: 300px;
  top: 200px;
  left: -60px;
  animation: blobFloat 6s ease-in-out infinite reverse;
}

.bg-blob-3 {
  width: 250px;
  height: 250px;
  bottom: 100px;
  right: 40px;
  animation: blobFloat 5s ease-in-out infinite;
}

@keyframes blobFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) scale(1.1);
    opacity: 0.8;
  }
}

.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* 头部 */
.header {
  margin-top: 80px;
  padding: 0 var(--spacing-xl);
  width: 100%;
}

.brand-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.brand-icon {
  width: 72px;
  height: 72px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
}

.brand-icon svg {
  width: 36px;
  height: 36px;
}

.brand-content {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 40px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.3px;
  margin-top: 4px;
}

/* 功能说明 */
.feature-intro {
  margin-top: var(--spacing-lg);
  width: 100%;
  padding: 0 var(--spacing-xl);
}

.intro-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.intro-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.intro-content {
  flex: 1;
}

.intro-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.intro-desc {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
}

.demo-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: var(--spacing-md);
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
}

.demo-badge span:last-child {
  font-size: 22px;
  color: rgba(255, 255, 255, 0.7);
}

/* 扫码区域 */
.scan-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-xl);
  width: 100%;
}

.scan-frame-wrapper {
  position: relative;
}

.scan-frame {
  position: relative;
  width: 360px;
  height: 360px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-3xl);
  overflow: hidden;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, transparent 50%, rgba(0,0,0,0.35) 100%);
}

.scan-border {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 280px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-xl);
}

.corner {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 3px solid #fff;
}

.corner.top-left {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
  border-radius: 8px 0 0 0;
}

.corner.top-right {
  top: -2px;
  right: -2px;
  border-left: none;
  border-bottom: none;
  border-radius: 0 8px 0 0;
}

.corner.bottom-left {
  bottom: -2px;
  left: -2px;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 8px;
}

.corner.bottom-right {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
  border-radius: 0 0 8px 0;
}

.corner-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255,255,255,0.5);
  border-radius: 50%;
}

.corner-dot.top-left {
  top: 14px;
  left: 14px;
}

.corner-dot.top-right {
  top: 14px;
  right: 14px;
}

.corner-dot.bottom-left {
  bottom: 14px;
  left: 14px;
}

.corner-dot.bottom-right {
  bottom: 14px;
  right: 14px;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 12%;
  right: 12%;
  height: 4px;
  background: linear-gradient(90deg, transparent, #fff, transparent);
  opacity: 0;
  box-shadow: 0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(255,255,255,0.4);
  border-radius: 2px;
}

.scan-line.scanning {
  animation: scanMove 1.8s linear infinite;
  opacity: 1;
}

@keyframes scanMove {
  0% {
    top: 10%;
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  95% {
    opacity: 1;
  }
  100% {
    top: 90%;
    opacity: 0;
  }
}

.scan-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: var(--radius-xl);
  border: 2px solid rgba(255,255,255,0);
  opacity: 0;
}

.scan-pulse.active {
  animation: pulseRing 1.5s ease-out infinite;
}

@keyframes pulseRing {
  0% {
    width: 100%;
    height: 100%;
    opacity: 0.5;
    border-color: rgba(255,255,255,0.5);
  }
  100% {
    width: 150%;
    height: 150%;
    opacity: 0;
    border-color: rgba(255,255,255,0);
  }
}

.scan-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
}

.qr-preview {
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.04);
  border-radius: var(--radius-lg);
}

.scan-reflection {
  position: absolute;
  top: -1px;
  left: 10%;
  right: 10%;
  height: 40%;
  background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  pointer-events: none;
}

.scan-hint {
  margin-top: var(--spacing-xl);
  font-size: 26px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.hint-icon {
  font-size: 28px;
}

/* 操作区域 */
.action-section {
  padding: 0 48px 24px;
  width: 100%;
}

.scan-btn {
  width: 100%;
  height: 100px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: var(--color-gray-900);
  font-size: 32px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 12px 36px rgba(255, 165, 0, 0.35);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.scan-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.scan-btn:active:not(:disabled)::before {
  left: 100%;
}

.scan-btn:active:not(:disabled) {
  transform: scale(0.96);
  box-shadow: 0 6px 20px rgba(255, 165, 0, 0.3);
}

.scan-btn:disabled {
  opacity: 0.7;
}

.btn-icon svg {
  width: 32px;
  height: 32px;
}

.btn-arrow {
  font-size: 28px;
  font-weight: 300;
  opacity: 0.8;
}

/* 提示 */
.tips {
  padding: 0 48px calc(56px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tip-dot {
  width: 8px;
  height: 8px;
  background: rgba(255,255,255,0.4);
  border-radius: 50%;
  flex-shrink: 0;
}

.tip-item span {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.7);
}
</style>
