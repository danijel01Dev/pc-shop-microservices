import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import * as nodemailer from 'nodemailer';


@Processor('email')
export class EmailProcessor extends WorkerHost{
  
async process(job: any ): Promise  <any>{
     if (job.name === 'send_email'){
      const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS,
        }
      })
      await transporter.sendMail({
        from : process.env.EMAIL_USER,
        to : job.data.email,
        subject : job.data.subject,
        text : job.data.text
      })
      console.log('Email Sent');
     }
    }
}