<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { useAppStore } from '@/stores/app'
import { queryCredit } from '@/api'
import type { CreditResult } from '@/types'
import PageHeader from '@/components/PageHeader.vue'

/**
 * 测评结果页
 * 根据测评结果展示不同推荐方案
 * - 实时测评通过：推荐使用实时测评
 * - 行业先享通过：推荐使用行业先享
 * - 均未通过：展示备选方案（花呗、余额宝冻结、储蓄卡冻结）
 */
const router = useRouter()
const store = useAppStore()

/** 加载中 */
const loading = ref(true)
/** 测评结果 */
const result = ref<CreditResult | null>(null)
/** 当前演示模式索引 */
const demoIndex = ref(0)
/** 演示模式列表 */
const demoModes = [
  { type: 'realTime', label: '实时测评通过', data: { realTimePass: true, realTimeAmount: 5000, zhimaGoPass: false, zhimaGoAmount: 0 } as CreditResult },
  { type: 'industry', label: '行业先享通过', data: { realTimePass: false, realTimeAmount: 0, zhimaGoPass: true, zhimaGoAmount: 3000 } as CreditResult },
  { type: 'fallback', label: '均未通过', data: { realTimePass: false, realTimeAmount: 0, zhimaGoPass: false, zhimaGoAmount: 0 } as CreditResult }
]

/** 备选方案列表 */
const fallbackOptions = [
  { id: 'huabei', name: '花呗', icon: '花', desc: '使用花呗额度进行支付' },
  { id: 'yuebao', name: '余额宝冻结', icon: '余', desc: '冻结余额宝资金作为担保' },
  { id: 'bankcard', name: '储蓄卡冻结', icon: '卡', desc: '冻结储蓄卡资金作为担保' }
]

/** 测评结果类型 */
const resultType = computed<'realTime' | 'industry' | 'fallback'>(() => {
  if (!result.value) return 'fallback'
  if (result.value.realTimePass) return 'realTime'
  if (result.value.zhimaGoPass) return 'industry'
  return 'fallback'
})

/** 结果标题 */
const resultTitle = computed(() => {
  switch (resultType.value) {
    case 'realTime': return '实时测评通过'
    case 'industry': return '行业先享通过'
    case 'fallback': return '推荐以下方式办单'
  }
})

/** 结果描述 */
const resultDesc = computed(() => {
  switch (resultType.value) {
    case 'realTime': return '恭喜！您已通过实时测评审核，可享受免预存办理'
    case 'industry': return '您已通过行业先享审核，可享受免预存办理'
    case 'fallback': return '推荐以下方式帮助您完成业务办理'
  }
})

/** 结果说明 */
const resultNote = computed(() => {
  switch (resultType.value) {
    case 'realTime': return '（实时测评通过）'
    case 'industry': return '（实时测评未通过，行业先享通过）'
    case 'fallback': return '（实时测评、行业先享均未通过）'
  }
})

/**
 * 查询测评结果
 */
async function fetchCredit() {
  if (!store.selectedPlan) {
    router.replace('/login')
    return
  }

  try {
    const res = await queryCredit(store.selectedPlan.price)
    result.value = res
    store.setCreditResult(res)
  } catch (err) {
    const msg = err instanceof Error ? err.message : '测评查询失败'
    showToast({ message: msg, type: 'fail', fontSize: '32px' })
  } finally {
    loading.value = false
  }
}

/**
 * 查看备选方案详情
 * @param name 方案名称
 * @param desc 方案描述
 */
function viewDetail(name: string, desc: string) {
  showDialog({
    title: name,
    message: desc,
    confirmButtonText: '知道了'
  })
}

/**
 * 重新申请，重置流程
 */
function handleReset() {
  store.resetAll()
  router.replace('/login')
}

/**
 * 切换演示模式
 */
function toggleDemoMode() {
  demoIndex.value = (demoIndex.value + 1) % demoModes.length
  result.value = demoModes[demoIndex.value].data
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
}

onMounted(() => {
  fetchCredit()
})
</script>

<template>
  <div class="result-page">
    <PageHeader title="办理结果" />

    <div class="content" v-if="!loading && result">
      <!-- 测评结果卡片 -->
      <div class="result-card" :class="resultType">
        <!-- 背景装饰 -->
        <div class="card-decoration"></div>
        <div class="card-blob card-blob-1"></div>
        <div class="card-blob card-blob-2"></div>
        
        <!-- 结果图标 -->
        <div class="result-icon">
          <div class="icon-ring"></div>
          <span v-if="resultType === 'realTime'" class="icon-success">✓</span>
          <span v-else-if="resultType === 'industry'" class="icon-industry">享</span>
          <span v-else class="icon-fallback">!</span>
        </div>

        <h2 class="result-title">{{ resultTitle }}</h2>
        <p class="result-desc">{{ resultDesc }}</p>

        <!-- 结果说明 -->
        <div class="result-note">{{ resultNote }}</div>

        <!-- 额度展示（实时测评 / 行业先享） -->
        <div class="amount-section" v-if="resultType === 'realTime' || resultType === 'industry'">
          <span class="amount-label">可用额度</span>
          <div class="amount-value">
            <span class="amount-symbol">¥</span>
            <span class="amount-num">{{ resultType === 'realTime' ? result.realTimeAmount : result.zhimaGoAmount }}</span>
          </div>
        </div>

        <!-- 演示切换按钮 -->
        <div class="demo-switch">
          <button class="demo-btn" @click="toggleDemoMode">
            <span class="demo-icon">🎭</span>
            <span class="demo-text">切换演示</span>
            <span class="demo-label">{{ demoModes[demoIndex].label }}</span>
          </button>
        </div>
      </div>

      <!-- 备选方案（均未通过时展示） -->
      <div class="fallback-section" v-if="resultType === 'fallback'">
        <div class="fallback-header">
          <span class="fallback-title">推荐方案</span>
        </div>
        <div class="fallback-list">
          <div
            v-for="(opt, index) in fallbackOptions"
            :key="opt.id"
            class="fallback-item"
            :class="{ 'animate-slide-up': true }"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="viewDetail(opt.name, opt.desc)"
          >
            <div class="fallback-icon">
              <span class="icon-inner">{{ opt.icon }}</span>
              <div class="icon-glow"></div>
            </div>
            <div class="fallback-info">
              <span class="fallback-name">{{ opt.name }}</span>
              <span class="fallback-desc">{{ opt.desc }}</span>
            </div>
            <span class="fallback-arrow">›</span>
          </div>
        </div>
      </div>

      <!-- 提示信息（通过场景显示） -->
      <div class="tip-card" v-if="resultType === 'realTime' || resultType === 'industry'">
        <div class="tip-icon">💡</div>
        <div class="tip-content">
          <div class="tip-title">温馨提示</div>
          <div class="tip-text">请确保办单信息与选择一致（包括营业员、套餐）</div>
        </div>
      </div>

      <!-- 套餐信息 -->
      <div class="order-info" v-if="store.selectedPlan">
        <div class="order-header">
          <span class="order-icon">📋</span>
          <span class="order-title">订单信息</span>
        </div>
        <div class="order-divider"></div>
        <div class="order-row">
          <span class="order-label">已选套餐</span>
          <span class="order-value">{{ store.selectedPlan.name }}</span>
        </div>
        <div class="order-row">
          <span class="order-label">月费</span>
          <span class="order-value">¥{{ store.selectedPlan.price }}/月</span>
        </div>
        <div class="order-row" v-if="store.orderId">
          <span class="order-label">订单号</span>
          <span class="order-value">{{ store.orderId }}</span>
        </div>
      </div>

      <!-- 重新申请按钮（仅未通过场景显示） -->
      <div class="action-section" v-if="resultType === 'fallback'">
        <button class="reset-btn" @click="handleReset">
          <span>重新申请</span>
          <span class="btn-arrow">↻</span>
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="loading-section" v-if="loading">
      <div class="loading-ring"></div>
      <div class="loading-spinner"></div>
      <p class="loading-text">正在查询办理结果...</p>
    </div>
  </div>
</template>

<style scoped>
.result-page {
  min-height: 100vh;
  background: var(--color-bg);
}

.content {
  padding: var(--spacing-xl);
}

/* 结果卡片 */
.result-card {
  background: var(--color-card);
  border-radius: var(--radius-3xl);
  padding: var(--spacing-3xl) var(--spacing-xl);
  text-align: center;
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--spacing-2xl);
  position: relative;
  overflow: hidden;
}

.result-card.realTime {
  background: linear-gradient(135deg, #07C160 0%, #06AD56 100%);
  color: #fff;
}

.result-card.industry {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: #fff;
}

.result-card.fallback {
  background: linear-gradient(135deg, var(--color-warning) 0%, var(--color-warning-dark) 100%);
  color: #fff;
}

/* 卡片背景装饰 */
.card-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 40%);
  pointer-events: none;
}

.card-blob {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  filter: blur(40px);
}

.card-blob-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  right: -50px;
}

.card-blob-2 {
  width: 150px;
  height: 150px;
  bottom: -30px;
  left: -30px;
}

/* 结果图标 */
.result-icon {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-xl);
  position: relative;
  animation: iconPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes iconPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.icon-ring {
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.3);
  animation: ringPulse 2s ease-out infinite;
}

@keyframes ringPulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.icon-success {
  font-size: 72px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.icon-industry {
  font-size: 56px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.icon-fallback {
  font-size: 72px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.result-title {
  font-size: 40px;
  font-weight: 800;
  margin-bottom: var(--spacing-sm);
  letter-spacing: -0.5px;
}

.result-desc {
  font-size: 28px;
  opacity: 0.9;
  margin-bottom: var(--spacing-md);
}

.result-note {
  font-size: 26px;
  opacity: 0.8;
  margin-bottom: var(--spacing-xl);
  font-weight: 500;
}

/* 额度展示 */
.amount-section {
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-xl);
  background: rgba(255,255,255,0.1);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(10px);
}

.amount-label {
  font-size: 26px;
  opacity: 0.85;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.amount-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
}

.amount-symbol {
  font-size: 36px;
  font-weight: 600;
}

.amount-num {
  font-size: 80px;
  font-weight: 900;
  letter-spacing: -2px;
  animation: countUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 备选方案 */
.fallback-section {
  margin-bottom: var(--spacing-2xl);
}

.fallback-header {
  margin-bottom: var(--spacing-lg);
}

.fallback-title {
  font-size: 30px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.fallback-list {
  background: var(--color-card);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-light);
}

.fallback-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border-light);
  transition: all var(--transition-normal);
}

.fallback-item:last-child {
  border-bottom: none;
}

.fallback-item:active {
  background: var(--color-bg);
}

.fallback-icon {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.result-card.fallback + .fallback-section .fallback-icon {
  background: linear-gradient(135deg, var(--color-warning-light) 0%, rgba(250,173,20,0.1) 100%);
}

.result-card.realTime + .fallback-section .fallback-icon,
.result-card.industry + .fallback-section .fallback-icon {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, rgba(22,119,255,0.1) 100%);
}

.icon-inner {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-primary);
  position: relative;
  z-index: 1;
}

.result-card.fallback + .fallback-section .icon-inner {
  color: var(--color-warning);
}

.icon-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(22,119,255,0.1) 0%, transparent 70%);
}

.fallback-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fallback-name {
  font-size: 30px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.fallback-desc {
  font-size: 26px;
  color: var(--color-text-tertiary);
}

.fallback-arrow {
  font-size: 40px;
  color: var(--color-text-placeholder);
  font-weight: 300;
}

/* 提示卡片 */
.tip-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  background: rgba(22, 119, 255, 0.06);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  border: 1px solid rgba(22, 119, 255, 0.1);
}

.tip-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tip-title {
  font-size: 26px;
  font-weight: 600;
  color: var(--color-primary);
}

.tip-text {
  font-size: 26px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* 订单信息 */
.order-info {
  background: var(--color-card);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--spacing-2xl);
  border: 1px solid var(--color-border-light);
}

.order-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.order-icon {
  font-size: 28px;
}

.order-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.order-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
  margin: 0 -8px var(--spacing-md);
}

.order-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
}

.order-label {
  font-size: 26px;
  color: var(--color-text-tertiary);
}

.order-value {
  font-size: 26px;
  color: var(--color-text-primary);
  font-weight: 600;
}

/* 重新申请按钮 */
.action-section {
  padding: var(--spacing-lg) 0 calc(var(--spacing-2xl) + env(safe-area-inset-bottom));
}

.reset-btn {
  width: 100%;
  height: 100px;
  border-radius: var(--radius-full);
  background: var(--color-card);
  color: var(--color-primary);
  font-size: 34px;
  font-weight: 600;
  border: 2px solid var(--color-primary);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.reset-btn:active {
  transform: scale(0.96);
  background: var(--color-primary-light);
}

.btn-arrow {
  font-size: 28px;
}

/* 加载状态 */
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200px;
}

.loading-ring {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid rgba(22, 119, 255, 0.1);
  position: absolute;
  animation: ringRotate 2s linear infinite;
}

@keyframes ringRotate {
  to {
    transform: rotate(360deg);
  }
}

.loading-spinner {
  width: 80px;
  height: 80px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: var(--spacing-xl);
  position: relative;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 28px;
  color: var(--color-text-secondary);
}

/* 演示切换按钮 */
.demo-switch {
  margin-top: var(--spacing-lg);
}

.demo-btn {
  width: 100%;
  height: 80px;
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 26px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  backdrop-filter: blur(10px);
}

.demo-btn:active {
  transform: scale(0.96);
  background: rgba(255, 255, 255, 0.25);
}

.demo-icon {
  font-size: 28px;
}

.demo-text {
  flex-shrink: 0;
}

.demo-label {
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  margin-left: 4px;
}
</style>
