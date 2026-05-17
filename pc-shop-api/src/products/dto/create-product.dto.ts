import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Mouse', description: 'Prodcut Name' })
  @IsString()
  name: string;
  @ApiProperty({
    example: 'This Keyboard is black ....',
    description: 'Product description',
  })
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty({ example: '43', description: 'Product price' })
  @IsNumber()
  price: number;
  @ApiProperty({ example: '26', description: 'Prodcut Stock' })
  @IsNumber()
  stock: number;
}
