/**
 * 配置助手
 * 对应Python版本的BasicLibrary.configHelper.ConfigHelper
 */

/**
 * 配置数据
 */
const config: Record<string, Record<string, any>> = {
  'JianYingDraft.basic': {
    drafts_root: 'C:\\Jianying.Drafts',
  },
  'JianYingDraft.image': {
    default_duration: 5000000, // 5秒，单位微秒
  },
}

/**
 * 获取配置项
 * @param section 配置节名称
 * @param key 配置项键名
 * @param defaultValue 默认值
 * @returns 配置项值
 */
export function getItem(section: string, key: string, defaultValue: any): any {
  return config[section]?.[key] ?? defaultValue
}
