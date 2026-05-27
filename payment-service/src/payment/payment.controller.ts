import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PaymentService } from './payment.service';
import { ProcessPaymentDto } from './dto/payment.dto';
import { WebhookService } from './webhook.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller()
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly wh : WebhookService,
  ) {}

  @MessagePattern('process_payment')
  processPayment(payment : ProcessPaymentDto) {
    return this.paymentService.processPayment(payment);
  }
  @Post('payments/webhook')
  async handleWebhook(@Req() req : Request){

     return await this.wh.handleWebhook(req)
  }
  @UseInterceptors(CacheInterceptor)
  @Get('status/:id')
  async getStatus(@Param('id', ParseIntPipe)  id : number){
    return await this.paymentService.getStatus(id)
  }
}
