export interface veoGenerateVideosParamsType {
  /**
   * 文本提示（prompt），用于描述要生成的视频内容和风格。
   * 参考：`https://ai.google.dev/gemini-api/docs/video?hl=zh-cn&example=dialogue#veo-model-parameters`
   */
  prompt?: string

  /**
   * Veo 模型 ID（默认 `"veo-3.0-generate-preview"`）。
   * 可选：`"veo-3.0-fast-generate-001"`、`"veo-2.0-generate-001"`，或将来新增的版本字符串。
   */
  model?: 'veo-3.0-generate-preview' | 'veo-3.0-fast-generate-001' | 'veo-2.0-generate-001' | string

  /**
   * 轮询等待生成完成的间隔（毫秒）。服务端内部使用，默认 10000。
   */
  pollIntervalMs?: number

  /**
   * 输出分辨率，仅支持 `"720p"` 或 `"1080p"`。
   * - 默认值：`"1080p"`
   * - 该字段会直接传递给 Veo 模型的 `resolution` 参数。
   */
  resolution?: '720p' | '1080p'

  /**
   * 下载保存路径（含文件名）。若不提供，会在 `public/files` 生成随机文件名。
   */
  downloadPath?: string

  /**
   * 人像生成策略（地区限制相关）。EU/UK/CH/MENA 对 Veo 3 仅允许 `allow_adult`。
   */
  personGeneration?: 'dont_allow' | 'allow_adult'


  /**
   * 纵横比（如 `"16:9"`、`"9:16"`）。
   */
  aspectRatio?: '16:9' | '9:16' | string

  /** 其他可选参数，直接透传到底层 SDK（前向兼容）。 */
  [k: string]: unknown
}

export interface veoGenerateVideosResultType {
  /** 生成的视频文件句柄（Google GenAI SDK 返回对象）。 */
  file?: any
  /** 完整的响应对象（包含 generatedVideos 等）。 */
  response?: any
}
/**
 * 测试写入接口入参类型。
 */
export interface veoTestWriteParamsType {
  /**
   * 生成文件名前缀，仅支持与服务方法一致的三种前缀。
   * - 用于 `GoogleModelService.buildDownloadPath(prefix, ext)`。
   */
  prefix?: 'video' | 'image' | 'audio'
  /**
   * 文件扩展名（不带点）。
   */
  ext?: string
  /**
   * 要写入文件中的内容（纯文本）。
   */
  content?: string
}

/**
 * 测试写入接口返回类型。
 */
export interface veoTestWriteResultType {
  /**
   * 写入后的绝对路径（容器内或本机进程的 CWD 下）。
   */
  absPath: string
  /**
   * 可通过 HTTP 访问的下载地址（由静态资源模块提供）。
   */
  downPath: string
}

