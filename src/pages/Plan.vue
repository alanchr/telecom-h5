<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { useAppStore } from '@/stores/app'
import { submitPlan } from '@/api'
import type { PlanItem } from '@/types'
import PageHeader from '@/components/PageHeader.vue'

/**
 * 套餐选择页
 * 展示三种电信套餐，用户单选后提交
 */

/** 套餐列表数据 */
const plans: PlanItem[] = [
  {
    id: 'plan-59',
    name: '畅享59元套餐',
    price: 59,
    description: '10G流量 · 100分钟通话',
    features: ['10G全国流量', '100分钟国内通话', '免费来电显示'],
    tag: '热销',
    popular: false
  },
  {
    id: 'plan-99',
    name: '畅享99元套餐',
    price: 99,
    description: '30G流量 · 300分钟通话',
    features: ['30G全国流量', '300分钟国内通话', '免费来电显示', '5G网络优先接入'],
    tag: '推荐',
    popular: false
  },
  {
    id: 'plan-199',
    name: '畅享199元套餐',
    price: 199,
    description: '100G流量 · 宽带 · 1000分钟',
    features: ['100G全国流量', '1000分钟国内通话', '500M家庭宽带', '5G网络优先接入', '视频会员月卡'],
    tag: '',
    popular: false
  }
]

const router = useRouter()
const store = useAppStore()

/** 当前选中套餐ID */
const selectedId = ref<string>('')

/** 提交加载中 */
const loading = ref(false)

/** 选中套餐对象 */
const selectedPlan = computed(() => plans.find(p => p.id === selectedId.value) || null)

/** 是否可提交 */
const canSubmit = computed(() => !!selectedId.value && !loading.value)

/**
 * 选择套餐
 * @param plan 套餐对象
 */
function selectPlan(plan: PlanItem) {
  selectedId.value = plan.id
}

/**
 * 提交套餐
 */
async function handleSubmit() {
  if (!canSubmit.value || !selectedPlan.value) return
  loading.value = true
  showLoadingToast({ message: '提交中...', forbidClick: true, duration: 0 })

  try {
    const orderId = await submitPlan(selectedPlan.value.id)
    store.setSelectedPlan(selectedPlan.value)
    store.setOrderId(orderId)
    closeToast()
    showToast({ message: '提交成功', type: 'success' })
    router.push('/result')
  } catch (err) {
    closeToast()
    const msg = err instanceof Error ? err.message : '提交失败'
    showToast({ message: msg, type: 'fail' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="plan-page">
    <PageHeader title="选择套餐" show-back @back="router.back()" />

    <div class="content">
      <div class="page-header animate-fade-in">
        <h2 class="page-title">请选择您需要办理的套餐</h2>
        <p class="page-desc">根据您的需求选择合适的套餐方案</p>
      </div>

      <!-- 套餐列表 -->
      <div class="plan-list">
        <div
          v-for="(plan, index) in plans"
          :key="plan.id"
          class="plan-card"
          :class="{ 
            active: selectedId === plan.id,
            'animate-slide-up': true
          }"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="selectPlan(plan)"
        >
          <!-- 标签 -->
          <div class="plan-tag" v-if="plan.tag">
            <span class="tag-icon">✦</span>
            <span>{{ plan.tag }}</span>
          </div>

          <!-- 选中标记 -->
          <div class="plan-check" v-if="selectedId === plan.id">
            <span class="check-inner">✓</span>
          </div>

          <div class="plan-header">
            <div class="plan-info">
              <h3 class="plan-name">{{ plan.name }}</h3>
              <p class="plan-desc">{{ plan.description }}</p>
            </div>
            <div class="plan-price">
              <span class="price-symbol">¥</span>
              <span class="price-num">{{ plan.price }}</span>
              <span class="price-unit">/月</span>
            </div>
          </div>

          <div class="plan-features">
            <div class="feature-item" v-for="(feat, i) in plan.features" :key="i">
              <span class="feature-dot"></span>
              <span class="feature-text">{{ feat }}</span>
            </div>
          </div>

          
        </div>
      </div>
    </div>

    <!-- 底部固定按钮 -->
    <div class="bottom-bar">
      <button
        class="submit-btn"
        :disabled="!canSubmit"
        @click="handleSubmit"
      >
        <span>{{ loading ? '提交中...' : '确认提交' }}</span>
        <span class="btn-arrow" v-if="!loading">→</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.plan-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding-bottom: 200px;
}

.content {
  padding: var(--spacing-xl);
}

/* 页面头部 */
.page-header {
  margin-bottom: var(--spacing-2xl);
}

.page-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.page-desc {
  font-size: 26px;
  color: var(--color-text-tertiary);
}

/* 套餐列表 */
.plan-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* 套餐卡片 */
.plan-card {
  position: relative;
  background: var(--color-card);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-xl);
  border: 2px solid transparent;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  overflow: hidden;
}

.plan-card:active {
  transform: scale(0.98);
}

.plan-card.active {
  border-color: var(--color-primary);
  box-shadow: 0 10px 32px rgba(22, 119, 255, 0.18);
  background: linear-gradient(135deg, rgba(22, 119, 255, 0.02) 0%, rgba(22, 119, 255, 0.005) 100%);
}



/* 标签 */
.plan-tag {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, var(--color-warning) 0%, var(--color-warning-dark) 100%);
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  padding: 8px 20px;
  border-radius: 0 var(--radius-2xl) 0 var(--radius-md);
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(250, 173, 20, 0.3);
}

.tag-icon {
  font-size: 14px;
  animation: tagSpark 1.5s ease-in-out infinite;
}

@keyframes tagSpark {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

/* 选中标记 */
.plan-check {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(22, 119, 255, 0.4);
  animation: checkPop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes checkPop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.plan-card.active .plan-tag {
  display: none;
}

.check-inner {
  color: #fff;
  font-size: 26px;
  font-weight: 700;
}

/* 套餐头部 */
.plan-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.plan-info {
  flex: 1;
}

.plan-name {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.plan-desc {
  font-size: 26px;
  color: var(--color-text-tertiary);
}

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-left: var(--spacing-md);
}

.price-symbol {
  font-size: 26px;
  font-weight: 600;
  color: var(--color-primary);
}

.price-num {
  font-size: 52px;
  font-weight: 900;
  color: var(--color-primary);
  line-height: 1;
  letter-spacing: -2px;
}

.price-unit {
  font-size: 24px;
  color: var(--color-text-tertiary);
}

/* 套餐特性 */
.plan-features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px dashed var(--color-border-light);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.feature-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(22, 119, 255, 0.4);
}

.feature-text {
  font-size: 26px;
  color: var(--color-text-secondary);
}

/* 底部固定按钮 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-lg) var(--spacing-xl);
  padding-bottom: calc(var(--spacing-lg) + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.06);
}

.submit-btn {
  width: 100%;
  height: 100px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: #fff;
  font-size: 34px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 8px 28px rgba(22, 119, 255, 0.3);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  transition: left 0.5s ease;
}

.submit-btn:active:not(:disabled)::before {
  left: 100%;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.96);
  box-shadow: 0 4px 16px rgba(22, 119, 255, 0.25);
}

.submit-btn:disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-400);
  box-shadow: none;
}

.btn-arrow {
  font-size: 28px;
  font-weight: 300;
}
</style>
