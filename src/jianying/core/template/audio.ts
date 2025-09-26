import { generateId } from '@/jianying/core/utils/tools'

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
