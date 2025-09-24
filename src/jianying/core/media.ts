/**
 * 媒体基类
 * 完全按照Python版本 media.py 实现
 */

import * as path from 'path';
import { generateId } from '../utils/tools';
import * as template from './template';

// 媒体信息接口
export interface MediaInfo {
  track_type: string;
  width?: number;
  height?: number;
  duration?: number;
  [key: string]: any;
}

/**
 * 媒体基类
 */
export abstract class Media {
  // 类型映射（完全按照Python版本）
  static readonly mediaMaterialTypeMapping: Record<string, string> = {
    "audio": "music",
    "image": "photo",
  };

  static readonly mediaCategoryTypeMapping: Record<string, string> = {
    "image": "video"
  };

  // 基础属性
  public id: string;
  public mediaType: string = '';
  public materialType: string = '';
  public categoryType: string = '';
  public width: number = 0;
  public height: number = 0;
  public duration: number = 0;
  public materialName: string = '';
  public filePath: string = '';
  public extraInfo: string = '';

  // 业务属性
  public dataForMetaInfo: any;
  public dataForContent: any;
  public materialDataForContent: any;
  public segmentDataForContent: any;

  // 保存传递进来的参数
  protected kwargs: any;

  constructor(kwargs: any = {}) {
    this.kwargs = kwargs;

    // A.1. 定义基础属性
    this.id = generateId(); // 在meta_info和content中都使用同一个guid

    // A.2 初始化基础属性
    // A.2.00. 为初始化基础属性前加载逻辑
    this.initBasicInfoBefore();

    // A.2.10. 加载各种资源的文件名称等基础信息
    const mediaFileFullName = kwargs.mediaFileFullName || "";
    const mediaBaseNameNoExtension = this.getBaseNameNoExtension(mediaFileFullName);
    this.extraInfo = mediaBaseNameNoExtension;
    this.materialName = mediaBaseNameNoExtension;
    this.filePath = mediaFileFullName;

    // A.2.20. 加载各种媒体公共的信息
    const mediaInfo = kwargs.mediaInfo;
    this.loadPropertyFromMediaInfo(mediaInfo);
    this.setTypeInfo();

    // A.2.30. 加载媒体的自定义设置
    const duration = kwargs.duration;
    if (duration) {
      this.duration = duration;
    }

    // A.2.99. 为初始化基础属性后加载逻辑
    this.initBasicInfoAfter();

    // B.1. 定义业务属性（最后暴露给草稿文件使用）
    // B.1.10. 定义暴露给draft_meta_info文件的属性
    this.dataForMetaInfo = this.getMaterialForMetaInfo(this.id);

    // B.1.20. 定义暴露给draft_content文件的属性
    this.dataForContent = {
      "material": {},
      "segment": {},
    };

    // B.2 初始化业务属性
    // B.2.00. 为初始化业务属性前加载逻辑
    this.initBizInfoBefore();

    // B.2.10. 对外暴露内容
    this.setDataForContent();

    // B.2.99. 为初始化业务属性后加载逻辑
    this.initBizInfoAfter();

    // 设置别名，方便调用
    this.materialDataForContent = this.dataForContent["material"];
    this.segmentDataForContent = this.dataForContent["segment"];

    // 最后，为draft_meta_info中的metetype准备信息
    this.setDataForMetaInfo();
  }

  /**
   * 在初始化基础属性前加载逻辑（供派生类使用）
   */
  protected initBasicInfoBefore(): void {
    // 可以被派生类重写
  }

  /**
   * 在初始化基础属性后加载逻辑（供派生类使用）
   */
  protected initBasicInfoAfter(): void {
    // 可以被派生类重写
  }

  /**
   * 在初始化业务属性前加载逻辑（供派生类使用）
   */
  protected initBizInfoBefore(): void {
    // 可以被派生类重写
  }

  /**
   * 在初始化业务属性后加载逻辑（供派生类使用）
   */
  protected initBizInfoAfter(): void {
    // 可以被派生类重写
  }

  /**
   * 为草稿文件draft_content准备信息
   */
  private setDataForContent(): void {
    this.setMaterialDataForContent();
    this.setSegmentDataForContent();
  }

  /**
   * 设置草稿文件的material部分（抽象方法，需要派生类实现）
   */
  protected abstract setMaterialDataForContent(): void;

  /**
   * 设置草稿文件track中的segment部分
   */
  protected setSegmentDataForContent(): void {
    const segment = template.getSegment();

    const speed = this.kwargs.speed || 1.0;
    segment.speed = speed; // 速度
    const startInMedia = this.kwargs.start_in_media || 0;

    segment.material_id = this.id;
    segment.extra_material_refs = this.materialDataForContent["X.extra_material_refs"];

    // 时长，如果开始时间大于0，那么播放时长 = 总时长 - 开始时间
    if (startInMedia > 0) {
      segment.source_timerange.start = startInMedia;
      segment.source_timerange.duration = this.duration - startInMedia;
    } else {
      segment.source_timerange.start = 0;
      segment.source_timerange.duration = this.duration;
    }

    // 轨道上的时长
    segment.target_timerange.duration = segment.source_timerange.duration;
    segment.target_timerange.start = 0; // 由外部设置

    this.dataForContent["segment"] = segment;
  }

  /**
   * 为草稿文件draft_meta_info准备信息
   */
  private setDataForMetaInfo(): void {
    this.dataForMetaInfo.metetype = this.materialType;
    this.dataForMetaInfo.width = this.width;
    this.dataForMetaInfo.height = this.height;
    this.dataForMetaInfo.duration = this.duration;
    this.dataForMetaInfo.extra_info = this.extraInfo;
    this.dataForMetaInfo.file_Path = this.filePath;
  }

  /**
   * 从媒体信息中加载素材信息
   */
  private loadPropertyFromMediaInfo(mediaInfo: MediaInfo): void {
    if (!mediaInfo) {
      return;
    }

    this.mediaType = mediaInfo.track_type.toLowerCase();

    if (mediaInfo.width !== undefined && mediaInfo.height !== undefined) {
      this.width = mediaInfo.width;
      this.height = mediaInfo.height;
    }

    if (mediaInfo.duration !== undefined) {
      // Python版本乘以1000，但根据实际需要应该是1000000（微秒）
      let duration = mediaInfo.duration * 1000000;
      // 如果设置了截取时间start_in_media，那么duration需要减去start_in_media的时间
      const startInMedia = this.kwargs.start_in_media || 0;
      this.duration = duration - startInMedia;
    }
  }

  /**
   * 设置类型信息
   */
  private setTypeInfo(): void {
    const type = this.kwargs.media_type;
    if (type) {
      this.mediaType = type;
    }

    if (this.mediaType in Media.mediaMaterialTypeMapping) {
      this.materialType = Media.mediaMaterialTypeMapping[this.mediaType];
    } else {
      this.materialType = this.mediaType;
    }

    if (this.mediaType in Media.mediaCategoryTypeMapping) {
      this.categoryType = Media.mediaCategoryTypeMapping[this.mediaType];
    } else {
      this.categoryType = this.mediaType;
    }
  }

  /**
   * 获取文件名（不包含扩展名）
   */
  private getBaseNameNoExtension(filePath: string): string {
    if (!filePath) return '';
    const baseName = path.basename(filePath);
    const extName = path.extname(baseName);
    return baseName.replace(extName, '');
  }

  /**
   * 获取元数据模板
   */
  private getMaterialForMetaInfo(guid: string): any {
    // 简化版的模板，对应Python的template.get_material_for_meta_info
    return {
      "create_time": Date.now(),
      "duration": 0,
      "extra_info": "",
      "file_Path": "",
      "height": 0,
      "id": guid,
      "import_time": Date.now(),
      "import_time_ms": Date.now(),
      "item_source": 1,
      "md5": "",
      "metetype": "",
      "roughcut_time_range": {"duration": 0, "start": 0},
      "sub_time_range": {"duration": -1, "start": -1},
      "type": 0,
      "width": 0
    };
  }
}