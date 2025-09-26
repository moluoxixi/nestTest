/**
 * 模板函数
 * 完全按照Python版本 template.py 实现
 */

import { generateId } from '@/jianying/utils/tools'

export { getDraft } from './draft'
/**
 * 获取画布模板
 * @param guid 画布ID，如果未提供则自动生成
 * @returns 画布对象
 */
export function getCanvas(guid?: string): any {
  if (guid === undefined) {
    guid = generateId()
  }

  return {
    album_image: '',
    blur: 0.0,
    color: '',
    id: guid,
    image: '',
    image_id: '',
    image_name: '',
    source_platform: 0,
    team_id: '',
    type: 'canvas_color',
  }
}

/**
 * 获取声道映射模板
 * @param guid 声道映射ID，如果未提供则自动生成
 * @returns 声道映射对象
 */
export function getSoundChannelMapping(guid?: string): any {
  if (guid === undefined) {
    guid = generateId()
  }

  return {
    audio_channel_mapping: 0,
    id: guid,
    is_config_open: false,
    type: 'none',
  }
}

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

/**
 * 获取素材信息
 * @param guid 素材id
 * @returns 素材信息对象
 */
export function getMaterialForMetaInfo(guid?: string): any {
  if (guid === undefined) {
    guid = generateId()
  }

  return {
    create_time: Math.floor(Date.now() / 1000),
    duration: 0,
    extra_info: '',
    file_Path: '',
    height: 0,
    id: guid,
    import_time: Math.floor(Date.now() / 1000),
    import_time_ms: Math.floor(Date.now() / 1000) * 10 ** 6,
    md5: '',
    metetype: '', // meta or mate?? 估计剪映开发人员最初拼写错误，以后大家就以讹传讹将错就错了。
    roughcut_time_range: { duration: 0, start: 0 },
    sub_time_range: { duration: -1, start: -1 },
    type: 0,
    width: 0,
  }
}

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
    attribute: 0, // 0表示正常；1表示关闭本轨道
    flag: 0,
    id: guid,
    segments: [],
    type: trackType,
  }
}

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

/**
 * 获取节拍模板
 * @param guid 节拍ID，如果未提供则自动生成
 * @returns 节拍对象
 */
export function getBeat(guid?: string): any {
  if (guid === undefined) {
    guid = generateId()
  }

  return {
    ai_beats: {
      beats_path: '',
      beats_url: '',
      melody_path: '',
      melody_percents: [0.0],
      melody_url: '',
    },
    enable_ai_beats: false,
    gear: 404,
    id: guid,
    mode: 404,
    type: 'beats',
    user_beats: [],
    user_delete_ai_beats: null,
  }
}

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
    extra_type_option: 0, // 是否播放视频素材的本身的背景音。0：播放；1：不播放
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

/**
 * 获取音频模板
 * @param guid 音频ID，如果未提供则自动生成
 * @returns 音频对象
 */
export function getAudio(guid?: string): any {
  if (guid === undefined) {
    guid = generateId()
  }

  return {
    app_id: 0,
    category_id: '',
    category_name: 'local',
    check_flag: 1,
    duration: 0,
    effect_id: '',
    formula_id: '',
    id: guid,
    intensifies_path: '',
    local_material_id: '',
    music_id: generateId(),
    name: 'Krubb Wenkroist - Bleach.mp3',
    path: 'D:/Music/Krubb Wenkroist - Bleach.mp3',
    request_id: '',
    resource_id: '',
    source_platform: 0,
    team_id: '',
    text_id: '',
    tone_category_id: '',
    tone_category_name: '',
    tone_effect_id: '',
    tone_effect_name: '',
    tone_speaker: '',
    tone_type: '',
    type: 'extract_music',
    video_id: '',
    wave_points: [],
  }
}

/**
 * 获取文本模板
 * @param guid 文本ID，如果未提供则自动生成
 * @returns 文本对象
 */
export function getText(guid?: string): any {
  if (guid === undefined) {
    guid = generateId()
  }

  return {
    add_type: 0,
    alignment: 1,
    background_alpha: 1.0,
    background_color: '',
    background_height: 1.0,
    background_horizontal_offset: 0.0,
    background_round_radius: 0.0,
    background_style: 0,
    background_vertical_offset: 0.0,
    background_width: 1.0,
    bold_width: 0.0,
    border_color: '',
    border_width: 0.08,
    check_flag: 7,
    content: '<font id="" path="E:/JianyingPro/4.2.0.10100/Resources/Font/SystemFont/zh-hans.ttf"><color=(1.000000, 1.000000, 1.000000, 1.000000)><size=15.000000>[默认文本]</size></color></font>',
    font_category_id: '',
    font_category_name: '',
    font_id: '',
    font_name: '',
    font_path: 'E:/JianyingPro/4.2.0.10100/Resources/Font/SystemFont/zh-hans.ttf',
    font_resource_id: '',
    font_size: 15.0,
    font_source_platform: 0,
    font_team_id: '',
    font_title: 'none',
    font_url: '',
    fonts: [],
    force_apply_line_max_width: false,
    global_alpha: 1.0,
    group_id: '',
    has_shadow: false,
    id: guid,
    initial_scale: 1.0,
    is_rich_text: false,
    italic_degree: 0,
    ktv_color: '',
    language: '',
    layer_weight: 1,
    letter_spacing: 0.0,
    line_spacing: 0.02,
    name: '',
    preset_category: '',
    preset_category_id: '',
    preset_has_set_alignment: false,
    preset_id: '',
    preset_index: 0,
    preset_name: '',
    recognize_type: 0,
    relevance_segment: [],
    shadow_alpha: 0.8,
    shadow_angle: -45.0,
    shadow_color: '',
    shadow_distance: 8.0,
    shadow_point: { x: 1.0182337649086284, y: -1.0182337649086284 },
    shadow_smoothing: 1.0,
    shape_clip_x: false,
    shape_clip_y: false,
    style_name: '',
    sub_type: 0,
    text_alpha: 1.0,
    text_color: '#FFFFFF',
    text_preset_resource_id: '',
    text_size: 30,
    text_to_audio_ids: [],
    tts_auto_update: false,
    type: 'text',
    typesetting: 0,
    underline: false,
    underline_offset: 0.22,
    underline_width: 0.05,
    use_effect_default_color: true,
    words: [],
  }
}

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
    id: generateId(), // 不会被其他地方引用，所以赋值一个随机id
    material_type: 'video',
    name,
    panel: 'video',
    path: '',
    platform: 'all',
    request_id: '',
    anim_adjust_params: '',
  }
}

/**
 * 添加音频的淡入淡出效果
 * @param guid 淡入淡出ID，如果未提供则自动生成
 * @param fadeInDuration 淡入时间（单位微秒）
 * @param fadeOutDuration 淡出时间（单位微秒）
 * @returns 音频淡入淡出对象
 */
export function getAudioFade(guid?: string, fadeInDuration: number = 0, fadeOutDuration: number = 0): any {
  if (guid === undefined) {
    guid = generateId()
  }

  return {
    fade_in_duration: fadeInDuration,
    fade_out_duration: fadeOutDuration,
    fade_type: 0,
    id: guid,
    type: 'audio_fade',
  }
}

/**
 * 添加视频特效
 * @param guid 特效的资源id
 * @param resourceId 特效资源在剪映的资源库中的id（非常重要，剪映通过这个id来自动获取特效的各种资源）
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
    resource_id: resourceId, // 特效的资源id（剪映通过这个id来自动获取特效的各种资源）
    source_platform: 0,
    time_range: { duration: 0, start: 0 },
    track_render_index: 0,
    type: 'video_effect',
    value: 1.0,
    version: '',
  }
}

/**
 * 添加转场效果
 * @param guid 转场的资源id
 * @param resourceId 转场资源在剪映的资源库中的id（非常重要，剪映通过这个id来自动获取转场的各种资源）
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
