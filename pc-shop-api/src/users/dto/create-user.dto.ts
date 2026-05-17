import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user.guest993@gmail.com',
    description: 'User E mail',
  })
  @IsEmail()
  @IsString()
  email: string;
  @ApiProperty({
    example: 'userPassword',
    description: ' User Password , Min Length 6',
  })
  @IsString()
  @MinLength(6)
  password: string;
  @ApiProperty({
    example: '32342sdfsdf',
    description: 'Refresh Token is optional ',
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
