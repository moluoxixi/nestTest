import { Body, Controller, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { VideosService } from './videos.service'
import type { videosExtractFramesParamsType } from './_types/videos'

@Controller('videos')
export class VideosController {
  constructor(private readonly videos: VideosService) {}

  /**
   * 提取首尾帧：POST /videos/extractFrames
   * @param req
   * @param body - 请求体
   * @param body.input - 视频 URL 或本地路径
   * @param body.firstName - 第一帧输出文件名（相对 public/files）
   * @param body.lastName - 最后一帧输出文件名（相对 public/files）
   * @param body.lastOffsetMs - 距结束回退毫秒，默认 100
   */
  @Post('extractFrames')
  async extractFrames(@Req() req: Request, @Body() body: videosExtractFramesParamsType) {
    try {
      const { firstAbs, lastAbs } = await this.videos.extractFrames(body)
      const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http'
      const host = (req.headers['x-forwarded-host'] as string) || req.get('host')
      const toUrl = (abs: string) => {
        const filename = abs.replace(/\\/g, '/').split('/').pop() as string
        return host ? `${proto}://${host}/files/${filename}` : `/files/${filename}`
      }
      return { firstFrame: toUrl(firstAbs), lastFrame: toUrl(lastAbs) }
    }
    catch (e: any) {
      return { error: (e?.message ?? e) }
    }
  }
} 