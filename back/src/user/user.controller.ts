import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.service';
import { CreateUser } from './user.service';
import * as userExceptions from '../exceptions/user.exceptions';

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

export function handleException(error: unknown): { message: string; status: HttpStatus } {
  if (
    error instanceof userExceptions.UserNotFoundException ||
    error instanceof userExceptions.ProfileNotFoundException
  ) {
    return { message: error.message, status: HttpStatus.NOT_FOUND };
  }

  if (
    error instanceof userExceptions.UserCreationException ||
    error instanceof userExceptions.InvalidEmailFormatException ||
    error instanceof userExceptions.InvalidUserDataException
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
  return { message: 'Erreur interne du serveur', status: HttpStatus.INTERNAL_SERVER_ERROR };
}
