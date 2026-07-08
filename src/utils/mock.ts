import type { ApiResponse, UserInfo, AuthInfo, CreditResult } from '@/types'

/**
 * Mock数据与接口模拟
 * 使用Promise + setTimeout模拟网络请求延迟
 * 所有数据为演示用途，不依赖真实后端
 */

/** 模拟网络延迟（800ms-1500ms随机） */
function delay(ms?: number): Promise<void> {
  const time = ms ?? (800 + Math.random() * 700)
  return new Promise((resolve) => setTimeout(resolve, time))
}

/** 模拟用户数据 */
const mockUserInfo: UserInfo = {
  userId: '2088123456789012',
  name: '陈**',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen',
  phone: '138****8000'
}

/** 模拟授权数据 */
const mockAuthInfo: AuthInfo = {
  idCard: '110101199001011234',
  realName: '陈**'
}

/**
 * 模拟一键登录接口
 * @returns Promise<ApiResponse<UserInfo>> 用户信息
 */
export async function mockLogin(): Promise<ApiResponse<UserInfo>> {
  await delay()
  return {
    code: 0,
    data: mockUserInfo
  }
}

/**
 * 模拟授权身份接口
 * @returns Promise<ApiResponse<AuthInfo>> 身份信息
 */
export async function mockAuth(): Promise<ApiResponse<AuthInfo>> {
  await delay()
  return {
    code: 0,
    data: mockAuthInfo
  }
}

/**
 * 模拟发送验证码接口
 * @param phone 手机号
 * @returns Promise<ApiResponse> 发送结果
 */
export async function mockSendSms(phone: string): Promise<ApiResponse> {
  console.log('[Mock] 验证码已发送至:', phone, '，验证码: 123456')
  await delay(500)
  return {
    code: 0,
    message: '验证码已发送'
  }
}

/**
 * 模拟验证码校验接口
 * @param code 验证码（固定123456）
 * @returns Promise<ApiResponse<{ valid: boolean }>> 校验结果
 */
export async function mockVerifySms(code: string): Promise<ApiResponse<{ valid: boolean }>> {
  await delay(500)
  const valid = code === '123456'
  return {
    code: 0,
    data: { valid }
  }
}

/**
 * 模拟提交套餐接口
 * @param planId 套餐ID
 * @returns Promise<ApiResponse<{ orderId: string }>> 订单信息
 */
export async function mockSubmit(planId: string): Promise<ApiResponse<{ orderId: string }>> {
  console.log('[Mock] 提交套餐:', planId)
  await delay()
  const orderId = `ORD${Date.now()}`
  return {
    code: 0,
    data: { orderId }
  }
}

/**
 * 模拟测评查询接口
 * 所有套餐均返回实时测评通过（演示用，结果页有切换功能）
 * @param planPrice 套餐价格
 * @returns Promise<ApiResponse<CreditResult>> 测评结果
 */
export async function mockCredit(planPrice: number): Promise<ApiResponse<CreditResult>> {
  await delay(1200)
  let result: CreditResult

  // 所有套餐统一返回实时测评通过
  result = {
    realTimePass: true,
    realTimeAmount: 5000,
    zhimaGoPass: false,
    zhimaGoAmount: 0
  }

  return {
    code: 0,
    data: result
  }
}
