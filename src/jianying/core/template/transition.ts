import { generateId } from '@/jianying/utils/tools'

/**
 * 添加转场效果
 * @param guid 转场的资源id
 * @param resourceId 转场资源在剪映的资源库中的id
 * @param name 转场的名称
 * @param duration 转场的持续时间（单位微秒）
 * @returns 转场对象
 */
export function getTransition(
  guid?: string,
  resourceId: string = '',
  name: string = '',
  duration: number = 500000,
): any {
  if (guid === undefined) {
    guid = generateId()
  }

  return {
    category_id: '39862',
    category_name: '叠化',
    duration,
    effect_id: '321493',
    id: guid,
    is_overlap: false,
    name,
    path: '',
    platform: 'all',
    request_id: '202404100726237F33ED27AE329CF48C4E',
    resource_id: resourceId,
    type: 'transition',
  }
}
