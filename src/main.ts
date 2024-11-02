import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { TransformInterceptor } from '@root/common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // url에 api추가

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
    .addTag('ecommerce')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(8000);
}
bootstrap();
