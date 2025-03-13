import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { User } from './enterprise.service';
import * as userExceptions from '../exceptions/user.exceptions';
import * as enterpriseExceptions from '../exceptions/enterprise.exceptions';

interface GetUsersResponse {
  users: User[];
  totalPages: number;
}

@Controller('enterprises')
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Get(':id/users')
  async getUsers(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number
  ): Promise<GetUsersResponse> {
    try {
      return await this.enterpriseService.getUsers(id, page, pageSize);
    } catch (error) {
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }

  @Get()
  async getEnterprises() {
    try {
      return await this.enterpriseService.getEnterprises();
    } catch (error) {
      console.error(error);
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }
}

export function handleException(error: any): { message: string; status: HttpStatus } {
  if (
    error instanceof enterpriseExceptions.EnterpriseNotFoundException ||
    error instanceof userExceptions.ProfileNotFoundException
  ) {
    return { message: error.message, status: HttpStatus.NOT_FOUND };
  }

  //console.error('Erreur', error);
  return { message: error.response.message, status: error.response.statusCode };
}
