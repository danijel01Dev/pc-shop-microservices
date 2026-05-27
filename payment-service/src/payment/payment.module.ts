import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WebhookService } from './webhook.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [PaymentController],
  providers: [PaymentService, WebhookService, PrismaService],
  
})
export class PaymentModule {}
