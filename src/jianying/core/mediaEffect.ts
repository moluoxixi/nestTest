/**
 * 特效媒体处理类
 * 完全按照Python版本 mediaEffect.py 实现
 */

import { Media } from './media'
import { getVideoEffect } from './template'
import { generateEffectData } from '../utils/tools'

/**
 * 特效媒体处理类
 * 继承自Media基类，专门处理视频特效
 */
export class MediaEffect extends Media {
  /**
   * 构造函数
   * @param kwargs 选项参数，包含 effect_name_or_resource_id 等
   */
  constructor(kwargs: any = {}) {
    // 设置默认媒体类型为 effect
    if (!kwargs.media_type) {
      kwargs.media_type = 'effect'
    }
    super(kwargs)
  }

  /**
   * 设置草稿文件的content部分（素材库）
   * 根据特效名称或资源ID生成特效数据，并添加到video_effects中
   */
  protected setMaterialDataForContent(): void {
    const effectNameOrResourceId = this.kwargs.effect_name_or_resource_id

    const effectData = generateEffectData(effectNameOrResourceId)
    effectData.guid = this.id // 使用Media实例的ID作为特效的GUID

    this.materialDataForContent.video_effects = getVideoEffect(effectData.guid, effectData.resourceId, effectData.name)

    // 特效的各种业务信息为空。后续供track下的segment使用
    this.materialDataForContent['X.extra_material_refs'] = []
  }
}
