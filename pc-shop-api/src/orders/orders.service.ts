import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';

import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationDto } from '../products/dto/pagination.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(private db: PrismaService,
    @Inject('PAYMENT_SERVICE') private paymentClient: ClientProxy
  ) {}

  //==== Create Order  >  order created in transaction  ====

  async create(userId: number, dto: CreateOrderDto) {
    return await this.db.$transaction(async (tx) => {
      const getId = dto.items.map((x) => x.productId);
      const products = await tx.product.findMany({
        where: {
          id: { in: getId },
        },
      });
      const orderProduct = new Map(products.map((p) => [p.id, p]));
      const productSum = new Map<number, number>();
      for (const item of dto.items) {
        const items = orderProduct.get(item.productId);

        if (!items) {
          throw new BadRequestException('invalid product occured');
        }
        const existing = productSum.get(item.productId) || 0;
        productSum.set(item.productId, existing + item.quantity);
      }
      let totalPrice = 0;
      const orderItemsData: {
        productId: number;
        quantity: number;
        price: number;
      }[] = [];
      for (const [productId, totalQuantity] of productSum) {
        const product = orderProduct.get(productId);

        if (!product) {
          throw new BadRequestException('invalid product');
        }
        if (totalQuantity > product.stock) {
          throw new ConflictException('out of stock ');
        }
        totalPrice += totalQuantity * product.price;
        orderItemsData.push({
          productId: product.id,
          quantity: totalQuantity,
          price: product.price,
        });
      }
      for (const [productId, totalQuantity] of productSum) {
        const updated = await tx.product.updateMany({
          where: { id: productId, stock: { gte: totalQuantity } },
          data: {
            stock: {
              decrement: totalQuantity,
            },
          },
        });
        if (updated.count === 0) {
          throw new ConflictException('out of stock during update');
        }
      }

      const orderCreate = await tx.order.create({
        data: {
          userId: userId,
          total: totalPrice,
          orderNumber: Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 10000),

          items: {
            create: orderItemsData,
          },
        },
      });

      return orderCreate;
    });
  }
  // === Get orders  >excluded 'DELIVERED' ===
  async findAll(pagDto: PaginationDto) {
    try {
      const page = pagDto.page || 1;
      const limit = pagDto.limit || 10;
      const skipOrder = Math.max((page - 1) * limit, 0);

      const orders = await this.db.order.findMany({
        where: {
          status: { not: 'DELIVERED' },
        },
        skip: skipOrder,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
      const total = await this.db.order.count({
        where: {
          status: { not: 'DELIVERED' },
        },
      });
      return {
        orders,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    } catch (error) {
      console.log('failed to load orders', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('failed to load all orders');
    }
  }
  // === Get Orders >  Only 'DELIVERED'
  async findDelivered(pagDto: PaginationDto) {
    const page = pagDto.page || 1;
    const limit = pagDto.limit || 10;
    const skipOrder = Math.max((page - 1) * limit, 0);
    const sort = pagDto.order === 'asc' ? 'asc' : 'desc';
    const total = await this.db.order.count({ where: { status: 'DELIVERED' } });
    const orders = await this.db.order.findMany({
      where: {
        status: 'DELIVERED',
      },
      skip: skipOrder,
      take: limit,
      orderBy: { createdAt: sort },
    });
    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  // ==== Find One Order > response : order  and items included  ====
  async findOne(userId: number, id: number) {
    try {
      const findOrder = await this.db.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!findOrder) {
        throw new NotFoundException('invalid order Id');
      }
      if (userId !== findOrder.userId) {
        throw new ForbiddenException('invalid user , access denied ');
      }
      return findOrder;
    } catch (error) {
      console.log('failed to get order', error);
      throw error;
    }
  }
  // ==== Admin order update >  Status update   ====
  async adminOrderUpdate(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      if (updateOrderDto.status === 'CANCELLED') {
        throw new BadRequestException(
          ' unable to cancel , Use cancelOrder route !',
        );
      }
      const findOrder = await this.db.order.findUnique({ where: { id } });
      if (!findOrder) {
        throw new NotFoundException('invalid order');
      }
      const updateStatus = this.db.order.update({
        where: { id: findOrder.id },
        data: {
          status: updateOrderDto.status,
        },
      });
      return updateStatus;
    } catch (error) {
      console.log('failed to update status', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('failed to update status');
    }
  }
  //==== Cancel order by user > stock restore and status change to 'CANCELLED' ====
  async cancelOrder(userId: number, id: number) {
    try {
      return await this.db.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id },
          include: { items: true },
        });
        if (!order) {
          throw new NotFoundException('Order doenst exist ');
        }
        if (userId !== order.userId) {
          throw new ForbiddenException('access denied ');
        }
        if (order.status !== 'PENDING') {
          throw new BadRequestException(
            ' Failed to remove Order , Order is processed already',
          );
        }
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }
        return await tx.order.update({
          where: { id: order.id },
          data: {
            status: 'CANCELLED',
          },
        });
      });
    } catch (error) {
      console.log('failed to delete order', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('failed to cancel order');
    }
  }

  // ==== Admin Cancel Order > canceling order and stock restore =====
  async adminCancelOrder(id: number) {
    try {
      return await this.db.$transaction(async (tx) => {
        const orderCheck = await tx.order.findUnique({
          where: { id },
          include: {
            items: true,
          },
        });
        if (!orderCheck) {
          throw new NotFoundException('invalid order id ');
        }
        if (
          orderCheck.status === 'DELIVERED' ||
          orderCheck.status === 'CANCELLED'
        ) {
          throw new BadRequestException(
            'this order is delivered or cancelled  ',
          );
        }

        for (const item of orderCheck.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
        return await tx.order.update({
          where: { id: orderCheck.id },
          data: {
            status: 'CANCELLED',
          },
        });
      });
    } catch (error) {
      console.log('failed to update order status ', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'failed to update order status , try again !',
      );
    }
  }


async testPayment() {
  return await firstValueFrom(
    this.paymentClient.send(
      'process_payment',
      {
        amount: 100,
      },
    ),
  );
}
}
