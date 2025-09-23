import { GoogleGenAI } from '@google/genai'
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { veoGenerateVideosParamsType, veoGenerateVideosResultType } from '../types/veo'

export class Veo {
  protected ai: any

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey })
  }

  private sleep(ms: number = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * veoGenerateVideos → 对应接口：/veo/generateVideos
   * 参考：`https://ai.google.dev/gemini-api/docs/video?hl=zh-cn&example=dialogue#veo-model-parameters`
   *
   * @param {veoGenerateVideosParamsType} options - 参数对象
   * @param {string} [options.prompt] - 文本提示，描述生成内容
   * @param {string} [options.model="veo-3.0-generate-001"] - Veo 模型 ID
   * @param {number} [options.pollIntervalMs=10000] - 轮询间隔（毫秒）
   * @param {string} [options.downloadPath] - 本地下载保存路径
   * @param {('dont_allow'|'allow_adult')} [options.personGeneration] - 人像生成策略
   * @param {number} [options.durationSeconds] - 视频时长（秒）
   * @param {('720p'|'1080p'|string)} [options.resolution] - 分辨率
   * @param {('16:9'|'9:16'|string)} [options.aspectRatio] - 纵横比
   * @param {('auto'|'none'|string)} [options.soundtrack] - 音轨策略
   * @returns {Promise<veoGenerateVideosResultType>} 返回文件句柄与完整响应
   */
  async veoGenerateVideos(options: veoGenerateVideosParamsType = {}): Promise<veoGenerateVideosResultType> {
    const {
      prompt = '',
      model = 'veo-3.0-generate-001',
      pollIntervalMs = 10000,
      downloadPath,
      personGeneration,
      durationSeconds,
      resolution,
      aspectRatio,
      soundtrack,
      imageUrls,
      imageBase64,
      imageMimeType = 'image/png',
      ...rest
    } = options

    // 预处理图片输入：将 URL 和 Base64 上传为 file 引用
    const files: any[] = []
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      for (const url of imageUrls) {
        // 使用 Files.upload 以 URL 形式上传/引用（SDK 支持 URL 或需先 fetch，再上传；这里直接透传 URL）
        files.push({ uri: url })
      }
    }
    if (Array.isArray(imageBase64) && imageBase64.length > 0) {
      for (const b64 of imageBase64) {
        const isDataUrl = /^data:/i.test(b64)
        const upload = isDataUrl
          ? { dataUrl: b64 }
          : { inlineData: { data: b64, mimeType: imageMimeType || 'image/png' } }
        files.push(upload)
      }
    }

    // 调用 SDK，传入 prompt 与 images（如支持），并透传扩展参数
    let operation = await this.ai.models.generateVideos({
      model,
      prompt,
      images: files.length ? files : undefined,
      personGeneration,
      durationSeconds,
      resolution,
      aspectRatio,
      soundtrack,
      ...rest,
    })

    while (!operation.done) {
      await this.sleep(pollIntervalMs)
      operation = await this.ai.operations.getVideosOperation({ operation })
    }

    const videoFile = operation.response?.generatedVideos?.[0]?.video
    if (!videoFile)
      throw new Error('No generated video file returned')

    const defaultDir = resolve(process.cwd(), 'public', 'files')
    const randomName = `video_${Date.now()}_${Math.random().toString(36).slice(2, 10)}.mp4`
    const finalDownloadPath = downloadPath || resolve(defaultDir, randomName)

    await mkdir(dirname(finalDownloadPath), { recursive: true })
    await this.ai.files.download({ file: videoFile, downloadPath: finalDownloadPath })

    return { file: videoFile, response: operation.response }
  }
}

export default Veo
