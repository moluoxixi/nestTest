import { Module } from '@nestjs/common'
import { GoogleModelService } from './googleModel.service'
import controllers from './controllers'

@Module({
  providers: [GoogleModelService],
  controllers,
})
export class GoogleModelModule {}


