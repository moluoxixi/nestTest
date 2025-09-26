import { generateId } from '@/jianying/utils/tools'

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
