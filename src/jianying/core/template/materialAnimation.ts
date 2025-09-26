import { generateId } from '@/jianying/utils/tools'

/**
 * 获取材质动画模板
 * @param guid 动画ID，如果未提供则自动生成
 * @returns 材质动画对象
 */
export function getMaterialAnimation(guid?: string): any {
  if (guid === undefined) {
    guid = generateId()
  }

  return {
    animations: [],
    id: guid,
    type: 'sticker_animation',
  }
}
