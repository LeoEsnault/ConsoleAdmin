import { Controller, Get, Post, Put, Param, Body, HttpException, HttpStatus, Delete } from '@nestjs/common';
import { CreateUser, User, UserService } from './user.service';
import { handleException } from '../../utils/handleExceptions';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId/enterprise')
  async getUserEnterprise(@Param('userId') userId: string) {
    try {
      return await this.userService.getUserEnterprise(userId);
    } catch (error) {
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }

  @Post()
  async createUser(@Body() body: CreateUser): Promise<User> {
    try {
      return await this.userService.createUser(body);
    } catch (error) {
      console.error(error);
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: User): Promise<User> {
    try {
      return await this.userService.updateUser(id, body);
    } catch (error) {
      console.error(error);
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.userService.deleteUser(id);
    } catch (error) {
      console.error(error);
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }
}
