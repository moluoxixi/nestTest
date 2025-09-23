import { Body, Controller, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { JianYingService } from './jianying.service'
import type { jianyingDraftGenerateParamsType, jianyingDraftGenerateResultType } from './_types/draft'

@Controller('jianying')
export class JianYingController {
  constructor(private readonly jianying: JianYingService) {}

  /**
   * 生成剪映草稿
   */
  @Post('generateDraft')
  async generateDraft(
    @Req() req: Request,
    @Body() body: jianyingDraftGenerateParamsType = {},
  ): Promise<jianyingDraftGenerateResultType | { error: any }> {
    try {
      const res = await this.jianying.jianyingDraftGenerate(body)
      const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http'
      const host = (req.headers['x-forwarded-host'] as string) || req.get('host')
      const contentAbs = host ? `${proto}://${host}${res.draftContentDownPath}` : res.draftContentDownPath
      const infoAbs = host ? `${proto}://${host}${res.draftInfoDownPath}` : res.draftInfoDownPath
      const manifestAbs = host ? `${proto}://${host}${res.manifestDownPath}` : res.manifestDownPath
      return { ...res, draftContentDownPath: contentAbs, draftInfoDownPath: infoAbs, manifestDownPath: manifestAbs }
    }
    catch (e: any) {
      return { error: (e?.message ?? e) }
    }
  }
}


