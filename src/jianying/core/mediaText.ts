/**
 * @file   : mediaText.ts
 * @time   : 15:23
 * @date   : 2024/3/23
 * @mail   : 9727005@qq.com
 * @creator: ShanDong Xiedali
 * @company: HiLand & RainyTop
 *
 * 文本媒体处理类
 * 完全按照Python版本 mediaText.py 一比一还原
 */

import { getSpeed, getText } from './template'
import { Media } from './media'
import { generateId } from '../utils/tools'

/**
 * 文本媒体处理类
 * 继承自Media基类，专门处理文本内容
 */
export class MediaText extends Media {
  /**
   * 构造函数
   * 注意：Python版本的构造函数不接受参数，这里为了兼容工厂模式需要接受kwargs但忽略它
   */
  constructor(kwargs?: any) {
    super(kwargs || {})
  }

  /**
   * 设置草稿文件的content部分（素材库）
   * 为文本媒体设置动画和文本内容
   */
  protected setMaterialDataForContent(): void {
    const maId = generateId()

    this.materialDataForContent.material_animations = getSpeed(maId)

    this.materialDataForContent.texts = this.generateText()
    // 将素材的各种业务信息，暂时保存起来，后续供track下的segment使用
    this.materialDataForContent['X.extra_material_refs'] = [maId]
  }

  /**
   * 生成文本数据
   * @returns 文本实体数据
   */
  private generateText(): any {
    return getText(this.id)
  }

  /**
   * 改变文字颜色
   * @param color 以"#"开头后跟6位的颜色值
   */
  changeColor(color: string): void {
    this.materialDataForContent.text_color = color
    const r = Number.parseInt(color.substring(1, 3), 16)
    const g = Number.parseInt(color.substring(3, 5), 16)
    const b = Number.parseInt(color.substring(5, 7), 16)
    const color1 = '<color=(1.000000, 1.000000, 1.000000, 1.000000)>'
    const color2 = `<color=(${(r / 255).toFixed(6)}, ${(g / 255).toFixed(
      6,
    )}, ${(b / 255).toFixed(6)}, 1.000000)>`

    // 确保content存在才进行替换（防止undefined错误）
    if (this.materialDataForContent.content) {
      this.materialDataForContent.content
        = this.materialDataForContent.content.replace(color1, color2)
    }
  }
}
