import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, extname } from 'node:path'

/**
 * 读取 JSON 文件
 */
export function readJson(path: string): any {
  const content = readFileSync(path, 'utf-8')
  return JSON.parse(content)
}

/**
 * 写入 JSON 文件（带 2 空格缩进）
 */
export function writeJson(path: string, data: any): void {
  const content = JSON.stringify(data, null, 2)
  writeFileSync(path, content, 'utf-8')
}

/**
 * 确保文件夹存在
 */
export function createFolder(folderPath: string): void {
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath, { recursive: true })
  }
}

/**
 * 获取文件名（不包含扩展名）
 */
export function getBaseNameNoExtension(filePath: string): string {
  if (!filePath)
    return ''
  const baseName = basename(filePath)
  const extName = extname(baseName)
  return baseName.replace(extName, '')
}
