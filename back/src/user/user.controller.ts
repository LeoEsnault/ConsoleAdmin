import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query
} from '@nestjs/common'
import { CreateUser, User, UserService } from './user.service'
import { handleException } from '../exceptions/exception.util'

interface GetUsersResponse {
  users: User[];
  totalPages: number;
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number
  ): Promise<GetUsersResponse> {
    try {
      return await this.userService.getAllUsers(page, pageSize);
    } catch (error) {
      console.error(error)
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }

  @Post()
  async createUser(@Body() body: CreateUser): Promise<User> {
    try {
      return await this.userService.createUser(body);
    } catch (error) {
      console.error(error)
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: User): Promise<User> {
    try {
      return await this.userService.updateUser(id, body);
    } catch (error) {
      console.error(error)
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.userService.deleteUser(id);
    } catch (error) {
      console.error(error)
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }
}