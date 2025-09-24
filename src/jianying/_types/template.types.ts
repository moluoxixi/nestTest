/**
 * 剪映模板相关类型定义
 */

/** 画布配置 */
export interface CanvasConfig {
  height: number;
  ratio: string;
  width: number;
}

/** 平台信息 */
export interface PlatformInfo {
  app_id: number;
  app_source: string;
  app_version: string;
  device_id: string;
  hard_disk_id: string;
  mac_address: string;
  os: string;
  os_version: string;
}

/** 配置信息 */
export interface ConfigInfo {
  adjust_max_index: number;
  attachment_info: any[];
  combination_max_index: number;
  export_range: any;
  extract_audio_last_index: number;
  lyrics_recognition_id: string;
  lyrics_sync: boolean;
  lyrics_taskinfo: any[];
  maintrack_adsorb: boolean;
  material_save_mode: number;
  original_sound_last_index: number;
  record_audio_last_index: number;
  sticker_max_index: number;
  subtitle_recognition_id: string;
  subtitle_sync: boolean;
  subtitle_taskinfo: any[];
  system_font_list: any[];
  video_mute: boolean;
  zoom_info_params: any;
}

/** 关键帧 */
export interface Keyframes {
  adjusts: any[];
  audios: any[];
  effects: any[];
  filters: any[];
  handwrites: any[];
  stickers: any[];
  texts: any[];
  videos: any[];
}

/** 素材集合 */
export interface Materials {
  ai_translates: any[];
  audio_balances: any[];
  audio_effects: any[];
  audio_fades: any[];
  audio_track_indexes: any[];
  audios: any[];
  beats: any[];
  canvases: any[];
  chromas: any[];
  color_curves: any[];
  digital_humans: any[];
  drafts: any[];
  effects: any[];
  flowers: any[];
  green_screens: any[];
  handwrites: any[];
  hsl: any[];
  images: any[];
  log_color_wheels: any[];
  loudnesses: any[];
  manual_deformations: any[];
  masks: any[];
  material_animations: any[];
  material_colors: any[];
  placeholders: any[];
  plugin_effects: any[];
  primary_color_wheels: any[];
  realtime_denoises: any[];
  shapes: any[];
  smart_crops: any[];
  smart_relights: any[];
  sound_channel_mappings: any[];
  speeds: any[];
  stickers: any[];
  tail_leaders: any[];
  text_templates: any[];
  texts: any[];
  time_marks: any[];
  transitions: any[];
  video_effects: any[];
  video_trackings: any[];
  videos: any[];
  vocal_beautifys: any[];
  vocal_separations: any[];
}

/** 草稿内容数据结构 */
export interface DraftContentData {
  canvas_config: CanvasConfig;
  color_space: number;
  config: ConfigInfo;
  cover: any;
  create_time: number;
  duration: number;
  extra_info: any;
  fps: number;
  free_render_index_mode_on: boolean;
  group_container: any;
  id: string;
  keyframe_graph_list: any[];
  keyframes: Keyframes;
  last_modified_platform: PlatformInfo;
  materials: Materials;
  mutable_config: any;
  name: string;
  new_version: string;
  platform: PlatformInfo;
  relationships: any[];
  render_index_track_mode_on: boolean;
  retouch_cover: any;
  source: string;
  static_cover_image_path: string;
  time_marks: any;
  tracks: any[];
  update_time: number;
  version: number;
}

/** 草稿元数据材料 */
export interface DraftMaterial {
  type: number;
  value: any[];
}

/** 企业信息 */
export interface EnterpriseInfo {
  draft_enterprise_extra: string;
  draft_enterprise_id: string;
  draft_enterprise_name: string;
  enterprise_material: any[];
}

/** 草稿元数据结构 */
export interface DraftMetaInfoData {
  cloud_package_completed_time: string;
  draft_cloud_capcut_purchase_info: string;
  draft_cloud_last_action_download: boolean;
  draft_cloud_materials: any[];
  draft_cloud_purchase_info: string;
  draft_cloud_template_id: string;
  draft_cloud_tutorial_info: string;
  draft_cloud_videocut_purchase_info: string;
  draft_cover: string;
  draft_deeplink_url: string;
  draft_enterprise_info: EnterpriseInfo;
  draft_fold_path: string;
  draft_id: string;
  draft_is_ai_packaging_used: boolean;
  draft_is_ai_shorts: boolean;
  draft_is_ai_translate: boolean;
  draft_is_article_video_draft: boolean;
  draft_is_from_deeplink: string;
  draft_is_invisible: boolean;
  draft_materials: DraftMaterial[];
  draft_materials_copied_info: any[];
  draft_name: string;
  draft_new_version: string;
  draft_removable_storage_device: string;
  draft_root_path: string;
  draft_segment_extra_info: any[];
  draft_timeline_materials_size_: number;
  draft_type: string;
  tm_draft_cloud_completed: string;
  tm_draft_cloud_modified: number;
  tm_draft_create: number;
  tm_draft_modified: number;
  tm_draft_removed: number;
  tm_duration: number;
}
