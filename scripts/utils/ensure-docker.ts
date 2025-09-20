import { execSync, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import type { ensureDockerOptionsType } from '../_types/ensure-docker'

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


