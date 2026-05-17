import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { OrderItemDto } from './order-item.dto';
import { IsArray, IsDateString, IsEnum, IsNumber } from 'class-validator';

export class OrderResponseDto {
  @ApiProperty({ example: 123423 })
  @IsNumber()
  id: number;
  @ApiProperty({ example: 43 })
  @IsNumber()
  total: number;
  @ApiProperty({ example: 1235 })
  @IsNumber()
  orderNumber: number;
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  @IsEnum(OrderStatus)
  status: OrderStatus;
  @ApiProperty({ example: '123' })
  @IsNumber()
  userId: number;
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  items: OrderItemDto[];
  @ApiProperty({ example: '2026-01-01T12:00:00Z' })
  @IsDateString()
  createdAt: Date;
}

export class PagResponseDto {
  @ApiProperty({ type: [OrderResponseDto] })
  @IsArray()
  orders: OrderResponseDto[];
  @ApiProperty({ example: 50 })
  @IsNumber()
  total: number;
  @ApiProperty({ example: 2 })
  @IsNumber()
  page: number;
  @ApiProperty({ example: 10 })
  @IsNumber()
  limit: number;
  @ApiProperty({ example: 5 })
  @IsNumber()
  totalPages: number;
}
