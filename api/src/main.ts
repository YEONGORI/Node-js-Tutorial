import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Date Type Validation 실행
      forbidNonWhitelisted: true, // 맞지 않는 타입 금지
      transform: true, // url 데이터 타입 자동 변환
    }),
  );
  await app.listen(3000);
}
bootstrap();
