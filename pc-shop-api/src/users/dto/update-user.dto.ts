import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'user.guest993@gmail.com',
    description: 'User E mail',
  })
  @IsOptional()
  @IsEmail()
  email?: string | undefined;
  @ApiProperty({
    example: 'userPassword',
    description: ' User Password , Min Length 6',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string ;
  @ApiProperty({
    example: '32342sdfsdf',
    description: 'Refresh Token is optional ',
  })
  @IsOptional()
  @IsString()
  refreshToken?: string | undefined;
}
