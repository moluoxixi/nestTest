/**
 * 草稿上下文管理器
 * 对应Python版本的DraftContext功能
 * 将创建和使用draft的公共功能都集中在此处
 */

import * as path from 'path';
import { Draft } from './draft';
import { DraftCreateOptions } from '../_types';
import { ConfigHelper } from '../config/config';

/**
 * 草稿上下文接口
 */
export interface IDraftContext {
  /** 草稿对象 */
  draft: Draft;
  /** 资源路径 */
  resPath: string;
  /** 项目根路径 */
  rootPath: string;
}

/**
 * 草稿上下文管理器类
 * 实现类似Python的with语句功能
 */
export class DraftContext implements IDraftContext {
  public draft: Draft;
  public resPath: string;
  public rootPath: string;

  /** 默认背景音乐文件名 */
  private static readonly DEFAULT_BGM_NAME = '似是故人来.wav';

  /**
   * 构造函数
   * @param draftName 草稿名称
   * @param options 创建选项
   */
  constructor(draftName = '', options: DraftCreateOptions = {}) {
    // 获取项目根路径
    this.rootPath = this.getProjectRootPath();

    // 设置资源路径
    this.resPath = path.join(this.rootPath, '.res');

    // 创建草稿
    const draftOptions: DraftCreateOptions = {
      name: draftName,
      config: {
        drafts_root: ConfigHelper.getItem('JianYingDraft.basic', 'drafts_root'),
        ...options.config,
      },
    };

    this.draft = new Draft(draftOptions);
  }

  /**
   * 获取项目根路径
   * @returns 项目物理根目录
   */
  private getProjectRootPath(): string {
    // 在Node.js中，我们使用process.cwd()作为项目根路径
    return process.cwd();
  }

  /**
   * 进入上下文（对应Python的__enter__）
   * @returns 上下文对象自身
   */
  public enter(): DraftContext {
    return this;
  }

  /**
   * 退出上下文（对应Python的__exit__）
   * @param addDefaultBgm 是否添加默认背景音乐
   */
  public exit(addDefaultBgm = true): void {
    try {
      // 添加默认背景音乐
      if (addDefaultBgm) {
        this.addDefaultBackgroundMusic();
      }

      // 保存草稿
      this.draft.save();
    } catch (error) {
      console.error('退出草稿上下文时发生错误:', error.message);
      throw error;
    }
  }

  /**
   * 添加默认背景音乐
   */
  private addDefaultBackgroundMusic(): void {
    try {
      const musicFullName = path.join(
        this.resPath,
        DraftContext.DEFAULT_BGM_NAME,
      );

      // 检查文件是否存在
      const fs = require('fs');
      if (fs.existsSync(musicFullName)) {
        // 添加音频，指定淡入淡出时长
        this.draft.addMedia(musicFullName, 0, 0, 0, {
          fade_in_duration: 1000000, // 1秒淡入
          fade_out_duration: 1500000, // 1.5秒淡出
        });

        console.log(`✓ 已添加默认背景音乐: ${DraftContext.DEFAULT_BGM_NAME}`);
      } else {
        console.log(`⚠ 默认背景音乐文件不存在: ${musicFullName}`);
      }
    } catch (error) {
      console.warn('添加默认背景音乐失败:', error.message);
    }
  }

  /**
   * 使用with语法糖（TypeScript版本）
   * @param draftName 草稿名称
   * @param callback 回调函数
   * @param options 创建选项
   */
  public static async withContext<T>(
    draftName: string,
    callback: (context: DraftContext) => T | Promise<T>,
    options: DraftCreateOptions = {},
  ): Promise<T> {
    const context = new DraftContext(draftName, options);

    try {
      context.enter();

      return await callback(context);
    } finally {
      context.exit();
    }
  }

  /**
   * 使用with语法糖（不添加默认BGM）
   * @param draftName 草稿名称
   * @param callback 回调函数
   * @param options 创建选项
   */
  public static async withContextNoBgm<T>(
    draftName: string,
    callback: (context: DraftContext) => T | Promise<T>,
    options: DraftCreateOptions = {},
  ): Promise<T> {
    const context = new DraftContext(draftName, options);

    try {
      context.enter();

      return await callback(context);
    } finally {
      context.exit(false); // 不添加默认BGM
    }
  }

  /**
   * 添加媒体文件（快捷方法）
   * @param mediaPath 媒体文件路径（相对于resPath）
   * @param options 添加选项
   */
  public addMedia(mediaPath: string, options: any = {}): void {
    const fullPath = path.isAbsolute(mediaPath)
      ? mediaPath
      : path.join(this.resPath, mediaPath);

    this.draft.addMedia(fullPath, options);
  }

  /**
   * 添加文本（快捷方法）
   * @param textContent 文本内容
   * @param options 添加选项
   */
  public addText(textContent: string, options: any = {}): void {
    this.draft.addText(textContent, options);
  }

  /**
   * 添加特效（快捷方法）
   * @param effectName 特效名称
   * @param options 特效选项
   */
  public addEffect(effectName: string | number, options: any = {}): void {
    this.draft.addEffect(effectName, options);
  }

  /**
   * 获取草稿时长
   * @returns 草稿时长（微秒）
   */
  public getDuration(): number {
    return this.draft.calcDraftDuration();
  }

  /**
   * 手动保存草稿
   */
  public save(): void {
    this.draft.save();
  }
}
