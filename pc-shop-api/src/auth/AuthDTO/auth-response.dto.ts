import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: 'access-token-example',
  })
  accessToken: string;

  @ApiProperty({
    example: 'refresh-token-example',
  })
  refreshToken: string;
}
export class RefreshDto {
  @ApiProperty({ example: 'your refresh_token_here' })
  refreshToken: string;
}
