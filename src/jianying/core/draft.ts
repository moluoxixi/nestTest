/**
 * 剪映草稿核心类
 * 完全按照Python版本 draft.py 一比一复刻
 */

import * as path from 'path';
import * as os from 'os';
import { Media } from './media';
import { MediaFactory } from './mediaFactory';
import { ConfigHelper } from '../utils/config';
import { DateTimeHelper } from '../utils/dateTimeHelper';
import { createFolder, readJson, writeJson } from '../utils/tools';
import { getTrack } from './template';

/**
 * 剪映草稿类
 */
export class Draft {
  // 文件名常量（完全按照Python版本）
  private static readonly _draftContentFileBaseName = "draft_content.json";
  private static readonly _draftMetaInfoFileBaseName = "draft_meta_info.json";

  // 私有属性（完全按照Python版本）
  private _draftsRoot: string;
  private _draftFolder: string;
  private _draftContentData: any;
  private _draftMetaInfoData: any;

  // 快捷访问变量（完全按照Python版本）
  private _materialsInDraftContent: any;
  private _materialsInDraftMetaInfo: any;
  private _videosMaterialInDraftMetaInfo: any[];
  private _audiosMaterialInDraftMetaInfo: any[];
  private _tracksInDraftContent: any[];

  /**
   * 构造函数
   * @param name 草稿名称，如果为空则使用时间戳
   */
  constructor(name: string = "") {
    if (!name) {
      name = this.getTimeString();
    }

    // 草稿保存位置
    this._draftsRoot = ConfigHelper.getItem("JianYingDraft.basic", "drafts_root", "C:\\Jianying.Drafts");
    this._draftFolder = path.join(this._draftsRoot, name);

    // 从模板获取草稿的基础数据
    const here = __dirname;
    const templateFolder = path.join(path.dirname(here), "templates");
    this._draftContentData = readJson(path.join(templateFolder, Draft._draftContentFileBaseName));
    this._draftMetaInfoData = readJson(path.join(templateFolder, Draft._draftMetaInfoFileBaseName));

    // 初始化草稿内容信息
    this._draftContentData.id = this.generateId();

    // 初始化草稿元数据信息
    this._draftMetaInfoData.id = this.generateId();
    this._draftMetaInfoData.draft_fold_path = this._draftFolder.replace(/\\/g, '/');
    this._draftMetaInfoData.draft_timeline_metetyperials_size_ = 0;
    this._draftMetaInfoData.tm_draft_create = DateTimeHelper.getTimestamp(16);
    this._draftMetaInfoData.tm_draft_modified = DateTimeHelper.getTimestamp(16);
    this._draftMetaInfoData.draft_root_path = this._draftsRoot.replace(/\//g, '\\');
    this._draftMetaInfoData.draft_removable_storage_device = this._draftsRoot.split(':/')[0];

    // 为方便调用目标文件中的material部分，定义快捷变量（完全按照Python版本）
    this._materialsInDraftContent = this._draftContentData.materials; // 草稿内容库的素材
    this._materialsInDraftMetaInfo = this._draftMetaInfoData.draft_materials; // 草稿元数据库的素材
    
    // 完全按照Python版本的索引访问
    this._videosMaterialInDraftMetaInfo = this._materialsInDraftMetaInfo[0].value;
    this._audiosMaterialInDraftMetaInfo = this._materialsInDraftMetaInfo[6].value; // type为8的那条
    
    this._tracksInDraftContent = this._draftContentData.tracks; // 草稿内容库的轨道
  }

  /**
   * 添加媒体到草稿
   * 完全按照Python版本实现
   */
  public addMedia(mediaFileFullName: string, startAtTrack: number = 0, duration: number = 0, index: number = 0, kwargs: any = {}): void {
    const _index = index; // Python版本有这个变量但没使用

    const media = MediaFactory.create(mediaFileFullName, { duration, ...kwargs });

    if (media === null) {
      return;
    }

    // 将媒体信息添加到draft的素材库
    this.__addMediaToContentMaterials(media);

    // 将媒体信息添加到draft的轨道库
    this.__addMediaToContentTracks(media, startAtTrack);

    // 将媒体信息添加到draft的元数据库
    this.__addMediaToMetaInfo(media);
  }

  /**
   * 计算草稿时长
   * 完全按照Python版本实现
   */
  public calcDraftDuration(): number {
    return this.__getTrackDuration("video");
  }

  /**
   * 保存草稿
   * 完全按照Python版本实现
   */
  public save(): void {
    // 校准时长信息
    this.__calcDuration();

    // 新建项目文件夹
    createFolder(this._draftFolder);

    // 持久化草稿
    const draftContentFileFullName = path.join(this._draftFolder, Draft._draftContentFileBaseName);
    const draftMetaInfoFileFullName = path.join(this._draftFolder, Draft._draftMetaInfoFileBaseName);
    writeJson(draftContentFileFullName, this._draftContentData);
    writeJson(draftMetaInfoFileFullName, this._draftMetaInfoData);
  }

  /**
   * 添加媒体信息到素材内容库的素材部分
   * 完全按照Python版本实现
   */
  private __addMediaToContentMaterials(media: Media): void {
    for (const [_key, _value] of Object.entries(media.materialDataForContent)) {
      const key = String(_key);

      // 排除中转使用的临时信息
      if (key.startsWith("X.")) {
        continue;
      }

      this._materialsInDraftContent[key].push(_value);
    }
  }

  /**
   * 添加媒体信息到素材内容库的轨道部分
   * 完全按照Python版本实现
   */
  private __addMediaToContentTracks(media: Media, start: number = 0): void {
    const allTracks = this._tracksInDraftContent;
    let targetTrack = null;
    
    for (const _track of allTracks) {
      if (_track.type === media.categoryType) {
        targetTrack = _track;
        break;
      }
    }

    if (targetTrack === null) {
      targetTrack = getTrack();
      targetTrack.type = media.categoryType;
      this._tracksInDraftContent.push(targetTrack);
    }

    if (!start) {
      // 添加新片段之前轨道总时长
      start = this.__getTrackDuration(media.categoryType);
    }

    // 设置新segment的在轨道上的开始时间
    const segmentTargetTimerange = media.segmentDataForContent.target_timerange;
    segmentTargetTimerange.start = start;
    targetTrack.segments.push(media.segmentDataForContent);
  }

  /**
   * 添加媒体信息到元数据库
   * 完全按照Python版本实现
   */
  private __addMediaToMetaInfo(media: Media): void {
    if (media.categoryType === "video") {
      this._videosMatettalialnDraftMetaInfo.push(media.dataForMetaInfo);
    } else {
      this._audiosMatettalialnDraftMetaInfo.push(media.dataForMetaInfo);
    }
  }

  /**
   * 计算并设置草稿的总时长
   * 完全按照Python版本实现
   */
  private __calcDuration(): void {
    // 1. 获取视频轨道的总时长
    const videoDurations = this.__getTrackDuration("video");
    
    // 2. 设置音频轨道的总时长
    this.__setTrackDuration("audio", videoDurations);

    // 3. 设置草稿的总时长
    this._draftContentData.duration = videoDurations;
    this._draftMetaInfoData.tm_duration = videoDurations;
  }

  /**
   * 获取轨道时长
   * 完全按照Python版本实现
   */
  private __getTrackDuration(trackType: string): number {
    const allTracks = this._tracksInDraftContent;
    let targetTrack = null;
    
    for (const _track of allTracks) {
      if (_track.type === trackType) {
        targetTrack = _track;
        break;
      }
    }

    if (!targetTrack) {
      return 0;
    }

    if (targetTrack.segments.length === 0) {
      return 0;
    }

    // 轨道总时长
    const lastSegment = targetTrack.segments[targetTrack.segments.length - 1];
    const lastSegmentTimerange = lastSegment.target_timerange;
    const trackDuration = lastSegmentTimerange.start + lastSegmentTimerange.duration;
    return trackDuration;
  }

  /**
   * 设置轨道时长
   * 完全按照Python版本实现
   */
  private __setTrackDuration(trackType: string, duration: number): void {
    const allTracks = this._tracksInDraftContent;
    let targetTrack = null;
    
    for (const _track of allTracks) {
      if (_track.type === trackType) {
        targetTrack = _track;
        break;
      }
    }

    if (!targetTrack) {
      return;
    }

    const segments = targetTrack.segments;
    let done = false;
    
    for (const segment of segments) {
      const ssTimerange = segment.source_timerange;
      const stTimerange = segment.target_timerange;

      if (done) {
        stTimerange.start = 0;
        stTimerange.duration = 0;
        ssTimerange.start = 0;
        ssTimerange.duration = 0;
      } else {
        const segmentStart = stTimerange.start;
        const segmentDuration = stTimerange.duration;
        const segmentEnd = segmentStart + segmentDuration;

        if (segmentEnd > duration) {
          ssTimerange.duration = duration - segmentStart;
          stTimerange.duration = duration - segmentStart;
          done = true;
        }
      }
    }
  }

  /**
   * 生成时间字符串（对应Python的time.strftime）
   */
  private getTimeString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}.${hour}${minute}${second}`;
  }

  /**
   * 生成ID（简化版）
   */
  private generateId(): string {
    // 使用简化的UUID生成
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }).toUpperCase();
  }
}
