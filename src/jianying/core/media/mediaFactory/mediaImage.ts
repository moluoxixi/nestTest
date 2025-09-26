/**
 * @file   : mediaImage.ts
 * @time   : 15:23
 * @date   : 2024/3/23
 * @mail   : 9727005@qq.com
 * @creator: ShanDong Xiedali
 * @company: HiLand & RainyTop
 *
 * 图片媒体处理类
 * 完全按照Python版本 mediaImage.py 一比一还原
 */

import { getItem } from '@/jianying/utils/configHelper'
import { getVideo } from '../../template'
import { MediaVideo } from './mediaVideo'

// TODO:xiedali@2024/03/27 功能需要实现

/**
 * 图片媒体处理类
 * 继承自MediaVideo，因为图片在剪映中被当作视频处理
 */
export class MediaImage extends MediaVideo {
  /**
   * 在初始化基础属性后加载逻辑（供派生类使用）
   */
  protected initBasicInfoAfter(): void {
    super.initBasicInfoAfter()

    // duration = self.kwargs.get("duration", 0)
    if (this.duration === 0) {
      this.duration = getItem(
        'JianYingDraft.image',
        'default_duration',
        5000000,
      )
    }
  }

  /**
   * 生成图片主数据
   * @returns 图片实体数据
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
