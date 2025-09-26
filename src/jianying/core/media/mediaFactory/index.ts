/**
 * @file   : mediaFactory.ts
 * @time   : 16:10
 * @date   : 2024/3/24
 * @mail   : 9727005@qq.com
 * @creator: ShanDong Xiedali
 * @company: HiLand & RainyTop
 *
 * 媒体工厂类
 * 完全按照Python版本 mediaFactory.py 一比一还原
 */

import { existsSync } from 'node:fs'
import { upperFirstChar } from '@/jianying/core/utils/stringHelper'
import { parse as parseMediaInfo } from '@/jianying/core/utils/mediaInfo'
import { Media } from '../media'

// 静态导入所有媒体类（TypeScript不支持动态导入模块名）
import { MediaVideo } from './mediaVideo'
import { MediaAudio } from './mediaAudio'
import { MediaImage } from './mediaImage'
import { MediaText } from './mediaText'

/**
 * 媒体工厂
 */
export class MediaFactory {
  /**
   * 根据素材来信创建素材实体
   * @param mediaFullName 媒体文件完整路径
   * @param kwargs 其他参数
   * @returns 媒体实例或null
   */
  static create(mediaFullName: string, kwargs: any = {}): Media | null {
    if (!existsSync(mediaFullName)) {
      return null
    }

    const mediaInfo = parseMediaInfo(mediaFullName).toData().tracks[1]
    let materialType = mediaInfo.track_type.toLowerCase()

    materialType = upperFirstChar(materialType)
    const className = `Media${materialType}`
    kwargs.mediaInfo = mediaInfo
    kwargs.mediaFileFullName = mediaFullName

    // TypeScript使用静态导入，不需要package_name

    return MediaFactory.createInstance(className, kwargs)
  }

  /**
   * 创建媒体实例（替代Python的DynamicImporter.load_class）
   * 由于TypeScript不支持动态模块导入，使用静态映射
   * @param className 类名
   * @param kwargs 构造参数
   * @returns 媒体实例或null
   */
  private static createInstance(className: string, kwargs: any): Media | null {
    // TypeScript替代方案：静态类映射
    switch (className) {
      case 'MediaVideo':
        return new MediaVideo(kwargs)
      case 'MediaAudio':
        return new MediaAudio(kwargs)
      case 'MediaImage':
        return new MediaImage(kwargs)
      case 'MediaText':
        return new MediaText(kwargs)
      default:
        console.log(`暂未实现的媒体类: ${className}`)
        return null
    }
  }
}
