import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);

  // app.setGlobalPrefix('api'); // url에 api추가
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors(); // 허용된 ip 만 접속 가능하도록 설정
  app.use(cookieParser());

  // Validation 설정
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // 프로젝트 전체에 Interceptor 적용 방식
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger 환경변수
  const config = new DocumentBuilder()
    .setTitle('ecommerce_jangwon_api')
    .setDescription('ecommerce_jangwon_api description')
    .addBearerAuth()
    .setVersion('1.0')
    .addServer('http://localhost/api')
    .addServer('http://jangsen.duckdns.org/api')
    // .addServer('http://211.49.53.89:8000')
    .addTag('ecommerce')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get('BACKEND_PORT') ?? 7070;
  // const host = configService.get('BACKEND_HOST');

  await app.listen(port);
}

bootstrap();
