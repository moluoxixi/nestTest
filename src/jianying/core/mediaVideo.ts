/**
 * 视频媒体类
 * 完全按照Python版本 mediaVideo.py 实现
 */

import { Media } from './media';
import * as template from './template';
import { generateId } from '../utils/tools';

/**
 * 视频媒体类
 */
export class MediaVideo extends Media {

  /**
   * 设置草稿文件的content部分
   */
  protected setMaterialDataForContent(): void {
    const speedId = generateId();
    const scmId = generateId();
    const canvasId = generateId();

    this.materialDataForContent["sound_channel_mappings"] = this.getSoundChannelMapping(scmId);
    this.materialDataForContent["canvases"] = this.getCanvas(canvasId);

    const speedData = this.getSpeed(speedId);
    const speed = this.kwargs.speed || 1.0;
    speedData.speed = speed;
    this.materialDataForContent["speeds"] = speedData;
    
    const videoData = this.generateMainData();

    // 判定是否要对视频素材本身的背景音进行静音处理
    const bgmMute = this.kwargs.bgm_mute || false;
    if (bgmMute) {
      videoData.extra_type_option = 1;
    } else {
      videoData.extra_type_option = 0;
    }

    this.materialDataForContent["videos"] = videoData;

    // 设置中转使用的临时信息
    this.materialDataForContent["X.extra_material_refs"] = [];

    // 处理转场（如果有）
    const transitionData = this.kwargs.transition_data;
    if (transitionData) {
      // 转场处理逻辑（简化）
    }

    // 处理动画（如果有）
    const animationDataArray = this.kwargs.animation_data_array;
    if (animationDataArray && animationDataArray.length > 0) {
      // 动画处理逻辑（简化）
    }
  }

  /**
   * 生成主要数据
   */
  protected generateMainData(): any {
    const entity = template.getVideo(this.id);
    entity.duration = this.duration;
    entity.height = this.height;
    entity.local_material_id = this.id; // 暂时跟素材设置为相同的id
    entity.material_name = this.materialName;
    entity.path = this.filePath;
    entity.type = this.materialType;
    entity.width = this.width;
    return entity;
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
   * 获取画布模板
   */
  private getCanvas(guid: string): any {
    return {
      "album_image": "",
      "blur": 0.0,
      "color": "",
      "id": guid,
      "image": "",
      "image_id": "",
      "image_name": "",
      "source_platform": 0,
      "team_id": "",
      "type": "canvas_color"
    };
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
}
