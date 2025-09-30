export interface downloadUrlToPathParamsType {
  /** 要下载的资源 URL */
  url: string
  /** 目标文件绝对路径或相对项目根目录的路径 */
  filePath: string
  /** 可选的请求头 */
  headers?: Record<string, string>
  /** 超时时间，毫秒 */
  timeoutMs?: number
  /** 允许的重定向次数 */
  maxRedirects?: number
}

export interface downloadUrlToPathResultType {
  /** 实际写入的文件路径 */
  filePath: string
  /** 最终访问的 URL（考虑重定向） */
  finalUrl: string
  /** HTTP 状态码 */
  statusCode: number
  /** 文件字节大小 */
  sizeBytes: number
  /** Content-Type */
  contentType?: string
  /** 耗时，毫秒 */
  elapsedMs: number
}
