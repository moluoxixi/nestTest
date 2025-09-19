import { GoogleGenAI } from '@google/genai'
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { veoGenerateVideosParamsType, veoGenerateVideosResultType } from '../types/veo'

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
   */
  async veoGenerateVideos(options: veoGenerateVideosParamsType = {}): Promise<veoGenerateVideosResultType> {
    const { prompt = '', model = 'veo-3.0-generate-001', pollIntervalMs = 10000, downloadPath } = options

    let operation = await this.ai.models.generateVideos({ model, prompt })

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


