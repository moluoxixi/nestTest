import { generateId } from '@/jianying/utils/tools'

/**
 * 获取片段模板
 * @param guid 片段ID，如果未提供则自动生成
 * @returns 片段对象
 */
export function getSegment(guid?: string): any {
  if (guid === undefined) {
    guid = generateId()
  }

  return {
    cartoon: false,
    clip: {
      alpha: 1.0,
      flip: { horizontal: false, vertical: false },
      rotation: 0.0,
      scale: { x: 1.0, y: 1.0 },
      transform: { x: 0.0, y: 0.0 },
    },
    common_keyframes: [],
    enable_adjust: true,
    enable_color_curves: true,
    enable_color_wheels: true,
    enable_lut: true,
    enable_smart_color_adjust: false,
    extra_material_refs: [],
    group_id: '',
    hdr_settings: { intensity: 1.0, mode: 1, nits: 1000 },
    id: guid,
    intensifies_audio: false,
    is_placeholder: false,
    is_tone_modify: false,
    keyframe_refs: [],
    last_nonzero_volume: 1.0,
    material_id: '',
    render_index: 0,
    reverse: false,
    source_timerange: { duration: 0, start: 0 },
    speed: 1.0,
    target_timerange: { duration: 0, start: 0 },
    template_id: '',
    template_scene: 'default',
    track_attribute: 0,
    track_render_index: 0,
    visible: true,
    volume: 1.0,
  }
}
