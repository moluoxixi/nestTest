import { Module } from '@nestjs/common'
import { GoogleService } from './google.service'
import controllers from './controllers'

@Module({
  providers: [GoogleService],
  controllers,
})
export class GoogleModule {}
