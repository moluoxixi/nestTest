import type { GraphqlConfig } from './common/configs/config.interface'
import type { ConfigService } from '@nestjs/config'
import type { ApolloDriverConfig } from '@nestjs/apollo'
import { Injectable } from '@nestjs/common'
import type { GqlOptionsFactory } from '@nestjs/graphql'

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private configService: ConfigService) {}
  createGqlOptions(): ApolloDriverConfig {
    const graphqlConfig = this.configService.get<GraphqlConfig>('graphql')
    return {
      // schema options
      autoSchemaFile: graphqlConfig.schemaDestination || './src/schema.graphql',
      sortSchema: graphqlConfig.sortSchema,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      // subscription
      installSubscriptionHandlers: true,
      includeStacktraceInErrorResponses: graphqlConfig.debug,
      playground: graphqlConfig.playgroundEnabled,
      context: ({ req }) => ({ req }),
    }
  }
}
