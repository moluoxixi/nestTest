import { generateId } from '@/jianying/core/utils/tools'

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
