import { mockLogin, mockAuth, mockSendSms, mockVerifySms, mockSubmit, mockCredit } from '@/utils/mock'
import type { ApiResponse, UserInfo, AuthInfo, CreditResult } from '@/types'

/**
 * API请求封装层
 * 统一封装所有Mock接口调用，方便后续替换为真实接口
 */

/**
 * 一键登录
 * @returns Promise<UserInfo> 用户信息
 */
export async function login(): Promise<UserInfo> {
  const res: ApiResponse<UserInfo> = await mockLogin()
  if (res.code !== 0 || !res.data) throw new Error(res.message || '登录失败')
  return res.data
}

/**
 * 授权身份信息
 * @returns Promise<AuthInfo> 身份信息
 */
export async function authIdentity(): Promise<AuthInfo> {
  const res: ApiResponse<AuthInfo> = await mockAuth()
  if (res.code !== 0 || !res.data) throw new Error(res.message || '授权失败')
  return res.data
}

/**
 * 发送验证码
 * @param phone 手机号
 */
export async function sendSms(phone: string): Promise<void> {
  const res: ApiResponse = await mockSendSms(phone)
  if (res.code !== 0) throw new Error(res.message || '发送验证码失败')
}

/**
 * 验证验证码
 * @param code 验证码
 * @returns Promise<boolean> 是否验证通过
 */
export async function verifySms(code: string): Promise<boolean> {
  const res: ApiResponse<{ valid: boolean }> = await mockVerifySms(code)
  if (res.code !== 0 || !res.data) throw new Error(res.message || '验证失败')
  return res.data.valid
}

/**
 * 提交套餐
 * @param planId 套餐ID
 * @returns Promise<string> 订单ID
 */
export async function submitPlan(planId: string): Promise<string> {
  const res: ApiResponse<{ orderId: string }> = await mockSubmit(planId)
  if (res.code !== 0 || !res.data) throw new Error(res.message || '提交失败')
  return res.data.orderId
}

/**
 * 查询测评结果
 * @param planPrice 套餐价格（用于决定测评分支）
 * @returns Promise<CreditResult> 测评结果
 */
export async function queryCredit(planPrice: number): Promise<CreditResult> {
  const res: ApiResponse<CreditResult> = await mockCredit(planPrice)
  if (res.code !== 0 || !res.data) throw new Error(res.message || '测评查询失败')
  return res.data
}
