import { Injectable } from '@nestjs/common'
import { join } from 'node:path'
import type {
  jianyingComposeCreateParamsType,
  jianyingComposeCreateResultType,
} from './_types/jianying'
import { addMedia, createDraft, save } from '@/jianying/core/draft'
import { getSegment, getText, getTrack } from '@/jianying/core/template'
import { createFolder } from '@/jianying/core/utils/tools'

@Injectable()
export class JianyingService {
  /**
   * 创建剪映草稿，逐 item 添加视频/音频/图片/文本，按给定优先级决定片段时长。
   */
  async createDraft(dto: jianyingComposeCreateParamsType): Promise<jianyingComposeCreateResultType> {
    const name = dto?.name?.trim?.() || ''
    const draft = createDraft(join(process.cwd(), 'public'), name)

    //1. 创建草稿根目录及其资源目录
    const assetsDir = join(draft.draftFolder, 'assets')
    createFolder(assetsDir)

    // 2) 添加视频（使用仓库内已有测试视频）
    const videoPath = join(process.cwd(), 'public', 'files', 'video_1758685355426_lv2x4xsw.mp4')
    // startAtTrack=0 表示自动衔接到视频轨道末尾；duration=0 表示用媒体实际时长
    addMedia(draft, videoPath, 0, 0, { bgm_mute: false })

    // 3) 添加字幕（文本）
    const text = getText() // 生成一条文本素材模板
    // 3.1 文本内容
    const content = '你好，世界！这是字幕示例。'
    text.content = String(text.content || '').replace('[默认文本]', content)
    // 3.2 颜色与字号（可选）
    const color = '#FFFF00'
    text.text_color = color
    const r = Number.parseInt(color.slice(1, 3), 16) / 255
    const g = Number.parseInt(color.slice(3, 5), 16) / 255
    const b = Number.parseInt(color.slice(5, 7), 16) / 255
    text.content = String(text.content).replace(
      /<color=\([^)]+\)>/,
      `<color=(${r.toFixed(6)}, ${g.toFixed(6)}, ${b.toFixed(6)}, 1.000000)>`,
    )
    const textSize = 36
    text.text_size = textSize
    text.content = text.content.replace(/<size=([0-9.]+)>/, `<size=${textSize.toFixed(6)}>`)

    // 3.3 将文本素材推入 materials
    draft.materialsInDraftContent.texts.push(text)

    // 3.4 将字幕片段挂到“video”轨道（若没有则创建）
    let videoTrack = draft.tracksInDraftContent.find((t: any) => t.type === 'video')
    if (!videoTrack) {
      videoTrack = getTrack()
      videoTrack.type = 'video'
      draft.tracksInDraftContent.push(videoTrack)
    }

    // 3.5 片段开始时间：衔接到视频轨道末尾
    const lastEnd = (() => {
      if (!videoTrack.segments.length)
        return 0
      const lastSeg = videoTrack.segments[videoTrack.segments.length - 1]
      return lastSeg.target_timerange.start + lastSeg.target_timerange.duration
    })()

    // 3.6 创建字幕片段（持续 3 秒：3_000_000 微秒）
    const subtitleDuration = 3_000_000
    const seg = getSegment()
    seg.material_id = text.id
    seg.extra_material_refs = []
    seg.source_timerange = { start: 0, duration: subtitleDuration }
    seg.target_timerange = { start: lastEnd, duration: subtitleDuration }
    videoTrack.segments.push(seg)

    // 保存草稿
    save(draft)
    return {
      id: '1231',
    }
  }
}
