/**
 * 音频媒体类
 * 完全按照Python版本 mediaAudio.py 实现
 */

import { Media } from './media';
import * as template from './template';
import { generateId } from '../utils/tools';

/**
 * 音频媒体类
 */
export class MediaAudio extends Media {

  /**
   * 设置草稿文件的content部分
   */
  protected setMaterialDataForContent(): void {
    const speedId = generateId();
    const scmId = generateId();
    const beatId = generateId();

    this.materialDataForContent['speeds'] = this.getSpeed(speedId);
    this.materialDataForContent['sound_channel_mappings'] = this.getSoundChannelMapping(scmId);
    this.materialDataForContent['beats'] = this.getBeat(beatId);

    this.materialDataForContent["audios"] = this.generateMainData();
    // 将素材的各种业务信息，暂时保存起来，后续供track下的segment使用
    this.materialDataForContent["X.extra_material_refs"] = [speedId, scmId, beatId];

    // 以下为音频淡入淡出的效果
    const fadeInDuration = this.kwargs.fade_in_duration || 0;
    const fadeOutDuration = this.kwargs.fade_out_duration || 0;
    if (fadeInDuration > 0 || fadeOutDuration > 0) {
      const audioFadeId = generateId();
      this.materialDataForContent['audio_fades'] = this.getAudioFade(
        audioFadeId,
        fadeInDuration,
        fadeOutDuration
      );

      this.materialDataForContent["X.extra_material_refs"].push(audioFadeId);
    }
  }

  /**
   * 生成主要数据
   */
  private generateMainData(): any {
    const entity = template.getAudio(this.id);
    entity.duration = this.duration;
    entity.local_material_id = this.id;
    entity.material_name = this.materialName;
    entity.path = this.filePath;
    entity.type = "extract_" + this.materialType; // "extract_"前缀
    return entity;
  }

  /**
   * 获取速度模板
   */
  private getSpeed(guid: string): any {
    return {
      "curve_speed": null,
      "id": guid,
      "mode": 0,
      "speed": 1.0,
      "type": "speed"
    };
  }

  /**
   * 获取声道映射模板
   */
  private getSoundChannelMapping(guid: string): any {
    return {
      "audio_channel_mapping": 0,
      "id": guid,
      "is_config_open": false,
      "type": "sound_channel_mapping"
    };
  }

  /**
   * 获取节拍模板
   */
  private getBeat(guid: string): any {
    return {
      "ai_beats": {
        "beats_path": "",
        "beats_url": "",
        "melody_path": "",
        "melody_percents": [0.0],
        "melody_url": ""
      },
      "enable_ai_beats": false,
      "gear": 404,
      "id": guid,
      "mode": 404,
      "type": "beats",
      "user_beats": [],
      "user_delete_ai_beats": null
    };
  }

  /**
   * 获取音频淡入淡出模板
   */
  private getAudioFade(guid: string, fadeInDuration: number, fadeOutDuration: number): any {
    return {
      "fade_in_duration": fadeInDuration,
      "fade_out_duration": fadeOutDuration,
      "fade_type": 0,
      "id": guid,
      "type": "audio_fade"
    };
  }
}
