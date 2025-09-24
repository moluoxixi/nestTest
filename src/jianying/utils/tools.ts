/**
 * 剪映草稿工具函数
 */

import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import {
  TransitionData,
  EffectData,
  AnimationData,
  AnimationTypes,
} from '../_types';
import {
  effectDict,
  transitionDict,
  animationInDict,
  animationOutDict,
  animationGroupDict,
} from './innerBizTypes';

/**
 * 生成UUID
 * @returns 大写的UUID字符串
 */
export function generateId(): string {
  return uuidv4().toUpperCase();
}

/**
 * 读取JSON文件
 * @param filePath 文件路径
 * @returns JSON对象
 */
export function readJson(filePath: string): any {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`读取JSON文件失败: ${filePath}, 错误: ${error.message}`);
  }
}

/**
 * 写入JSON文件
 * @param filePath 文件路径
 * @param data 要写入的数据
 */
export function writeJson(filePath: string, data: any): void {
  try {
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, content, 'utf-8');
  } catch (error) {
    throw new Error(`写入JSON文件失败: ${filePath}, 错误: ${error.message}`);
  }
}

/**
 * 创建文件夹
 * @param folderPath 文件夹路径
 */
export function createFolder(folderPath: string): void {
  try {
    // 如果文件夹已存在，先删除
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }
    
    // 递归创建文件夹
    fs.mkdirSync(folderPath, { recursive: true });
  } catch (error) {
    throw new Error(`创建文件夹失败: ${folderPath}, 错误: ${error.message}`);
  }
}

/**
 * 确保文件夹存在
 * @param folderPath 文件夹路径
 */
export function ensureFolderExists(folderPath: string): void {
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  } catch (error) {
    throw new Error(`确保文件夹存在失败: ${folderPath}, 错误: ${error.message}`);
  }
}

/**
 * 生成特效数据
 * @param nameOrResourceId 特效名称或资源ID
 * @returns 特效数据
 */
export function generateEffectData(nameOrResourceId: string | number): EffectData {
  let resourceId = "7012933493663470088"; // 默认特效资源ID（小花花特效）
  let name = "小花花";

  if (typeof nameOrResourceId === 'string') {
    name = nameOrResourceId;
    if (effectDict[name]) {
      resourceId = effectDict[name];
    }
  } else if (typeof nameOrResourceId === 'number') {
    resourceId = nameOrResourceId.toString();
    name = resourceId;
  }

  return {
    guid: generateId(),
    resource_id: resourceId,
    name,
    start: 0,
    duration: 0,
  };
}

/**
 * 生成转场数据
 * @param nameOrResourceId 转场名称或资源ID
 * @param duration 持续时间（微秒）
 * @returns 转场数据
 */
export function generateTransitionData(
  nameOrResourceId: string | number,
  duration = 0,
): TransitionData {
  let resourceId = "6724239388189921806"; // 默认转场资源ID（闪黑）
  let name = "闪黑";

  if (typeof nameOrResourceId === 'string') {
    name = nameOrResourceId;
    if (transitionDict[name]) {
      resourceId = transitionDict[name];
    }
  } else if (typeof nameOrResourceId === 'number') {
    resourceId = nameOrResourceId.toString();
    name = resourceId;
  }

  return {
    guid: generateId(),
    resource_id: resourceId,
    duration,
    name,
    start: 0,
  };
}

/**
 * 生成动画数据
 * @param nameOrResourceId 动画名称或资源ID
 * @param animationType 动画类型
 * @param start 开始时间（微秒）
 * @param duration 持续时间（微秒）
 * @returns 动画数据
 */
export function generateAnimationData(
  nameOrResourceId: string | number,
  animationType: AnimationTypes = "in",
  start = 0,
  duration = 0,
): AnimationData {
  let resourceId = ""; // 默认动画资源ID
  let name = "";

  if (typeof nameOrResourceId === 'string') {
    name = nameOrResourceId;

    if (animationType === "in" && animationInDict[name]) {
      resourceId = animationInDict[name];
    }

    if (animationType === "out" && animationOutDict[name]) {
      resourceId = animationOutDict[name];
    }

    if (animationType === "group" && animationGroupDict[name]) {
      resourceId = animationGroupDict[name];
    }
  } else if (typeof nameOrResourceId === 'number') {
    resourceId = nameOrResourceId.toString();
    name = resourceId;
  }

  return {
    guid: generateId(),
    resource_id: resourceId,
    duration,
    animation_type: animationType,
    start,
    name,
  };
}

/**
 * 获取当前时间戳（16位精度）
 * @returns 时间戳
 */
export function getTimestamp(): number {
  return Math.floor(Date.now() * 1000);
}

/**
 * 获取文件名（不含扩展名）
 * @param filePath 文件路径
 * @returns 文件名（不含扩展名）
 */
export function getBaseNameNoExtension(filePath: string): string {
  const basename = path.basename(filePath);
  const lastDotIndex = basename.lastIndexOf('.');
  
  if (lastDotIndex === -1) {
    return basename;
  }
  
  return basename.substring(0, lastDotIndex);
}

/**
 * 检查文件是否存在
 * @param filePath 文件路径
 * @returns 文件是否存在
 */
export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}
