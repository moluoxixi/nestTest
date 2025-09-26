/**
 * @file   : mediaAudio.ts
 * @time   : 15:23
 * @date   : 2024/3/23
 * @mail   : 9727005@qq.com
 * @creator: ShanDong Xiedali
 * @company: HiLand & RainyTop
 *
 * 音频媒体处理类
 * 完全按照Python版本 mediaAudio.py 一比一还原
 */

import { getAudio, getAudioFade, getBeat, getSoundChannelMapping, getSpeed } from '../../template'
import { Media } from '../media'
import { generateId } from '@/jianying/utils/tools'

/**
 * 音频媒体处理类
 * 继承自Media基类，专门处理音频文件
 */
export class MediaAudio extends Media {
  /**
   * 设置草稿文件的content部分（素材库）
   * 为音频媒体设置速度、声道映射、节拍等业务属性
   */
  protected setMaterialDataForContent(): void {
    const speedId = generateId()
    const scmId = generateId()
    const beatId = generateId()

    this.materialDataForContent.speeds = getSpeed(speedId)
    this.materialDataForContent.sound_channel_mappings = getSoundChannelMapping(scmId)
    this.materialDataForContent.beats = getBeat(beatId)

    this.materialDataForContent.audios = this.generateMainData()
    // 将素材的各种业务信息，暂时保存起来，后续供track下的segment使用
    this.materialDataForContent['X.extra_material_refs'] = [speedId, scmId, beatId]

    // 以下为音频淡入淡出的效果
    const fadeInDuration = this.kwargs.fade_in_duration || 0
    const fadeOutDuration = this.kwargs.fade_out_duration || 0
    if (fadeInDuration > 0 || fadeOutDuration > 0) {
      const audioFadeId = generateId()
      this.materialDataForContent.audio_fades = getAudioFade(
        audioFadeId,
        fadeInDuration,
        fadeOutDuration,
      )

      this.materialDataForContent['X.extra_material_refs'].push(audioFadeId)
    }
  }

  /**
   * 生成音频主数据
   * @returns 音频实体数据
   */
  private generateMainData(): any {
    const entity = getAudio(this.id)
    entity.duration = this.duration
    entity.local_material_id = this.id
    entity.name = this.materialName
    entity.path = this.filePath
    entity.type = `extract_${this.materialType}` // "extract_"??什么时候不加这个前缀
    return entity
  }
}
