import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express'
import { GoogleModelService } from '../googleModel.service'

@Controller('googleModel/veo')
export class VeoController {
  constructor(private readonly google: GoogleModelService) {}

  @Get('hello/:name')
  getHelloName(@Param('name') name: string): string {
    return `Hello ${name}!`
  }

  /**
   * 生成视频（Veo 3 / Veo 3 Fast / Veo 2）
   * 文档参考：`https://ai.google.dev/gemini-api/docs/video?hl=zh-cn&example=dialogue#veo-model-parameters`
   *
   * @param req
   * @param {object} body - 请求体参数
   * @param {string} body.apiKey - Gemini API Key
   * @param {string} body.prompt - 文本提示
   * @param {string} [body.model] - 模型 ID，默认 `veo-3.0-generate-001`
   * @param {number} [body.pollIntervalMs] - 轮询间隔（毫秒），默认 10000
   * @param {('dont_allow'|'allow_adult')} [body.personGeneration] - 人像生成策略（地区限制）
   * @param {number} [body.durationSeconds] - 视频时长（秒）
   * @param {('720p'|'1080p'|string)} [body.resolution] - 分辨率
   * @param {('16:9'|'9:16'|string)} [body.aspectRatio] - 纵横比
   * @param {('auto'|'none'|string)} [body.soundtrack] - 音轨策略
   */
  @Post('generateVideos')
  async generateVideos(
    @Req() req: Request,
    @Body() body: {
      apiKey: string
      prompt: string
      model?: string
      pollIntervalMs?: number
      personGeneration?: 'dont_allow' | 'allow_adult'
      durationSeconds?: number
      resolution?: '720p' | '1080p' | string
      aspectRatio?: '16:9' | '9:16' | string
      soundtrack?: 'auto' | 'none' | string
      [k: string]: unknown
    },
  ) {
    const downloadPath = this.google.buildDownloadPath('video', 'mp4')
    const client = this.google.getClient(body.apiKey)
    const { model = 'veo-3.0-generate-001', prompt, pollIntervalMs, ...rest } = body || {}
    const res = await client.veoGenerateVideos({
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
    return {
      downPath,
      file: res.file,
    }
  }
}
