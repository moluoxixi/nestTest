/**
 * 图片媒体处理类
 */

import { MediaVideo } from './mediaVideo';
import { AddMediaOptions } from '../_types';
import { ConfigHelper } from '../config/config';
import { getVideo } from '../templates/template';

/**
 * 图片媒体类
 * 继承自MediaVideo，因为图片在剪映中被当作视频处理
 */
export class MediaImage extends MediaVideo {

  /**
   * 构造函数
   * @param mediaFileFullName 媒体文件完整路径
   * @param options 选项参数
   */
  constructor(mediaFileFullName: string, options: AddMediaOptions = {}) {
    super(mediaFileFullName, options);
  }

  /**
   * 初始化基础属性后的钩子
   * 设置图片的默认时长
   */
  protected initBasicInfoAfter(): void {
    super.initBasicInfoAfter();
    
    // 如果没有设置时长，使用配置中的默认图片时长
    if (this.duration === 0) {
      this.duration = ConfigHelper.getItem('JianYingDraft.image', 'default_duration', 5000000);
    }
  }

  /**
   * 生成主要数据
   * @returns 视频数据对象（图片作为视频处理）
   */
  protected generateMainData(): any {
    // 完全按照Python版本的MediaImage.__generate_main_data实现
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
