<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { useAppStore } from '@/stores/app'
import { useCountdown } from '@/composables/useCountdown'
import { authIdentity, sendSms, verifySms } from '@/api'
import { isValidPhone, isValidSmsCode } from '@/utils/validators'
import PageHeader from '@/components/PageHeader.vue'

/**
 * 授权身份页
 * 展示用户信息，授权身份，验证营业员手机号
 */
const router = useRouter()
const store = useAppStore()

/** 授权加载中 */
const authLoading = ref(false)
/** 营业员手机号 */
const phone = ref('')
/** 验证码 */
const smsCode = ref('')
/** 发送验证码加载中 */
const sendLoading = ref(false)
/** 验证中 */
const verifyLoading = ref(false)

/** 倒计时 */
const { count, isCounting, start } = useCountdown(60)

/** 手机号是否合法 */
const isPhoneValid = computed(() => isValidPhone(phone.value))

/** 验证码是否合法 */
const isCodeValid = computed(() => isValidSmsCode(smsCode.value))

/** 获取验证码按钮是否可用 */
const canSendCode = computed(() => isPhoneValid.value && !isCounting.value && !sendLoading.value)

/** 提交按钮是否可用 */
const canSubmit = computed(() => store.isAuthorized && isPhoneValid.value && isCodeValid.value && !verifyLoading.value)

/**
 * 脱敏显示身份证号（只显示前6位和后4位）
 * @param idCard 身份证号
 * @returns 脱敏后的身份证号
 */
function maskIdCard(idCard: string): string {
  if (idCard.length < 10) return idCard
  return idCard.slice(0, 6) + '**********' + idCard.slice(-4)
}

/**
 * 确认授权身份信息
 */
async function handleAuth() {
  if (store.isAuthorized || authLoading.value) return
  authLoading.value = true
  showLoadingToast({ message: '授权中...', forbidClick: true, duration: 0 })

  try {
    const info = await authIdentity()
    store.setAuthInfo(info)
    closeToast()
    showToast({ message: '授权成功', type: 'success', fontSize: '32px' })
  } catch (err) {
    closeToast()
    const msg = err instanceof Error ? err.message : '授权失败'
    showToast({ message: msg, type: 'fail', fontSize: '32px' })
  } finally {
    authLoading.value = false
  }
}

/**
 * 填写验证码（演示用）
 */
function fillSmsCode() {
  smsCode.value = '123456'
  showToast({ message: '已填写验证码', type: 'success', fontSize: '32px' })
}

/**
 * 发送验证码
 */
async function handleSendCode() {
  if (!canSendCode.value) return
  sendLoading.value = true

  try {
    await sendSms(phone.value)
    store.setClerkPhone(phone.value)
    start()
    showToast({ message: '验证码已发送（123456）', type: 'success', fontSize: '32px' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '发送失败'
    showToast({ message: msg, type: 'fail', fontSize: '32px' })
  } finally {
    sendLoading.value = false
  }
}

/**
 * 提交验证
 */
async function handleSubmit() {
  if (!canSubmit.value) return
  verifyLoading.value = true
  showLoadingToast({ message: '验证中...', forbidClick: true, duration: 0 })

  try {
    const valid = await verifySms(smsCode.value)
    if (valid) {
      store.setPhoneVerified()
      closeToast()
      showToast({ message: '验证通过', type: 'success', fontSize: '32px' })
      router.push('/plan')
    } else {
      closeToast()
      showToast({ message: '验证码错误', type: 'fail', fontSize: '32px' })
    }
  } catch (err) {
    closeToast()
    const msg = err instanceof Error ? err.message : '验证失败'
    showToast({ message: msg, type: 'fail', fontSize: '32px' })
  } finally {
    verifyLoading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <PageHeader title="身份授权" />

    <div class="content">
      <!-- 授权身份区域 -->
      <div class="section animate-fade-in">
        <div class="section-header">
          <div class="section-icon auth-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="section-title-wrap">
            <h2 class="section-title">身份信息授权</h2>
            <p class="section-desc">授权后将获取您的身份信息用于办理业务</p>
          </div>
        </div>
        
        <div class="auth-card">
          <div class="auth-content" v-if="!store.authInfo">
            <div class="auth-placeholder">
              <div class="placeholder-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="placeholder-ring"></div>
              <p class="placeholder-text">请授权身份信息</p>
              <p class="placeholder-hint">授权仅用于本次业务办理</p>
            </div>
            <button
              class="auth-btn"
              :disabled="authLoading"
              @click="handleAuth"
            >
              <span class="auth-btn-icon">✓</span>
              <span>{{ authLoading ? '授权中...' : '确认授权' }}</span>
            </button>
          </div>
          
          <div class="auth-detail" v-else>
            <div class="detail-header">
              <div class="detail-avatar">
                <span class="avatar-text">{{ store.authInfo.realName.charAt(0) }}</span>
              </div>
              <div class="detail-name-wrap">
                <span class="detail-name">{{ store.authInfo.realName }}</span>
                <div class="auth-success-tag">
                  <span class="success-icon">✓</span>
                  <span>已授权</span>
                </div>
              </div>
            </div>
            <div class="detail-divider"></div>
            <div class="detail-item">
              <div class="detail-label">
                <span class="label-icon">🆔</span>
                <span>身份证号</span>
              </div>
              <span class="detail-value">{{ maskIdCard(store.authInfo.idCard) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 营业员验证区域 -->
      <div class="section animate-slide-up" style="animation-delay: 0.1s">
        <div class="section-header">
          <div class="section-icon phone-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div class="section-title-wrap">
            <h2 class="section-title">营业员手机号验证</h2>
            <p class="section-desc">输入手机号获取验证码验证</p>
          </div>
        </div>

        <div class="form-card">
          <div class="form-row">
            <div class="input-prefix">📱</div>
            <input
              v-model="phone"
              class="form-input"
              type="tel"
              maxlength="11"
              placeholder="请输入营业员手机号"
            />
          </div>
          <div class="form-row">
            <div class="input-prefix">🔢</div>
            <input
              v-model="smsCode"
              class="form-input"
              type="tel"
              maxlength="6"
              placeholder="请输入验证码"
            />
            <button
              class="code-btn"
              :class="{ active: canSendCode }"
              :disabled="!canSendCode"
              @click="handleSendCode"
            >
              {{ isCounting ? `${count}s` : '获取验证码' }}
            </button>
          </div>
          <div class="form-hint">
            <span class="hint-dot"></span>
            <span>验证码为：123456</span>
            <button class="fill-btn" @click="fillSmsCode">填写</button>
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
        <span>{{ verifyLoading ? '验证中...' : '下一步' }}</span>
        <span class="btn-arrow" v-if="!verifyLoading">→</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding-bottom: 200px;
}

.content {
  padding: var(--spacing-xl);
}

/* 区域 */
.section {
  margin-bottom: var(--spacing-2xl);
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.section-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}

.section-icon::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: var(--radius-xl);
  opacity: 0.3;
}

.section-icon svg {
  width: 30px;
  height: 30px;
  position: relative;
  z-index: 1;
}

.auth-icon {
  background: linear-gradient(135deg, var(--color-info-light) 0%, var(--color-info-light) 100%);
  color: var(--color-info);
}

.auth-icon::before {
  background: var(--color-info);
}

.phone-icon {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-light) 100%);
  color: var(--color-primary);
}

.phone-icon::before {
  background: var(--color-primary);
}

.section-title-wrap {
  flex: 1;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.section-desc {
  font-size: 24px;
  color: var(--color-text-tertiary);
  line-height: 1.5;
}

/* 授权卡片 */
.auth-card {
  background: var(--color-card);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-light);
}

.auth-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-2xl);
  position: relative;
}

.placeholder-icon {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-gray-100) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-400);
  position: relative;
  z-index: 1;
  border: 2px solid var(--color-gray-100);
}

.placeholder-icon svg {
  width: 40px;
  height: 40px;
}

.placeholder-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  border: 2px solid var(--color-gray-200);
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.2;
  }
}

.placeholder-text {
  font-size: 30px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-top: var(--spacing-lg);
}

.placeholder-hint {
  font-size: 24px;
  color: var(--color-text-tertiary);
  margin-top: 4px;
}

.auth-btn {
  width: 100%;
  height: 96px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: #fff;
  font-size: 32px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 8px 28px rgba(22, 119, 255, 0.3);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.auth-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  transition: left 0.5s ease;
}

.auth-btn:active:not(:disabled)::before {
  left: 100%;
}

.auth-btn:active:not(:disabled) {
  transform: scale(0.98);
  box-shadow: 0 4px 16px rgba(22, 119, 255, 0.25);
}

.auth-btn-icon {
  font-size: 26px;
  font-weight: 700;
}

.auth-detail {
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
}

.detail-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-info-light) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(22, 119, 255, 0.15);
}

.avatar-text {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-primary);
}

.detail-name-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-name {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.auth-success-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: var(--color-success-light);
  border-radius: var(--radius-full);
  font-size: 22px;
  color: var(--color-success);
  width: fit-content;
}

.success-icon {
  font-size: 18px;
  font-weight: 700;
}

.detail-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
  margin: 0 -8px;
}

.detail-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) 0;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 26px;
  color: var(--color-text-tertiary);
}

.label-icon {
  font-size: 26px;
}

.detail-value {
  font-size: 26px;
  font-weight: 600;
  color: var(--color-text-primary);
  font-family: 'SF Mono', monospace;
}

/* 表单卡片 */
.form-card {
  background: var(--color-card);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-light);
}

.form-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  height: 104px;
  border-bottom: 1px solid var(--color-border-light);
  padding: 0 4px;
}

.form-row:last-child {
  border-bottom: none;
}

.input-prefix {
  font-size: 30px;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
  height: 100%;
  font-size: 32px;
  color: var(--color-text-primary);
}

.form-input::placeholder {
  color: var(--color-text-placeholder);
}

.code-btn {
  white-space: nowrap;
  font-size: 26px;
  color: var(--color-text-tertiary);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  background: var(--color-gray-50);
  transition: all var(--transition-normal);
  font-weight: 500;
}

.code-btn.active {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, rgba(22,119,255,0.1) 100%);
  color: var(--color-primary);
  font-weight: 600;
}

.code-btn:disabled {
  opacity: 0.5;
}

.form-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px dashed var(--color-border-light);
}

.hint-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-warning);
}

.form-hint span:last-of-type {
  font-size: 22px;
  color: var(--color-text-tertiary);
}

.fill-btn {
  white-space: nowrap;
  font-size: 26px;
  color: var(--color-primary);
  font-weight: 600;
  padding: 8px 20px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-primary-light) 0%, rgba(22,119,255,0.1) 100%);
  transition: all var(--transition-normal);
}

.fill-btn:active {
  transform: scale(0.96);
  opacity: 0.8;
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
