import { Controller, Get, Post, Put, Param, Body, HttpException, HttpStatus, Delete } from '@nestjs/common';
import { CreateUser, User, UserService } from './user.service';
import * as userExceptions from '../exceptions/user.exceptions';
import * as roleExceptions from '../exceptions/role.exceptions';
import * as enterpriseExceptions from '../exceptions/enterprise.exceptions';


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


export function handleException(error: any): { message: string; status: HttpStatus } {
  if (
    error instanceof userExceptions.UserNotFoundException ||
    error instanceof userExceptions.ProfileNotFoundException ||
    error instanceof enterpriseExceptions.EnterpriseNotFoundException ||
    error instanceof roleExceptions.RoleNotFoundException
  ) {
    return { message: error.message, status: HttpStatus.NOT_FOUND };
  }

  if (
    error instanceof userExceptions.UserCreationException ||
    error instanceof userExceptions.InvalidEmailFormatException ||
    error instanceof userExceptions.InvalidUserDataException ||
    error instanceof userExceptions.SuperAdminDeleteException
  ) {
    return { message: error.message, status: HttpStatus.BAD_REQUEST };
  }

  if (
    error instanceof userExceptions.ProfileCreationException ||
    error instanceof userExceptions.ProfileUpdateException ||
    error instanceof userExceptions.DatabaseException ||
    error instanceof userExceptions.UserDeleteException
  ) {
    return { message: error.message, status: HttpStatus.INTERNAL_SERVER_ERROR };
  }

  if (error instanceof userExceptions.UserAlreadyExistsException) {
    return { message: error.message, status: HttpStatus.CONFLICT };
  }

  //console.error('Erreur inconnue :', error);
  return { message: error.response.message, status: error.response.statusCode };
}
