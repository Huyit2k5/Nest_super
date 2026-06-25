import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './shared/Interceptor/logging.interceptor';
import { TransformInterceptor } from './shared/Interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // tự động loại bỏ các field không không được khai báo decorator trong DTO
    forbidNonWhitelisted: true, // nếu có field không được khai báo decorator thì báo lỗi
    transform: true, // tự động chuyển đổi kiểu dữ liệu của các field sang kiểu được khai báo trong DTO
    exceptionFactory(validationErrors) {
      console.log(validationErrors)
      return new UnprocessableEntityException(validationErrors.map(error => ({
        field: error.property,
        error: Object.values(error.constraints as any).join(", ")
      })))
    },
  }))
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
