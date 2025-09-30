import { createWriteStream } from 'node:fs'
import { mkdir, stat, unlink } from 'node:fs/promises'
import { dirname } from 'node:path'
import { Buffer } from 'node:buffer'
import axios from 'axios'
import type { downloadUrlToPathParamsType, downloadUrlToPathResultType } from './_types/download'

/**
 * 将远程 URL 的资源下载到本地指定路径。
 *
 * @param options 参数对象
 * @returns 下载结果
 */
export async function downloadUrlToPath(options: downloadUrlToPathParamsType): Promise<downloadUrlToPathResultType> {
  const { url, filePath, headers = {}, timeoutMs = 30000, maxRedirects = 5 } = options

  const startAt = Date.now()

  const ensureDirectory = async () => {
    const folder = dirname(filePath)
    await mkdir(folder, { recursive: true })
  }

  await ensureDirectory()

  const fileStream = createWriteStream(filePath)

  try {
    const res = await axios.get(url, {
      headers,
      timeout: timeoutMs,
      maxRedirects,
      responseType: 'stream',
      // 保持与 Node 默认一致
      decompress: true,
      validateStatus: status => status >= 200 && status < 300,
    })

    let sizeBytes = 0
    const readable = res.data as NodeJS.ReadableStream

    readable.on('data', (chunk: unknown) => {
      if (Buffer.isBuffer(chunk))
        sizeBytes += chunk.length
      else sizeBytes += Buffer.byteLength(String(chunk))
    })

    const pipePromise = new Promise<void>((resolve, reject) => {
      fileStream.on('finish', resolve)
      fileStream.on('error', reject)
    })

    readable.pipe(fileStream)
    await pipePromise

    const fileStat = await stat(filePath)
    const elapsedMs = Date.now() - startAt

    const finalUrl = (res.request as any)?.res?.responseUrl || url
    const contentType = typeof res.headers['content-type'] === 'string' ? res.headers['content-type'] : undefined

    return {
      filePath,
      finalUrl,
      statusCode: res.status,
      sizeBytes: fileStat.size || sizeBytes,
      contentType,
      elapsedMs,
    }
  }
  catch (err) {
    try {
      await unlink(filePath)
    }
    catch {}
    throw err
  }
}
