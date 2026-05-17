import {
  HttpException,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateRoleDto } from './dto/update-admin.dto';
import { PaginationDto } from '../products/dto/pagination.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}
  async createUser(createUserDto: CreateUserDto) {
    try {
      const hash = await bcrypt.hash(createUserDto.password, 10);
      return await this.db.user.create({
        data: {
          email: createUserDto.email,
          password: hash,
          refreshToken: createUserDto.refreshToken,
        },
      });
    } catch (error) {
      console.log(' failed to create user', error);
      throw new NotFoundException(' Something went wrong , try again');
    }
  }

  async findByEmail(email: string) {
    try {
      return this.db.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
        },
      });
    } catch (error) {
      console.log('failed to find user', error);
      throw new NotFoundException('User not found');
    }
  }
  async updateRefreshToken(id: number, token: string | null) {
    try {
      return this.db.user.update({
        where: { id },
        data: { refreshToken: token },
      });
    } catch (error) {
      console.log('failed to update token', error);
      throw new NotFoundException('Token not found');
    }
  }
  async findAll(pagDto: PaginationDto) {
    try {
      const page = pagDto.page || 1;
      const limit = pagDto.limit || 10;
      const skip = Math.max((page - 1) * limit, 0);

      const total = await this.db.user.count();
      const users = await this.db.user.findMany({
        select: {
          email: true,
        },
        orderBy: { id: 'asc' },
        skip,
        take: limit,
      });

      return {
        data: users,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    } catch (error) {
      console.log('failed to load users', error);
      throw new NotFoundException(' Loading Users failed');
    }
  }

  async findOne(id: number) {
    try {
      return await this.db.user.findUnique({ where: { id } });
    } catch (error) {
      console.log('failed to find user', error);
      throw new NotFoundException('invalid user');
    }
  }

  async update(userId: number, id: number, updateUserDto: UpdateUserDto) {
    try {
      const findUser = await this.db.user.findUnique({ where: { id } });
      if (!findUser) {
        throw new UnauthorizedException('invalid user , failed to update');
      }
      if (findUser.id !== userId) {
        throw new UnauthorizedException('access denied ');
      }
    
       const hashPassword =  updateUserDto.password ? await bcrypt.hash(updateUserDto.password , 10) : findUser.password
       const emailUpdate = updateUserDto.email ??findUser.email
      return await this.db.user.update({
        where: { id: findUser.id },
        data: {
          email: emailUpdate,
          password: hashPassword
        },
      });
    } catch (error) {
      console.log('failed to update user', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('failed to update user');
    }
  }

  async remove(id: number) {
    try {
       return await this.db.user.delete({ where: { id } });
    } catch (error) {
      console.log('failed to delete user', error);
      throw new NotFoundException('failed to delete user ');
    }
  }
  async userUpdateByAdmin(dto: UpdateRoleDto) {
    try {
      const findUser = await this.db.user.findUnique({
        where: { email: dto.email },
      });
      if (!findUser) {
        throw new UnauthorizedException('invalid user ');
      }
      return await this.db.user.update({
        where: { id: findUser.id },
        data: {
          role: dto.role,
        },
      });
    } catch (error) {
      console.log('failed to update user by Admin ', error);
      throw new UnauthorizedException(' failed to update user By Admin');
    }
  }
}
