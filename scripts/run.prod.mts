import { containerExists, ensureDockerDesktop } from './utils/docker'
import { exec, pipeExec } from './utils/exec'
import type { runProdParamsType } from './_types'

/**
 * 生产运行脚本：构建 Docker 镜像并以容器运行（使用根目录 Dockerfile）
 * @param {runProdParamsType} options - 运行配置对象
 * @param {string} options.tag - 镜像标签名
 * @param {string} options.containerName - 容器名称
 */
function runProd(options: runProdParamsType = {}) {
  const {
    tag = 'nest-prisma-server',
    containerName = 'nest-prisma-server-app',
  } = options
  ensureDockerDesktop()
  // 构建镜像
  exec(`docker build -t ${tag} .`)
  // 清理同名容器
  if (containerExists({ name: containerName })) {
    pipeExec(`docker rm -f ${containerName}`)
  }
  // 运行容器（依赖外部 DB，通过 .env 提供 DATABASE_URL）
  exec(
    `docker run -d -t --name ${containerName} -p 4000:4000 --env-file .env ${tag}`,
  )
}

runProd()
