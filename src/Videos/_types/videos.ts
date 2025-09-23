/**
 * 提取首尾帧入参类型
 */
export interface videosExtractFramesParamsType {
  /** 输入视频 URL 或本地绝对/相对路径 */
  input: string
  /** 第一帧输出文件名（相对 public/files） */
  firstName?: string
  /** 最后一帧输出文件名（相对 public/files） */
  lastName?: string
  /** 距离视频末尾回退的毫秒数（默认 100） */
  lastOffsetMs?: number
}

/**
 * 提取首尾帧返回类型
 */
export interface videosExtractFramesResultType {
  /** 第一帧绝对路径 */
  firstAbs: string
  /** 最后一帧绝对路径 */
  lastAbs: string
}


