import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import type { loadEnvFromFileParamsType } from '../_types/env'

/**
 * 从指定 env 文件加载键值并注入到 process.env
 * - 支持 # 注释与空行
 * - 支持值中的引用展开：${VAR_NAME}
 * - 默认不覆盖已有的环境变量（override=false）
 * @param {loadEnvFromFileParamsType} options - 配置对象
 * @param {string} options.filePath - env 文件相对或绝对路径
 * @param {boolean} options.override - 是否覆盖已存在的 env 值
 * @param {string[]} options.requiredKeys - 校验必填键，缺失则抛错
 * @returns {Record<string,string>} 加载到的键值对
 */
export function loadEnvFromFile(
  options: loadEnvFromFileParamsType = {},
): Record<string, string> {
  const { filePath, requiredKeys } = options;
  if (!filePath) throw new Error('loadEnvFromFile 需要提供 filePath');

  const absPath = resolve(process.cwd(), filePath);
  if (!existsSync(absPath)) throw new Error(`未找到 env 文件：${filePath}`);

  const content = readFileSync(absPath, 'utf-8');
  const loaded: Record<string, string> = {};

  const lines = content.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIndex = line.indexOf('=');
    if (eqIndex <= 0) continue;
    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    // 去掉可能的包裹引号
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    )
      value = value.slice(1, -1);

    // 展开 ${VAR_NAME}
    value = value.replace(/\$\{([A-Z_]\w*)}/gi, (_m, vname: string) => {
      const fromLoaded = loaded[vname];
      const fromProc = process.env[vname];
      return fromLoaded ?? fromProc ?? '';
    });

    loaded[key] = value;
  }

  if (requiredKeys && requiredKeys.length > 0) {
    const missing = requiredKeys.filter((k) => !loaded[k] || loaded[k] === '');
    if (missing.length)
      throw new Error(`缺少必要环境变量：${missing.join(', ')}`);
  }

  return loaded;
}


