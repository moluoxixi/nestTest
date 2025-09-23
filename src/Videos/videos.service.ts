import { Injectable } from '@nestjs/common'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import ffmpegPath from 'ffmpeg-static'
import { spawn } from 'node:child_process'
import type { videosExtractFramesParamsType, videosExtractFramesResultType } from './_types/videos'

@Injectable()
export class VideosService {
  private run(cmd: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const p = spawn(cmd, args, { stdio: 'inherit' })
      p.on('error', reject)
      p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited with code ${code}`))))
    })
  }

  /**
   * 提取视频第一帧与最后一帧（使用 ffmpeg-static）
   * @param options - 参数对象
   * @param options.input - 视频 URL 或本地路径
   * @param options.firstName - 第一帧输出文件名（相对 public/files）
   * @param options.lastName - 最后一帧输出文件名（相对 public/files）
   * @param options.lastOffsetMs - 距结束回退毫秒，默认 100
   */
  async extractFrames(options: videosExtractFramesParamsType): Promise<videosExtractFramesResultType> {
    const { input, firstName, lastName, lastOffsetMs = 100 } = options || {}
    if (!input)
      throw new Error('extractFrames: input required')

    const filesRoot = join(process.cwd(), 'public', 'files')
    const firstAbs = join(filesRoot, firstName || `video_first_${Date.now()}.jpg`)
    const lastAbs = join(filesRoot, lastName || `video_last_${Date.now()}.jpg`)
    await mkdir(dirname(firstAbs), { recursive: true })

    // 若为 URL，则下载到临时文件
    let inputPath = input
    if (/^https?:\/\//i.test(input)) {
      const res = await fetch(input)
      if (!res.ok)
        throw new Error(`download video failed: ${res.status} ${res.statusText}`)
      const buf = Buffer.from(await res.arrayBuffer())
      const tmpPath = join(filesRoot, `video_tmp_${Date.now()}.mp4`)
      await writeFile(tmpPath, buf)
      inputPath = tmpPath
    }

    const ffmpeg = String(ffmpegPath)
    // 第一帧
    await this.run(ffmpeg, ['-y', '-i', inputPath, '-frames:v', '1', '-q:v', '2', firstAbs])
    // 最后一帧
    await this.run(ffmpeg, ['-y', '-sseof', `-${(lastOffsetMs / 1000).toFixed(3)}`, '-i', inputPath, '-frames:v', '1', '-q:v', '2', lastAbs])

    return { firstAbs, lastAbs }
  }
} 