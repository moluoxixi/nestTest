/**
 * 将字符串的首字母转换为大写
 */
export function upperFirstChar(str: string): string {
  if (!str || str.length === 0) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}
