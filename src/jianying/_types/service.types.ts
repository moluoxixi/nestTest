/**
 * 剪映服务相关类型定义
 */

import { 
  TransitionData,
  AnimationData 
} from './index';

/** 创建草稿参数类型 */
export interface CreateDraftParamsType {
  /** 草稿名称 */
  name?: string;
  /** 草稿根目录 */
  draftsRoot?: string;
  /** 图片默认时长（微秒） */
  defaultImageDuration?: number;
}

/** 添加媒体参数类型 */
export interface AddMediaParamsType {
  /** 媒体文件路径 */
  mediaFilePath: string;
  /** 播放时长（微秒） */
  duration?: number;
  /** 播放速度 */
  speed?: number;
  /** 媒体内开始时间（微秒） */
  startInMedia?: number;
  /** 背景音静音 */
  bgmMute?: boolean;
  /** 淡入时长（微秒） */
  fadeInDuration?: number;
  /** 淡出时长（微秒） */
  fadeOutDuration?: number;
  /** 转场数据 */
  transitionData?: TransitionData;
  /** 动画数据数组 */
  animationDatas?: AnimationData[];
}

/** 添加文本参数类型 */
export interface AddTextParamsType {
  /** 文本内容 */
  textContent: string;
  /** 播放时长（微秒） */
  duration?: number;
  /** 文本颜色 */
  textColor?: string;
  /** 文本大小 */
  textSize?: number;
  /** 对齐方式 */
  alignment?: number;
}

/** 配置管理参数类型 */
export interface ConfigManagementParamsType {
  /** 配置节名称 */
  section: string;
  /** 配置项键名 */
  key: string;
  /** 配置项值 */
  value?: any;
  /** 默认值 */
  defaultValue?: any;
}

/** 草稿上下文参数类型 */
export interface DraftContextParamsType {
  /** 草稿名称 */
  draftName?: string;
  /** 是否添加默认背景音乐 */
  addDefaultBgm?: boolean;
  /** 创建选项 */
  options?: CreateDraftParamsType;
}

/** 添加特效参数类型 */
export interface AddEffectParamsType {
  /** 特效名称或资源ID */
  effectNameOrResourceId: string | number;
  /** 开始时间（微秒） */
  start?: number;
  /** 持续时间（微秒） */
  duration?: number;
  /** 索引 */
  index?: number;
}

/** 生成转场数据参数类型 */
export interface GenerateTransitionDataParamsType {
  /** 转场名称或资源ID */
  nameOrResourceId: string | number;
  /** 持续时间（微秒） */
  duration?: number;
}

/** 生成动画数据参数类型 */
export interface GenerateAnimationDataParamsType {
  /** 动画名称或资源ID */
  nameOrResourceId: string | number;
  /** 动画类型 */
  animationType?: 'in' | 'out' | 'group';
  /** 开始时间（微秒） */
  start?: number;
  /** 持续时间（微秒） */
  duration?: number;
}

/** 草稿信息类型 */
export interface DraftInfoType {
  /** 草稿名称 */
  name: string;
  /** 草稿文件夹路径 */
  folderPath: string;
  /** 草稿时长（微秒） */
  duration: number;
  /** 创建时间 */
  createTime: number;
  /** 修改时间 */
  modifyTime: number;
}

/** 服务响应类型 */
export interface ServiceResponseType<T = any> {
  /** 是否成功 */
  success: boolean;
  /** 响应数据 */
  data?: T;
  /** 错误消息 */
  message?: string;
  /** 错误代码 */
  code?: string;
}

/** 媒体文件信息类型 */
export interface MediaFileInfoType {
  /** 文件路径 */
  filePath: string;
  /** 文件名 */
  fileName: string;
  /** 文件大小（字节） */
  fileSize: number;
  /** 媒体类型 */
  mediaType: string;
  /** 是否支持 */
  isSupported: boolean;
  /** 宽度（如果适用） */
  width?: number;
  /** 高度（如果适用） */
  height?: number;
  /** 时长（秒，如果适用） */
  duration?: number;
}
