/**
 * 表单校验工具函数
 */

/**
 * 校验手机号格式（11位数字，1开头）
 * @param phone 手机号字符串
 * @returns boolean 是否合法
 */
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 校验验证码格式（6位数字）
 * @param code 验证码字符串
 * @returns boolean 是否合法
 */
export function isValidSmsCode(code: string): boolean {
  return /^\d{6}$/.test(code)
}

/**
 * 校验身份证号格式（18位，最后一位可为X）
 * @param idCard 身份证号字符串
 * @returns boolean 是否合法
 */
export function isValidIdCard(idCard: string): boolean {
  return /^\d{17}[\dXx]$/.test(idCard)
}
