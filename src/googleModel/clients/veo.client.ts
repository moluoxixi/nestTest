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
   * @param {string} [options.model="veo-3.0-generate-preview"] - Veo 模型 ID
   * @param {number} [options.pollIntervalMs=10000] - 轮询间隔（毫秒）
   * @param {('720p'|'1080p')} [options.resolution='1080p'] - 输出分辨率
   * @param {string} [options.downloadPath] - 本地下载保存路径
   * @param {('dont_allow'|'allow_adult')} [options.personGeneration] - 人像生成策略
   * @param {number} [options.durationSeconds] - 视频时长（秒）
   * @param {('16:9'|'9:16'|string)} [options.aspectRatio] - 纵横比
   * @returns {Promise<veoGenerateVideosResultType>} 返回文件句柄与完整响应
   */
  async veoGenerateVideos(options: veoGenerateVideosParamsType = {}): Promise<veoGenerateVideosResultType> {
    const {
      prompt = '',
      model = 'veo-3.0-generate-preview',
      resolution = '1080p',
      pollIntervalMs = 10000,
      downloadPath,
      personGeneration,
      aspectRatio = '16:9',
      ...rest
    } = options

    // 调用 SDK，传入 prompt 与 images（如支持），并透传扩展参数
    let operation = await this.ai.models.generateVideos({
      model,
      prompt,
      resolution,
      config: {
        personGeneration,
        aspectRatio,
        ...rest,
      },
    })

    while (!operation.done) {
      await this.sleep(pollIntervalMs)
      operation = await this.ai.operations.getVideosOperation({ operation })
    }

    const videoFile = operation.response?.generatedVideos?.[0]?.video
    if (!videoFile)
      throw new Error(operation)

    const defaultDir = resolve(process.cwd(), 'public', 'files')
    const randomName = `video_${Date.now()}_${Math.random().toString(36).slice(2, 10)}.mp4`
    const finalDownloadPath = downloadPath || resolve(defaultDir, randomName)

    await mkdir(dirname(finalDownloadPath), { recursive: true })
    await this.ai.files.download({ file: videoFile, downloadPath: finalDownloadPath })

    return { file: videoFile, response: operation.response }
  }
}

export default Veo
