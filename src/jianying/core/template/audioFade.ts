import { generateId } from '@/jianying/utils/tools'

/**
 * 添加音频的淡入淡出效果
 * @param guid 淡入淡出ID，如果未提供则自动生成
 * @param fadeInDuration 淡入时间（单位微秒）
 * @param fadeOutDuration 淡出时间（单位微秒）
 * @returns 音频淡入淡出对象
 */
export function getAudioFade(
  guid?: string,
  fadeInDuration: number = 0,
  fadeOutDuration: number = 0,
): any {
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
