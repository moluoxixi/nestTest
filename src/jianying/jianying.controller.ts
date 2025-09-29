import { Body, Controller, Post } from '@nestjs/common'
import type { jianyingComposeCreateParamsType } from '@/jianying/_types/jianying'
import { JianyingService } from './jianying.service'

@Controller('jianying')
export class JianyingController {
  constructor(private readonly service: JianyingService) {}

  /**
   * 创建剪映草稿：POST /jianying/createDraft
   * 入参 items 为数组，item 含 videoUrl/audioUrl/imageUrl/text（均可选）。
   */
  @Post('createDraft')
  async createDraft(@Body() body: jianyingComposeCreateParamsType) {
    return await this.service.createDraft(body)
  }
}
