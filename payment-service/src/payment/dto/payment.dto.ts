import { IsString , IsNumber, Min} from '@nestjs/class-validator'

export class ProcessPaymentDto {

  @IsString()
  currency?: string;

  @IsString()
  userId?: string;

  @IsString()
  orderId?: string;

  @IsString()
  paymentMethod?: string;

  @IsNumber()
  @Min(1)
  amount?: number;
}




