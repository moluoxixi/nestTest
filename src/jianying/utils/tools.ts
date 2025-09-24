/**
 * 工具函数
 * 完全按照Python版本 tools.py 实现，一比一复刻
 */

import * as fs from 'node:fs'
import { v4 as uuidv4 } from 'uuid'
import { ensureFolderExists } from './fileHelper'
import { animationGroupDict, animationInDict, animationOutDict, effectDict, transitionDict } from './innerBizTypes'
import { AnimationData, AnimationTypes, EffectData, TransitionData } from './dataStruct'

/**
 * 生成uuid
 */
export function generateId(): string {
  return uuidv4().toUpperCase()
}

/**
 * 读取json文件
 * @param path 文件路径
 */
export function readJson(path: string): any {
  const content = fs.readFileSync(path, 'utf-8')
  return JSON.parse(content)
}

/**
 * 写入json文件
 * @param path 文件路径
 * @param data 数据
 */
export function writeJson(path: string, data: any): void {
  // 给json.dump添加参数 ensure_ascii=false可以保证汉字不被编码
  const content = JSON.stringify(data, null, 2)
  fs.writeFileSync(path, content, 'utf-8')
}

/**
 * 创建文件夹
 * @param folderPath 文件夹路径
 */
export function createFolder(folderPath: string): void {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true })
  }

  ensureFolderExists(folderPath)
}

/**
 * 生成特效数据
 * @param nameOrResourceId 特效名称或资源id
 */
export function generateEffectData(nameOrResourceId: string | number): EffectData {
  let resourceId = '7012933493663470088' // 缺省的特效资源ID表示小花花特效
  let name = '小花花'

  if (typeof nameOrResourceId === 'string') {
    name = nameOrResourceId

    if (name in effectDict) {
      resourceId = effectDict[name]
    }
  }
  else if (typeof nameOrResourceId === 'number') {
    resourceId = String(nameOrResourceId)
    name = resourceId
  }

  return new EffectData(
    generateId(),
    resourceId,
    name,
  )
}

/**
 * 生成转场数据
 * @param nameOrResourceId 动画名称或资源id
 * @param duration 持续时间
 */
export function generateTransitionData(nameOrResourceId: string | number, duration: number = 0): TransitionData {
  let resourceId = '6724239388189921806' // 缺省的转场资源ID表示闪黑
  let name = '闪黑'

  if (typeof nameOrResourceId === 'string') {
    name = nameOrResourceId

    if (name in transitionDict) {
      resourceId = transitionDict[name]
    }
  }
  else if (typeof nameOrResourceId === 'number') {
    resourceId = String(nameOrResourceId)
    name = resourceId
  }

  return new TransitionData(
    generateId(),
    resourceId,
    duration,
    name,
  )
}

/**
 * 生成动画数据
 * @param nameOrResourceId 动画名称或资源id
 * @param animationType 动画类型 in/out/group
 * @param start 开始时间
 * @param duration 持续时间
 */
export function generateAnimationData(
  nameOrResourceId: string | number,
  animationType: AnimationTypes = 'in',
  start: number = 0,
  duration: number = 0,
): AnimationData {
  let resourceId = '' // 缺省的动画资源ID
  let name = ''

  if (typeof nameOrResourceId === 'string') {
    name = nameOrResourceId

    if (animationType === 'in' && name in animationInDict) {
      resourceId = animationInDict[name]
    }

    if (animationType === 'out' && name in animationOutDict) {
      resourceId = animationOutDict[name]
    }

    if (animationType === 'group' && name in animationGroupDict) {
      resourceId = animationGroupDict[name]
    }
  }
  else if (typeof nameOrResourceId === 'number') {
    resourceId = String(nameOrResourceId)
    name = resourceId
  }
  return new AnimationData(
    generateId(),
    resourceId,
    duration,
    animationType,
    start,
    name,
  )
}
