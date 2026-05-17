import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt/JWT-Guards/jwt.guard';
import { RolesGuard } from '../auth/jwt/JWT-Guards/role.guard';
import { Roles } from '../auth/jwt/JWT-Decorator/role.decorator';
import { UpdateRoleDto } from './dto/update-admin.dto';
import { UserResponseDto, UserEmailDto, UserRoleDto } from './dto/api-user.dto';
import { PaginationDto } from '../products/dto/pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponses } from '../error-decorator/ErrorDecoratorSwagger';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post('create')
  @ApiOperation({ summary: 'User Create' })
  @ApiResponse({
    status: 200,
    description: 'User Created Succesfully',
    type: UserResponseDto,
  })
  @ApiErrorResponses()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get('many')
  @ApiOperation({ summary: 'Get All Users' })
  @ApiResponse({
    status: 200,
    description: 'Users loaded successfully',
    type: UserEmailDto,
  })
  @ApiErrorResponses()
  findAll(@Query() pagDto: PaginationDto) {
    return this.usersService.findAll(pagDto);
  }
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  @ApiOperation({ summary: ' Get User By Id' })
  @ApiResponse({
    status: 200,
    description: 'User loaded Successfully',
    type: UserResponseDto,
  })
  @ApiErrorResponses()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user By Id ' })
  @ApiResponse({
    status: 200,
    description: 'User Updated Successfully',
    type: UserResponseDto,
  })
  @ApiErrorResponses()
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = req.user.sub;
    return this.usersService.update(userId, id, updateUserDto);
  }
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete User ' })
  @ApiResponse({ status: 200, description: 'User Deleted Successfully' })
  @ApiErrorResponses()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch('role')
  @ApiOperation({ summary: 'Update Admin Role' })
  @ApiResponse({
    status: 200,
    description: 'User Role Updated Successfully',
    type: UserRoleDto,
  })
  @ApiErrorResponses()
  roleUpdateByAdmin(@Body() Body: UpdateRoleDto) {
    return this.usersService.userUpdateByAdmin(Body);
  }
}
