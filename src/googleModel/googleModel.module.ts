import { Module } from '@nestjs/common'
import { VideosModule } from '@/videos/videos.module'
import { GoogleModelService } from './googleModel.service'
import controllers from './controllers'

@Module({
  imports: [VideosModule],
  providers: [GoogleModelService],
  controllers,
})
export class GoogleModelModule {}


