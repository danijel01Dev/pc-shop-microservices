import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { Bucket$, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
// ==== Whole service is covered by Admin guard in controller  except findAll and  findOne===

@Injectable()
export class ProductsService {
  private readonly s3Client: S3Client;

  constructor(
    private db: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.s3Client = new S3Client({ region: this.configService.get('AWS_s3_REGION') });
  }
  async create(createProductDto: CreateProductDto, imageurl : string) {
    return await this.db.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
        imageurl : imageurl
      },
    });
  }
 async upload(fileName : string, fileBuffer : Buffer, mimetype : string){
     await this.s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: fileName,
      Body: fileBuffer,
      ContentType : mimetype
     }))
     return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`
 }

  async findAll(pagDto: PaginationDto) {
    const page = pagDto.page || 1;
    const limit = pagDto.limit || 10;
    const skip = (page - 1) * limit;
    const where = {
      deletedAt: null,
      ...(pagDto.search
        ? {
            name: {
              contains: pagDto.search,
              mode: 'insensitive' as const,
            },
          }
        : {}),
    };
    const total = await this.db.product.count({
      where,
    });
    const products = await this.db.product.findMany({
      where,
      orderBy: pagDto.sortBy
        ? {
            [pagDto.sortBy]: pagDto.order,
          }
        : undefined,
      skip,
      take: limit,
    });
    return {
      data: products,
      meta: {
        total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    return await this.db.product.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return await this.db.product.update({
        where: { id },
        data: {
          name: updateProductDto.name,
          description: updateProductDto.description,
          price: updateProductDto.price,
          stock: updateProductDto.stock,
        },
      });
    } catch (error) {
      console.log('failed to update product', error);
      throw new NotFoundException('failed to update product');
    }
  }

async remove(id: number) {
  const product = await this.db.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }

  await this.db.product.delete({ where: { id } });

  return { message: 'Product deleted successfully' };
}

}
