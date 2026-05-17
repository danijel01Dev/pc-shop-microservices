import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ example: 'Mouse', description: 'Prodcut Name' })
  name?: string | undefined;
  @ApiProperty({
    example: 'This Keyboard is black ....',
    description: 'Product description',
  })
  description?: string | undefined;
  @ApiProperty({ example: '43', description: 'Product price' })
  price?: number | undefined;
  @ApiProperty({ example: '26', description: 'Prodcut Stock' })
  stock?: number | undefined;
}
