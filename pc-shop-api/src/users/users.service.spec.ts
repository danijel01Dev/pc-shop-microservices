import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;
  const mockPrisma = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });
  it('should create user ', async () => {
    const dto = { email: 'danijeltest@gmail.com', password: '1234567' };
    prisma.user.create.mockResolvedValue({ id: 1, ...dto });
    const test = await service.createUser(dto);
    expect(test.email).toBe('danijeltest@gmail.com');
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: dto.email,
          password: expect.any(String),
        }),
      }),
    );
  });

  it('should return paginated users', async () => {
    const dto = { page: 2, limit: 5 };
    const users = [{ email: 'user@mail.com' }];

    prisma.user.count.mockResolvedValue(6);
    prisma.user.findMany.mockResolvedValue(users);

    await expect(service.findAll(dto)).resolves.toEqual({
      data: users,
      meta: {
        total: 6,
        page: 2,
        limit: 5,
        totalPages: 2,
      },
    });
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      select: {
        email: true,
      },
      orderBy: { id: 'asc' },
      skip: 5,
      take: 5,
    });
  });
});
