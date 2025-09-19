import { Body, Controller, Post } from '@nestjs/common'
import type { GoogleService } from './google.service'

@Controller('imagen')
export class ImagenController {
  constructor(private readonly google: GoogleService) {}

  @Post('generateImages')
  async generateImages(@Body() body: { prompt?: string, model?: string }) {
    const basePath = this.google.buildDownloadPath('image', 'png')
    const baseWithoutExt = basePath.replace(/\.(png|jpg|jpeg|webp)$/i, '')
    const res = await this.google.client.imagenGenerateImages({
      prompt: body?.prompt,
      model: body?.model,
      downloadPath: `${baseWithoutExt}.png`,
    })
    // 根据实现，可能会生成多图，拼接索引后缀 _1, _2 ...
    const downPaths: string[] = []
    // 推断保存的文件名集合（最少包含 baseWithoutExt.png）
    downPaths.push(`/files/${baseWithoutExt.split('files').pop()?.replace(/^[\\/]/, '')}.png`.replace(/\\/g, '/'))
    return { downPaths }
  }
}
