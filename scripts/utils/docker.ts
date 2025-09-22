import { execSync, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import type { containerExistsParamsType, dockerLoginParamsType, ensureDockerOptionsType } from './_types/docker'
import { exec } from './exec'

/**
 * 确保 Docker Desktop 已启动并等待 Docker 引擎就绪（Windows）
 * @param {ensureDockerOptionsType} options - 配置项
 * @param {number} [options.maxWaitMs] - 最大等待时间
 * @param {number} [options.pollIntervalMs] - 轮询间隔
 * @param {string[]} [options.dockerDesktopPaths] - Docker Desktop 可执行文件候选路径
 */
export function ensureDockerDesktop(options: ensureDockerOptionsType = {}) {
  const {
    maxWaitMs = 120000,
    pollIntervalMs = 3000,
    dockerDesktopPaths = [
      'C:/Program Files/Docker/Docker/Docker Desktop.exe',
      process.env.ProgramFiles ? `${process.env.ProgramFiles}/Docker/Docker/Docker Desktop.exe` : '',
    ].filter(Boolean),
  } = options

  try {
    execSync('docker info', { stdio: 'ignore' })
    return
  }
  catch {}

  for (const candidate of dockerDesktopPaths) {
    if (existsSync(candidate)) {
      try {
        spawn(candidate, { detached: true, stdio: 'ignore' }).unref()
        break
      }
      catch {}
    }
  }

  const start = Date.now()
  while (Date.now() - start < maxWaitMs) {
    try {
      execSync('docker info', { stdio: 'ignore' })
      return
    }
    catch {}
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, pollIntervalMs)
  }
  throw new Error('Docker 未就绪：请确认 Docker Desktop 已安装并启动。')
}

/**
 * 检查容器是否存在
 * @param {containerExistsParamsType} options - 参数对象
 * @param {string} options.name - 容器名称
 * @returns {boolean} 是否存在
 */
export function containerExists(options: containerExistsParamsType = {}): boolean {
  const { name = '' } = options
  if (!name)
    return false
  try {
    const result = execSync(`docker ps -aq -f name=^/${name}$`, {
      cwd: resolve(process.cwd()),
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf-8',
    }) as unknown as string
    return result.trim().length > 0
  }
  catch {
    return false
  }
}

/**
 * 登录 Docker Registry（使用 --password-stdin，避免在命令行暴露密码）
 * @param {dockerLoginParamsType} options - 参数对象
 * @param {string} options.registry - Registry 地址（如 docker.io 或 cr.xxx.aliyuncs.com）
 * @param {string} options.username - 用户名
 * @param {string} options.password - 密码或 Token
 */
export function dockerLogin(options: dockerLoginParamsType = {}) {
  const { registry = 'docker.io', username = '', password = '' } = options
  if (!username || !password)
    throw new Error('docker 登录缺少用户名或密码。')
  // 使用 echo 将密码通过 stdin 传给 docker login
  exec(`echo ${password} | docker login ${registry} --username ${username} --password-stdin`)
}
