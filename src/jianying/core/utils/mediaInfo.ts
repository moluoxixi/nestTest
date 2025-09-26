/**
 * 媒体信息解析工具
 * 模拟Python版本的pymediainfo.MediaInfo
 */

import { extname } from 'node:path'

/**
 * 媒体信息接口
 */
export interface MediaInfoData {
  track_type: string
  width?: number
  height?: number
  duration?: number
  [key: string]: any
}

/**
 * 媒体信息解析结果类
 */
export class MediaInfoResult {
  public tracks: MediaInfoData[]

  constructor(tracks: MediaInfoData[]) {
    this.tracks = tracks
  }

  /**
   * 转换为数据格式
   * 模拟.to_data()方法
   * @returns 数据对象
   */
  toData(): any {
    return { tracks: this.tracks }
  }
}

/**
 * 解析媒体文件信息
 * 模拟pymediainfo的MediaInfo.parse(media_full_name)
 * @param mediaFullName 媒体文件路径
 * @returns 媒体信息解析结果
 */
export function parse(mediaFullName: string): MediaInfoResult {
  const ext = extname(mediaFullName).toLowerCase()

  let trackData: MediaInfoData

  // 基于文件扩展名模拟媒体信息
  if (['.mp3', '.wav', '.aac', '.m4a', '.flac'].includes(ext)) {
    trackData = {
      track_type: 'Audio',
      duration: 30,
    }
  }
  else if (['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.webp'].includes(ext)) {
    trackData = {
      track_type: 'Image',
      width: 1920,
      height: 1080,
      duration: 5,
    }
  }
  else {
    // 默认为视频
    trackData = {
      track_type: 'Video',
      width: 1920,
      height: 1080,
      duration: 10,
    }
  }

  return new MediaInfoResult([
    { track_type: 'General' }, // tracks[0] - 通常是General track
    trackData, // tracks[1] - 实际的媒体数据
  ])
}
