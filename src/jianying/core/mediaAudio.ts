/**
 * 音频媒体处理类
 */

import { Media } from './media';
import { AddMediaOptions } from '../_types';
import { generateId } from '../utils/tools';
import {
  getSpeed,
  getSoundChannelMapping,
  getBeat,
  getAudio,
  getAudioFade,
} from '../templates/template';

/**
 * 音频媒体类
 */
export class MediaAudio extends Media {
  /**
   * 构造函数
   * @param mediaFileFullName 媒体文件完整路径
   * @param options 选项参数
   */
  constructor(mediaFileFullName: string, options: AddMediaOptions = {}) {
    super(mediaFileFullName, options);
  }

  /**
   * 设置素材数据（用于内容）
   */
  protected setMaterialDataForContent(): void {
    const speedId = generateId();
    const scmId = generateId();
    const beatId = generateId();

    // 设置速度
    this.materialDataForContent['speeds'] = getSpeed(speedId);
    
    // 设置声道映射
    this.materialDataForContent['sound_channel_mappings'] = getSoundChannelMapping(scmId);
    
    // 设置节拍
    this.materialDataForContent['beats'] = getBeat(beatId);

    // 设置音频数据
    this.materialDataForContent['audios'] = this.generateMainData();
    
    // 将素材的各种业务信息，暂时保存起来，后续供track下的segment使用
    this.materialDataForContent['X.extra_material_refs'] = [speedId, scmId, beatId];

    // 处理音频淡入淡出效果
    this.handleAudioFade();
  }

  /**
   * 处理音频淡入淡出效果
   */
  private handleAudioFade(): void {
    const fadeInDuration = this.options.fade_in_duration || 0;
    const fadeOutDuration = this.options.fade_out_duration || 0;
    
    if (fadeInDuration > 0 || fadeOutDuration > 0) {
      const audioFadeId = generateId();
      this.materialDataForContent['audio_fades'] = getAudioFade(
        audioFadeId,
        fadeInDuration,
        fadeOutDuration,
      );

      this.materialDataForContent['X.extra_material_refs'].push(audioFadeId);
    }
  }

  /**
   * 生成主要数据
   * @returns 音频数据对象
   */
  private generateMainData(): any {
    const entity = getAudio(this.id);
    entity.duration = this.duration;
    entity.local_material_id = this.id;
    entity.name = this.materialName;
    entity.path = this.filePath;
    entity.type = `extract_${this.materialType}`; // "extract_"前缀
    return entity;
  }
}
