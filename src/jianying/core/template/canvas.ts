import { generateId } from '@/jianying/utils/tools'

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
