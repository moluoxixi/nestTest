/**
 * 剪映组合入参与返回类型
 */

/**
 * 单个时间段的素材项
 */
export interface jianyingComposeItemType {
  /** 可选：视频链接或本地路径 */
  videoUrl?: string
  /** 可选：音频链接或本地路径 */
  audioUrl?: string
  /** 可选：图片链接或本地路径 */
  imageUrl?: string
  /** 可选：字幕/文本内容 */
  text?: string
}

/**
 * 组合草稿创建入参
 */
export interface jianyingComposeCreateParamsType {
  /** 草稿名称（可选，不传则使用时间戳） */
  name?: string
  /** 时间线素材数组（一个 item 表示一段时长） */
  items: jianyingComposeItemType[]
}

/**
 * 组合草稿创建返回
 */
export interface jianyingComposeCreateResultType {
  /** 草稿 ID */
  id: string
}
