import { ApiProperty } from '@nestjs/swagger';

import { OrderItemDto } from './order-item.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
}
