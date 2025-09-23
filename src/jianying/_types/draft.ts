/**
 * JianYing 草稿生成入参类型
 */
export interface jianyingDraftGenerateParamsType {
  /**
   * 草稿标题
   */
  title?: string

  /**
   * 图片素材列表（支持 URL 或 base64）
   */
  images?: Array<{
    /** 图片的远程 URL（与 base64 二选一） */
    url?: string
    /** 图片的 base64（可为 data URL 或纯 base64） */
    base64?: string
    /** 自定义保存文件名（可选） */
    filename?: string
    /** 排序位置（可选） */
    order?: number
    /** 放到时间线上的持续时长（毫秒，默认 3000） */
    timelineDurationMs?: number
  }>

  /**
   * 视频素材列表（支持 URL 或 base64）
   */
  videos?: Array<{
    url?: string
    base64?: string
    filename?: string
    order?: number
    /** 在时间线上的使用时长（毫秒，默认 5000） */
    timelineDurationMs?: number
    /** 源素材的截取起点（毫秒，默认 0） */
    trimStartMs?: number
  }>

  /**
   * 音频素材列表（支持 URL 或 base64）
   */
  audios?: Array<{
    url?: string
    base64?: string
    filename?: string
    order?: number
    /** 在时间线上的使用时长（毫秒，默认与素材长度或 5000） */
    timelineDurationMs?: number
    /** 源素材的截取起点（毫秒，默认 0） */
    trimStartMs?: number
  }>

  /**
   * 字幕列表：可直接传入 srt 字符串，或传结构化 items 由服务生成 .srt
   */
  subtitles?: Array<{
    /** 直接提供的 srt 内容（可选） */
    srt?: string
    /** 结构化字幕条目（提供则会生成 srt） */
    items?: Array<{
      /** 开始时间（毫秒） */ startMs?: number
      /** 结束时间（毫秒） */ endMs?: number
      /** 字幕文本 */ text?: string
    }>
    /** 保存文件名（默认 auto） */
    filename?: string
  }>

  /**
   * 画布设置（默认 16:9, 1920x1080, 30fps）
   */
  canvas?: {
    ratio?: '16:9' | '9:16' | '1:1' | string
    width?: number
    height?: number
    fps?: number
  }
}

/**
 * JianYing 草稿生成返回类型
 */
export interface jianyingDraftGenerateResultType {
  /** 草稿所在绝对目录 */
  absDirPath: string
  /** 标准草稿（draft_content.json）下载地址 */
  draftContentDownPath: string
  /** 草稿信息（draft_info.json）下载地址 */
  draftInfoDownPath: string
  /** 兼容字段：与 draftContentDownPath 相同 */
  manifestDownPath: string
  /** 生成的相对资产路径列表（供参考） */
  assetRelativePaths: string[]
  /** manifest 的内容对象（调试用） */
  manifest: any
}

/** 以下为标准草稿结构类型（简化） */

export interface JianyingTimerangeType {
  start: number
  duration: number
}

export interface JianyingMaterialBaseType {
  id: string
  path: string
}

export interface JianyingMaterialVideoType extends JianyingMaterialBaseType {
  type: 'video'
}
export interface JianyingMaterialImageType extends JianyingMaterialBaseType {
  type: 'image'
}
export interface JianyingMaterialAudioType extends JianyingMaterialBaseType {
  type: 'audio'
}
export interface JianyingMaterialTextType extends JianyingMaterialBaseType {
  type: 'text'
  content: string
}

export interface JianyingTrackSegmentType {
  material_id: string
  target_timerange: JianyingTimerangeType
  material_timerange: JianyingTimerangeType
}

export interface JianyingTrackType {
  type: 'video' | 'audio' | 'text'
  segments: JianyingTrackSegmentType[]
}

export interface JianyingMaterialsType {
  videos: JianyingMaterialVideoType[]
  images: JianyingMaterialImageType[]
  audios: JianyingMaterialAudioType[]
  texts: JianyingMaterialTextType[]
}

export interface JianyingDraftContentType {
  version: string
  canvas_config: { ratio: string, width: number, height: number, fps: number }
  materials: JianyingMaterialsType
  tracks: JianyingTrackType[]
}


