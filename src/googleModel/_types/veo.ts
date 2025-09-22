/**
 * Veo 生成视频参数（参考 Gemini API 文档：Veo 模型参数）
 * 文档：`https://ai.google.dev/gemini-api/docs/video?hl=zh-cn&example=dialogue#veo-model-parameters`
 */
export interface veoGenerateVideosParamsType {
  /**
   * 文字提示（prompt）。用于指导生成的视频内容。
   * 建议提供具体、清晰的镜头与场景描述。
   */
  prompt?: string

  /**
   * Veo 模型 ID。
   * - 推荐：`"veo-3.0-generate-001"`（高保真 8 秒 720p/1080p，含原生音频）
   * - 其他：`"veo-3.0-fast-generate-001"`（更快）、`"veo-2.0-generate-001"`
   * 也允许传入将来的预览/稳定版本字符串。
   */
  model?:
    | 'veo-3.0-generate-001'
    | 'veo-3.0-fast-generate-001'
    | 'veo-2.0-generate-001'
    | string

  /**
   * 轮询生成任务的间隔（毫秒）。仅在服务端轮询时使用，与 Gemini API 无关。
   * 默认 10000ms（10 秒）。
   */
  pollIntervalMs?: number

  /**
   * 生成后在本地落盘的路径（包含文件名）。若未提供，会自动生成到 `public/files` 目录下。
   */
  downloadPath?: string

  /**
   * 人像生成功能的地区安全设置。
   * - 欧盟、英国、瑞士、中东和北非地区：Veo 3 仅允许 `allow_adult`
   * - 其他地区可能允许 `dont_allow`
   * 参考文档的“限制/地区限制”说明。
   */
  personGeneration?: 'dont_allow' | 'allow_adult'

  /**
   * 视频时长（秒）。Veo 3 典型支持 8 秒。
   * 实际支持以服务端为准，非必填。
   */
  durationSeconds?: number

  /**
   * 分辨率。常用：`"720p"`、`"1080p"`。
   * 实际支持以服务端为准，非必填。
   */
  resolution?: '720p' | '1080p' | string

  /**
   * 纵横比。Veo 2 曾支持 `"9:16"`；Veo 3 以 16:9 为主。
   * 填写将直接透传给 SDK（若支持）。
   */
  aspectRatio?: '16:9' | '9:16' | string

  /**
   * 音频策略。Veo 3 可原生生成音频。
   * - `"auto"`：按模型能力自动生成/包含音频
   * - `"none"`：不生成音频（如需）
   */
  soundtrack?: 'auto' | 'none' | string

  /**
   * 其他可选参数，直接透传给 `ai.models.generateVideos`（前向兼容）。
   */
  [k: string]: unknown
}

/**
 * Veo 生成视频返回值。
 */
export interface veoGenerateVideosResultType {
  /**
   * 生成的视频文件句柄（Google GenAI SDK 返回对象）。
   */
  file?: any

  /**
   * 操作的完整返回（含 generatedVideos 等）。
   */
  response?: any
}


