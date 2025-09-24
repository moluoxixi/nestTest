/**
 * 剪映草稿配置管理器
 * 对应Python版本的ConfigHelper功能
 */

import * as fs from 'fs';
import * as path from 'path';
import { JianyingConfig } from '../_types';

/**
 * 配置管理器类
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private config: Map<string, Map<string, any>> = new Map();
  private configFilePath: string;

  /**
   * 私有构造函数，实现单例模式
   */
  private constructor() {
    this.configFilePath = path.join(process.cwd(), 'jianying.config.json');
    this.loadDefaultConfig();
    this.loadConfigFromFile();
  }

  /**
   * 获取配置管理器实例
   * @returns 配置管理器实例
   */
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * 加载默认配置
   */
  private loadDefaultConfig(): void {
    // JianYingDraft.basic 配置节
    const basicConfig = new Map<string, any>();
    basicConfig.set('drafts_root', path.join(process.cwd(), 'jianying-drafts'));
    this.config.set('JianYingDraft.basic', basicConfig);

    // JianYingDraft.image 配置节
    const imageConfig = new Map<string, any>();
    imageConfig.set('default_duration', 5000000); // 5秒，单位微秒
    this.config.set('JianYingDraft.image', imageConfig);

    // JianYingDraft.video 配置节
    const videoConfig = new Map<string, any>();
    videoConfig.set('default_speed', 1.0);
    videoConfig.set('default_bgm_mute', false);
    this.config.set('JianYingDraft.video', videoConfig);

    // JianYingDraft.audio 配置节
    const audioConfig = new Map<string, any>();
    audioConfig.set('default_fade_in_duration', 0);
    audioConfig.set('default_fade_out_duration', 0);
    this.config.set('JianYingDraft.audio', audioConfig);

    // JianYingDraft.text 配置节
    const textConfig = new Map<string, any>();
    textConfig.set('default_duration', 5000000); // 5秒
    textConfig.set('default_color', '#FFFFFF');
    textConfig.set('default_size', 30);
    textConfig.set('default_alignment', 1); // 居中对齐
    this.config.set('JianYingDraft.text', textConfig);
  }

  /**
   * 从文件加载配置
   */
  private loadConfigFromFile(): void {
    try {
      if (fs.existsSync(this.configFilePath)) {
        const configData = JSON.parse(fs.readFileSync(this.configFilePath, 'utf-8'));
        
        for (const [section, items] of Object.entries(configData)) {
          if (!this.config.has(section)) {
            this.config.set(section, new Map());
          }
          
          const sectionConfig = this.config.get(section)!;
          for (const [key, value] of Object.entries(items as any)) {
            sectionConfig.set(key, value);
          }
        }
      }
    } catch (error) {
      console.warn('加载配置文件失败，使用默认配置:', error.message);
    }
  }

  /**
   * 保存配置到文件
   */
  public saveConfigToFile(): void {
    try {
      const configData: any = {};
      
      for (const [section, items] of this.config.entries()) {
        configData[section] = {};
        for (const [key, value] of items.entries()) {
          configData[section][key] = value;
        }
      }
      
      fs.writeFileSync(this.configFilePath, JSON.stringify(configData, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存配置文件失败:', error.message);
    }
  }

  /**
   * 获取配置项
   * @param section 配置节名称
   * @param key 配置项键名
   * @param defaultValue 默认值
   * @returns 配置项值
   */
  public getItem<T = any>(section: string, key: string, defaultValue?: T): T {
    const sectionConfig = this.config.get(section);
    if (sectionConfig && sectionConfig.has(key)) {
      return sectionConfig.get(key) as T;
    }
    return defaultValue as T;
  }

  /**
   * 设置配置项
   * @param section 配置节名称
   * @param key 配置项键名
   * @param value 配置项值
   */
  public setItem(section: string, key: string, value: any): void {
    if (!this.config.has(section)) {
      this.config.set(section, new Map());
    }
    
    const sectionConfig = this.config.get(section)!;
    sectionConfig.set(key, value);
  }

  /**
   * 获取剪映配置对象
   * @returns 剪映配置对象
   */
  public getJianyingConfig(): JianyingConfig {
    return {
      drafts_root: this.getItem('JianYingDraft.basic', 'drafts_root', path.join(process.cwd(), 'jianying-drafts')),
      default_image_duration: this.getItem('JianYingDraft.image', 'default_duration', 5000000),
    };
  }

  /**
   * 更新剪映配置
   * @param config 剪映配置对象
   */
  public updateJianyingConfig(config: Partial<JianyingConfig>): void {
    if (config.drafts_root !== undefined) {
      this.setItem('JianYingDraft.basic', 'drafts_root', config.drafts_root);
    }
    if (config.default_image_duration !== undefined) {
      this.setItem('JianYingDraft.image', 'default_duration', config.default_image_duration);
    }
  }

  /**
   * 获取所有配置
   * @returns 所有配置的对象表示
   */
  public getAllConfig(): Record<string, Record<string, any>> {
    const result: Record<string, Record<string, any>> = {};
    
    for (const [section, items] of this.config.entries()) {
      result[section] = {};
      for (const [key, value] of items.entries()) {
        result[section][key] = value;
      }
    }
    
    return result;
  }

  /**
   * 重置为默认配置
   */
  public resetToDefault(): void {
    this.config.clear();
    this.loadDefaultConfig();
  }
}

/**
 * 配置助手类，提供静态方法访问配置
 */
export class ConfigHelper {
  /**
   * 获取配置项
   * @param section 配置节名称
   * @param key 配置项键名
   * @param defaultValue 默认值
   * @returns 配置项值
   */
  public static getItem<T = any>(section: string, key: string, defaultValue?: T): T {
    return ConfigManager.getInstance().getItem(section, key, defaultValue);
  }

  /**
   * 设置配置项
   * @param section 配置节名称
   * @param key 配置项键名
   * @param value 配置项值
   */
  public static setItem(section: string, key: string, value: any): void {
    ConfigManager.getInstance().setItem(section, key, value);
  }

  /**
   * 获取剪映配置
   * @returns 剪映配置对象
   */
  public static getJianyingConfig(): JianyingConfig {
    return ConfigManager.getInstance().getJianyingConfig();
  }

  /**
   * 保存配置到文件
   */
  public static saveConfig(): void {
    ConfigManager.getInstance().saveConfigToFile();
  }
}
