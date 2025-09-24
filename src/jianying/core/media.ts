/**
 * 素材的基类
 * 完全按照Python版本 media.py 实现
 */

import * as path from 'node:path'
import { generateId } from '../utils/tools'
import * as template from './template'

/**
 * 媒体信息接口
 */
export interface MediaInfo {
  track_type: string
  width?: number
  height?: number
  duration?: number
  [key: string]: any
}

/**
 * 素材的基类
 *
 * # 本代码的实现逻辑与说明
 * 1. 本类型的实例对应某一个加入到草稿中的媒体文件
 * 2. 本类型的属性，分为两类：素材的基础属性和业务属性
 *   2.1. 素材的基础属性，包括素材的长、宽、名称等固有信息
 *   2.2. 素材的业务属性，包括基于此素材进行的各种业务操作，比如播放速度（speed）等
 *
 * 3. 与文件draft_content内节点的对映关系
 *   3.1. 节点materials的videos（或者audio）数组中会保存media的基础属性
 *   3.2. 节点materials的speeds、sound_channel_mappings等几个数组中会保存media的业务属性
 *   3.3. 节点Tracks数组内的每个轨道，都有segments数组节点，数组的元素segment内保存media的基础属性，及其业务属性的id列表
 * 4. 与文件draft_meta_info内节点的对映关系
 *   数组draft_materials的第0和第8个元素，value数组的每个元素记录media的基础属性
 */
export abstract class Media {
  /** 媒体材料类型映射 */
  static readonly mediaMaterialTypeMapping: Record<string, string> = {
    audio: 'music',
    image: 'photo',
  }

  /** 媒体类别类型映射 */
  static readonly mediaCategoryTypeMapping: Record<string, string> = {
    image: 'video',
  }

  // 基础属性
  /** 唯一标识ID */
  public id: string
  /** 媒体文件真实的类型 */
  public mediaType: string = ''
  /** 媒体添加到草稿里面，对应的素材类型（比如图片媒体文件image，对应的素材类型就是photo） */
  public materialType: string = ''
  /** 媒体添加到草稿里面，素材所属类目（比如图片对应的类目就是Video） */
  public categoryType: string = ''
  /** 宽度 */
  public width: number = 0
  /** 高度 */
  public height: number = 0
  /** 持续时间（微秒） */
  public duration: number = 0
  /** 素材名称 */
  public materialName: string = ''
  /** 文件路径 */
  public filePath: string = ''
  /** 额外信息 */
  public extraInfo: string = ''

  // 业务属性
  /** 暴露给draft_meta_info文件的属性 */
  public dataForMetaInfo: any
  /** 暴露给draft_content文件的属性 */
  public dataForContent: any
  /** material组的别名，方便调用 */
  public materialDataForContent: any
  /** segment组的别名，方便调用 */
  public segmentDataForContent: any

  /** 保存传递进来的kwargs，供后续灵活使用 */
  protected kwargs: any

  /**
   * 初始化数据
   * 初始化数据分为两个阶段：
   * 1. 初始化基础属性（media本身的属性，比如width等）
   * 2. 初始化业务属性（media为组成草稿准备的属性，比如轨道的segment等）
   * 针对这2个阶段，设置4个钩子，派生类可以根据情况调用：
   * 1. initBasicInfoBefore
   * 2. initBasicInfoAfter
   * 3. initBizInfoBefore
   * 4. initBizInfoAfter
   * @param kwargs 初始化参数
   */
  constructor(kwargs: any = {}) {
    // 00. 保存传递进来的kwargs，供后续灵活使用
    this.kwargs = kwargs

    // A.1. 定义基础属性
    this.id = generateId() // 在meta_info和content中都使用同一个guid

    // A.2 初始化基础属性
    // A.2.00. 为初始化基础属性前加载逻辑
    this.initBasicInfoBefore()

    // A.2.10. 加载各种资源的文件名称等基础信息
    const mediaFileFullName = kwargs.mediaFileFullName || ''
    const mediaBaseNameNoExtension = this.getBaseNameNoExtension(mediaFileFullName)
    this.extraInfo = mediaBaseNameNoExtension
    this.materialName = mediaBaseNameNoExtension
    this.filePath = mediaFileFullName

    // A.2.20. 加载各种媒体公共的信息
    const mediaInfo = kwargs.mediaInfo
    this.loadPropertyFromMediaInfo(mediaInfo)
    this.setTypeInfo()

    // A.2.30. 加载媒体的自定义设置
    const duration = kwargs.duration || 0
    if (duration) {
      this.duration = duration
    }

    // A.2.99. 为初始化基础属性后加载逻辑
    this.initBasicInfoAfter()

    // B.1. 定义业务属性（最后暴露给草稿文件使用）

    // B.1.10. 定义暴露给draft_meta_info文件的属性
    this.dataForMetaInfo = template.getMaterialForMetaInfo(this.id)

    // B.1.20. 定义暴露给draft_content文件的属性
    // 内部有各种属性分为两组，并分别为两个组设置别名：material_for_content,track_for_content
    // 第1组. material组（speed、sound_channel_mapping等，当然最重要的是video（或者audio））
    // 这些属性最后都会最成为materials各种数组属性的元素（比如此处的speed会保存为materials.speeds数组的一个元素：
    // materials.speeds = [speed1, speed2, speed3, ...]。此处的其他各属性亦然。）
    // 第2组. track组（segments等）
    // 具体内容在派生类中实现
    this.dataForContent = {
      material: {},
      segment: {},
    }
    this.materialDataForContent = this.dataForContent.material
    this.segmentDataForContent = this.dataForContent.segment

    // B.2.00. 为初始化业务属性前加载逻辑
    this.initBizInfoBefore()

    // B.2.10. 设置草稿文件的meta_info部分
    this.setDataForMetaInfo()

    // B.2.20. 设置草稿文件的content部分
    // 此部分功能在派生类中实现
    this.setDataForContent()

    // B.2.99. 为初始化业务属性后加载逻辑
    this.initBizInfoAfter()
  }

  /**
   * 在初始化基础属性前加载逻辑（供派生类使用）
   */
  protected initBasicInfoBefore(): void {}

  /**
   * 在初始化基础属性后加载逻辑（供派生类使用）
   */
  protected initBasicInfoAfter(): void {}

  /**
   * 在初始化业务属性前加载逻辑（供派生类使用）
   */
  protected initBizInfoBefore(): void {}

  /**
   * 在初始化业务属性后加载逻辑（供派生类使用）
   */
  protected initBizInfoAfter(): void {}

  /**
   * 为草稿文件draft_content准备信息
   */
  private setDataForContent(): void {
    this.setMaterialDataForContent()
    this.setSegmentDataForContent()
  }

  /**
   * 设置草稿文件的material部分（抽象方法，需要派生类实现）
   */
  protected abstract setMaterialDataForContent(): void

  /**
   * 设置草稿文件track中的segment部分
   */
  protected setSegmentDataForContent(): void {
    const segment = template.getSegment()

    // 将本片段应该表示的素材类型，临时记录在"X.xx"内
    // segment['X.material_type'] = this.material_type

    const speed = this.kwargs.speed || 1.0
    segment.speed = speed // 速度
    const startInMedia = this.kwargs.start_in_media || 0

    segment.material_id = this.id
    segment.extra_material_refs = this.materialDataForContent['X.extra_material_refs']

    segment.source_timerange = { duration: this.duration, start: startInMedia } // 使用原素材的开始位置和使用时长信息（素材自己的时间）
    segment.target_timerange = { duration: this.duration / speed, start: 0 } // 放入轨道上的开始位置和使用时长信息（轨道上的时间）

    this.segmentDataForContent = segment
  }

  /**
   * 为稿文件draft_meta_info准备信息
   */
  private setDataForMetaInfo(): void {
    this.dataForMetaInfo.metetype = this.materialType
    this.dataForMetaInfo.width = this.width
    this.dataForMetaInfo.height = this.height
    this.dataForMetaInfo.duration = this.duration
    this.dataForMetaInfo.extra_info = this.extraInfo
    this.dataForMetaInfo.file_Path = this.filePath
  }

  /**
   * 从媒体信息中加载素材信息
   * @param mediaInfo 媒体信息对象
   */
  private loadPropertyFromMediaInfo(mediaInfo: MediaInfo): void {
    if (!mediaInfo) {
      return
    }

    this.mediaType = mediaInfo.track_type.toLowerCase()

    if ('width' in mediaInfo) {
      this.width = mediaInfo.width!
      this.height = mediaInfo.height!
    }

    if ('duration' in mediaInfo) {
      const duration = mediaInfo.duration! * 1000 // Python版本乘以1000
      // 如果设置了截取时间start_in_media，那么duration需要减去start_in_media的时间
      const startInMedia = this.kwargs.start_in_media || 0
      this.duration = duration - startInMedia
    }
  }

  /**
   * 设置类型信息
   */
  private setTypeInfo(): void {
    const type = this.kwargs.media_type || ''
    if (type) {
      this.mediaType = type
    }

    if (this.mediaType in Media.mediaMaterialTypeMapping) {
      this.materialType = Media.mediaMaterialTypeMapping[this.mediaType]
    }
    else {
      this.materialType = this.mediaType
    }

    if (this.mediaType in Media.mediaCategoryTypeMapping) {
      this.categoryType = Media.mediaCategoryTypeMapping[this.mediaType]
    }
    else {
      this.categoryType = this.mediaType
    }
  }

  /**
   * 获取文件名（不包含扩展名）
   * 对应Python的FileHelper.get_base_name_no_extension
   * @param filePath 文件路径
   * @returns 不包含扩展名的文件名
   */
  private getBaseNameNoExtension(filePath: string): string {
    if (!filePath)
      return ''
    const baseName = path.basename(filePath)
    const extName = path.extname(baseName)
    return baseName.replace(extName, '')
  }
}
