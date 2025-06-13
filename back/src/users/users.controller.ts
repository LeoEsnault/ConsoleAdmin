import { Controller, Get, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { handleException } from '../../utils/handleExceptions';
import { UserNotFoundException } from 'src/exceptions';

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @Get()
  async getUserProfile() {
    try {
      return await this.UsersService.getUser();
    } catch (error) {
      console.error(error);
      throw new UserNotFoundException();
    }
  }
}