import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    },
    rawBody: true,
  });
   app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted : true ,
    transform : true ,
   }))
   
  await app.listen();
}

bootstrap();