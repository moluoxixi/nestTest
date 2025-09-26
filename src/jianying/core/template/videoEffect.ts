import { generateId } from '@/jianying/utils/tools'

/**
 * 添加视频特效
 * @param guid 特效的资源id
 * @param resourceId 特效资源在剪映的资源库中的id
 * @param name 特效的名称
 * @returns 视频特效对象
 */
export function getVideoEffect(guid?: string, resourceId: string = '', name: string = ''): any {
  if (guid === undefined) {
    guid = generateId()
  }

  return {
    adjust_params: [
      {
        default_value: 0.33,
        name: 'effects_adjust_speed',
        value: 0.33,
      },
      {
        default_value: 1.0,
        name: 'effects_adjust_background_animation',
        value: 1.0,
      },
    ],
    algorithm_artifact_path: '',
    apply_target_type: 2,
    apply_time_range: { duration: 0, start: 0 },
    category_id: '1039448',
    category_name: '热门',
    common_keyframes: [],
    disable_effect_faces: [],
    effect_id: '1039448',
    formula_id: '',
    id: guid,
    name,
    path: '',
    platform: 'all',
    render_index: 0,
    request_id: '',
    resource_id: resourceId,
    source_platform: 0,
    time_range: { duration: 0, start: 0 },
    track_render_index: 0,
    type: 'video_effect',
    value: 1.0,
    version: '',
  }
}
