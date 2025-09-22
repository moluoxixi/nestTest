export interface veoGenerateVideosParamsType {
  /**
   * 文本提示（prompt），用于描述要生成的视频内容和风格。
   * 参考：`https://ai.google.dev/gemini-api/docs/video?hl=zh-cn&example=dialogue#veo-model-parameters`
   */
  prompt?: string

  /**
   * Veo 模型 ID（默认 `"veo-3.0-generate-001"`）。
   * 可选：`"veo-3.0-fast-generate-001"`、`"veo-2.0-generate-001"`，或将来新增的版本字符串。
   */
  model?: 'veo-3.0-generate-001' | 'veo-3.0-fast-generate-001' | 'veo-2.0-generate-001' | string

  /**
   * 轮询等待生成完成的间隔（毫秒）。服务端内部使用，默认 10000。
   */
  pollIntervalMs?: number

  /**
   * 下载保存路径（含文件名）。若不提供，会在 `public/files` 生成随机文件名。
   */
  downloadPath?: string

  /**
   * 人像生成策略（地区限制相关）。EU/UK/CH/MENA 对 Veo 3 仅允许 `allow_adult`。
   */
  personGeneration?: 'dont_allow' | 'allow_adult'

  /**
   * 目标视频时长（秒）。Veo 3 常见为 8 秒。
   */
  durationSeconds?: number

  /**
   * 分辨率（如 `"720p"`、`"1080p"`）。
   */
  resolution?: '720p' | '1080p' | string

  /**
   * 纵横比（如 `"16:9"`、`"9:16"`）。
   */
  aspectRatio?: '16:9' | '9:16' | string

  /**
   * 音轨设置：`"auto"`（模型自动/包含音频）或 `"none"`（不包含音频）。
   */
  soundtrack?: 'auto' | 'none' | string

  /** 其他可选参数，直接透传到底层 SDK（前向兼容）。 */
  [k: string]: unknown
}

export interface veoGenerateVideosResultType {
  /** 生成的视频文件句柄（Google GenAI SDK 返回对象）。 */
  file?: any
  /** 完整的响应对象（包含 generatedVideos 等）。 */
  response?: any
}


