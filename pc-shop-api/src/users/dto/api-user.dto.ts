import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@mail.com' })
  email: string;

  @ApiProperty({ example: 'USER' })
  role: string;
}

export class UserEmailDto {
  @ApiProperty({ example: 'test@mail.com' })
  email: string;
}
export class UserRoleDto {
  @ApiProperty({ example: 'ADMIN' })
  role: string;
}
