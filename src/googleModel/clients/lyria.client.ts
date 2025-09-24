import { GoogleGenAI } from '@google/genai'
import { Buffer } from 'node:buffer'
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { createWriteStream } from 'node:fs'
import { lyriaGenerateMusicParamsType, lyriaGenerateMusicResultType } from '@/googleModel/types/lyria'

export class Lyria {
  protected ai: any

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey })
  }

  /**
   * lyriaGenerateMusic → 对应接口：/lyria/generateMusic
   * 参考：`https://ai.google.dev/gemini-api/docs/music-generation?hl=zh-cn#generate-music`
   *
   * @param {lyriaGenerateMusicParamsType} options - 参数对象
   * @returns {Promise<lyriaGenerateMusicResultType>} 生成的文件信息、底层响应或下载路径（实现后）
   */
  async lyriaGenerateMusic(options: lyriaGenerateMusicParamsType = {}): Promise<lyriaGenerateMusicResultType> {
    const {
      prompt,
      weightedPrompts,
      model = 'models/lyria-realtime-exp',
      downloadPath,
      config,
      durationSeconds,
      ...rest
    } = options

    const defaultDir = resolve(process.cwd(), 'public', 'files')
    const randomName = `audio_${Date.now()}_${Math.random().toString(36).slice(2, 10)}.wav`
    const finalDownloadPath = downloadPath || resolve(defaultDir, randomName)
    await mkdir(dirname(finalDownloadPath), { recursive: true })

    const writeStream = createWriteStream(finalDownloadPath)

    let session: any
    try {
      // 建立实时音乐会话（实验性）
      // 参考文档： https://ai.google.dev/gemini-api/docs/music-generation?hl=zh-cn#generate-music
      session = await (this.ai as any).live?.music?.connect?.({ model, ...rest })
      if (!session)
        throw new Error('Live Music API 不可用：请确认 @google/genai 版本是否支持 live.music.connect')

      // 组装 WeightedPrompts
      const prompts = Array.isArray(weightedPrompts) && weightedPrompts.length > 0
        ? weightedPrompts
        : (prompt ? [{ text: prompt, weight: 1.0 }] : [])
      if (prompts.length > 0 && typeof session.setWeightedPrompts === 'function')
        await session.setWeightedPrompts({ prompts })

      // 设置音乐生成配置
      if (config && typeof session.setMusicGenerationConfig === 'function')
        await session.setMusicGenerationConfig({ config })

      // 开始生成（播放）
      if (typeof session.play === 'function')
        await session.play()

      const startedAt = Date.now()

      // 接收音频块并持续写入文件
      if (typeof session.receive === 'function') {
        // for await 支持（依赖 SDK 实现 AsyncIterable）
        for await (const message of session.receive()) {
          const serverContent = (message && (message.serverContent || message.server_content)) || {}
          const audioChunks = serverContent.audioChunks || serverContent.audio_chunks || []
          if (Array.isArray(audioChunks)) {
            for (const chunk of audioChunks) {
              const data = chunk?.data || chunk?.inlineData?.data
              if (!data)
                continue
              if (typeof data === 'string') {
                writeStream.write(Buffer.from(data, 'base64'))
              }
              else if (data instanceof Uint8Array) {
                writeStream.write(Buffer.from(data))
              }
            }
          }

          if (typeof durationSeconds === 'number' && durationSeconds > 0) {
            const elapsed = (Date.now() - startedAt) / 1000
            if (elapsed >= durationSeconds) {
              if (typeof session.stop === 'function')
                await session.stop()
              break
            }
          }
        }
      }

      return { downloadPath: finalDownloadPath }
    }
    finally {
      try {
        if (session?.close)
          await session.close()
        else if (session?.disconnect)
          await session.disconnect()
      }
      catch (_e) {
        // ignore close errors
      }
      await new Promise<void>(resolveDone => writeStream.end(resolveDone))
    }
  }
}

export default Lyria
