/**
 * 获取时间戳
 * 对齐原实现：formatter=16 时返回微秒级（Date.now()*1000），否则返回毫秒
 */
export function getTimestamp(formatter: number = 16): number {
  if (formatter === 16) {
    return Date.now() * 1000
  }
  return Date.now()
}
