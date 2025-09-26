import { generateId } from '@/jianying/core/utils/tools'

/**
 * 获取详细动画模板
 * @param resourceId 动画资源ID
 * @param name 动画名称
 * @param animationType 动画类型 in/out/group
 * @param start 开始时间
 * @param duration 持续时间
 * @returns 详细动画对象
 */
export function getDetailAnimation(
  resourceId: string = '',
  name: string = '',
  animationType: string = 'in',
  start: number = 0,
  duration: number = 0,
): any {
  return {
    resource_id: resourceId,
    type: animationType,
    category_id: animationType,
    category_name: animationType,
    start,
    duration,
    id: generateId(),
    material_type: 'video',
    name,
    panel: 'video',
    path: '',
    platform: 'all',
    request_id: '',
    anim_adjust_params: '',
  }
}
