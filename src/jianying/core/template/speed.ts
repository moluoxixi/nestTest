import { generateId } from '@/jianying/core/utils/tools'

/**
 * 获取速度模板
 * @param guid 速度ID，如果未提供则自动生成
 * @returns 速度对象
 */
export function getSpeed(guid?: string): any {
  if (guid === undefined) {
    guid = generateId()
  }

  return {
    curve_speed: null,
    id: guid,
    mode: 0,
    speed: 1.0,
    type: 'speed',
  }
}
