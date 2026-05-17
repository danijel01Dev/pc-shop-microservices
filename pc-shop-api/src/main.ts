import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RemovePasswordInterceptor } from './interceptor/data.interceptor';
import { GlobalExceptionFilter } from './global-filter/global.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new RemovePasswordInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('PC Shop API')
    .setDescription('API documentation for PC Shop')
    .setVersion('1.0')
    .addTag('pc-shop')
    .addBearerAuth({type : 'http',scheme : 'bearer', bearerFormat : 'JWT'}, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.DOCKER_PORT ?? 3001);
}
bootstrap();
