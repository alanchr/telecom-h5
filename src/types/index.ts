/**
 * 全局类型定义
 * 定义用户信息、授权信息、套餐、测评结果等接口
 */

/** 用户登录信息 */
export interface UserInfo {
  userId: string
  name: string
  avatar: string
  phone: string
}

/** 授权身份信息 */
export interface AuthInfo {
  idCard: string
  realName: string
}

/** 套餐信息 */
export interface PlanItem {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  tag?: string
  popular?: boolean
}

/** 测评结果 */
export interface CreditResult {
  realTimePass: boolean
  realTimeAmount: number
  zhimaGoPass: boolean
  zhimaGoAmount: number
}

/** 通用接口响应 */
export interface ApiResponse<T = unknown> {
  code: number
  message?: string
  data?: T
}
