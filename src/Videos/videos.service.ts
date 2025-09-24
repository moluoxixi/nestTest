import { Injectable } from '@nestjs/common'
import { mkdir, writeFile, stat } from 'node:fs/promises'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import ffmpegPath from 'ffmpeg-static'
import { spawn } from 'node:child_process'
import type { videosExtractFramesParamsType, videosExtractFramesResultType } from './_types/videos'

@Injectable()
export class VideosService {
  // 写入完成等待逻辑已迁移至 Veo 客户端，提帧阶段不再重复等待
  /**
   * 运行外部命令（捕获 stderr 便于排错）
   * @param cmd - 可执行程序路径
   * @param args - 参数数组
   */
  private run(cmd: string = '', args: string[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
      let stderr = ''
      let stdout = ''
      child.stdout?.on('data', (d: Buffer) => { stdout += d.toString?.() || String(d) })
      child.stderr?.on('data', (d: Buffer) => { stderr += d.toString?.() || String(d) })
      child.on('error', (err) => reject(err))
      child.on('close', (code) => {
        if (code === 0) return resolve()
        const detail = stderr.trim() || stdout.trim() || `exit code ${code}`
        reject(new Error(`${cmd} exited with code ${code}: ${detail}`))
      })
    })
  }

  /**
   * 提取视频第一帧与最后一帧（使用 ffmpeg-static）
   * 支持输入：
   * - inputUrl: http/https URL（将下载到临时文件）
   * - inputUrl: 本地路径（绝对/相对，解析为绝对路径并校验）
   * @param options - 参数对象
   * @param options.firstName - 第一帧输出文件名（相对 public/files）
   * @param options.lastName - 最后一帧输出文件名（相对 public/files）
   * @param options.lastOffsetMs - 距结束回退毫秒，默认 100
   */
  async extractFrames(options: videosExtractFramesParamsType): Promise<videosExtractFramesResultType> {
    const { videoUrl, firstName, lastName, lastOffsetMs = 100 } = options || {}
    if (!videoUrl)
      throw new Error('extractFrames: videoUrl is required')

    const filesRoot = join(process.cwd(), 'public', 'files')
    const firstAbs = join(filesRoot, firstName || `video_first_${Date.now()}.jpg`)
    const lastAbs = join(filesRoot, lastName || `video_last_${Date.now()}.jpg`)
    await mkdir(dirname(firstAbs), { recursive: true })

    // 统一得到本地可用的 inputPath
    let inputPath = ''
    if (/^https?:\/\//i.test(videoUrl)) {
      const res = await fetch(videoUrl)
      if (!res.ok)
        throw new Error(`download video failed: ${res.status} ${res.statusText}`)
      const contentType = res.headers.get('content-type') || ''
      const buf = Buffer.from(await res.arrayBuffer())
      inputPath = join(filesRoot, `video_tmp_${Date.now()}.mp4`)
      await writeFile(inputPath, buf)
      if (buf.length === 0)
        throw new Error('downloaded video is empty (0 bytes)')
      if (!/video\//i.test(contentType) && buf.length < 1024)
        throw new Error(`unexpected content-type: ${contentType || 'unknown'}`)
    }
    else {
      // 视为本地路径（绝对或相对）
      const abs = isAbsolute(videoUrl) ? videoUrl : resolve(process.cwd(), videoUrl)
      try {
        const s = await stat(abs)
        if (!s.isFile())
          throw new Error('videoUrl path is not a regular file')
        if (s.size === 0)
          throw new Error('videoUrl file is empty (0 bytes)')
        inputPath = abs
      }
      catch (e: any) {
        throw new Error(`invalid videoUrl path: ${abs} (${e?.message || e})`)
      }
    }

    const ffmpeg = String(ffmpegPath)
    if (!ffmpeg)
      throw new Error('ffmpeg binary not found. Please ensure ffmpeg-static is installed correctly.')

    // 本地文件存在性与大小校验
    try {
      const s = await stat(inputPath)
      if (!s.isFile())
        throw new Error('input is not a regular file')
      if (s.size === 0)
        throw new Error('input file is empty (0 bytes)')
    }
    catch (e: any) {
      throw new Error(`invalid input file: ${inputPath} (${e?.message || e})`)
    }
    // 提帧阶段不做写入完成等待，假设上游已确保文件就绪
    // 第一帧
    await this.run(ffmpeg, ['-y', '-v', 'error', '-hide_banner', '-i', inputPath, '-frames:v', '1', '-q:v', '2', firstAbs])
    // 最后一帧
    await this.run(ffmpeg, ['-y', '-v', 'error', '-hide_banner', '-sseof', `-${(lastOffsetMs / 1000).toFixed(3)}`, '-i', inputPath, '-frames:v', '1', '-q:v', '2', lastAbs])

    return { firstAbs, lastAbs }
  }
} 