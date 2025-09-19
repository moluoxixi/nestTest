import { Injectable } from '@nestjs/common'
import createGoogleModels from './clients'
import { join } from 'node:path'

@Injectable()
export class GoogleService {
  private readonly gm = createGoogleModels(process.env.GOOGLE_API_KEY || '')

  get client() {
    return this.gm
  }

  buildDownloadPath(prefix: 'video' | 'image', ext: string) {
    const name = `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`
    return join(process.cwd(), 'public', 'files', name)
  }
}
