/**
 * 剪映草稿服务
 * 提供剪映草稿的创建、编辑和管理功能
 */

import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Draft } from './core/draft';
import { MediaFactory } from './core/mediaFactory';
import { DraftContext } from './core/draftContext';
import { ConfigHelper } from './config/config';
import { 
  generateTransitionData, 
  generateAnimationData, 
  fileExists
} from './utils/tools';
import {
  CreateDraftParamsType,
  AddMediaParamsType,
  AddTextParamsType,
  AddEffectParamsType,
  GenerateTransitionDataParamsType,
  GenerateAnimationDataParamsType,
  DraftInfoType,
  ServiceResponseType,
  MediaFileInfoType,
  ConfigManagementParamsType,
  DraftContextParamsType,
} from './_types/service.types';
import {
  DraftCreateOptions,
  AddMediaOptions,
  TransitionData,
  AnimationData,
} from './_types';

@Injectable()
export class JianyingService {
  /**
   * 创建新草稿
   * @param params 创建草稿参数
   * @returns 服务响应
   */
  public createDraft(params: CreateDraftParamsType = {}): ServiceResponseType<Draft> {
    try {
      const options: DraftCreateOptions = {
        name: params.name,
        config: {
          drafts_root: params.draftsRoot || path.join(process.cwd(), 'jianying-drafts'),
          default_image_duration: params.defaultImageDuration || 5000000,
        },
      };

      const draft = new Draft(options);
      
      return {
        success: true,
        data: draft,
        message: '草稿创建成功',
      };
    } catch (error) {
      return {
        success: false,
        message: `创建草稿失败: ${error.message}`,
        code: 'CREATE_DRAFT_ERROR',
      };
    }
  }

  /**
   * 向草稿添加媒体文件
   * @param draft 草稿对象
   * @param params 添加媒体参数
   * @returns 服务响应
   */
  public addMediaToDraft(
    draft: Draft,
    params: AddMediaParamsType,
  ): ServiceResponseType<void> {
    try {
      if (!fileExists(params.mediaFilePath)) {
        return {
          success: false,
          message: `媒体文件不存在: ${params.mediaFilePath}`,
          code: 'FILE_NOT_FOUND',
        };
      }

      if (!MediaFactory.isSupported(params.mediaFilePath)) {
        return {
          success: false,
          message: `不支持的媒体格式: ${path.extname(params.mediaFilePath)}`,
          code: 'UNSUPPORTED_FORMAT',
        };
      }

      const options: AddMediaOptions = {
        duration: params.duration,
        speed: params.speed,
        start_in_media: params.startInMedia,
        bgm_mute: params.bgmMute,
        fade_in_duration: params.fadeInDuration,
        fade_out_duration: params.fadeOutDuration,
        transition_data: params.transitionData,
        animation_datas: params.animationDatas,
      };

      draft.addMedia(params.mediaFilePath, 0, 0, 0, options);

      return {
        success: true,
        message: '媒体添加成功',
      };
    } catch (error) {
      return {
        success: false,
        message: `添加媒体失败: ${error.message}`,
        code: 'ADD_MEDIA_ERROR',
      };
    }
  }

  /**
   * 向草稿添加文本
   * @param draft 草稿对象
   * @param params 添加文本参数
   * @returns 服务响应
   */
  public addTextToDraft(
    draft: Draft,
    params: AddTextParamsType,
  ): ServiceResponseType<void> {
    try {
      const options: AddMediaOptions = {
        duration: params.duration,
      };

      draft.addText(params.textContent, options);

      return {
        success: true,
        message: '文本添加成功',
      };
    } catch (error) {
      return {
        success: false,
        message: `添加文本失败: ${error.message}`,
        code: 'ADD_TEXT_ERROR',
      };
    }
  }

  /**
   * 向草稿添加特效
   * @param draft 草稿对象
   * @param params 添加特效参数
   * @returns 服务响应
   */
  public addEffectToDraft(
    draft: Draft,
    params: AddEffectParamsType,
  ): ServiceResponseType<void> {
    try {
      draft.addEffect(params.effectNameOrResourceId, {
        start: params.start,
        duration: params.duration,
        index: params.index,
      });

      return {
        success: true,
        message: '特效添加成功',
      };
    } catch (error) {
      return {
        success: false,
        message: `添加特效失败: ${error.message}`,
        code: 'ADD_EFFECT_ERROR',
      };
    }
  }

  /**
   * 生成转场数据
   * @param params 生成转场数据参数
   * @returns 服务响应
   */
  public generateTransitionData(
    params: GenerateTransitionDataParamsType,
  ): ServiceResponseType<TransitionData> {
    try {
      const transitionData = generateTransitionData(
        params.nameOrResourceId,
        params.duration || 0,
      );

      return {
        success: true,
        data: transitionData,
        message: '转场数据生成成功',
      };
    } catch (error) {
      return {
        success: false,
        message: `生成转场数据失败: ${error.message}`,
        code: 'GENERATE_TRANSITION_ERROR',
      };
    }
  }

  /**
   * 生成动画数据
   * @param params 生成动画数据参数
   * @returns 服务响应
   */
  public generateAnimationData(
    params: GenerateAnimationDataParamsType,
  ): ServiceResponseType<AnimationData> {
    try {
      const animationData = generateAnimationData(
        params.nameOrResourceId,
        params.animationType || 'in',
        params.start || 0,
        params.duration || 0,
      );

      return {
        success: true,
        data: animationData,
        message: '动画数据生成成功',
      };
    } catch (error) {
      return {
        success: false,
        message: `生成动画数据失败: ${error.message}`,
        code: 'GENERATE_ANIMATION_ERROR',
      };
    }
  }

  /**
   * 保存草稿
   * @param draft 草稿对象
   * @returns 服务响应
   */
  public saveDraft(draft: Draft): ServiceResponseType<DraftInfoType> {
    try {
      draft.save();

      const draftInfo: DraftInfoType = {
        name: (draft as any).draftName,
        folderPath: (draft as any).draftFolder,
        duration: draft.calcDraftDuration(),
        createTime: Date.now(),
        modifyTime: Date.now(),
      };

      return {
        success: true,
        data: draftInfo,
        message: '草稿保存成功',
      };
    } catch (error) {
      return {
        success: false,
        message: `保存草稿失败: ${error.message}`,
        code: 'SAVE_DRAFT_ERROR',
      };
    }
  }

  /**
   * 获取媒体文件信息
   * @param filePath 文件路径
   * @returns 服务响应
   */
  public getMediaFileInfo(filePath: string): ServiceResponseType<MediaFileInfoType> {
    try {
      if (!fileExists(filePath)) {
        return {
          success: false,
          message: `文件不存在: ${filePath}`,
          code: 'FILE_NOT_FOUND',
        };
      }

      const stats = fs.statSync(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const fileName = path.basename(filePath);
      const isSupported = MediaFactory.isSupported(filePath);

      // 简单的媒体类型判断
      let mediaType = 'unknown';
      if (['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv'].includes(ext)) {
        mediaType = 'video';
      } else if (['.mp3', '.wav', '.aac', '.flac', '.ogg'].includes(ext)) {
        mediaType = 'audio';
      } else if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext)) {
        mediaType = 'image';
      }

      const mediaFileInfo: MediaFileInfoType = {
        filePath,
        fileName,
        fileSize: stats.size,
        mediaType,
        isSupported,
      };

      return {
        success: true,
        data: mediaFileInfo,
        message: '获取媒体文件信息成功',
      };
    } catch (error) {
      return {
        success: false,
        message: `获取媒体文件信息失败: ${error.message}`,
        code: 'GET_MEDIA_INFO_ERROR',
      };
    }
  }

  /**
   * 获取支持的文件格式
   * @returns 服务响应
   */
  public getSupportedFormats(): ServiceResponseType<string[]> {
    try {
      const formats = MediaFactory.getSupportedExtensions();
      
      return {
        success: true,
        data: formats,
        message: '获取支持格式成功',
      };
    } catch (error) {
      return {
        success: false,
        message: `获取支持格式失败: ${error.message}`,
        code: 'GET_FORMATS_ERROR',
      };
    }
  }

  /**
   * 批量添加媒体文件
   * @param draft 草稿对象
   * @param mediaFiles 媒体文件路径数组
   * @param commonOptions 公共选项
   * @returns 服务响应
   */
  public batchAddMedia(
    draft: Draft,
    mediaFiles: string[],
    commonOptions: Partial<AddMediaParamsType> = {},
  ): ServiceResponseType<{ success: number; failed: number; errors: string[] }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const filePath of mediaFiles) {
      const result = this.addMediaToDraft(draft, {
        mediaFilePath: filePath,
        ...commonOptions,
      });

      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push(`${filePath}: ${result.message}`);
      }
    }

    return {
      success: true,
      data: results,
      message: `批量添加完成，成功: ${results.success}，失败: ${results.failed}`,
    };
  }

  /**
   * 获取配置项
   * @param params 配置管理参数
   * @returns 服务响应
   */
  public getConfigItem(params: ConfigManagementParamsType): ServiceResponseType<any> {
    try {
      const value = ConfigHelper.getItem(params.section, params.key, params.defaultValue);
      
      return {
        success: true,
        data: value,
        message: '获取配置项成功',
      };
    } catch (error) {
      return {
        success: false,
        message: `获取配置项失败: ${error.message}`,
        code: 'GET_CONFIG_ERROR',
      };
    }
  }

  /**
   * 设置配置项
   * @param params 配置管理参数
   * @returns 服务响应
   */
  public setConfigItem(params: ConfigManagementParamsType): ServiceResponseType<void> {
    try {
      ConfigHelper.setItem(params.section, params.key, params.value);
      ConfigHelper.saveConfig();
      
      return {
        success: true,
        message: '设置配置项成功',
      };
    } catch (error) {
      return {
        success: false,
        message: `设置配置项失败: ${error.message}`,
        code: 'SET_CONFIG_ERROR',
      };
    }
  }

  /**
   * 获取所有配置
   * @returns 服务响应
   */
  public getAllConfig(): ServiceResponseType<Record<string, Record<string, any>>> {
    try {
      const { ConfigManager } = require('./config/config');
      const config = ConfigManager.getInstance().getAllConfig();
      
      return {
        success: true,
        data: config,
        message: '获取所有配置成功',
      };
    } catch (error) {
      return {
        success: false,
        message: `获取所有配置失败: ${error.message}`,
        code: 'GET_ALL_CONFIG_ERROR',
      };
    }
  }

  /**
   * 创建草稿上下文
   * @param params 草稿上下文参数
   * @returns 服务响应
   */
  public createDraftContext(params: DraftContextParamsType = {}): ServiceResponseType<DraftContext> {
    try {
      const context = new DraftContext(params.draftName, params.options);
      context.enter();
      
      return {
        success: true,
        data: context,
        message: '草稿上下文创建成功',
      };
    } catch (error) {
      return {
        success: false,
        message: `创建草稿上下文失败: ${error.message}`,
        code: 'CREATE_CONTEXT_ERROR',
      };
    }
  }

  /**
   * 使用草稿上下文执行操作
   * @param params 草稿上下文参数
   * @param callback 回调函数
   * @returns 服务响应
   */
  public async withDraftContext<T>(
    params: DraftContextParamsType,
    callback: (context: DraftContext) => T | Promise<T>,
  ): Promise<ServiceResponseType<T>> {
    try {
      const result = await DraftContext.withContext(
        params.draftName || '上下文草稿',
        callback,
        params.options,
      );
      
      return {
        success: true,
        data: result,
        message: '草稿上下文操作成功',
      };
    } catch (error) {
      return {
        success: false,
        message: `草稿上下文操作失败: ${error.message}`,
        code: 'CONTEXT_OPERATION_ERROR',
      };
    }
  }

  /**
   * 更改文本颜色
   * @param textMedia 文本媒体对象
   * @param color 颜色值
   * @returns 服务响应
   */
  public changeTextColor(textMedia: any, color: string): ServiceResponseType<void> {
    try {
      if (textMedia && typeof textMedia.changeColor === 'function') {
        textMedia.changeColor(color);
        
        return {
          success: true,
          message: '文本颜色修改成功',
        };
      } else {
        return {
          success: false,
          message: '无效的文本媒体对象',
          code: 'INVALID_TEXT_MEDIA',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `修改文本颜色失败: ${error.message}`,
        code: 'CHANGE_TEXT_COLOR_ERROR',
      };
    }
  }
}
