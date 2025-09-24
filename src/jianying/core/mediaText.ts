/**
 * 文本媒体类
 * 完全按照Python版本 mediaText.py 实现
 */

import { Media } from './media';
import * as template from './template';
import { generateId } from '../utils/tools';

/**
 * 文本媒体类
 */
export class MediaText extends Media {
  private textContent: string = '';

  constructor(kwargs: any = {}) {
    super(kwargs);
    
    // 设置文本内容
    this.textContent = kwargs.textContent || kwargs.content || '[默认文本]';
    this.materialName = this.textContent.substring(0, 20); // 取前20个字符作为素材名
    this.extraInfo = this.textContent;
  }

  /**
   * 设置草稿文件的content部分
   */
  protected setMaterialDataForContent(): void {
    const maId = generateId();

    this.materialDataForContent['material_animations'] = this.getSpeed(maId);
    this.materialDataForContent["texts"] = this.generateText();
    
    // 将素材的各种业务信息，暂时保存起来，后续供track下的segment使用
    this.materialDataForContent["X.extra_material_refs"] = [maId];
  }

  /**
   * 生成文本数据
   */
  private generateText(): any {
    const entity = template.getText(this.id);
    entity.content = this.textContent;
    entity.name = this.materialName;
    return entity;
  }

  /**
   * 改变文字颜色
   * @param color 以"#"开头后跟6位的颜色值
   */
  public changeColor(color: string): void {
    this.materialDataForContent['text_color'] = color;
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    
    const color1 = "<color=(1.000000, 1.000000, 1.000000, 1.000000)>";
    const color2 = `<color=(${(r / 255).toFixed(6)}, ${(g / 255).toFixed(6)}, ${(b / 255).toFixed(6)}, 1.000000)>`;
    
    this.materialDataForContent['content'] = this.materialDataForContent['content'].replace(color1, color2);
  }

  /**
   * 获取速度模板（这里是material_animations）
   */
  private getSpeed(guid: string): any {
    return {
      "curve_speed": null,
      "id": guid,
      "mode": 0,
      "speed": 1.0,
      "type": "speed"
    };
  }
}
