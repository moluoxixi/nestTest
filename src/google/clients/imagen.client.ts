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
   */
  async imagenGenerateImages(options: imagenGenerateImagesParamsType = {}): Promise<imagenGenerateImagesResultType> {
    const { prompt, model = 'imagen-3.0-generate-001', downloadPath } = options
    const res = await this.ai.models.generateImages({ model, prompt })

    const files = res.response?.generatedImages?.map((g: any) => g.image) || []
    if (files.length === 0)
      throw new Error('No generated images returned')

    // 保存到 dist/google/files
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
