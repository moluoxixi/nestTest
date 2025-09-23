import { GoogleGenAI } from '@google/genai'
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { imagenGenerateImagesParamsType, imagenGenerateImagesResultType } from '../types/imagen'

export class Imagen {
  protected ai: any

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey })
  }

  /**
   * imagenGenerateImages → 对应接口：/imagen/generateImages
   * 参考：`https://ai.google.dev/gemini-api/docs/imagen?hl=zh-cn#imagen-configuration`
   *
   * @param {imagenGenerateImagesParamsType} options - 参数对象
   * @param {string} [options.prompt] - 文本提示
   * @param {string} [options.model] - 模型 ID（默认为 imagen-3.0-generate-002 或 4.x）
   * @param {string} [options.downloadPath] - 下载保存路径（单图或作为多图前缀）
   * @param {number} [options.numberOfImages] - 生成张数（1-4）
   * @param {('1K'|'2K')} [options.sampleImageSize] - 图片尺寸（Standard/Ultra）
   * @param {('1:1'|'3:4'|'4:3'|'9:16'|'16:9')} [options.aspectRatio] - 宽高比
   * @param {('dont_allow'|'allow_adult'|'allow_all')} [options.personGeneration] - 人像生成策略
   * @returns {Promise<imagenGenerateImagesResultType>} 图片文件句柄与完整响应
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

    const files = res.response?.generatedImages?.map((g: any) => g.image) || []
    if (files.length === 0)
      throw new Error('No generated images returned')

    // 保存到 dist/googleModel/files
    const defaultDir = resolve(process.cwd(), 'public', 'files')
    await mkdir(defaultDir, { recursive: true })

    if (downloadPath) {
      if (files.length === 1) {
        await this.ai.files.download({ file: files[0], downloadPath })
      }
      else {
        const base = downloadPath
        for (let i = 0; i < files.length; i++) {
          const suffix = i === 0 ? '' : `_${i}`
          const path = base.endsWith('.png') || base.endsWith('.jpg') || base.endsWith('.jpeg') || base.endsWith('.webp')
            ? base.replace(/(\.[a-z0-9]+)$/i, `${suffix}$1`)
            : `${base}${suffix}.png`
          await mkdir(dirname(path), { recursive: true })
          await this.ai.files.download({ file: files[i], downloadPath: path })
        }
      }
    }
    else {
      for (let i = 0; i < files.length; i++) {
        const randomName = `image_${Date.now()}_${Math.random().toString(36).slice(2, 10)}_${i}.png`
        const path = resolve(defaultDir, randomName)
        await mkdir(dirname(path), { recursive: true })
        await this.ai.files.download({ file: files[i], downloadPath: path })
      }
    }

    return { files, response: res.response }
  }
}

export default Imagen
