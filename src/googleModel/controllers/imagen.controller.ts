import { Body, Controller, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { GoogleModelService } from '../googleModel.service'

@Controller('googleModel/imagen')
export class ImagenController {
  constructor(private readonly google: GoogleModelService) {}

  @Post('generateImages')
  async generateImages(@Req() req: Request, @Body() body: { apiKey: string, prompt?: string, model?: string }) {
    const basePath = this.google.buildDownloadPath('image', 'png')
    const baseWithoutExt = basePath.replace(/\.(png|jpg|jpeg|webp)$/i, '')
    const client = this.google.getClient(body.apiKey)
    const res = await client.imagenGenerateImages({
      prompt: body?.prompt,
      model: body?.model,
      downloadPath: `${baseWithoutExt}.png`,
    })
    const relative = `/files/${baseWithoutExt.split('files').pop()?.replace(/^[\\/]/, '')}.png`.replace(/\\/g, '/')
    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http'
    const host = (req.headers['x-forwarded-host'] as string) || req.get('host')
    const absolute = host ? `${proto}://${host}${relative}` : relative
    const downPaths: string[] = [absolute]
    return { downPaths }
  }
}
