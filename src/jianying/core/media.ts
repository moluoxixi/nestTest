/**
 * 媒体基类
 * 所有媒体类型的基础抽象类
 */

import {
  MediaInfo, 
  AddMediaOptions, 
  MediaType, 
  MaterialType, 
  TrackType,
} from '../_types';
import { generateId, getBaseNameNoExtension } from '../utils/tools';
import { getMaterialForMetaInfo, getSegment } from '../templates/template';

/**
 * 媒体抽象基类
 */
export abstract class Media {
  /** 媒体类型映射到素材类型 */
  protected static readonly MEDIA_MATERIAL_TYPE_MAPPING: Record<MediaType, MaterialType> = {
    audio: 'music',
    image: 'photo',
    video: 'video',
    text: 'text',
  };

  /** 媒体类型映射到轨道类型 */
  protected static readonly MEDIA_CATEGORY_TYPE_MAPPING: Record<MediaType, TrackType> = {
    image: 'video',
    video: 'video',
    audio: 'audio',
    text: 'text',
  };

  // 基础属性
  /** 全局唯一标识符 */
  public readonly id: string;
  /** 媒体文件真实类型 */
  public mediaType: MediaType;
  /** 素材类型（在草稿中的类型） */
  public materialType: MaterialType;
  /** 轨道类型 */
  public categoryType: TrackType;
  /** 宽度 */
  public width: number;
  /** 高度 */
  public height: number;
  /** 时长（微秒） */
  public duration: number;
  /** 素材名称 */
  public materialName: string;
  /** 文件路径 */
  public filePath: string;
  /** 额外信息 */
  public extraInfo: string;

  // 业务属性
  /** 元数据信息 */
  public dataForMetaInfo: any;
  /** 内容数据 */
  public dataForContent: {
    material: Record<string, any>;
    segment: any;
  };
  /** 素材数据（用于内容） */
  public materialDataForContent: Record<string, any>;
  /** 片段数据（用于内容） */
  public segmentDataForContent: any;

  /** 传入的选项参数 */
  protected readonly options: AddMediaOptions;

  /**
   * 构造函数
   * @param mediaFileFullName 媒体文件完整路径
   * @param options 选项参数
   */
  protected constructor(mediaFileFullName: string, options: AddMediaOptions = {}) {
    this.options = options;

    // 初始化基础属性
    this.id = generateId();
    this.mediaType = 'video'; // 默认值，子类会覆盖
    this.materialType = 'video';
    this.categoryType = 'video';
    this.width = 0;
    this.height = 0;
    this.duration = 0;
    this.materialName = '';
    this.filePath = '';
    this.extraInfo = '';

    // 初始化基础信息前的钩子
    this.initBasicInfoBefore();

    // 加载文件基础信息
    this.loadFileBasicInfo(mediaFileFullName);

    // 加载媒体信息
    if (options.mediaInfo) {
      this.loadPropertyFromMediaInfo(options.mediaInfo);
    }

    // 设置类型信息
    this.setTypeInfo();

    // 处理自定义时长
    if (options.duration) {
      this.duration = options.duration;
    }

    // 初始化基础信息后的钩子
    this.initBasicInfoAfter();

    // 初始化业务属性
    this.dataForContent = {
      material: {},
      segment: {},
    };
    this.materialDataForContent = this.dataForContent.material;
    this.segmentDataForContent = this.dataForContent.segment;

    // 初始化业务信息前的钩子
    this.initBizInfoBefore();

    // 设置元数据信息
    this.dataForMetaInfo = getMaterialForMetaInfo(this.id);
    this.setDataForMetaInfo();

    // 设置内容数据
    this.setDataForContent();

    // 初始化业务信息后的钩子
    this.initBizInfoAfter();
  }

  /**
   * 初始化基础属性前的钩子（供子类重写）
   */
  protected initBasicInfoBefore(): void {
    // 子类可重写此方法
  }

  /**
   * 初始化基础属性后的钩子（供子类重写）
   */
  protected initBasicInfoAfter(): void {
    // 子类可重写此方法
  }

  /**
   * 初始化业务属性前的钩子（供子类重写）
   */
  protected initBizInfoBefore(): void {
    // 子类可重写此方法
  }

  /**
   * 初始化业务属性后的钩子（供子类重写）
   */
  protected initBizInfoAfter(): void {
    // 子类可重写此方法
  }

  /**
   * 加载文件基础信息
   * @param mediaFileFullName 媒体文件完整路径
   */
  private loadFileBasicInfo(mediaFileFullName: string): void {
    const mediaBaseNameNoExtension = getBaseNameNoExtension(mediaFileFullName);
    this.extraInfo = mediaBaseNameNoExtension;
    this.materialName = mediaBaseNameNoExtension;
    this.filePath = mediaFileFullName;
  }

  /**
   * 从媒体信息中加载属性
   * @param mediaInfo 媒体信息
   */
  private loadPropertyFromMediaInfo(mediaInfo: MediaInfo): void {
    if (!mediaInfo) {
      return;
    }

    this.mediaType = mediaInfo.track_type.toLowerCase() as MediaType;

    if (mediaInfo.width !== undefined && mediaInfo.height !== undefined) {
      this.width = mediaInfo.width;
      this.height = mediaInfo.height;
    }

    if (mediaInfo.duration !== undefined) {
      let duration = mediaInfo.duration * 1000000; // 转换为微秒（秒 * 1,000,000）
      
      // 如果设置了截取时间start_in_media，那么duration需要减去start_in_media的时间
      const startInMedia = this.options.start_in_media || 0;
      this.duration = duration - startInMedia;
    }
  }

  /**
   * 设置类型信息
   */
  private setTypeInfo(): void {
    // 如果选项中强制指定了媒体类型，使用指定的类型
    if (this.options.media_type) {
      this.mediaType = this.options.media_type;
    }

    // 设置素材类型
    if (Media.MEDIA_MATERIAL_TYPE_MAPPING[this.mediaType]) {
      this.materialType = Media.MEDIA_MATERIAL_TYPE_MAPPING[this.mediaType];
    } else {
      this.materialType = this.mediaType as MaterialType;
    }

    // 设置轨道类型
    if (Media.MEDIA_CATEGORY_TYPE_MAPPING[this.mediaType]) {
      this.categoryType = Media.MEDIA_CATEGORY_TYPE_MAPPING[this.mediaType];
    } else {
      this.categoryType = this.mediaType as TrackType;
    }
  }

  /**
   * 设置元数据信息
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
   * 设置内容数据
   */
  private setDataForContent(): void {
    this.setMaterialDataForContent();
    this.setSegmentDataForContent();
  }

  /**
   * 设置素材数据（抽象方法，子类必须实现）
   */
  protected abstract setMaterialDataForContent(): void;

  /**
   * 设置片段数据
   */
  protected setSegmentDataForContent(): void {
    const segment = getSegment();

    const speed = this.options.speed || 1.0;
    segment.speed = speed;
    
    const startInMedia = this.options.start_in_media || 0;

    segment.material_id = this.id;
    segment.extra_material_refs = this.materialDataForContent['X.extra_material_refs'] || [];

    segment.source_timerange = {
      duration: this.duration,
      start: startInMedia,
    };

    segment.target_timerange = {
      duration: this.duration / speed,
      start: 0,
    };

    this.segmentDataForContent = segment;
  }
}
