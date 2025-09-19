import { Module } from '@nestjs/common'
import { GoogleService } from './google.service'
import { VeoController } from './veo.controller'
import { ImagenController } from './imagen.controller'

@Module({
  providers: [GoogleService],
  controllers: [VeoController, ImagenController],
})
export class GoogleModule {}
