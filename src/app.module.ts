import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { ProductModule } from '@product/product.module';
import { AppController } from '@root/app.controller';
import { AppService } from '@root/app.service';
import { EmailModule } from '@email/email.module';
import { DatabaseModule } from '@database/database.module';
import { MinioClientModule } from '@minio-client/minio-client.module';
import { RedisModule } from '@redis/redis.module';
import { NoticeModule } from '@notice/notice.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AgreeOfTermModule } from '@root/agreeOfTerm/agree-of-term.module';
import { CommentModule } from './comment/comment.module';
import { MovieModule } from '@movie/movie.module';
import { ProfileModule } from '@profile/profile.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        // REDIS_USER: Joi.string().required(),
        // REDIS_PASSWORD: Joi.string().required(),
        REDIS_TTL: Joi.number().required(),

        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),

        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),

        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),

        FIND_PASSWORD_TOKEN_SECRET: Joi.string().required(),
        FIND_PASSWORD_TOKEN_EXPIRATION_TIME: Joi.string().required(),

        EMAIL_BASE_URL: Joi.string().required(),

        GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_AUTH_CALLBACK_URL: Joi.string().required(),

        KAKAO_AUTH_CLIENT_ID: Joi.string().required(),
        // KAKAO_AUTH_CLIENT_SECRET: Joi.string().required(),
        KAKAO_AUTH_CALLBACK_URL: Joi.string().required(),

        NAVER_AUTH_CLIENT_ID: Joi.string().required(),
        NAVER_AUTH_CLIENT_SECRET: Joi.string().required(),
        NAVER_AUTH_CALLBACK_URL: Joi.string().required(),

        MINIO_ENDPOINT: Joi.string().required(),
        MINIO_PORT: Joi.number().required(),
        MINIO_ACCESS_KEY: Joi.string().required(),
        MINIO_SECRET_KEY: Joi.string().required(),
        MINIO_BUCKET: Joi.string().required(),

        MOVIE_URL: Joi.string().required(),
        MOVIE_TOKEN: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
      context: ({ req }) => ({ req }),
      playground: true, // 개발 편의성 추가
      debug: true,
    }),
    DatabaseModule,
    ProductModule,
    AuthModule,
    UserModule,
    EmailModule,
    RedisModule,
    AgreeOfTermModule,
    MinioClientModule,
    NoticeModule,
    ScheduleModule.forRoot(),
    CommentModule,
    MovieModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
