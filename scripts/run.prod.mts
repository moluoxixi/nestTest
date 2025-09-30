import { containerExists, dockerLogin, ensureDockerDesktop } from './utils/docker'
import { exec, pipeExec } from './utils/exec'
import type { runProdParamsType } from './_types'
import { loadEnvFromFile } from './utils/env'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

/**
 * 生产运行脚本：构建 Docker 镜像并以容器运行（使用根目录 Dockerfile）
 * @param {runProdParamsType} options - 运行配置对象
 * @param {string} options.tag - 镜像标签名
 * @param {string} options.containerName - 容器名称
 * @param {boolean} options.publish - 是否推送到远端仓库
 * @param {string} options.registry - 远端镜像仓库地址（如 docker.io 或 cr.*.aliyuncs.com）
 * @param {string} options.username - 登录用用户名
 * @param {string} options.password - 登录用密码/Token（仅发布时必填）
 * @param {string} options.namespace - 可选命名空间（不指定则不使用命名空间）
 */
function runProd(options: runProdParamsType = {}) {
  const {
    publish,
    registry,
    username,
    password,
  } = options
  ensureDockerDesktop()
  // 仅在发布时强制需要用户名，密码以及远端镜像仓库地址
  if (publish && (!username || !password || !registry))
    throw new Error('发布到远端时需要提供用户名，密码，以及远端镜像仓库地址。')

  // 确保宿主机静态目录存在（用于卷挂载持久化生成文件）
  const hostPublicDir = resolve(process.cwd(), 'public')
  const hostFilesDir = resolve(hostPublicDir, 'files')
  mkdir(hostFilesDir, { recursive: true }).catch(() => {})

  // 使用 docker-compose（直接使用项目 compose）进行构建与启动
  exec('docker-compose down')
  exec('docker-compose up -d --build')
  // 如果指定发布，则先登录再构建推送
  if (publish) {
    dockerLogin({ registry: registry || 'docker.io', username: username || '', password: password || '' })
    // 使用 compose 构建并推送远端镜像（需要 compose 中的 image 为远端全名）
    exec('docker-compose build --push')
  }
}

// 从 CLI 读取 publish（仅支持 --publish，默认不发布）
function parseCliBoolean(flag: string): boolean | undefined {
  const argv = process.argv.slice(2)
  if (argv.includes(flag))
    return true
  return undefined
}

// 载入 docker 专用环境变量（仅返回键值，不注入到 process.env）
const dockerEnv = loadEnvFromFile({ filePath: 'docker.env' })

// 仅支持 --publish 开关；其余配置从环境变量读取
const cliPublish = parseCliBoolean('--publish')

const envOptions: runProdParamsType = {
  publish: cliPublish,
  registry: dockerEnv.DOCKER_REGISTRY,
  username: dockerEnv.DOCKER_USERNAME,
  password: dockerEnv.DOCKER_PASSWORD,
}

runProd(envOptions)
