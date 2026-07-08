import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo, AuthInfo, PlanItem, CreditResult } from '@/types'

/**
 * 全局状态管理
 * 管理登录信息、授权状态、营业员验证、套餐选择、测评结果
 */
export const useAppStore = defineStore('app', () => {
  // === 登录状态 ===
  /** 是否已登录 */
  const isLoggedIn = ref(false)
  /** 用户信息 */
  const userInfo = ref<UserInfo | null>(null)

  // === 授权状态 ===
  /** 是否已授权身份 */
  const isAuthorized = ref(false)
  /** 授权身份信息 */
  const authInfo = ref<AuthInfo | null>(null)

  // === 营业员验证 ===
  /** 营业员手机号 */
  const clerkPhone = ref('')
  /** 手机号是否已验证通过 */
  const isPhoneVerified = ref(false)

  // === 套餐选择 ===
  /** 已选套餐 */
  const selectedPlan = ref<PlanItem | null>(null)
  /** 订单ID */
  const orderId = ref<string | null>(null)

  // === 测评结果 ===
  /** 测评结果 */
  const creditResult = ref<CreditResult | null>(null)

  /**
   * 设置登录信息
   * @param info 用户信息
   */
  function setLoginInfo(info: UserInfo) {
    isLoggedIn.value = true
    userInfo.value = info
  }

  /**
   * 设置授权信息
   * @param info 身份信息
   */
  function setAuthInfo(info: AuthInfo) {
    isAuthorized.value = true
    authInfo.value = info
  }

  /**
   * 设置营业员手机号
   * @param phone 手机号
   */
  function setClerkPhone(phone: string) {
    clerkPhone.value = phone
  }

  /**
   * 标记手机号验证通过
   */
  function setPhoneVerified() {
    isPhoneVerified.value = true
  }

  /**
   * 设置已选套餐
   * @param plan 套餐信息
   */
  function setSelectedPlan(plan: PlanItem) {
    selectedPlan.value = plan
  }

  /**
   * 设置订单ID
   * @param id 订单ID
   */
  function setOrderId(id: string) {
    orderId.value = id
  }

  /**
   * 设置测评结果
   * @param result 测评结果
   */
  function setCreditResult(result: CreditResult) {
    creditResult.value = result
  }

  /**
   * 重置所有状态（重新申请时调用）
   */
  function resetAll() {
    isLoggedIn.value = false
    userInfo.value = null
    isAuthorized.value = false
    authInfo.value = null
    clerkPhone.value = ''
    isPhoneVerified.value = false
    selectedPlan.value = null
    orderId.value = null
    creditResult.value = null
  }

  return {
    // 状态
    isLoggedIn,
    userInfo,
    isAuthorized,
    authInfo,
    clerkPhone,
    isPhoneVerified,
    selectedPlan,
    orderId,
    creditResult,
    // 方法
    setLoginInfo,
    setAuthInfo,
    setClerkPhone,
    setPhoneVerified,
    setSelectedPlan,
    setOrderId,
    setCreditResult,
    resetAll
  }
})
