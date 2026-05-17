import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Macbook Pro' })
  name: string;

  @ApiProperty({ example: 2500 })
  price: number;

  @ApiProperty({ example: 5 })
  stock: number;

  @ApiProperty({ example: 'blue color and durable case' })
  description?: string;

  @ApiProperty({ example: '2026-01-01T12:00:00Z' })
  createdAt: Date;
}

export class PaginatedProductsDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data: ProductResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}
