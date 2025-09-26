import { generateId } from '@/jianying/core/utils/tools'

/**
 * 获取视频模板
 * @param guid 视频ID，如果未提供则自动生成
 * @returns 视频对象
 */
export function getVideo(guid?: string): any {
  if (guid === undefined) {
    guid = generateId()
  }

  return {
    audio_fade: null,
    cartoon_path: '',
    category_id: '',
    category_name: 'local',
    check_flag: 63487,
    crop: {
      lower_left_x: 0.0,
      lower_left_y: 1.0,
      lower_right_x: 1.0,
      lower_right_y: 1.0,
      upper_left_x: 0.0,
      upper_left_y: 0.0,
      upper_right_x: 1.0,
      upper_right_y: 0.0,
    },
    crop_ratio: 'free',
    crop_scale: 1.0,
    duration: 0,
    extra_type_option: 0,
    formula_id: '',
    freeze: null,
    gameplay: null,
    has_audio: true,
    height: 0,
    id: guid,
    intensifies_audio_path: '',
    intensifies_path: '',
    is_unified_beauty_mode: false,
    local_id: '',
    local_material_id: '',
    material_id: '',
    material_name: '',
    material_url: '',
    matting: {
      flag: 0,
      has_use_quick_brush: false,
      has_use_quick_eraser: false,
      interactiveTime: [],
      path: '',
      strokes: [],
    },
    media_path: '',
    object_locked: null,
    path: '',
    picture_from: 'none',
    picture_set_category_id: '',
    picture_set_category_name: '',
    request_id: '',
    reverse_intensifies_path: '',
    reverse_path: '',
    source_platform: 0,
    stable: null,
    team_id: '',
    type: '',
    video_algorithm: {
      algorithms: [],
      deflicker: null,
      motion_blur_config: null,
      noise_reduction: null,
      path: '',
      time_range: null,
    },
    width: 0,
  }
}
