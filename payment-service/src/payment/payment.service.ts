import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
    async processPayment(data: any) {
    console.log(data);

    return {
      success: true,
      message: 'Payment processed successfully',
    };
  }
}
