import { execSync } from 'node:child_process'
import { resolve } from 'node:path'
import type { commandStringType } from './_types/exec'

/**
 * 同步执行命令，继承当前进程 stdio
 * @param {commandStringType} command - 要执行的命令
 */
export function exec(command: commandStringType = '') {
  execSync(command, { stdio: 'inherit', cwd: resolve(process.cwd()) })
}

/**
 * 同步执行命令，pipe 输出（便于获取或静默错误）
 * @param {commandStringType} command - 要执行的命令
 */
export function pipeExec(command: commandStringType = '') {
  execSync(command, { stdio: 'pipe', cwd: resolve(process.cwd()) })
}


