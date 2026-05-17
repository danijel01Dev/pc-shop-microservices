import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user.guest993@gmail.com',
    description: 'User email',
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'userPassword',
    description: 'User password',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
