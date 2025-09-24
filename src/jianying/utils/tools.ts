/**
 * 工具函数
 * 完全按照Python版本 tools.py 实现
 */

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * 生成uuid
 * @returns UUID字符串（大写）
 */
export function generateId(): string {
  return uuidv4().toUpperCase();
}

/**
 * 读取json文件
 * @param filePath 文件路径
 * @returns JSON对象
 */
export function readJson(filePath: string): any {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * 写入json文件
 * @param filePath 文件路径
 * @param data 数据
 */
export function writeJson(filePath: string, data: any): void {
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * 创建文件夹
 * 如果文件夹存在则先删除再创建
 * @param folderPath 文件夹路径
 */
export function createFolder(folderPath: string): void {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
  }
  fs.mkdirSync(folderPath, { recursive: true });
}

/**
 * 确保文件夹存在（不删除已存在的）
 * @param folderPath 文件夹路径
 */
export function ensureFolderExists(folderPath: string): void {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

/**
 * 获取时间戳
 * @param formatter 格式化类型，16位时间戳
 * @returns 时间戳
 */
export function getTimestamp(formatter: number = 16): number {
  if (formatter === 16) {
    // 16位时间戳：微秒级
    return Date.now() * 1000;
  }
  return Date.now();
}

/**
 * 检查文件是否存在
 * @param filePath 文件路径
 * @returns 是否存在
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}
