/**
 * @file   : mediaVideo.ts
 * @time   : 15:23
 * @date   : 2024/3/23
 * @mail   : 9727005@qq.com
 * @creator: ShanDong Xiedali
 * @company: HiLand & RainyTop
 *
 * 视频媒体处理类
 * 完全按照Python版本 mediaVideo.py 一比一还原
 */

import {
  getCanvas,
  getDetailAnimation,
  getMaterialAnimation,
  getSoundChannelMapping,
  getSpeed,
  getTransition,
  getVideo,
} from './template'
import { Media } from './media'
import { generateId } from '../utils/tools'
import { AnimationData, TransitionData } from '../utils/dataStruct'

/**
 * 视频媒体处理类
 * 继承自Media基类，专门处理视频文件
 */
export class MediaVideo extends Media {
  /**
   * 设置草稿文件的content部分
   */
  protected setMaterialDataForContent(): void {
    const speedId = generateId()
    const scmId = generateId()
    const canvasId = generateId()

    this.materialDataForContent.sound_channel_mappings = getSoundChannelMapping(scmId)
    this.materialDataForContent.canvases = getCanvas(canvasId)

    const speedData = getSpeed(speedId)
    speedData.speed = this.kwargs.speed || 1.0
    this.materialDataForContent.speeds = speedData
    const videoData = this.generateMainData()

    // 判定是否要对视频素材本身的背景音进行静音处理
    const bgmMute = this.kwargs.bgm_mute || false
    if (bgmMute) {
      videoData.extra_type_option = 1
    }
    else {
      videoData.extra_type_option = 0
    }

    this.materialDataForContent.videos = videoData

    // 将素材的各种业务信息，暂时保存起来，后续供track下的segment使用
    this.materialDataForContent['X.extra_material_refs'] = [speedId, scmId, canvasId]

    // 处理转场效果
    const transitionData: TransitionData | null = this.kwargs.transition_data || null
    if (transitionData) {
      const transitionGuid = generateId()
      transitionData.guid = transitionGuid
      this.materialDataForContent.transitions = getTransition(
        transitionData.guid,
        transitionData.resourceId,
        transitionData.name,
        transitionData.duration,
      )
      this.materialDataForContent['X.extra_material_refs'].push(transitionGuid)
    }

    // 处理视频动画
    const animationDatas: AnimationData[] | null = this.kwargs.animation_datas || null
    if (animationDatas) {
      const animationGuid = generateId()
      const materialAnimations = getMaterialAnimation(animationGuid)

      for (const animationData of animationDatas) {
        let animationStart = animationData.start
        // 如果是入场动画，则动画的起始时间为0
        if (animationData.animationType === 'in') {
          animationStart = 0
        }

        // 如果是出场动画，则动画的起始时间为素材的持续时间向前推动画时长duration
        if (animationData.animationType === 'out') {
          animationStart = this.duration - animationData.duration
        }
        const animationEntity = getDetailAnimation(
          animationData.resourceId,
          animationData.name,
          animationData.animationType,
          animationStart,
          animationData.duration,
        )

        materialAnimations.animations.push(animationEntity)
      }

      this.materialDataForContent.material_animations = materialAnimations
      this.materialDataForContent['X.extra_material_refs'].push(animationGuid)
    }
  }

  /**
   * 生成视频主数据
   * @returns 视频实体数据
   */
  protected generateMainData(): any {
    const entity = getVideo(this.id)
    entity.duration = this.duration
    entity.height = this.height
    entity.local_material_id = this.id // 暂时跟素材设置为相同的id
    entity.material_name = this.materialName
    entity.path = this.filePath
    entity.type = this.materialType
    entity.width = this.width
    return entity
  }
}
