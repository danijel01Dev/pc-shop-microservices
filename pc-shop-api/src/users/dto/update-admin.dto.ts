import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';


export class UpdateRoleDto {
  @ApiProperty({
    example: 'user.guest993@gmail.com',
    description: 'User E mail',
  })
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'USER', description: 'User Role update ' })
  @IsEnum(Role)
  role: Role;
}
