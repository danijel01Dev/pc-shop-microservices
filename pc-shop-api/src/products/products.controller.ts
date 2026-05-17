import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt/JWT-Guards/jwt.guard';
import { RolesGuard } from '../auth/jwt/JWT-Guards/role.guard';
import { Roles } from '../auth/jwt/JWT-Decorator/role.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductResponseDto } from './dto/api-product.dto';
import { PaginatedProductsDto } from './dto/api-product.dto';
import { ApiErrorResponses } from '../error-decorator/ErrorDecoratorSwagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Max } from 'class-validator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create Prodcut' })
  @ApiResponse({
    status: 201,
    description: 'Product created',
    type: ProductResponseDto,
  })
  @ApiErrorResponses()
   async create(@UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto) {
       new ParseFilePipe({validators : [
        new MaxFileSizeValidator({ maxSize : 1024 * 1024 * 5}),
        new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/})
       ]})
      const awsURL = await this.productsService.upload(file.originalname, file.buffer,file.mimetype);

    return this.productsService.create(createProductDto, awsURL);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Products' })
  @ApiResponse({ status: 200, type: [PaginatedProductsDto] })
  @ApiErrorResponses()
  findAll(@Query() pagDto: PaginationDto) {
    return this.productsService.findAll(pagDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find Product by Id' })
  @ApiResponse({
    status: 201,
    description: 'Product succesfully loaded',
    type: ProductResponseDto,
  })
  @ApiErrorResponses()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update Product by Id' })
  @ApiResponse({
    status: 201,
    description: 'Prodcut Updated Successfully',
    type: ProductResponseDto,
  })
  @ApiErrorResponses()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Prodcut By Id' })
  @ApiResponse({ status: 201, description: 'Prodcut Deleted Successfully' })
  @ApiErrorResponses()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
