import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: any;
  const MockPrisma = {
    product: { findMany: jest.fn(), count: jest.fn(), create: jest.fn() },
  };
  const MockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'AWS_s3_REGION') return 'us-east-1';
      return null;
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: MockPrisma },
        { provide: ConfigService, useValue: MockConfigService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get(PrismaService);
  });

  it('should return products ', async () => {
    const dto = { page: 2, limit: 10 };
    prisma.product.findMany.mockResolvedValue([{ id: 1, name: 'Mouse' }]);

    const call = await service.findAll(dto);
    expect(call.data).toHaveLength(1);
  });

  it('should return filtered products', async () => {
    const dto = {
      page: 2,
      limit: 10,
      search: 'Mouse',
      sortBy: 'price' as const,
      order: 'asc' as 'asc',
    };
    prisma.product.findMany.mockResolvedValue([
      { id: 1, name: 'Mouse', price: 10 },
    ]);
    prisma.product.count.mockResolvedValue(1);
    const test = await service.findAll(dto);

    expect(test.data).toHaveLength(1);
    expect(test.meta.page).toBe(2);
    expect(test.meta.limit).toBe(10);
    expect(test.meta.total).toBe(1);
  });
  it('should return created product', async () => {
    const dto = {
      name: 'Mouse',
      description: 'Blue Mouse',
      price: 15,
      stock: 50,
    };
    const imageurl = '';
    prisma.product.create.mockResolvedValue({
      id: 1,
      ...dto,
      imageurl,
      createdAt: new Date(),
      deletedAt: null,
    });
    const test = await service.create(dto, imageurl);

    expect(prisma.product.create).toHaveBeenCalledWith({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        imageurl,
      },
    });
    expect(test.name).toBe('Mouse');
  });
});
