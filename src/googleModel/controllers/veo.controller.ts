import { Body, Controller, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { GoogleModelService } from '../googleModel.service'
import { VideosService } from '../../Videos/videos.service'
import { writeFile } from 'node:fs/promises'
import { veoTestWriteParamsType, veoTestWriteResultType } from '../types/veo'

@Controller('googleModel/veo')
export class VeoController {
  constructor(private readonly google: GoogleModelService, private readonly videos: VideosService) {}

  /**
   * 生成视频（Veo 3 / Veo 3 Fast / Veo 2）
   * 文档参考：`https://ai.google.dev/gemini-api/docs/video?hl=zh-cn&example=dialogue#veo-model-parameters`
   *
   * @param req
   * @param {object} body - 请求体参数
   * @param {string} body.apiKey - Gemini API Key
   * @param {string} body.prompt - 文本提示
   * @param {string} [body.model] - 模型 ID，默认 `veo-3.0-generate-preview`
   * @param {number} [body.pollIntervalMs] - 轮询间隔（毫秒），默认 10000
   * @param {('dont_allow'|'allow_adult')} [body.personGeneration] - 人像生成策略（地区限制）
   * @param {('720p'|'1080p')} [body.resolution='1080p'] - 输出分辨率
   * @param {string} [body.imageUrl] - 参考图像地址（http/https 或 base64），转换后以 image 传入
   * @param {('16:9'|'9:16'|string)} [body.aspectRatio] - 纵横比
   */
  @Post('generateVideos')
  async generateVideos(
    @Req() req: Request,
    @Body() body: {
      apiKey: string
      prompt: string
      model?: string
      pollIntervalMs?: number
      resolution?: '720p' | '1080p'
      imageUrl?: string
      personGeneration?: 'dont_allow' | 'allow_adult'
      aspectRatio?: '16:9' | '9:16' | string
      [k: string]: unknown
    },
  ) {
    try {
      const downloadPath = this.google.buildDownloadPath('video', 'mp4')
      const client = this.google.getClient(body.apiKey)
      const { model = 'veo-3.0-generate-preview', prompt, pollIntervalMs, ...rest } = body || {}
      const result = await client.veoGenerateVideos({
        prompt,
        model,
        pollIntervalMs,
        downloadPath,
        ...rest,
      })
      // 生成首尾帧图片（调用独立 VideosService，直接获得相对 URL）
      const base = downloadPath.replace(/\.(mp4|mov|mkv)$/i, '')
      const firstPic = `${base}_first.jpg`
      const lastPic = `${base}_last.jpg`
      const { firstAbs, lastAbs } = await this.videos.extractFrames({
        input: downloadPath,
        firstName: firstPic.replace(/\\/g, '/').split('/').pop(),
        lastName: lastPic.replace(/\\/g, '/').split('/').pop(),
        lastOffsetMs: 100,
      })

      const filename = downloadPath.replace(/\\/g, '/').split('/').pop()
      const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http'
      const host = (req.headers['x-forwarded-host'] as string) || req.get('host')
      const downPath = host ? `${proto}://${host}/files/${filename}` : `/files/${filename}`
      const toRel = (abs: string) => `/files/${abs.replace(/\\/g, '/').split('/').pop()}`
      const firstRelUrl = toRel(firstAbs)
      const lastRelUrl = toRel(lastAbs)
      const firstAbsUrl = host ? `${proto}://${host}${firstRelUrl}` : firstRelUrl
      const lastAbsUrl = host ? `${proto}://${host}${lastRelUrl}` : lastRelUrl
      const downPaths: string[] = [downPath]
      return { downPaths, firstFrame: firstAbsUrl, lastFrame: lastAbsUrl, response: result }
    }
    catch (e: any) {
      return { downPaths: [], response: undefined, error: (e?.message ?? e) }
    }
  }

  /**
   * 测试接口：在 `public/files` 写入一个文本文件
   * - 目的：验证容器/进程的输出是否落盘到静态目录，并可被静态资源模块正确访问
   * - 路径：POST /googleModel/veo/testWrite
   */
  @Post('testWrite')
  async testWrite(
    @Req() req: Request,
    @Body() body: veoTestWriteParamsType = {},
  ): Promise<veoTestWriteResultType> {
    const { prefix = 'video', ext = 'txt', content = 'ok' } = body
    const filePath = this.google.buildDownloadPath(prefix, ext)
    await writeFile(filePath, String(content ?? ''))
    const filename = filePath.replace(/\\/g, '/').split('/').pop() as string
    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http'
    const host = (req.headers['x-forwarded-host'] as string) || req.get('host')
    const downPath = host ? `${proto}://${host}/files/${filename}` : `/files/${filename}`
    return { absPath: filePath, downPath }
  }
}
