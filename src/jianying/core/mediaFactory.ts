/**
 * 媒体工厂类
 * 用于根据文件类型创建对应的媒体实例
 */

import * as path from 'path';
import { Media } from './media';
import { MediaVideo } from './mediaVideo';
import { MediaAudio } from './mediaAudio';
import { MediaImage } from './mediaImage';
import { MediaText } from './mediaText';
import { AddMediaOptions, MediaType, MediaInfo } from '../_types';
import { fileExists } from '../utils/tools';

/**
 * 媒体工厂类
 */
export class MediaFactory {
  /** 支持的视频格式 */
  private static readonly VIDEO_EXTENSIONS = [
    '.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm', '.m4v', '.3gp', '.ts'
  ];

  /** 支持的音频格式 */
  private static readonly AUDIO_EXTENSIONS = [
    '.mp3', '.wav', '.aac', '.flac', '.ogg', '.wma', '.m4a', '.opus'
  ];

  /** 支持的图片格式 */
  private static readonly IMAGE_EXTENSIONS = [
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.ico'
  ];

  /**
   * 创建媒体实例
   * @param mediaFullName 媒体文件完整路径
   * @param options 选项参数
   * @returns 媒体实例，如果创建失败返回null
   */
  public static create(mediaFullName: string, options: AddMediaOptions = {}): Media | null {
    // 检查文件是否存在
    if (!fileExists(mediaFullName)) {
      console.warn(`媒体文件不存在: ${mediaFullName}`);
      return null;
    }

    try {
      // 获取媒体信息
      const mediaInfo = this.parseMediaInfo(mediaFullName);
      const mediaType = this.getMediaType(mediaFullName, mediaInfo);

      // 将媒体信息添加到选项中
      const optionsWithMediaInfo = {
        ...options,
        mediaInfo,
      };

      // 根据媒体类型创建对应的实例
      switch (mediaType) {
        case 'video':
          return new MediaVideo(mediaFullName, optionsWithMediaInfo);
        case 'audio':
          return new MediaAudio(mediaFullName, optionsWithMediaInfo);
        case 'image':
          return new MediaImage(mediaFullName, optionsWithMediaInfo);
        default:
          console.warn(`不支持的媒体类型: ${mediaType}`);
          return null;
      }
    } catch (error) {
      console.error(`创建媒体实例失败: ${mediaFullName}`, error);
      return null;
    }
  }

  /**
   * 创建文本媒体
   * @param textContent 文本内容
   * @param options 选项参数
   * @returns 文本媒体实例
   */
  public static createText(textContent: string, options: AddMediaOptions = {}): MediaText {
    return new MediaText(textContent, options);
  }

  /**
   * 解析媒体信息
   * @param mediaFullName 媒体文件完整路径
   * @returns 媒体信息对象
   */
  private static parseMediaInfo(mediaFullName: string): MediaInfo | null {
    try {
      // 这里应该使用类似 pymediainfo 的库来解析媒体信息
      // 由于 Node.js 生态中没有完全等价的库，我们使用 fs.stat 获取基础信息
      // 在实际项目中，可以考虑使用 ffprobe 或其他工具
      
      const ext = path.extname(mediaFullName).toLowerCase();
      
      // 根据文件扩展名推断媒体类型
      let trackType = 'video';
      if (this.AUDIO_EXTENSIONS.includes(ext)) {
        trackType = 'audio';
      } else if (this.IMAGE_EXTENSIONS.includes(ext)) {
        trackType = 'image';
      }

      // 构建基础媒体信息
      const mediaInfo: MediaInfo = {
        track_type: trackType,
        // 注意：实际项目中应该使用专业的媒体解析库来获取准确的宽高和时长信息
        // 这里只是示例实现
      };

      // 对于图片，设置默认尺寸（实际应该解析图片获取真实尺寸）
      if (trackType === 'image') {
        mediaInfo.width = 1920;
        mediaInfo.height = 1080;
        mediaInfo.duration = 5; // 图片默认5秒
      }

      return mediaInfo;
    } catch (error) {
      console.error(`解析媒体信息失败: ${mediaFullName}`, error);
      return null;
    }
  }

  /**
   * 获取媒体类型
   * @param mediaFullName 媒体文件完整路径
   * @param mediaInfo 媒体信息
   * @returns 媒体类型
   */
  private static getMediaType(mediaFullName: string, mediaInfo: MediaInfo | null): MediaType {
    // 如果有媒体信息，优先使用媒体信息中的类型
    if (mediaInfo && mediaInfo.track_type) {
      return mediaInfo.track_type.toLowerCase() as MediaType;
    }

    // 否则根据文件扩展名推断
    const ext = path.extname(mediaFullName).toLowerCase();
    
    if (this.VIDEO_EXTENSIONS.includes(ext)) {
      return 'video';
    } else if (this.AUDIO_EXTENSIONS.includes(ext)) {
      return 'audio';
    } else if (this.IMAGE_EXTENSIONS.includes(ext)) {
      return 'image';
    }

    // 默认返回视频类型
    return 'video';
  }

  /**
   * 检查是否支持指定的文件格式
   * @param filePath 文件路径
   * @returns 是否支持
   */
  public static isSupported(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return [
      ...this.VIDEO_EXTENSIONS,
      ...this.AUDIO_EXTENSIONS,
      ...this.IMAGE_EXTENSIONS,
    ].includes(ext);
  }

  /**
   * 获取支持的文件扩展名列表
   * @returns 支持的扩展名数组
   */
  public static getSupportedExtensions(): string[] {
    return [
      ...this.VIDEO_EXTENSIONS,
      ...this.AUDIO_EXTENSIONS,
      ...this.IMAGE_EXTENSIONS,
    ];
  }
}
