import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express'
import { GoogleService } from '../google.service'

@Controller('veo')
export class VeoController {
  constructor(private readonly google: GoogleService) {}

  @Get('hello/:name')
  getHelloName(@Param('name') name: string): string {
    return `Hello ${name}!`
  }

  @Post('generateVideos')
  async generateVideos(@Req() req: Request, @Body() body: { apiKey: string, prompt: string, model?: string, pollIntervalMs?: number }) {
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
