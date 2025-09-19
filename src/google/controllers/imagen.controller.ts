import { Body, Controller, Post } from '@nestjs/common'
import type { GoogleService } from '../google.service'

@Controller('imagen')
export class ImagenController {
  constructor(private readonly google: GoogleService) {}

  @Post('generateImages')
  async generateImages(@Body() body: { apiKey: string, prompt?: string, model?: string }) {
    const basePath = this.google.buildDownloadPath('image', 'png')
    const baseWithoutExt = basePath.replace(/\.(png|jpg|jpeg|webp)$/i, '')
    const client = this.google.getClient(body.apiKey)
    const res = await client.imagenGenerateImages({
      prompt: body?.prompt,
      model: body?.model,
      downloadPath: `${baseWithoutExt}.png`,
    })
    const downPaths: string[] = []
    downPaths.push(`/files/${baseWithoutExt.split('files').pop()?.replace(/^[\\/]/, '')}.png`.replace(/\\/g, '/'))
    return { downPaths }
  }
}
