import { Module } from '@nestjs/common'
import { JianyingService } from './jianying.service'
import { JianyingController } from './jianying.controller'

@Module({
  controllers: [JianyingController],
  providers: [JianyingService],
  exports: [JianyingService],
})
export class JianyingModule {}
