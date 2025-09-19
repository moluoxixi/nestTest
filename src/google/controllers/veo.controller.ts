import { Body, Controller, Post } from '@nestjs/common'
import type { GoogleService } from '../google.service'

@Controller('veo')
export class VeoController {
  constructor(private readonly google: GoogleService) {}

  @Post('generateVideos')
  async generateVideos(@Body() body: { apiKey: string, prompt?: string, model?: string, pollIntervalMs?: number }) {
    const downloadPath = this.google.buildDownloadPath('video', 'mp4')
    const client = this.google.getClient(body.apiKey)
    const res = await client.veoGenerateVideos({
      prompt: body?.prompt || '',
      model: body?.model,
      pollIntervalMs: body?.pollIntervalMs,
      downloadPath,
    })
    const filename = downloadPath.replace(/\\/g, '/').split('/').pop()
    return {
      downPath: `/files/${filename}`,
      file: res.file,
    }
  }
}
