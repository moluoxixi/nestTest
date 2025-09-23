/** Lyria 音阶（Scale）枚举 */
export type lyriaScaleType =
  | 'C_MAJOR_A_MINOR'
  | 'D_FLAT_MAJOR_B_FLAT_MINOR'
  | 'D_MAJOR_B_MINOR'
  | 'E_FLAT_MAJOR_C_MINOR'
  | 'E_MAJOR_D_FLAT_MINOR'
  | 'F_MAJOR_D_MINOR'
  | 'G_FLAT_MAJOR_E_FLAT_MINOR'
  | 'G_MAJOR_E_MINOR'
  | 'A_FLAT_MAJOR_F_MINOR'
  | 'A_MAJOR_G_FLAT_MINOR'
  | 'B_FLAT_MAJOR_G_MINOR'
  | 'B_MAJOR_A_FLAT_MINOR'
  | 'SCALE_UNSPECIFIED'

/** Lyria 生成模式 */
export type lyriaMusicGenerationModeType = 'QUALITY' | 'DIVERSITY' | 'VOCALIZATION'

/** 加权提示 */
export interface lyriaWeightedPromptType {
  /** 文本 */
  text: string
  /** 权重（0-1），默认 1.0 */
  weight?: number
}

/** 音乐生成配置（摘自文档） */
export interface lyriaMusicGenerationConfigType {
  guidance?: number // 0.0-6.0, 默认 4.0
  bpm?: number // 60-200
  density?: number // 0.0-1.0
  brightness?: number // 0.0-1.0
  scale?: lyriaScaleType
  mute_bass?: boolean
  mute_drums?: boolean
  only_bass_and_drums?: boolean
  music_generation_mode?: lyriaMusicGenerationModeType // QUALITY (默认) | DIVERSITY | VOCALIZATION
  temperature?: number // 0.0-3.0, 默认 1.1
  top_k?: number // 1-1000, 默认 40
  seed?: number // 0-2147483647
}

/**
 * Lyria 生成音乐参数
 * 参考：`https://ai.google.dev/gemini-api/docs/music-generation?hl=zh-cn#generate-music`
 */
export interface lyriaGenerateMusicParamsType {
  /** 简单提示（与 weightedPrompts 二选一，若都提供则合并） */
  prompt?: string

  /** 加权提示集合 */
  weightedPrompts?: lyriaWeightedPromptType[]

  /** 模型（例如：models/lyria-realtime-exp） */
  model?: string

  /** 轮询/等待间隔（如采用轮询） */
  pollIntervalMs?: number

  /** 下载保存路径（含文件名，默认生成 .wav） */
  downloadPath?: string

  /** 音乐生成配置 */
  config?: lyriaMusicGenerationConfigType

  /** 期望持续生成的秒数（仅用于服务端采集时长控制，非官方参数） */
  durationSeconds?: number

  /** 其他可选参数，预留前向兼容 */
  [k: string]: unknown
}

export interface lyriaGenerateMusicResultType {
  /** 生成的音频文件句柄或标识（若可用） */
  file?: any
  /** 底层响应对象（若可用） */
  response?: any
  /** 实际下载保存的路径（服务器本地） */
  downloadPath?: string
}


