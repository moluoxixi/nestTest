/**
 * 剪映草稿相关类型定义
 */

/** 动画类型 */
export type AnimationTypes = "in" | "out" | "group";

/** 媒体类型 */
export type MediaType = "video" | "audio" | "image" | "text";

/** 素材类型 */
export type MaterialType = "video" | "music" | "photo" | "text";

/** 轨道类型 */
export type TrackType = "video" | "audio" | "text";

/** 资源数据基础接口 */
export interface ResourceData {
  /** 全局唯一标识符 */
  guid: string;
  /** 资源名称 */
  name: string;
  /** 资源ID */
  resource_id: string;
}

/** 带时长的资源数据接口 */
export interface DurationResourceData extends ResourceData {
  /** 开始时间（微秒） */
  start: number;
  /** 持续时间（微秒） */
  duration: number;
}

/** 特效数据接口 */
export interface EffectData extends DurationResourceData {}

/** 转场数据接口 */
export interface TransitionData extends DurationResourceData {}

/** 动画数据接口 */
export interface AnimationData extends DurationResourceData {
  /** 动画类型 */
  animation_type: AnimationTypes;
}

/** 媒体信息接口 */
export interface MediaInfo {
  /** 媒体轨道类型 */
  track_type: string;
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 时长（秒） */
  duration?: number;
  /** 其他属性 */
  [key: string]: any;
}

/** 添加媒体参数接口 */
export interface AddMediaOptions {
  /** 播放时长（微秒） */
  duration?: number;
  /** 播放速度 */
  speed?: number;
  /** 媒体内开始时间（微秒） */
  start_in_media?: number;
  /** 背景音静音 */
  bgm_mute?: boolean;
  /** 淡入时长（微秒） */
  fade_in_duration?: number;
  /** 淡出时长（微秒） */
  fade_out_duration?: number;
  /** 转场数据 */
  transition_data?: TransitionData;
  /** 动画数据数组 */
  animation_datas?: AnimationData[];
  /** 媒体类型（强制指定） */
  media_type?: MediaType;
  /** 媒体信息（内部使用） */
  mediaInfo?: MediaInfo;
}

/** 添加特效参数接口 */
export interface AddEffectOptions {
  /** 开始时间（微秒） */
  start?: number;
  /** 持续时间（微秒） */
  duration?: number;
  /** 索引 */
  index?: number;
}

/** 时间范围接口 */
export interface TimeRange {
  /** 开始时间（微秒） */
  start: number;
  /** 持续时间（微秒） */
  duration: number;
}

/** 剪映配置接口 */
export interface JianyingConfig {
  /** 草稿根目录 */
  drafts_root: string;
  /** 图片默认时长（微秒） */
  default_image_duration: number;
}

/** 草稿创建选项接口 */
export interface DraftCreateOptions {
  /** 草稿名称 */
  name?: string;
  /** 配置选项 */
  config?: Partial<JianyingConfig>;
}

// 导出模板类型
export * from './template.types';
