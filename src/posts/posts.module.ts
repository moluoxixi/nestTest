import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PostsResolver } from './posts.resolver'

@Module({
  imports: [AuthModule],
  providers: [PostsResolver],
})
export class PostsModule {}
