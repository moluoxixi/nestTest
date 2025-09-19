import { GoogleGenAI } from '@google/genai'
import type { lyriaGenerateMusicParamsType, lyriaGenerateMusicResultType } from '../types/lyria'

export class Lyria {
  protected ai: any

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey })
  }

  /**
   * lyriaGenerateMusic → 对应接口：/lyria/generateMusic
   */
  async lyriaGenerateMusic(_options: lyriaGenerateMusicParamsType = {}): Promise<lyriaGenerateMusicResultType> {
    throw new Error('Lyria music generation via JS SDK is not supported yet in this project.')
  }
}

export default Lyria


