import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationDto } from '../products/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt/JWT-Guards/jwt.guard';
import { RolesGuard } from '../auth/jwt/JWT-Guards/role.guard';
import { Roles } from '../auth/jwt/JWT-Decorator/role.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
 import { OrderResponseDto, PagResponseDto } from './dto/api-order.dto';
import { ApiErrorResponses } from '../error-decorator/ErrorDecoratorSwagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create Order' })
  @ApiResponse({
    status: 200,
    description: 'Order Created Successfully',
    type: OrderResponseDto,
  })
  @ApiErrorResponses()
  create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.sub;
    return this.ordersService.create(userId, createOrderDto);
  }
  @UseInterceptors(CacheInterceptor)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('active')
  @ApiOperation({ summary: 'Get All Active  Orders ' })
  @ApiResponse({
    status: 200,
    description: 'Orders loaded Successfully',
    type: PagResponseDto,
  })
  @ApiErrorResponses()
  findAll(@Query() pagdto: PaginationDto) {
    return this.ordersService.findAll(pagdto);
  }
  @UseInterceptors(CacheInterceptor)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('delivered')
  @ApiOperation({ summary: 'Get All Delivered Orders' })
  @ApiResponse({
    status: 200,
    description: 'Orders loaded Successfully',
    type: PagResponseDto,
  })
  @ApiErrorResponses()
  findDelivered(@Query() pagdto: PaginationDto) {
    return this.ordersService.findDelivered(pagdto);
  }

  @Get('test-payment')
  testPayment() {
    return this.ordersService.testPayment();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get Order By Id ' })
  @ApiResponse({
    status: 200,
    description: 'Order loaded Successfully',
    type: OrderResponseDto,
  })
  @ApiErrorResponses()
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.sub;
    return this.ordersService.findOne(userId, id);
  }
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('update/:id')
  @ApiOperation({ summary: 'Update Order' })
  @ApiResponse({ status: 200, description: 'Update', type: OrderResponseDto })
  @ApiErrorResponses()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.adminOrderUpdate(id, updateOrderDto);
  }
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Cancel Order ' })
  @ApiResponse({
    status: 200,
    description: 'Order Cancelled successfully',
    type: OrderResponseDto,
  })
  @ApiErrorResponses()
  orderCancel(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.sub;
    return this.ordersService.cancelOrder(userId, id);
  }
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('cancel/:id')
  @ApiOperation({ summary: 'Order Cancel By Admin' })
  @ApiResponse({
    status: 200,
    description: 'Order Cancelled successfully',
    type: OrderResponseDto,
  })
  @ApiErrorResponses()
  adminCancelOrder(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.adminCancelOrder(id);
  }
}
