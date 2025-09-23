import { Body, Controller, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { GoogleModelService } from '../googleModel.service'
import type { lyriaMusicGenerationConfigType } from '../types/lyria'

@Controller('googleModel/lyria')
export class LyriaController {
  constructor(private readonly google: GoogleModelService) {}

  /**
   * 使用 Lyria 生成音乐（实验性）。
   * 参考：`https://ai.google.dev/gemini-api/docs/music-generation?hl=zh-cn`
   *
   * @param req
   * @param {object} body - 请求体
   * @param {string} body.apiKey - Gemini API Key
   * @param {string} [body.prompt] - 简单文本提示
   * @param {{text:string,weight?:number}[]} [body.weightedPrompts] - 加权提示数组
   * @param {string} [body.model] - 模型（如 models/lyria-realtime-exp）
   * @param {number} [body.pollIntervalMs] - 轮询/等待间隔（如采用轮询）
   * @param {object} [body.config] - 音乐生成配置（guidance、bpm、density、brightness、scale、mute_bass、mute_drums、only_bass_and_drums、music_generation_mode、temperature、top_k、seed）
   */
  @Post('generateMusic')
  async generateMusic(
    @Req() req: Request,
    @Body() body: {
      apiKey: string
      prompt?: string
      weightedPrompts?: { text: string, weight?: number }[]
      model?: string
      pollIntervalMs?: number
      config?: lyriaMusicGenerationConfigType
      [k: string]: unknown
    },
  ) {
    const downloadPath = this.google.buildDownloadPath('audio', 'wav')
    const client = this.google.getClient(body.apiKey)
    try {
      const { model = 'models/lyria-realtime-exp', prompt, pollIntervalMs, ...rest } = body || {}
      const result = await client.lyriaGenerateMusic({
        prompt,
        model,
        pollIntervalMs,
        downloadPath,
        ...rest,
      })
      const filename = downloadPath.replace(/\\/g, '/').split('/').pop()
      const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http'
      const host = (req.headers['x-forwarded-host'] as string) || req.get('host')
      const downPath = host ? `${proto}://${host}/files/${filename}` : `/files/${filename}`
      const downPaths: string[] = [downPath]
      return { downPaths }
    }
    catch (e: any) {
      // 先返回占位 downPaths，同时反馈说明
      const filename = downloadPath.replace(/\\/g, '/').split('/').pop()
      const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http'
      const host = (req.headers['x-forwarded-host'] as string) || req.get('host')
      const downPath = host ? `${proto}://${host}/files/${filename}` : `/files/${filename}`
      const message = e?.message || 'Lyria music generation is not implemented in client.'
      return { downPaths: [downPath], response: undefined, error: (e?.message ?? e) }
    }
  }
}
