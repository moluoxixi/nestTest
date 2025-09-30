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
    tag,
    containerName,
    publish,
    registry,
    username,
    password,
    namespace,
  } = options
  // 必填参数校验
  if (!tag)
    throw new Error('缺少 DOCKER_TAG')
  ensureDockerDesktop()
  // 仅在发布时强制需要用户名，密码以及远端镜像仓库地址
  if (publish && (!username || !password || !registry))
    throw new Error('发布到远端时需要提供用户名，密码，以及远端镜像仓库地址。')

  const actualContainerName = containerName || tag

  // 确保宿主机静态目录存在（用于卷挂载持久化生成文件）
  const hostPublicDir = resolve(process.cwd(), 'public')
  const hostFilesDir = resolve(hostPublicDir, 'files')
  mkdir(hostFilesDir, { recursive: true }).catch(() => {})

  // 如存在同名容器，先移除，避免 compose 起不来
  if (containerExists({ name: actualContainerName })) {
    pipeExec(`docker rm -f ${actualContainerName}`)
  }

  // 使用 docker-compose（直接使用项目 compose）进行构建与启动
  exec('docker-compose down')
  exec('docker-compose up -d --build')

  // 如需推送到远端仓库（仅推送 latest 标签）
  if (publish) {
    dockerLogin({ registry, username, password })
    const remoteTag = (namespace && namespace.trim())
      ? `${registry}/${namespace}/${tag}:latest`
      : `${registry}/${tag}:latest`
    // 给已构建的本地镜像追加远端 tag 并推送
    exec(`docker tag ${tag}:latest ${remoteTag}`)
    exec(`docker push ${remoteTag}`)
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
  tag: dockerEnv.DOCKER_TAG,
  containerName: dockerEnv.DOCKER_CONTAINER_NAME,
  publish: cliPublish,
  registry: dockerEnv.DOCKER_REGISTRY,
  username: dockerEnv.DOCKER_USERNAME,
  password: dockerEnv.DOCKER_PASSWORD,
  namespace: dockerEnv.DOCKER_NAMESPACE,
}

runProd(envOptions)
