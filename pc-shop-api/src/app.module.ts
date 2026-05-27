import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    OrdersModule,
    AuthModule,CacheModule.register({
    isGlobal : true,
    useFactory: async () => ({store : await redisStore,
    host : process.env.REDIS_HOST || 'localhost',
    port : Number(process.env.REDIS_PORT) || 6379,
    ttl : 60,
  })}),
BullModule.forRoot({
  connection : {
    host : process.env.REDIS_HOST || 'localhost',
    port : Number(process.env.REDIS_PORT) || 6379
  }
  
}),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 60
       }]}),
       
        
      ]
    ,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
