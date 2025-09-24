/**
 * 视频媒体处理类
 */

import { Media } from './media';
import { AddMediaOptions, AnimationData, TransitionData } from '../_types';
import { generateId } from '../utils/tools';
import {
  getCanvas,
  getDetailAnimation,
  getMaterialAnimation,
  getSoundChannelMapping,
  getSpeed,
  getTransition,
  getVideo,
} from '../templates/template';

/**
 * 视频媒体类
 */
export class MediaVideo extends Media {
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
    const canvasId = generateId();

    // 设置声道映射
    this.materialDataForContent['sound_channel_mappings'] =
      getSoundChannelMapping(scmId);

    // 设置画布
    this.materialDataForContent['canvases'] = getCanvas(canvasId);

    // 设置速度
    const speedData = getSpeed(speedId);

    speedData.speed = this.options.speed || 1.0;
    this.materialDataForContent['speeds'] = speedData;

    // 设置视频数据
    const videoData = this.generateMainData();

    // 判定是否要对视频素材本身的背景音进行静音处理
    const bgmMute = this.options.bgm_mute || false;
    if (bgmMute) {
      videoData.extra_type_option = 1;
    } else {
      videoData.extra_type_option = 0;
    }

    this.materialDataForContent['videos'] = videoData;

    // 将素材的各种业务信息，暂时保存起来，后续供track下的segment使用
    this.materialDataForContent['X.extra_material_refs'] = [
      speedId,
      scmId,
      canvasId,
    ];

    // 处理转场效果
    this.handleTransitionData();

    // 处理视频动画
    this.handleAnimationData();
  }

  /**
   * 处理转场数据
   */
  private handleTransitionData(): void {
    const transitionData: TransitionData | undefined = this.options.transition_data;
    if (transitionData) {
      const transitionGuid = generateId();
      transitionData.guid = transitionGuid;
      
      this.materialDataForContent['transitions'] = getTransition(
        transitionData.guid,
        transitionData.resource_id,
        transitionData.name,
        transitionData.duration,
      );
      
      this.materialDataForContent['X.extra_material_refs'].push(transitionGuid);
    }
  }

  /**
   * 处理动画数据
   */
  private handleAnimationData(): void {
    const animationDatas: AnimationData[] | undefined = this.options.animation_datas;
    if (animationDatas && animationDatas.length > 0) {
      const animationGuid = generateId();
      const materialAnimations = getMaterialAnimation(animationGuid);

      for (const animationData of animationDatas) {
        let animationStart = animationData.start;
        
        // 如果是入场动画，则动画的起始时间为0
        if (animationData.animation_type === 'in') {
          animationStart = 0;
        }

        // 如果是出场动画，则动画的起始时间为素材的持续时间向前推动画时长duration
        if (animationData.animation_type === 'out') {
          animationStart = this.duration - animationData.duration;
        }

        const animationEntity = getDetailAnimation(
          animationData.resource_id,
          animationData.name,
          animationData.animation_type,
          animationStart,
          animationData.duration,
        );

        materialAnimations.animations.push(animationEntity);
      }

      this.materialDataForContent['material_animations'] = materialAnimations;
      this.materialDataForContent['X.extra_material_refs'].push(animationGuid);
    }
  }

  /**
   * 生成主要数据
   * @returns 视频数据对象
   */
  protected generateMainData(): any {
    const entity = getVideo(this.id);
    entity.duration = this.duration;
    entity.height = this.height;
    entity.local_material_id = this.id; // 暂时跟素材设置为相同的id
    entity.material_name = this.materialName;
    entity.path = this.filePath;
    entity.type = this.materialType;
    entity.width = this.width;
    return entity;
  }
}
