import { Module } from '@nestjs/common'
import { JianYingController } from './jianying.controller'
import { JianYingService } from './jianying.service'

@Module({
  controllers: [JianYingController],
  providers: [JianYingService],
})
export class JianYingModule {}


