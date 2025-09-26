/**
 * 目录帮助类
 * 对应Python版本的BasicLibrary.io.dirHelper
 */

import { existsSync, mkdirSync } from 'node:fs'
import { basename, extname } from 'node:path'

/**
 * 确保文件夹存在（简化版函数）
 * @param folderPath 文件夹路径
 */
export function ensureFolderExists(folderPath: string): void {
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath, { recursive: true })
  }
}

/**
 * 获取文件名（不包含扩展名）
 * 对应Python的FileHelper.get_base_name_no_extension
 * @param filePath 文件路径
 * @returns 不包含扩展名的文件名
 */
export function getBaseNameNoExtension(filePath: string): string {
  if (!filePath)
    return ''
  const baseName = basename(filePath)
  const extName = extname(baseName)
  return baseName.replace(extName, '')
}
