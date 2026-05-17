import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @MessagePattern('process_payment')
  processPayment(data: any) {
    return this.paymentService.processPayment(data);
  }
}
