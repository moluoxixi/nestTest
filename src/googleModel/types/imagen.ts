export interface imagenGenerateImagesParamsType {
  /**
   * 文本提示（prompt），用于描述要生成的图片内容和风格。
   * 参考：`https://ai.google.dev/gemini-api/docs/imagen?hl=zh-cn#imagen-configuration`
   */
  prompt?: string

  /**
   * Imagen 模型 ID。
   * 常用：
   * - `"imagen-4.0-generate-001"`
   * - `"imagen-4.0-ultra-generate-001"`
   * - `"imagen-4.0-fast-generate-001"`
   * - `"imagen-3.0-generate-002"`
   */
  model?:
    | 'imagen-4.0-generate-001'
    | 'imagen-4.0-ultra-generate-001'
    | 'imagen-4.0-fast-generate-001'
    | 'imagen-3.0-generate-002'
    | string

  /**
   * 下载保存路径（含文件名）。若不提供，会在 `public/files` 生成随机文件名。
   */
  downloadPath?: string

  /**
   * 生成图片张数，1-4，默认 4。
   * JS SDK 对应字段：`config.numberOfImages`
   */
  numberOfImages?: number

  /**
   * 图片尺寸（仅 Standard/Ultra 支持）。可选：`"1K"` | `"2K"`。
   * JS SDK 对应字段：`config.sampleImageSize`
   */
  sampleImageSize?: '1K' | '2K'

  /**
   * 宽高比。可选：`"1:1"`、`"3:4"`、`"4:3"`、`"9:16"`、`"16:9"`。
   * JS SDK 对应字段：`config.aspectRatio`
   */
  aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'

  /**
   * 人像生成策略。可选：`"dont_allow"`、`"allow_adult"`、`"allow_all"`。
   * 注意：EU/UK/CH/MENA 不允许 `"allow_all"`。
   * JS SDK 对应字段：`config.personGeneration`
   */
  personGeneration?: 'dont_allow' | 'allow_adult' | 'allow_all'

  /** 其他可选参数，直接透传到底层 SDK（前向兼容）。 */
  [k: string]: unknown
}

export interface imagenGenerateImagesResultType {
  /** 生成的图片文件句柄列表（Google GenAI SDK 返回对象）。 */
  files?: any[]
  /** 完整的响应对象（包含 generatedImages 等）。 */
  response?: any
}


