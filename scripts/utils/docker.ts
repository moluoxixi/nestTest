import { execSync, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import type { ensureDockerOptionsType, containerExistsParamsType } from './_types/docker'

/**
 * 确保 Docker Desktop 已启动并等待 Docker 引擎就绪（Windows）
 * @param {ensureDockerOptionsType} options - 配置项
 * @param {number} [options.maxWaitMs=120000] - 最大等待时间
 * @param {number} [options.pollIntervalMs=3000] - 轮询间隔
 * @param {string[]} [options.dockerDesktopPaths] - Docker Desktop 可执行文件候选路径
 */
export function ensureDockerDesktop(options: ensureDockerOptionsType = {}) {
  const {
    maxWaitMs = 120000,
    pollIntervalMs = 3000,
    dockerDesktopPaths = [
      'C:/Program Files/Docker/Docker/Docker Desktop.exe',
      process.env['ProgramFiles'] ? `${process.env['ProgramFiles']}/Docker/Docker/Docker Desktop.exe` : '',
    ].filter(Boolean),
  } = options

  try {
    execSync('docker info', { stdio: 'ignore' })
    return
  } catch {}

  for (const candidate of dockerDesktopPaths) {
    if (existsSync(candidate)) {
      try {
        spawn(candidate, { detached: true, stdio: 'ignore' }).unref()
        break
      } catch {}
    }
  }

  const start = Date.now()
  while (Date.now() - start < maxWaitMs) {
    try {
      execSync('docker info', { stdio: 'ignore' })
      return
    } catch {}
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
  const { name = '' } = options;
  if (!name) return false;
  try {
    const result = execSync(`docker ps -aq -f name=^/${name}$`, {
      cwd: resolve(process.cwd()),
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf-8',
    }) as unknown as string;
    return result.trim().length > 0;
  } catch {
    return false;
  }
}


