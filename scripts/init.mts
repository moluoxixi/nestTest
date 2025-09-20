import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

function exec(command: string) {
  execSync(command, { stdio: 'inherit', cwd: resolve(process.cwd()) })
}
// 下载依赖
exec('yarn install')
// 启动数据库
exec('docker-compose -f docker-compose.db.yml up -d')
// 迁移数据库
exec('npx prisma migrate dev')
// 生成 Prisma Client
exec('npx prisma generate')
// 往数据库填充种子
exec('npx prisma db seed')
