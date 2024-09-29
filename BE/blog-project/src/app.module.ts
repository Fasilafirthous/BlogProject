import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource, { dbdataSource } from './data-source';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { UserModule } from './module/user/user.module';
import { BlogModule } from './module/blog/blog.module';
import { S3Module } from './module/s3/s3.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { CognitoModule } from './aws/cognito.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(dbdataSource),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), '/schema.gql'),
      sortSchema: true,
      playground: false,
      context: ({ req }) => ({ headers: req.headers }),
      buildSchemaOptions: {
        scalarsMap: [{ type: () => GraphQLDate, scalar: GraphQLDate }],
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      installSubscriptionHandlers: true,
    }),
    // ConfigModule.forRoot({
    //   envFilePath: '.env',
    //   isGlobal: true,
    //   load: [],
    // }),
    UserModule,
    BlogModule,
    S3Module,
    AuthModule,
    LoggerModule,
    CognitoModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
