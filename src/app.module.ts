import { GraphQLModule } from '@nestjs/graphql'
import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { loggingMiddleware, PrismaModule } from 'nestjs-prisma'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { PostsModule } from './posts/posts.module'
import config from './common/configs/config'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'

import { GqlConfigService } from './gql-config.service'
import { GoogleModelModule } from './googleModel/googleModel.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { JianYingModule } from './jianying/jianying.module'
import { VideosModule } from './videos/videos.module'
import { join } from 'node:path'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    // 静态资源：用于暴露生成的文件（/files/**）
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public', 'files'),
      serveRoot: '/files',
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          // configure your prisma middleware
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),

    AuthModule,
    UsersModule,
    PostsModule,
    GoogleModelModule,
    VideosModule,
    JianYingModule,
  ],
})
export class AppModule {}
