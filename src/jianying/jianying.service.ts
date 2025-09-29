import { Injectable } from '@nestjs/common'
import { join } from 'node:path'
import type {
  jianyingComposeCreateParamsType,
  jianyingComposeCreateResultType,
} from './_types/jianying'
import { createDraft, save } from '@/jianying/core/draft'
import { createFolder } from '@/jianying/core/utils/tools'

@Injectable()
export class JianyingService {
  /**
   * 创建剪映草稿，逐 item 添加视频/音频/图片/文本，按给定优先级决定片段时长。
   */
  async createDraft(dto: jianyingComposeCreateParamsType): Promise<jianyingComposeCreateResultType> {
    const name = dto?.name?.trim?.() || ''
    const draft = createDraft(join(process.cwd(), 'public'), name)

    //1. 创建草稿根目录及其资源目录
    const assetsDir = join(draft.draftFolder, 'assets')
    createFolder(assetsDir)

    // 保存草稿
    save(draft)
    return {
      id: '1231',
    }
  }
}
