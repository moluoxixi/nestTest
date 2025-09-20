import { execSync } from 'node:child_process'
import { resolve } from 'node:path'
import { ensureDockerDesktop } from './utils/ensure-docker'
import type { runDevParamsType } from './_types/run.dev'

function exec(command: string) {
  execSync(command, { stdio: 'inherit', cwd: resolve(process.cwd()) })
}


/**
 * 启动开发环境脚本：在 Docker 启动数据库后，启动 Nest 开发服务
 * @param {runDevParamsType} options - 运行配置对象
 * @param {boolean} [options.startServer=true] - 是否在 DB 启动后启动 Nest 开发服务
 */
function runDev(options: runDevParamsType = {}) {
  const { startServer = true } = options
  // // 确保 Docker 引擎就绪
  ensureDockerDesktop()
  // 启动数据库（与 init 保持一致，尽量简洁）
  exec('docker-compose -f docker-compose.db.yml up -d')
  // 启动开发服务
  if (startServer) {
    exec('nest start --watch')
  }
}

runDev()
