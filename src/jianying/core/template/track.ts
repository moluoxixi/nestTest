import { generateId } from '@/jianying/core/utils/tools'

/**
 * 获取轨道模板
 * @param guid 轨道ID，如果未提供则自动生成
 * @param trackType 轨道类型
 * @returns 轨道对象
 */
export function getTrack(guid?: string, trackType: string = ''): any {
  if (guid === undefined) {
    guid = generateId()
  }

  return {
    attribute: 0,
    flag: 0,
    id: guid,
    segments: [],
    type: trackType,
  }
}
