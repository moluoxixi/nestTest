/**
 * 字符串处理工具
 * 对应Python版本的BasicLibrary.data.stringHelper
 */

/**
 * 将字符串的首字母转换为大写
 * @param str 要处理的字符串
 * @returns 首字母大写的字符串
 */
export function upperFirstChar(str: string): string {
  if (!str || str.length === 0) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}
