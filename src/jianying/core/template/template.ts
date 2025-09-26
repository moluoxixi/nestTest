export const draft_content = {
  /** 画布配置 */
  canvas_config: {
    /** 画布高度，决定时间轴预览画面的像素高度 */
    height: 1920,
    /** 画布比例，original 表示保持素材原始比例 */
    ratio: 'original',
    /** 画布宽度，决定时间轴预览画面的像素宽度 */
    width: 1437,
  },
  /** 工程色彩空间，0 表示标准 sRGB */
  color_space: 0,
  /** 草稿运行配置 */
  config: {
    /** 调色操作的自增索引，用于生成唯一调色 ID */
    adjust_max_index: 1,
    /** 附件信息列表，暂未使用 */
    attachment_info: [],
    /** 组合片段最大索引，配合组合轨道使用 */
    combination_max_index: 1,
    /** 导出范围配置，null 表示导出整个时间轴 */
    export_range: null,
    /** 音频提取索引，记录最后一次提取操作的 ID */
    extract_audio_last_index: 1,
    /** 歌词识别任务 ID，空字符串表示未触发 */
    lyrics_recognition_id: '',
    /** 是否开启歌词自动同步 */
    lyrics_sync: true,
    /** 歌词识别任务附加信息 */
    lyrics_taskinfo: [],
    /** 主轨道吸附开关，控制时间轴对齐吸附 */
    maintrack_adsorb: true,
    /** 素材保存模式，0 表示默认存储 */
    material_save_mode: 0,
    /** 原声索引，控制原声素材的 ID 递增 */
    original_sound_last_index: 1,
    /** 录音索引，控制录音素材的 ID 递增 */
    record_audio_last_index: 1,
    /** 贴纸最大索引，确保贴纸 ID 唯一 */
    sticker_max_index: 1,
    /** 字幕识别任务 ID */
    subtitle_recognition_id: '',
    /** 是否开启字幕自动同步 */
    subtitle_sync: true,
    /** 字幕识别任务附加信息 */
    subtitle_taskinfo: [],
    /** 系统字体列表缓存 */
    system_font_list: [],
    /** 是否静音主视频轨道 */
    video_mute: false,
    /** 时间轴缩放信息，null 表示默认缩放 */
    zoom_info_params: null,
  },
  /** 自定义封面信息，null 表示尚未设置 */
  cover: null,
  /** 工程创建时间，单位微秒 */
  create_time: 0,
  /** 时间轴总时长，单位微秒 */
  duration: 10000000,
  /** 额外信息扩展字段 */
  extra_info: null,
  /** 时间轴帧率，单位帧/秒 */
  fps: 30.0,
  /** 是否启用自由渲染索引模式 */
  free_render_index_mode_on: false,
  /** 分组容器配置，null 表示未使用 */
  group_container: null,
  /** 草稿唯一标识 */
  id: 'B9705571-90C4-4c1d-B014-9622D3D39791',
  /** 关键帧曲线集合，空数组表示尚未绘制 */
  keyframe_graph_list: [],
  /** 各类型关键帧集合 */
  keyframes: {
    /** 调整类关键帧集合 */
    adjusts: [],
    /** 音频关键帧集合 */
    audios: [],
    /** 特效关键帧集合 */
    effects: [],
    /** 滤镜关键帧集合 */
    filters: [],
    /** 手写关键帧集合 */
    handwrites: [],
    /** 贴纸关键帧集合 */
    stickers: [],
    /** 文本关键帧集合 */
    texts: [],
    /** 视频关键帧集合 */
    videos: [],
  },
  /** 最后修改草稿的平台信息 */
  last_modified_platform: {
    /** 最后修改的客户端 ID */
    app_id: 3704,
    /** 客户端来源标识 */
    app_source: 'lv',
    /** 最后修改使用的剪映版本号 */
    app_version: '5.5.0',
    /** 设备唯一标识 */
    device_id: '96c92feee48771d8c6254946af2e1435',
    /** 硬盘标识，空字符串表示未采集 */
    hard_disk_id: '',
    /** 设备网卡地址列表 */
    mac_address:
      '8bae3d70404c92895e88330be7d10087,f6f4dd030c1ffaaec65d57efc506274c,13f596b2a65ff05343b7880e06c1b134',
    /** 操作系统类型 */
    os: 'windows',
    /** 操作系统版本 */
    os_version: '10.0.22631',
  },
  /** 草稿中所有素材集合 */
  materials: {
    /** AI 翻译素材列表 */
    ai_translates: [],
    /** 音频平衡素材列表 */
    audio_balances: [],
    /** 音频特效素材列表 */
    audio_effects: [],
    /** 音频淡入淡出素材列表 */
    audio_fades: [],
    /** 音频轨道索引表 */
    audio_track_indexes: [],
    /** 音频素材列表 */
    audios: [],
    /** 节拍素材列表 */
    beats: [],
    /** 画布素材列表 */
    canvases: [],
    /** 抠像素材列表 */
    chromas: [],
    /** 色彩曲线素材列表 */
    color_curves: [],
    /** 数字人素材列表 */
    digital_humans: [],
    /** 二级草稿引用列表 */
    drafts: [],
    /** 特效素材列表 */
    effects: [],
    /** 花字素材列表 */
    flowers: [],
    /** 绿幕素材列表 */
    green_screens: [],
    /** 手写素材列表 */
    handwrites: [],
    /** HSL 调色素材列表 */
    hsl: [],
    /** 图片素材列表 */
    images: [],
    /** Log 色轮素材列表 */
    log_color_wheels: [],
    /** 响度素材列表 */
    loudnesses: [],
    /** 手动变形素材列表 */
    manual_deformations: [],
    /** 蒙版素材列表 */
    masks: [],
    /** 材质动画素材列表 */
    material_animations: [],
    /** 材质颜色素材列表 */
    material_colors: [],
    /** 占位符素材列表 */
    placeholders: [],
    /** 插件特效素材列表 */
    plugin_effects: [],
    /** 原色轮素材列表 */
    primary_color_wheels: [],
    /** 实时降噪素材列表 */
    realtime_denoises: [],
    /** 图形素材列表 */
    shapes: [],
    /** 智能裁剪素材列表 */
    smart_crops: [],
    /** 智能补光素材列表 */
    smart_relights: [],
    /** 声道映射素材列表 */
    sound_channel_mappings: [],
    /** 变速素材列表 */
    speeds: [],
    /** 贴纸素材列表 */
    stickers: [],
    /** 片头片尾素材列表 */
    tail_leaders: [],
    /** 文本模板素材列表 */
    text_templates: [],
    /** 文本素材列表 */
    texts: [],
    /** 时间标记素材列表 */
    time_marks: [],
    /** 转场素材列表 */
    transitions: [],
    /** 视频特效素材列表 */
    video_effects: [],
    /** 视频跟踪素材列表 */
    video_trackings: [],
    /** 视频素材列表 */
    videos: [],
    /** 人声美化素材列表 */
    vocal_beautifys: [],
    /** 人声分离素材列表 */
    vocal_separations: [],
  },
  /** 可变配置占位，当前未启用 */
  mutable_config: null,
  /** 草稿名称，空字符串表示尚未命名 */
  name: '',
  /** 草稿对应的新版本标识 */
  new_version: '103.0.0',
  /** 草稿创建平台信息 */
  platform: {
    /** 创建时的客户端 ID */
    app_id: 3704,
    /** 创建时的客户端来源 */
    app_source: 'lv',
    /** 创建时的剪映版本 */
    app_version: '5.5.0',
    /** 创建时的设备 ID */
    device_id: '96c92feee48771d8c6254946af2e1435',
    /** 创建时的硬盘 ID，占位 */
    hard_disk_id: '',
    /** 创建时的网卡地址 */
    mac_address:
      '8bae3d70404c92895e88330be7d10087,f6f4dd030c1ffaaec65d57efc506274c,13f596b2a65ff05343b7880e06c1b134',
    /** 创建时的操作系统 */
    os: 'windows',
    /** 创建时的系统版本 */
    os_version: '10.0.22631',
  },
  /** 素材依赖关系表 */
  relationships: [],
  /** 是否启用渲染轨道索引模式 */
  render_index_track_mode_on: false,
  /** AI 美化封面配置 */
  retouch_cover: null,
  /** 草稿来源，default 表示本地创建 */
  source: 'default',
  /** 静态封面路径 */
  static_cover_image_path: '',
  /** 时间标记定义，null 表示未使用 */
  time_marks: null,
  /** 轨道集合，初始为空 */
  tracks: [],
  /** 最后更新时间，单位微秒 */
  update_time: 0,
  /** 草稿版本号，用于兼容性判断 */
  version: 360000,
} as const

export const draft_meta_info = {
  /** 云端打包完成时间，空字符串表示未完成 */
  cloud_package_completed_time: '',
  /** 云端 CapCut 购置信息 */
  draft_cloud_capcut_purchase_info: '',
  /** 标记最近一次云端操作是否为下载 */
  draft_cloud_last_action_download: false,
  /** 云端素材列表 */
  draft_cloud_materials: [],
  /** 云端购买信息占位 */
  draft_cloud_purchase_info: '',
  /** 云端模板 ID */
  draft_cloud_template_id: '',
  /** 云端教程信息 */
  draft_cloud_tutorial_info: '',
  /** 云端视频剪辑购置信息 */
  draft_cloud_videocut_purchase_info: '',
  /** 草稿封面文件名 */
  draft_cover: 'draft_cover.jpg',
  /** 草稿深链地址 */
  draft_deeplink_url: '',
  /** 企业草稿信息 */
  draft_enterprise_info: {
    /** 企业草稿额外信息 */
    draft_enterprise_extra: '',
    /** 企业草稿所属企业 ID */
    draft_enterprise_id: '',
    /** 企业草稿所属企业名称 */
    draft_enterprise_name: '',
    /** 企业草稿素材列表 */
    enterprise_material: [],
  },
  /** 草稿所在文件夹相对路径 */
  draft_fold_path: '',
  /** 草稿 ID，占位等待剪映生成 */
  draft_id: '',
  /** 是否使用 AI 包装 */
  draft_is_ai_packaging_used: false,
  /** 是否为 AI Shorts 草稿 */
  draft_is_ai_shorts: false,
  /** 是否使用 AI 翻译 */
  draft_is_ai_translate: false,
  /** 是否为图文成片草稿 */
  draft_is_article_video_draft: false,
  /** 草稿是否由深链打开，字符串形式兼容剪映 */
  draft_is_from_deeplink: 'false',
  /** 草稿是否在素材库列表中隐藏 */
  draft_is_invisible: false,
  /** 草稿素材分类列表 */
  draft_materials: [
    {
      /** 类型 0，通常表示视频素材 */
      type: 0,
      /** 对应类型的素材 ID 列表 */
      value: [],
    },
    {
      /** 类型 1，通常表示音频素材 */
      type: 1,
      /** 对应类型的素材 ID 列表 */
      value: [],
    },
    {
      /** 类型 2，通常表示图片素材 */
      type: 2,
      /** 对应类型的素材 ID 列表 */
      value: [],
    },
    {
      /** 类型 3，通常表示文本素材 */
      type: 3,
      /** 对应类型的素材 ID 列表 */
      value: [],
    },
    {
      /** 类型 6，通常表示贴纸素材 */
      type: 6,
      /** 对应类型的素材 ID 列表 */
      value: [],
    },
    {
      /** 类型 7，通常表示特效素材 */
      type: 7,
      /** 对应类型的素材 ID 列表 */
      value: [],
    },
    {
      /** 类型 8，通常表示转场素材 */
      type: 8,
      /** 对应类型的素材 ID 列表 */
      value: [],
    },
  ],
  /** 素材引用副本信息 */
  draft_materials_copied_info: [],
  /** 草稿名称 */
  draft_name: '',
  /** 草稿新版本号占位 */
  draft_new_version: '',
  /** 可移动存储标识 */
  draft_removable_storage_device: '',
  /** 草稿根目录路径 */
  draft_root_path: '',
  /** 时间轴片段扩展信息 */
  draft_segment_extra_info: [],
  /** 时间轴素材占用空间大小 */
  draft_timeline_materials_size_: 0,
  /** 草稿类型 */
  draft_type: '',
  /** 云端完成时间戳 */
  tm_draft_cloud_completed: '',
  /** 云端最近修改时间戳 */
  tm_draft_cloud_modified: 0,
  /** 草稿创建时间戳（微秒） */
  tm_draft_create: 1710300238044323,
  /** 草稿最近修改时间戳（微秒） */
  tm_draft_modified: 1710300542634473,
  /** 草稿删除时间戳，0 表示未删除 */
  tm_draft_removed: 0,
  /** 草稿时间轴时长（微秒） */
  tm_duration: 10000000,
} as const

export type DraftContent = typeof draft_content

export type DraftMetaInfo = typeof draft_meta_info

export function getDraftTemplate() {
  return JSON.parse(JSON.stringify({
    draft_content,
    draft_meta_info,
  }))
}
