import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe.skip('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should call login service', async () => {
    mockAuthService.login.mockResolvedValue({ token: '123' });

    const result = await controller.login({ email: 'test', password: '123' });

    expect(result).toEqual({ token: '123' });
    expect(mockAuthService.login).toHaveBeenCalled();
  });
});
