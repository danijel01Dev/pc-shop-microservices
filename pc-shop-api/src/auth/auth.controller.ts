import { Controller, Post, Body, Req, UseGuards, Delete } from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './jwt/JWT-Guards/jwt.guard.refreshToken';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto, RefreshDto } from './AuthDTO/auth-response.dto';
import { ApiErrorResponses } from '../error-decorator/ErrorDecoratorSwagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './AuthDTO/login.dto';
import { JwtAuthGuard } from './jwt/JWT-Guards/jwt.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @ApiOperation({ summary: 'User Register' })
  @ApiResponse({
    status: 200,
    description: 'User created successfully',
    type: AuthResponseDto,
  })
  @ApiErrorResponses()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.auth.register(dto);
  }
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'User Log In' })
  @ApiResponse({
    status: 200,
    description: 'User Log In successfull',
    type: AuthResponseDto,
  })
  @ApiErrorResponses()
  @Throttle({ default: { limit: 5, ttl: 60000} })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Refresh/verify Token' })
  @ApiBody({
  type: RefreshDto,
  examples: {
    example: {
      value: {
        refreshToken: 'your_refresh_token_here',
      },
    },
  },
})
  @ApiResponse({
    status: 200,
    description: 'Token has been refreshed ',
    type: AuthResponseDto,
  })
  @ApiErrorResponses()
 @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@Req() req) {
    return this.auth.refresh(req.user.sub , req.user.refreshToken);
  }
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remove token/access to user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @ApiErrorResponses()
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req) {
    return this.auth.logout(req.user.sub);
  }
}
