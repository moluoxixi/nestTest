import { generateId } from '@/jianying/core/utils/tools'

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
    metetype: '',
    roughcut_time_range: { duration: 0, start: 0 },
    sub_time_range: { duration: -1, start: -1 },
    type: 0,
    width: 0,
  }
}
