/**
 * @file   : draft.ts
 * @time   : 11:12
 * @date   : 2024/3/20
 * @mail   : 9727005@qq.com
 * @creator: ShanDong Xiedali
 * @company: HiLand & RainyTop
 *
 * 剪映草稿处理核心模块
 * 完全按照Python版本 draft.py 一比一还原
 */

import { join } from 'node:path'
import { getTimestamp } from '@/jianying/utils/dateTimeHelper'
import { createFolder, generateId, writeJson } from '@/jianying/utils/tools'
import { getDraftTemplate, getTrack } from './template'
import { Media, MediaEffect, MediaFactory } from './media'

/**
 * 草稿接口定义
 */
export interface Draft {
  /** 草稿内容数据 */
  draftContentData: any
  /** 草稿元数据 */
  draftMetaInfoData: any
  /** 草稿根目录 */
  draftsRoot: string
  /** 草稿文件夹路径 */
  draftFolder: string
  /** 内容库中的素材 */
  materialsInDraftContent: any
  /** 元数据库中的素材 */
  materialsInDraftMetaInfo: any
  /** 元数据库中的视频素材 */
  videosMaterialInDraftMetaInfo: any[]
  /** 元数据库中的音频素材 */
  audiosMaterialInDraftMetaInfo: any[]
  /** 内容库中的轨道 */
  tracksInDraftContent: any[]
}

/**
 * 草稿文件名常量
 */
const DRAFT_CONTENT_FILE_BASE_NAME = 'draft_content.json'
const DRAFT_META_INFO_FILE_BASE_NAME = 'draft_meta_info.json'

const PROJECT_PUBLIC_ROOT = join(process.cwd(), 'public')

/**
 * 创建草稿
 * @param name 草稿名称，默认为时间戳格式
 * @returns 草稿对象
 */
export function createDraft(name: string = ''): Draft {
  if (!name) {
    const now = new Date()
    name = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
  }

  // 草稿保存位置
  const draftsRoot = PROJECT_PUBLIC_ROOT
  const draftFolder = join(draftsRoot, name)

  // 从模板常量克隆草稿的基础数据
  const { draft_content: draftContentData, draft_meta_info: draftMetaInfoData } = getDraftTemplate()

  // 初始化草稿内容信息
  draftContentData.id = generateId()

  // 初始化草稿元数据信息
  draftMetaInfoData.id = generateId()
  draftMetaInfoData.draft_fold_path = draftFolder.replace(/\\/g, '/')
  draftMetaInfoData.draft_timeline_materials_size_ = 0
  draftMetaInfoData.tm_draft_create = getTimestamp(16)
  draftMetaInfoData.tm_draft_modified = getTimestamp(16)
  draftMetaInfoData.draft_root_path = draftsRoot.replace(/\//g, '\\')
  draftMetaInfoData.draft_removable_storage_device = draftsRoot.split(':/')[0]

  // 为方便调用目标文件中的material部分，定义快捷变量
  const materialsInDraftContent = draftContentData.materials // 草稿内容库的素材
  const materialsInDraftMetaInfo = draftMetaInfoData.draft_materials // 草稿元数据库的素材
  const videosMaterialInDraftMetaInfo = materialsInDraftMetaInfo[0].value
  const audiosMaterialInDraftMetaInfo = materialsInDraftMetaInfo[6].value // type为8的那条

  const tracksInDraftContent = draftContentData.tracks // 草稿内容库的轨道

  return {
    draftContentData,
    draftMetaInfoData,
    draftsRoot,
    draftFolder,
    materialsInDraftContent,
    materialsInDraftMetaInfo,
    videosMaterialInDraftMetaInfo,
    audiosMaterialInDraftMetaInfo,
    tracksInDraftContent,
  }
}

/**
 * 添加媒体到草稿
 * @param draft 草稿对象
 * @param mediaFileFullName 媒体文件完整路径
 * @param startAtTrack 开始轨道位置，默认0
 * @param duration 持续时间，默认0
 * @param index 索引，默认0
 * @param kwargs 其他参数
 */
export function addMedia(
  draft: Draft,
  mediaFileFullName: string,
  startAtTrack: number = 0,
  duration: number = 0,
  index: number = 0,
  kwargs: any = {},
): void {
  const media = MediaFactory.create(mediaFileFullName, { duration, ...kwargs })

  if (media === null) {
    return
  }

  // 将媒体信息添加到draft的素材库
  addMediaToContentMaterials(draft, media)

  // 将媒体信息添加到draft的轨道库
  addMediaToContentTracks(draft, media, startAtTrack)

  // 将媒体信息添加到draft的元数据库
  addMediaToMetaInfo(draft, media)
}

/**
 * 添加特效到草稿
 * @param draft 草稿对象
 * @param effectNameOrResourceId 特效的名称或资源ID（内置特效可以使用名称；外置特效直接使用剪映的资源ID）
 * @param start 开始时间，默认0
 * @param duration 持续时间，默认0
 * @param _index 索引，默认0
 * @param kwargs 其他参数
 */
export function addEffect(
  draft: Draft,
  effectNameOrResourceId: string | number,
  start: number = 0,
  duration: number = 0,
  _index: number = 0,
  kwargs: any = {},
): void {
  const media = new MediaEffect({
    effect_name_or_resource_id: effectNameOrResourceId,
    start,
    duration,
    ...kwargs,
  })

  // 将媒体信息添加到draft的素材库
  addMediaToContentMaterials(draft, media)

  // 将媒体信息添加到draft的轨道库
  addMediaToContentTracks(draft, media, start)

  // 效果的媒体信息不需要添加到draft的元数据库
  // addMediaToMetaInfo(draft, media)
}

/**
 * 获取（通过计算）草稿的时长
 * @param draft 草稿对象
 * @returns 草稿持续时间
 */
export function calcDraftDuration(draft: Draft): number {
  return getTrackDuration(draft, 'video')
}

/**
 * 保存草稿
 * @param draft 草稿对象
 */
export function save(draft: Draft): void {
  // 校准时长信息
  calcDuration(draft)

  // 新建项目文件夹
  createFolder(draft.draftFolder)

  // 持久化草稿
  const draftContentFileFullName = join(draft.draftFolder, DRAFT_CONTENT_FILE_BASE_NAME)
  const draftMetaInfoFileFullName = join(draft.draftFolder, DRAFT_META_INFO_FILE_BASE_NAME)
  writeJson(draftContentFileFullName, draft.draftContentData)
  writeJson(draftMetaInfoFileFullName, draft.draftMetaInfoData)
}

/**
 * 添加媒体信息到素材内容库的素材部分
 * @param draft 草稿对象
 * @param media 媒体对象
 */
function addMediaToContentMaterials(draft: Draft, media: Media): void {
  for (const [key, value] of Object.entries(media.materialDataForContent)) {
    const keyStr = String(key)

    // 排除中转使用的临时信息
    if (keyStr.startsWith('X.')) {
      continue
    }

    draft.materialsInDraftContent[keyStr].push(value)
  }
}

/**
 * 添加媒体信息到素材内容库的轨道部分
 * @param draft 草稿对象
 * @param media 媒体对象
 * @param start 开始时间，默认0
 */
function addMediaToContentTracks(draft: Draft, media: Media, start: number = 0): void {
  const allTracks = draft.tracksInDraftContent
  let targetTrack = null

  for (const track of allTracks) {
    if (track.type === media.categoryType) {
      targetTrack = track
      break
    }
  }

  if (targetTrack === null) {
    targetTrack = getTrack()
    targetTrack.type = media.categoryType
    draft.tracksInDraftContent.push(targetTrack)
  }

  if (!start) {
    // 添加新片段之前轨道总时长
    start = getTrackDuration(draft, media.categoryType)
  }

  // 设置新segment的在轨道上的开始时间
  const segmentTargetTimerange = media.segmentDataForContent.target_timerange
  segmentTargetTimerange.start = start
  targetTrack.segments.push(media.segmentDataForContent)
}

/**
 * 添加媒体信息到元数据库
 * @param draft 草稿对象
 * @param media 媒体对象
 */
function addMediaToMetaInfo(draft: Draft, media: Media): void {
  if (media.categoryType === 'video') {
    draft.videosMaterialInDraftMetaInfo.push(media.dataForMetaInfo)
  }
  else {
    draft.audiosMaterialInDraftMetaInfo.push(media.dataForMetaInfo)
  }
}

/**
 * 计算并设置草稿的总时长
 * 计算策略为（以视频时长为基准，让其他地方的duration相对此时长对齐）：
 * 1. 以视频轨道中最后一个segment的结束时间作为总时长
 * 2. 将音频轨道的总时长设置为第一步计算的结果
 * 3. 设置草稿的总时长字段duration（文件content和meta_info都要设置）
 * @param draft 草稿对象
 */
function calcDuration(draft: Draft): void {
  // 1. 获取视频轨道的总时长
  const videoDurations = getTrackDuration(draft, 'video')

  // 2. 设置音频轨道的总时长
  // TODO:xiedali@2024/03/23 暂时只设置audio
  setTrackDuration(draft, 'audio', videoDurations)

  // 3. 设置草稿的总时长
  draft.draftContentData.duration = videoDurations
  draft.draftMetaInfoData.tm_duration = videoDurations
}

/**
 * 获取指定轨道的总时长
 * @param draft 草稿对象
 * @param trackType 轨道类型
 * @returns 轨道持续时间
 */
function getTrackDuration(draft: Draft, trackType: string): number {
  const allTracks = draft.tracksInDraftContent
  let targetTrack = null

  for (const track of allTracks) {
    if (track.type === trackType) {
      targetTrack = track
      break
    }
  }

  if (!targetTrack) {
    return 0
  }

  if (targetTrack.segments.length === 0) {
    return 0
  }

  // 轨道总时长
  const lastSegment = targetTrack.segments[targetTrack.segments.length - 1]
  const lastSegmentTimerange = lastSegment.target_timerange

  return lastSegmentTimerange.start + lastSegmentTimerange.duration
}

/**
 * 设置指定轨道的总时长
 * @param draft 草稿对象
 * @param trackType 轨道类型
 * @param duration 持续时间
 */
function setTrackDuration(draft: Draft, trackType: string, duration: number): void {
  const allTracks = draft.tracksInDraftContent
  let targetTrack = null

  for (const track of allTracks) {
    if (track.type === trackType) {
      targetTrack = track
      break
    }
  }

  if (!targetTrack) {
    return
  }

  const segments = targetTrack.segments
  let done = false

  for (const segment of segments) {
    const ssTimerange = segment.source_timerange
    const stTimerange = segment.target_timerange

    if (done) {
      stTimerange.start = 0
      stTimerange.duration = 0
      ssTimerange.start = 0
      ssTimerange.duration = 0
    }
    else {
      const segmentStart = stTimerange.start
      const segmentDuration = stTimerange.duration
      const segmentEnd = segmentStart + segmentDuration

      if (segmentEnd > duration) {
        ssTimerange.duration = duration - segmentStart
        stTimerange.duration = duration - segmentStart
        done = true
      }
    }
  }
}
