import { GoogleGenAI } from '@google/genai'
import { Buffer } from 'node:buffer'
import { mkdir, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { veoGenerateVideosParamsType, veoGenerateVideosResultType } from '@/googleModel/types/veo'

export class Veo {
  protected ai: any

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey })
  }

  private sleep(ms: number = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 等待文件写入完成：检测文件大小在短时间内保持稳定
   * - 至少两次采样大小相同即认为稳定
   * - 最长等待约 4s（20*200ms）
   * @param filePath - 目标文件绝对路径
   */
  private async waitForFileReady(filePath: string): Promise<void> {
    let lastSize = -1
    let stableCount = 0
    for (let i = 0; i < 20; i++) {
      try {
        const s = await stat(filePath)
        if (!s.isFile() || s.size <= 0)
          throw new Error('not a non-empty file')
        if (s.size === lastSize) {
          stableCount++
          if (stableCount >= 1) return
        }
        else {
          stableCount = 0
          lastSize = s.size
        }
      }
      catch {}
      await this.sleep(200)
    }
    const fin = await stat(filePath)
    if (!fin.isFile() || fin.size <= 0)
      throw new Error('file not ready: empty or not a file')
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
   * @param {string} [options.imageUrl] - 参考图像地址（http/https 或 base64），将作为 image 传入
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
      imageUrl,
      ...rest
    } = options

    // 将 imageUrl 处理为 { imageBytes, mimeType }
    let image: any | undefined
    if (imageUrl && typeof imageUrl === 'string') {
      const dataUrlMatch = imageUrl.match(/^data:(.*?);base64,(.*)$/i)
      if (dataUrlMatch) {
        const mime = dataUrlMatch[1] || 'image/png'
        const base64 = dataUrlMatch[2]
        image = { imageBytes: base64, mimeType: mime }
      }
      else if (/^https?:\/\//i.test(imageUrl)) {
        const res = await fetch(imageUrl)
        const mime = res.headers.get('content-type') || 'image/png'
        const arrBuf = await res.arrayBuffer()
        const base64 = Buffer.from(arrBuf).toString('base64')
        image = { imageBytes: base64, mimeType: mime }
      }
      else {
        // 纯 base64（可能不带 data: 前缀）
        image = { imageBytes: imageUrl, mimeType: 'image/png' }
      }
    }

    // 调用 SDK，传入 prompt 与 image（如有），并透传扩展参数
    let operation = await this.ai.models.generateVideos({
      model,
      prompt,
      resolution,
      image,
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
    await this.waitForFileReady(finalDownloadPath)

    return { file: videoFile, response: operation.response }
  }
}

export default Veo
