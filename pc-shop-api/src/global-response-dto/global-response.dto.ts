import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  message: string;

  @ApiProperty({ example: '2026-04-22T10:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: '/auth/login' })
  path: string;
}
