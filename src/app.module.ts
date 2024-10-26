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
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),

        GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_AUTH_CALLBACK_URL: Joi.string().required(),

        KAKAO_AUTH_CLIENT_ID: Joi.string().required(),
        // KAKAO_AUTH_CLIENT_SECRET: Joi.string().required(),
        KAKAO_AUTH_CALLBACK_URL: Joi.string().required(),

        NAVER_AUTH_CLIENT_ID: Joi.string().required(),
        NAVER_AUTH_CLIENT_SECRET: Joi.string().required(),
        NAVER_AUTH_CALLBACK_URL: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        // REDIS_USER: Joi.string().required(),
        // REDIS_PASSWORD: Joi.string().required(),
        REDIS_TTL: Joi.number().required(),
      }),
    }),
    DatabaseModule,
    ProductModule,
    AuthModule,
    UserModule,
    EmailModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
