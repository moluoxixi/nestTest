import { Body, Controller, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { GoogleModelService } from '../googleModel.service'

@Controller('googleModel/imagen')
export class ImagenController {
  constructor(private readonly google: GoogleModelService) {}

  /**
   * 使用 Imagen 生成图片
   * 参考：`https://ai.google.dev/gemini-api/docs/imagen?hl=zh-cn#imagen-configuration`
   *
   * @param req
   * @param {object} body - 请求体参数
   * @param {string} body.apiKey - Gemini API Key
   * @param {string} [body.prompt] - 文本提示
   * @param {string} [body.model] - 模型 ID
   * @param {number} [body.numberOfImages] - 生成张数（1-4）
   * @param {('1K'|'2K')} [body.sampleImageSize] - 图片尺寸（Standard/Ultra）
   * @param {('1:1'|'3:4'|'4:3'|'9:16'|'16:9')} [body.aspectRatio] - 宽高比
   * @param {('dont_allow'|'allow_adult'|'allow_all')} [body.personGeneration] - 人像策略
   */
  @Post('generateImages')
  async generateImages(
    @Req() req: Request,
    @Body() body: {
      apiKey: string
      prompt?: string
      model?: string
      numberOfImages?: number
      sampleImageSize?: '1K' | '2K'
      aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
      personGeneration?: 'dont_allow' | 'allow_adult' | 'allow_all'
      [k: string]: unknown
    },
  ) {
    try {
      const basePath = this.google.buildDownloadPath('image', 'png')
      const baseWithoutExt = basePath.replace(/\.(png|jpg|jpeg|webp)$/i, '')
      const client = this.google.getClient(body.apiKey)
      const { model, prompt, ...rest } = body || {}
      const result = await client.imagenGenerateImages({
        prompt,
        model,
        downloadPath: `${baseWithoutExt}.png`,
        ...rest,
      })
      const relative = `/files/${baseWithoutExt.split('files').pop()?.replace(/^[\\/]/, '')}.png`.replace(/\\/g, '/')
      const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http'
      const host = (req.headers['x-forwarded-host'] as string) || req.get('host')
      const absolute = host ? `${proto}://${host}${relative}` : relative
      const downPaths: string[] = [absolute]
      return { downPaths, response: result }
    }
    catch (e: any) {
      return { downPaths: [], response: undefined, error: (e?.message ?? e) }
    }
  }
}
