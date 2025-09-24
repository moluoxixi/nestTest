/**
 * @file   : dateTimeHelper.ts
 * @time   : 11:12
 * @date   : 2024/3/20
 * @mail   : 9727005@qq.com
 * @creator: ShanDong Xiedali
 * @company: HiLand & RainyTop
 *
 * 日期时间助手模块
 * 对应Python版本的BasicLibrary.data.dateTimeHelper
 */

/**
 * 获取时间戳
 * 对应Python的DateTimeHelper.get_timestamp
 * @param formatter 格式化方式，16表示16位数字格式
 * @returns 时间戳
 */
export function getTimestamp(formatter: number = 16): number {
  if (formatter === 16) {
    // 返回16位数字格式的时间戳（微秒）
    // Python版本返回的是16位数字，这里模拟相同格式
    return Date.now() * 1000 // 转换为微秒
  }

  // 默认返回毫秒时间戳
  return Date.now()
}
