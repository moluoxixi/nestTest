/**
 * 媒体工厂类
 * 完全按照Python版本 mediaFactory.py 实现
 */

import * as fs from 'fs';
import * as path from 'path';
import { Media, MediaInfo } from './media';

/**
 * 媒体工厂类
 */
export class MediaFactory {
  /**
   * 根据素材来源创建素材实体
   * @param mediaFullName 媒体文件完整路径
   * @param kwargs 其他参数
   * @returns 媒体实例或null
   */
  static create(mediaFullName: string, kwargs: any = {}): Media | null {
    if (!fs.existsSync(mediaFullName)) {
      return null;
    }

    // 解析媒体信息（简化版，对应Python的MediaInfo.parse）
    const mediaInfo = this.parseMediaInfo(mediaFullName);
    if (!mediaInfo) {
      return null;
    }

    const materialType = mediaInfo.track_type.toLowerCase();
    
    // 根据类型创建实例（这里需要动态导入，类似Python的DynamicImporter）
    const packageName = `media${this.upperFirstChar(materialType)}`;
    const className = `Media${this.upperFirstChar(materialType)}`;

    kwargs.mediaInfo = mediaInfo;
    kwargs.mediaFileFullName = mediaFullName;

    // 动态加载类（简化实现）
    try {
      const moduleClass = this.loadClass(packageName, className);
      if (moduleClass) {
        return new moduleClass(kwargs);
      }
    } catch (error) {
      console.error(`无法创建媒体实例: ${error}`);
    }

    return null;
  }

  /**
   * 解析媒体信息（简化版）
   * @param mediaFullName 媒体文件完整路径
   * @returns 媒体信息
   */
  private static parseMediaInfo(mediaFullName: string): MediaInfo | null {
    try {
      const ext = path.extname(mediaFullName).toLowerCase();
      const stats = fs.statSync(mediaFullName);
      
      // 根据扩展名推断类型
      let trackType = 'video';
      if (['.mp3', '.wav', '.aac', '.flac', '.ogg'].includes(ext)) {
        trackType = 'audio';
      } else if (['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(ext)) {
        trackType = 'image';
      }

      const mediaInfo: MediaInfo = {
        track_type: trackType,
      };

      // 对于图片，设置默认信息
      if (trackType === 'image') {
        mediaInfo.width = 1920;
        mediaInfo.height = 1080;
        mediaInfo.duration = 5; // 默认5秒
      }

      return mediaInfo;
    } catch (error) {
      console.error(`解析媒体信息失败: ${error}`);
      return null;
    }
  }

  /**
   * 首字母大写
   * @param str 字符串
   * @returns 首字母大写的字符串
   */
  private static upperFirstChar(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * 动态加载类（简化实现）
   * @param packageName 包名
   * @param className 类名
   * @returns 类构造函数
   */
  private static loadClass(packageName: string, className: string): any {
    // 简化实现：直接根据类型返回对应的类
    try {
      if (className === 'MediaVideo') {
        const { MediaVideo } = require('./mediaVideo');
        return MediaVideo;
      } else if (className === 'MediaAudio') {
        const { MediaAudio } = require('./mediaAudio');
        return MediaAudio;
      } else if (className === 'MediaImage') {
        const { MediaImage } = require('./mediaImage');
        return MediaImage;
      } else if (className === 'MediaText') {
        const { MediaText } = require('./mediaText');
        return MediaText;
      }
    } catch (error) {
      console.error(`加载类失败: ${error}`);
    }
    return null;
  }
}
