/**
 * 剪映草稿核心类
 * 负责管理和生成剪映草稿文件
 */

import * as path from 'path';
import { Media } from './media';
import { MediaEffect } from './mediaEffect';
import { MediaFactory } from './mediaFactory';
import {
  AddEffectOptions,
  AddMediaOptions,
  DraftContentData,
  DraftCreateOptions,
  DraftMetaInfoData,
  JianyingConfig,
  TrackType
} from '../_types';
import { ensureFolderExists, generateId, getTimestamp, readJson, writeJson } from '../utils/tools';
import { getTrack } from '../templates/template';

/**
 * 剪映草稿类
 */
export class Draft {
  /** 草稿内容文件名 */
  private static readonly DRAFT_CONTENT_FILE_NAME = 'draft_content.json';
  /** 草稿元数据文件名 */
  private static readonly DRAFT_META_INFO_FILE_NAME = 'draft_meta_info.json';

  /** 草稿名称 */
  private readonly draftName: string;
  /** 草稿根目录 */
  private readonly draftsRoot: string;
  /** 草稿文件夹路径 */
  private readonly draftFolder: string;
  /** 草稿内容数据 */
  private draftContentData: DraftContentData;
  /** 草稿元数据 */
  private draftMetaInfoData: DraftMetaInfoData;

  // 快捷访问变量
  /** 草稿内容库的素材 */
  private materialsInDraftContent: any;
  /** 草稿元数据库的素材 */
  private materialsInDraftMetaInfo: any;
  /** 草稿内容库的轨道 */
  private tracksInDraftContent: any[];

  /**
   * 构造函数
   * @param options 创建选项
   */
  constructor(options: DraftCreateOptions = {}) {
    // 设置草稿名称
    this.draftName = options.name || this.generateDraftName();

    // 设置配置
    const config = this.getDefaultConfig();
    if (options.config) {
      Object.assign(config, options.config);
    }
    this.draftsRoot = config.drafts_root;

    // 设置草稿文件夹路径
    this.draftFolder = path.join(this.draftsRoot, this.draftName);

    // 初始化草稿数据
    this.initializeDraftData();
  }

  /**
   * 添加媒体到草稿
   * @param mediaFileFullName 媒体文件完整路径
   * @param startAtTrack 在轨道上的开始时间（微秒）
   * @param duration 持续时间（微秒）
   * @param options 其他选项
   */
  public addMedia(
    mediaFileFullName: string, 
    startAtTrack = 0, 
    duration = 0, 
    options: AddMediaOptions = {}
  ): void {
    // 为了保持向后兼容，如果第二个参数是对象，则使用新的接口
    if (typeof startAtTrack === 'object') {
      options = startAtTrack as AddMediaOptions;
      startAtTrack = 0;
      duration = 0;
    }

    // 如果指定了duration，将其添加到options中
    if (duration > 0) {
      if (typeof options !== 'object' || options === null) {
        options = {};
      }
      options.duration = duration;
    }

    const media = MediaFactory.create(mediaFileFullName, options);
    
    if (!media) {
      console.warn(`无法创建媒体实例: ${mediaFileFullName}`);
      return;
    }

    this.addMediaToContent(media, startAtTrack);
  }

  /**
   * 添加文本到草稿
   * @param textContent 文本内容
   * @param options 添加选项
   */
  public addText(textContent: string, options: AddMediaOptions = {}): void {
    const textMedia = MediaFactory.createText(textContent, options);
    this.addMediaToContent(textMedia);
  }

  /**
   * 添加特效到草稿
   * @param effectNameOrResourceId 特效名称或资源ID
   * @param options 特效选项
   */
  public addEffect(effectNameOrResourceId: string | number, options: AddEffectOptions = {}): void {
    const effectMedia = new MediaEffect(effectNameOrResourceId, options);
    
    // 将特效信息添加到draft的素材库
    this.addMediaToContentMaterials(effectMedia);
    
    // 将特效信息添加到draft的轨道库
    this.addMediaToContentTracks(effectMedia, options.start || 0);
    
    // 特效不需要添加到元数据库
  }

  /**
   * 计算草稿时长
   * @returns 草稿时长（微秒）
   */
  public calcDraftDuration(): number {
    return this.getTrackDuration('video');
  }

  /**
   * 保存草稿
   */
  public save(): void {
    // 校准时长信息
    this.calcDuration();

    // 创建项目文件夹
    ensureFolderExists(this.draftFolder);

    // 持久化草稿
    const draftContentFilePath = path.join(this.draftFolder, Draft.DRAFT_CONTENT_FILE_NAME);
    const draftMetaInfoFilePath = path.join(this.draftFolder, Draft.DRAFT_META_INFO_FILE_NAME);
    
    writeJson(draftContentFilePath, this.draftContentData);
    writeJson(draftMetaInfoFilePath, this.draftMetaInfoData);

    console.log(`草稿已保存到: ${this.draftFolder}`);
  }

  /**
   * 生成草稿名称
   * @returns 基于时间戳的草稿名称
   */
  private generateDraftName(): string {
    const now = new Date();
    return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
  }

  /**
   * 获取默认配置
   * @returns 默认配置对象
   */
  private getDefaultConfig(): JianyingConfig {
    const { ConfigHelper } = require('../config/config');
    return ConfigHelper.getJianyingConfig();
  }

  /**
   * 初始化草稿数据
   */
  private initializeDraftData(): void {
    // 从模板文件加载基础数据
    const templateFolder = path.join(__dirname, '../templates');
    
    this.draftContentData = readJson(path.join(templateFolder, Draft.DRAFT_CONTENT_FILE_NAME));
    this.draftMetaInfoData = readJson(path.join(templateFolder, Draft.DRAFT_META_INFO_FILE_NAME));

    // 初始化草稿内容信息
    this.draftContentData.id = generateId();

    // 初始化草稿元数据信息
    this.draftMetaInfoData.draft_id = generateId();
    this.draftMetaInfoData.draft_fold_path = this.draftFolder.replace(/\\/g, '/');
    this.draftMetaInfoData.draft_timeline_materials_size_ = 0;
    this.draftMetaInfoData.tm_draft_create = getTimestamp();
    this.draftMetaInfoData.tm_draft_modified = getTimestamp();
    this.draftMetaInfoData.draft_root_path = this.draftsRoot.replace(/\//g, '\\');
    
    // 设置可移动存储设备（Windows驱动器盘符）
    if (process.platform === 'win32') {
      this.draftMetaInfoData.draft_removable_storage_device = this.draftsRoot.split(':')[0];
    }

    // 设置快捷访问变量
    this.materialsInDraftContent = this.draftContentData.materials;
    this.materialsInDraftMetaInfo = this.draftMetaInfoData.draft_materials;
    
    // 确保必要的材料类型存在于draft_materials中
    this.ensureMaterialTypeExists(0); // 视频类型
    this.ensureMaterialTypeExists(8); // 音频类型
    
    this.tracksInDraftContent = this.draftContentData.tracks;
  }

  /**
   * 添加媒体到内容
   * @param media 媒体对象
   * @param startAtTrack 在轨道上的开始时间
   */
  private addMediaToContent(media: Media, startAtTrack = 0): void {
    // 将媒体信息添加到draft的素材库
    this.addMediaToContentMaterials(media);

    // 将媒体信息添加到draft的轨道库
    this.addMediaToContentTracks(media, startAtTrack);

    // 将媒体信息添加到draft的元数据库
    this.addMediaToMetaInfo(media);
  }

  /**
   * 添加媒体信息到素材内容库的素材部分
   * @param media 媒体对象
   */
  private addMediaToContentMaterials(media: Media): void {
    for (const [key, value] of Object.entries(media.materialDataForContent)) {
      // 排除中转使用的临时信息
      if (key.startsWith('X.')) {
        continue;
      }

      if (!this.materialsInDraftContent[key]) {
        this.materialsInDraftContent[key] = [];
      }

      this.materialsInDraftContent[key].push(value);
    }
  }

  /**
   * 添加媒体信息到素材内容库的轨道部分
   * @param media 媒体对象
   * @param start 开始时间
   */
  private addMediaToContentTracks(media: Media, start: number): void {
    // 查找目标轨道
    let targetTrack = this.tracksInDraftContent.find(track => track.type === media.categoryType);

    // 如果轨道不存在，创建新轨道
    if (!targetTrack) {
      targetTrack = getTrack();
      targetTrack.type = media.categoryType;
      this.tracksInDraftContent.push(targetTrack);
    }

    // 如果没有指定开始时间，使用轨道的当前总时长
    if (!start) {
      start = this.getTrackDuration(media.categoryType);
    }

    // 设置新segment的在轨道上的开始时间
    const segmentTargetTimerange = media.segmentDataForContent.target_timerange;
    segmentTargetTimerange.start = start;
    targetTrack.segments.push(media.segmentDataForContent);
  }

  /**
   * 确保指定类型的材料项存在于draft_materials中
   * @param materialType 材料类型
   */
  private ensureMaterialTypeExists(materialType: number): void {
    const exists = this.materialsInDraftMetaInfo.find( (m: { type: number }) => m.type === materialType);
    if (!exists) {
      this.materialsInDraftMetaInfo.push({
        type: materialType,
        value: [],
      });
    }
  }

  /**
   * 获取指定类型的材料数组
   * @param materialType 材料类型
   * @returns 材料数组
   */
  private getMaterialArrayByType(materialType: number): any[] {
    const material = this.materialsInDraftMetaInfo.find((m: { type: number; }) => m.type === materialType);
    return material ? material.value : [];
  }

  /**
   * 添加媒体信息到元数据库
   * @param media 媒体对象
   */
  private addMediaToMetaInfo(media: Media): void {
    if (media.categoryType === 'video') {
      // 视频和图片都存储在type=0的材料中
      const videoMaterials = this.getMaterialArrayByType(0);
      videoMaterials.push(media.dataForMetaInfo);
    } else if (media.categoryType === 'audio') {
      // 音频存储在type=8的材料中
      const audioMaterials = this.getMaterialArrayByType(8);
      audioMaterials.push(media.dataForMetaInfo);
    }
    // 文本等其他类型暂不添加到元数据库
  }

  /**
   * 计算并设置草稿的总时长
   */
  private calcDuration(): void {
    // 1. 获取视频轨道的总时长
    const videoDuration = this.getTrackDuration('video');
    
    // 2. 设置音频轨道的总时长
    this.setTrackDuration('audio', videoDuration);

    // 3. 设置草稿的总时长
    this.draftContentData.duration = videoDuration;
    this.draftMetaInfoData.tm_duration = videoDuration;
  }

  /**
   * 获取轨道时长
   * @param trackType 轨道类型
   * @returns 轨道时长（微秒）
   */
  private getTrackDuration(trackType: TrackType): number {
    const targetTrack = this.tracksInDraftContent.find(track => track.type === trackType);

    if (!targetTrack || targetTrack.segments.length === 0) {
      return 0;
    }

    // 轨道总时长 = 最后一个片段的开始时间 + 持续时间
    const lastSegment = targetTrack.segments[targetTrack.segments.length - 1];
    const lastSegmentTimerange = lastSegment.target_timerange;
    
    if (!lastSegmentTimerange || 
        typeof lastSegmentTimerange.start !== 'number' || 
        typeof lastSegmentTimerange.duration !== 'number') {
      return 0;
    }
    
    return lastSegmentTimerange.start + lastSegmentTimerange.duration;
  }

  /**
   * 设置轨道时长
   * @param trackType 轨道类型
   * @param duration 目标时长（微秒）
   */
  private setTrackDuration(trackType: TrackType, duration: number): void {
    const targetTrack = this.tracksInDraftContent.find(track => track.type === trackType);

    if (!targetTrack) {
      return;
    }

    const segments = targetTrack.segments;
    let done = false;

    for (const segment of segments) {
      const ssTimerange = segment.source_timerange;
      const stTimerange = segment.target_timerange;

      if (done) {
        // 超出目标时长的片段设为0
        stTimerange.start = 0;
        stTimerange.duration = 0;
        ssTimerange.start = 0;
        ssTimerange.duration = 0;
      } else {
        const segmentStart = stTimerange.start;
        const segmentDuration = stTimerange.duration;
        const segmentEnd = segmentStart + segmentDuration;

        if (segmentEnd > duration) {
          // 裁剪超出部分
          const newDuration = duration - segmentStart;
          ssTimerange.duration = newDuration;
          stTimerange.duration = newDuration;
          done = true;
        }
      }
    }
  }
}
