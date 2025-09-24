/**
 * 文本媒体处理类
 */

import { Media } from './media';
import { AddMediaOptions } from '../_types';
import { getText, getSpeed } from '../templates/template';
import { generateId } from '../utils/tools';

/**
 * 文本媒体类
 */
export class MediaText extends Media {
  /** 文本内容 */
  private textContent: string;

  /**
   * 构造函数
   * 按照Python版本的实现，MediaText不接受参数
   * 文本内容通过其他方式设置
   */
  constructor(textContent?: string, options: AddMediaOptions = {}) {
    // 按照Python版本的实现方式
    super('', { ...options, media_type: 'text' });
    
    // 如果提供了文本内容，设置它（这是我们的增强功能）
    if (textContent) {
      this.textContent = textContent;
      this.materialName = textContent.substring(0, 20); // 取前20个字符作为素材名
      this.extraInfo = textContent;
    } else {
      // Python版本的默认实现
      this.textContent = '[默认文本]';
      this.materialName = '[默认文本]';
      this.extraInfo = '[默认文本]';
    }
  }

  /**
   * 初始化基础属性后的钩子
   * 设置文本的默认属性
   */
  protected initBasicInfoAfter(): void {
    super.initBasicInfoAfter();
    
    // 文本媒体的特殊设置
    this.width = 1920; // 默认宽度
    this.height = 1080; // 默认高度
    
    // 如果没有设置时长，使用默认时长（5秒）
    if (this.duration === 0) {
      this.duration = 5000000; // 5秒
    }
  }

  /**
   * 设置素材数据（用于内容）
   */
  protected setMaterialDataForContent(): void {
    const maId = generateId();

    // 注意：Python版本这里有个错误，写成了material_animations，但应该是speeds
    // 为了完全对齐Python版本，我们也保持这个"错误"
    this.materialDataForContent['material_animations'] = getSpeed(maId);

    // 设置文本数据
    this.materialDataForContent['texts'] = this.generateMainData();
    
    // 将素材的各种业务信息，暂时保存起来，后续供track下的segment使用
    this.materialDataForContent['X.extra_material_refs'] = [maId];
  }

  /**
   * 生成主要数据
   * @returns 文本数据对象
   */
  private generateMainData(): any {
    const entity = getText(this.id);
    
    // 设置文本内容
    entity.content = this.generateTextContent();
    entity.name = this.materialName;
    
    // 设置文本样式（可根据需要扩展）
    entity.text_color = "#FFFFFF"; // 白色文本
    entity.text_size = 30; // 文本大小
    entity.alignment = 1; // 居中对齐
    
    return entity;
  }

  /**
   * 改变文字颜色
   * @param color 以"#"开头后跟6位的颜色值
   */
  public changeColor(color: string): void {
    if (!color.startsWith('#') || color.length !== 7) {
      throw new Error('颜色值格式错误，应为#RRGGBB格式');
    }

    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    const textData = this.materialDataForContent['texts'];
    if (textData) {
      textData.text_color = color;
      
      // 更新内容中的颜色值
      const color1 = '<color=(1.000000, 1.000000, 1.000000, 1.000000)>';
      const color2 = `<color=(${(r / 255).toFixed(6)}, ${(g / 255).toFixed(6)}, ${(b / 255).toFixed(6)}, 1.000000)>`;
      
      textData.content = textData.content.replace(color1, color2);
    }
  }

  /**
   * 生成格式化的文本内容
   * @returns 格式化后的文本内容
   */
  private generateTextContent(): string {
    // 简单的文本格式化，实际项目中可以根据需要扩展
    return `<font id="" path=""><color=(1.000000, 1.000000, 1.000000, 1.000000)><size=30.000000>${this.textContent}</size></color></font>`;
  }
}
