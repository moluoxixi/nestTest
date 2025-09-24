/**
 * 目录帮助类
 * 对应Python版本的BasicLibrary.io.dirHelper
 */

import * as fs from 'node:fs'

export class DirHelper {
  /**
   * 确保目录存在
   * @param dirPath 目录路径
   */
  static ensureExist(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
  }
}

/**
 * 确保文件夹存在（简化版函数）
 * @param folderPath 文件夹路径
 */
export function ensureFolderExists(folderPath: string): void {
  DirHelper.ensureExist(folderPath)
}
