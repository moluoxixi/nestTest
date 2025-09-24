/**
 * 特效媒体处理类
 */

import { Media } from './media';
import { AddEffectOptions } from '../_types';
import { generateEffectData } from '../utils/tools';
import { getVideoEffect } from '../templates/template';

/**
 * 特效媒体类
 */
export class MediaEffect extends Media {
  /** 特效名称或资源ID */
  private readonly effectNameOrResourceId: string | number;
  /** 特效开始时间 */
  private readonly effectStart: number;
  /** 特效持续时间 */
  private readonly effectDuration: number;

  /**
   * 构造函数
   * @param effectNameOrResourceId 特效名称或资源ID
   * @param options 特效选项参数
   */
  constructor(
    effectNameOrResourceId: string | number,
    options: AddEffectOptions = {},
  ) {
    // 按照Python版本的实现方式
    const kwargs = {
      media_type: 'video' as const, // 特效归属于视频类型
      effect_name_or_resource_id: effectNameOrResourceId,
      start: options.start || 0,
      duration: options.duration || 0,
      index: options.index || 0,
      ...options
    };
    
    // 特效不需要文件路径，传入空字符串
    super('', kwargs);
    
    this.effectNameOrResourceId = effectNameOrResourceId;
    this.effectStart = options.start || 0;
    this.effectDuration = options.duration || 0;
    
    // 设置基础属性
    this.categoryType = 'video'; // 特效归属于视频轨道
    this.materialType = 'video';
    this.duration = this.effectDuration;
    
    // 设置素材名称
    if (typeof effectNameOrResourceId === 'string') {
      this.materialName = effectNameOrResourceId;
      this.extraInfo = effectNameOrResourceId;
    } else {
      this.materialName = effectNameOrResourceId.toString();
      this.extraInfo = effectNameOrResourceId.toString();
    }
  }

  /**
   * 设置素材数据（用于内容）
   */
  protected setMaterialDataForContent(): void {
    // 完全按照Python版本的实现
    const effectNameOrResourceId = (this.options as any).effect_name_or_resource_id || this.effectNameOrResourceId;

    const effectData = generateEffectData(effectNameOrResourceId);
    effectData.guid = this.id;

    this.materialDataForContent['video_effects'] = getVideoEffect(effectData.guid, effectData.resource_id, effectData.name);

    // 特效的各种业务信息为空。后续供track下的segment使用
    this.materialDataForContent['X.extra_material_refs'] = [];
  }

  /**
   * 重写片段数据设置
   * 特效的片段数据设置与普通媒体不同
   */
  protected setSegmentDataForContent(): void {
    // 特效使用不同的片段结构，这里可以根据需要自定义
    // 或者直接使用父类的实现
    super.setSegmentDataForContent();
    
    // 设置特效特有的片段属性
    this.segmentDataForContent.source_timerange = {
      start: this.effectStart,
      duration: this.effectDuration,
    };
    
    this.segmentDataForContent.target_timerange = {
      start: this.effectStart,
      duration: this.effectDuration,
    };
  }
}
