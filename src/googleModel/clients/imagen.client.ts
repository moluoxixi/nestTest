import { GoogleGenAI } from '@google/genai'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { imagenGenerateImagesParamsType, imagenGenerateImagesResultType } from '@/googleModel/types/imagen'

export class Imagen {
  protected ai: any

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey })
  }

  /**
   * imagenGenerateImages → 对应接口：/imagen/generateImages
   * 参考：`https://ai.google.dev/gemini-api/docs/imagen?hl=zh-cn#imagen-configuration`
   *
   * @param options - 参数对象
   * @param options.prompt - 文本提示
   * @param options.model - 模型 ID（默认为 imagen-3.0-generate-002 或 4.x）
   * @param options.downloadPath - 下载保存路径（单图或作为多图前缀）
   * @param options.numberOfImages - 生成张数（1-4）
   * @param options.sampleImageSize - 图片尺寸（Standard/Ultra）
   * @param options.aspectRatio - 宽高比
   * @param options.personGeneration - 人像生成策略
   * @returns 图片文件句柄与完整响应
   */
  async imagenGenerateImages(options: imagenGenerateImagesParamsType = {}): Promise<imagenGenerateImagesResultType> {
    const {
      prompt,
      model = 'imagen-3.0-generate-002',
      downloadPath,
      numberOfImages,
      sampleImageSize,
      aspectRatio,
      personGeneration,
      ...rest
    } = options
    const res = await this.ai.models.generateImages({
      model,
      prompt,
      config: {
        numberOfImages,
        sampleImageSize,
        aspectRatio,
        personGeneration,
      },
      ...rest,
    })

    // 注意：SDK 返回对象里，图片位于 response.generatedImages[].image（含 imageBytes 或文件句柄 name）
    const generated = res?.response?.generatedImages || res?.generatedImages || []
    const files = generated.map((g: any) => g?.image).filter(Boolean)
    if (files.length === 0)
      throw new Error('No generated images returned')

    // 保存到 dist/googleModel/files
    const defaultDir = resolve(process.cwd(), 'public', 'files')
    await mkdir(defaultDir, { recursive: true })

    // 保存策略：始终使用 imageBytes（base64）写盘
    const getExtByMime = (mime: string | undefined) => {
      if (!mime) return '.png'
      if (/png/i.test(mime)) return '.png'
      if (/jpe?g/i.test(mime)) return '.jpg'
      if (/webp/i.test(mime)) return '.webp'
      return '.png'
    }

    const hasKnownExt = (p: string) => /\.(png|jpg|jpeg|webp)$/i.test(p)

    const getTargetPath = (index: number, mime: string | undefined) => {
      const ext = getExtByMime(mime)
      if (downloadPath) {
        const base = downloadPath
        if (files.length === 1) {
          return hasKnownExt(base) ? base : `${base}${ext}`
        }
        if (hasKnownExt(base))
          return base.replace(/(\.[a-z0-9]+)$/i, `${index === 0 ? '' : `_${index}`}$1`)
        return `${base}${index === 0 ? '' : `_${index}`}${ext}`
      }
      const randomName = `image_${Date.now()}_${Math.random().toString(36).slice(2, 10)}_${index}${ext}`
      return resolve(defaultDir, randomName)
    }

    for (let i = 0; i < files.length; i++) {
      const img = files[i] as any
      const imageBytes = img?.imageByte
      const mimeType = img?.mimeType
      if (!imageBytes || typeof imageBytes !== 'string')
        throw new Error('Image object missing imageBytes')
      const target = getTargetPath(i, mimeType)
      await mkdir(dirname(target), { recursive: true })
      const buffer = Buffer.from(imageBytes, 'base64')
      await writeFile(target, buffer)
    }

    return { files, response: res?.response ?? res }
  }
}

export default Imagen
