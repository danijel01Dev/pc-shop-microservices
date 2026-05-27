import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ProcessPaymentDto } from './dto/payment.dto';
import { PaymentStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  private stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
    async processPayment(pay : ProcessPaymentDto) {
       try{
        const session = await this.stripe.checkout.sessions.create({
       mode: 'payment',

      payment_method_types: ['card'],

      line_items: [
        {
          price_data: {

            currency: pay.currency!,

            product_data: {
              name: `Order #${pay.orderId}`,
            },

            unit_amount: Math.round(pay.amount! * 100),
          },

          quantity: 1,
        },
      ],

      metadata: {
        userId: pay.userId!,
        orderId: pay.orderId!,
      },

      success_url: `${process.env.CLIENT_URL}/payment-success`,

      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
        })
       const payment = await this.prisma.payment.create({
      data: {

        status: PaymentStatus.PENDING,

        amount: Math.round(pay.amount! * 100),

        currency: pay.currency!,

        paymentMethod: 'card',

        userId: Number(pay.userId),

        orderId: Number(pay.orderId),

        stripeSessionId: session.id,
      },
    });

    return {
      url: session.url,
      paymentId: payment.id,
    };}
       catch(err){
        console.error('error processing payment', err)
        throw err
       }
  }
  async getStatus(id : number){
   try{ const getPayment = await this.prisma.payment.findUnique(
      { where : {id },
    select : {
      status : true,
    }}
    )
    if(!getPayment){throw new Error('payment not found')}
    return getPayment.status
  }
  catch(err){
    console.error('error getting payment status', err)
    throw err
  }}
}
