/**
 * 剪映草稿模块
 * 整合剪映草稿相关的所有功能
 */

import { Module } from '@nestjs/common';
import { JianyingController } from './jianying.controller';
import { JianyingService } from './jianying.service';

@Module({
  controllers: [JianyingController],
  providers: [JianyingService],
  exports: [JianyingService],
})
export class JianyingModule {}
