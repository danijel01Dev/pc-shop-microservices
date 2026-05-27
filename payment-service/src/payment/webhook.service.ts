import { BadRequestException, Injectable } from "@nestjs/common";
import type { Checkout } from 'stripe'

import { PrismaService } from "src/prisma/prisma.service";
import { Stripe as StripeType} from 'stripe'
import { Queue} from "bullmq";
import { InjectQueue } from "@nestjs/bullmq";
import  Stripe from 'stripe'





@Injectable()
export class WebhookService{
    private stripe: StripeType;
    constructor(
        @InjectQueue('email')
        private readonly  emailQueue : Queue,
        private readonly db : PrismaService,
    ){ this.stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY!,
    );}
   async handleWebhook(req : Request){
     const signature = req.headers['stripe-signature'];
     if(!signature) {throw new BadRequestException("missing signature")};
     let event: any;
     try{
        event = this.stripe.webhooks.constructEvent(
            (req as any).rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
     }
     catch(err){
        console.log('webhook signature error', err)
        throw new BadRequestException('invalid webhook signature')
     }
     switch(event.type){
        case 'checkout.session.completed' : {
            const session = event.data.object as Checkout.Session;
            await this.db.payment.update({
                where :{
                    stripeSessionId : session.id,
                },
                data : {
                    status : 'PAID'
                }
               
            })
            await this.emailQueue.add('send_email',{
                email : session.customer_details?.email,
                subject : 'Payment Confirmation',
                text : 'Your Payment was successful',
                

            })

        }
        console.log('payment completed', event.data.object);
        break;
        case 'checkout.session.expired' : {
            const session = event.data.object as Checkout.Session;
            await this.db.payment.update({
                where : {
                    stripeSessionId : session.id,},
                    data : {
                        status : 'FAILED'
                    }
                }
            )
            
        }
        default : {
            console.log(`Unhandled event type ${event.type}`);
        }
        return { recived : true}
     }
   }
}