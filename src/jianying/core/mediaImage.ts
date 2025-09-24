/**
 * 图片媒体类
 * 完全按照Python版本 mediaImage.py 实现
 */

import { MediaVideo } from './mediaVideo';
import { ConfigHelper } from '../utils/config';
import * as template from './template';

/**
 * 图片媒体类
 * 继承自MediaVideo，因为图片在剪映中被当作视频处理
 */
export class MediaImage extends MediaVideo {

  /**
   * 在初始化基础属性后加载逻辑（供派生类使用）
   */
  protected initBasicInfoAfter(): void {
    // 如果没有设置时长，使用配置中的默认图片时长
    if (this.duration === 0) {
      const duration = ConfigHelper.getItem("JianYingDraft.image", "default_duration", 5000000);
      this.duration = duration;
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
}
