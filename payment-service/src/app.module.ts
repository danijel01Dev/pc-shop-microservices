import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule} from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-store';
import { BullModule} from '@nestjs/bullmq';
import { EmailModule } from './email/email.module';

@Module({
  imports: [PaymentModule, PrismaModule, EmailModule, CacheModule.register({
    isGlobal : true,
    store : redisStore,
    host : process.env.REDIS_HOST || 'localhost',
    port : Number(process.env.REDIS_PORT) || 6379,
    ttl : 60,
  }),
BullModule.forRoot({
  connection : {
    host : process.env.REDIS_HOST || 'localhost',
    port : Number(process.env.REDIS_PORT) || 6379
  }
  
}),
EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
