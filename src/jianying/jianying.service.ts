import { Injectable } from '@nestjs/common'
import { mkdir, writeFile } from 'node:fs/promises'
import { Buffer } from 'node:buffer'
import { dirname, join, resolve } from 'node:path'
import type {
  JianyingDraftContentType,
  jianyingDraftGenerateParamsType,
  jianyingDraftGenerateResultType,
  JianyingMaterialsType,
  JianyingTimerangeType,
  JianyingTrackType,
} from './_types/draft'

@Injectable()
export class JianYingService {
  /**
   * 将 dataURL 或 base64 字符串解码为 Buffer
   */
  private decodeBase64(data: string = ''): Buffer {
    const isDataUrl = /^data:/i.test(data)
    if (isDataUrl) {
      const base64 = data.split(',')[1] || ''
      return Buffer.from(base64, 'base64')
    }
    return Buffer.from(data, 'base64')
  }

  /**
   * 生成 srt 文本
   */
  private buildSrt(items: { startMs?: number, endMs?: number, text?: string }[] = []): string {
    const toTime = (ms: number = 0) => {
      const t = Math.max(0, Math.floor(ms))
      const hours = String(Math.floor(t / 3600000)).padStart(2, '0')
      const minutes = String(Math.floor((t % 3600000) / 60000)).padStart(2, '0')
      const seconds = String(Math.floor((t % 60000) / 1000)).padStart(2, '0')
      const millis = String(t % 1000).padStart(3, '0')
      return `${hours}:${minutes}:${seconds},${millis}`
    }
    const lines: string[] = []
    items.forEach((it, idx) => {
      const start = toTime(it.startMs ?? 0)
      const end = toTime(it.endMs ?? (it.startMs ?? 0) + 1000)
      const text = (it.text ?? '').toString()
      lines.push(String(idx + 1))
      lines.push(`${start} --> ${end}`)
      lines.push(text)
      lines.push('')
    })
    return `${lines.join('\n')}`
  }

  /**
   * 生成剪映草稿目录与标准文件（draft_content.json、draft_info.json）。
   *
   * @param {jianyingDraftGenerateParamsType} options - 草稿参数对象
   */
  async jianyingDraftGenerate(options: jianyingDraftGenerateParamsType = {}): Promise<jianyingDraftGenerateResultType> {
    const { title = 'draft', images = [], videos = [], audios = [], subtitles = [] } = options || {}

    const draftId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const draftRoot = resolve(process.cwd(), 'public', 'files', 'jianying', draftId)
    const assetsDir = resolve(draftRoot, 'assets')
    await mkdir(assetsDir, { recursive: true })

    const assetRelativePaths: string[] = []

    // 保存图片
    for (const [i, img] of images.entries()) {
      const name = img.filename || `image_${i + 1}.png`
      const abs = resolve(assetsDir, name)
      await mkdir(dirname(abs), { recursive: true })
      if (img.base64) {
        const buf = this.decodeBase64(img.base64)
        await writeFile(abs, buf)
      }
      else if (img.url) {
        const res = await fetch(img.url)
        const ab = await res.arrayBuffer()
        await writeFile(abs, Buffer.from(ab))
      }
      assetRelativePaths.push(join('assets', name).replace(/\\/g, '/'))
    }

    // 保存视频
    for (const [i, v] of videos.entries()) {
      const name = v.filename || `video_${i + 1}.mp4`
      const abs = resolve(assetsDir, name)
      await mkdir(dirname(abs), { recursive: true })
      if (v.base64) {
        const buf = this.decodeBase64(v.base64)
        await writeFile(abs, buf)
      }
      else if (v.url) {
        const res = await fetch(v.url)
        const ab = await res.arrayBuffer()
        await writeFile(abs, Buffer.from(ab))
      }
      assetRelativePaths.push(join('assets', name).replace(/\\/g, '/'))
    }

    // 保存音频
    for (const [i, a] of audios.entries()) {
      const name = a.filename || `audio_${i + 1}.wav`
      const abs = resolve(assetsDir, name)
      await mkdir(dirname(abs), { recursive: true })
      if (a.base64) {
        const buf = this.decodeBase64(a.base64)
        await writeFile(abs, buf)
      }
      else if (a.url) {
        const res = await fetch(a.url)
        const ab = await res.arrayBuffer()
        await writeFile(abs, Buffer.from(ab))
      }
      assetRelativePaths.push(join('assets', name).replace(/\\/g, '/'))
    }

    // 保存字幕（生成 .srt）
    for (const [i, s] of subtitles.entries()) {
      const name = s.filename || `subtitle_${i + 1}.srt`
      const abs = resolve(assetsDir, name)
      await mkdir(dirname(abs), { recursive: true })
      if (s.srt) {
        await writeFile(abs, s.srt)
      }
      else if (Array.isArray(s.items) && s.items.length > 0) {
        await writeFile(abs, this.buildSrt(s.items))
      }
      assetRelativePaths.push(join('assets', name).replace(/\\/g, '/'))
    }

    // 构建标准草稿结构（简化版，materials + tracks）
    const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const materials: JianyingMaterialsType = {
      videos: [],
      images: [],
      audios: [],
      texts: [],
    }
    const tracks: JianyingTrackType[] = []

    // 将素材注册到 materials，并构造对应轨道 segments
    const videoTrack: JianyingTrackType = { type: 'video', segments: [] }
    const audioTrack: JianyingTrackType = { type: 'audio', segments: [] }

    let currentVideoTimelineStart = 0
    for (const [i, v] of videos.entries()) {
      const name = v.filename || `video_${i + 1}.mp4`
      const id = genId()
      materials.videos.push({ type: 'video', id, path: `assets/${name}` })
      const duration = Math.max(1, v.timelineDurationMs ?? 5000)
      const materialRange: JianyingTimerangeType = { start: Math.max(0, v.trimStartMs ?? 0), duration }
      const targetRange: JianyingTimerangeType = { start: currentVideoTimelineStart, duration }
      videoTrack.segments.push({ material_id: id, target_timerange: targetRange, material_timerange: materialRange })
      currentVideoTimelineStart += duration
    }

    for (const [i, img] of images.entries()) {
      const name = img.filename || `image_${i + 1}.png`
      const id = genId()
      materials.images.push({ type: 'image', id, path: `assets/${name}` })
      const duration = Math.max(1, img.timelineDurationMs ?? 3000)
      const materialRange: JianyingTimerangeType = { start: 0, duration }
      const targetRange: JianyingTimerangeType = { start: currentVideoTimelineStart, duration }
      videoTrack.segments.push({ material_id: id, target_timerange: targetRange, material_timerange: materialRange })
      currentVideoTimelineStart += duration
    }

    let currentAudioTimelineStart = 0
    for (const [i, a] of audios.entries()) {
      const name = a.filename || `audio_${i + 1}.wav`
      const id = genId()
      materials.audios.push({ type: 'audio', id, path: `assets/${name}` })
      const duration = Math.max(1, a.timelineDurationMs ?? 5000)
      const materialRange: JianyingTimerangeType = { start: Math.max(0, a.trimStartMs ?? 0), duration }
      const targetRange: JianyingTimerangeType = { start: currentAudioTimelineStart, duration }
      audioTrack.segments.push({ material_id: id, target_timerange: targetRange, material_timerange: materialRange })
      currentAudioTimelineStart += duration
    }

    if (videoTrack.segments.length > 0)
      tracks.push(videoTrack)
    if (audioTrack.segments.length > 0)
      tracks.push(audioTrack)

    const canvas = options.canvas || {}
    const canvasConfig = {
      ratio: canvas.ratio || '16:9',
      width: canvas.width || 1920,
      height: canvas.height || 1080,
      fps: canvas.fps || 30,
    }

    const draftContent: JianyingDraftContentType = {
      version: '0.1',
      canvas_config: canvasConfig,
      materials,
      tracks,
    }

    // draft_info.json（基本项）
    const draftInfo = {
      app: 'jianying-adapter',
      modified_time: Date.now(),
      name: title,
      draft_id: draftId,
      description: '',
      duration: Math.max(currentVideoTimelineStart, currentAudioTimelineStart),
    }

    // 落盘两个标准文件
    const draftContentPath = resolve(draftRoot, 'draft_content.json')
    const draftInfoPath = resolve(draftRoot, 'draft_info.json')
    await writeFile(draftContentPath, JSON.stringify(draftContent, null, 2))
    await writeFile(draftInfoPath, JSON.stringify(draftInfo, null, 2))

    // 兼容旧 manifest 字段（指向 content）
    const manifest = draftContent
    const draftContentDownPath = `/files/jianying/${draftId}/draft_content.json`.replace(/\\/g, '/')
    const draftInfoDownPath = `/files/jianying/${draftId}/draft_info.json`.replace(/\\/g, '/')
    const manifestDownPath = draftContentDownPath

    return {
      absDirPath: draftRoot,
      draftContentDownPath,
      draftInfoDownPath,
      manifestDownPath,
      assetRelativePaths,
      manifest,
    }
  }
}
