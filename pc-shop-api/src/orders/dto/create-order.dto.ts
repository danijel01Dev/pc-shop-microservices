import { ApiProperty } from '@nestjs/swagger';

import { OrderItemDto } from './order-item.dto';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT',
}
export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  JPY = 'JPY',
  AUD = 'AUD',
}

export class CreateOrderDto {
  @ApiProperty({
    type: [OrderItemDto],
    example: [{ productId: 1, quantity: 2 }],
    description: 'List of items in order',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

 @ApiProperty({
  type : String,
  example : 'EUR',
  description : 'currency code for payment'
 })
 @IsEnum(Currency)
  currency : Currency

 
}
