import { Body, Query, Controller, HttpException, Post, Delete, Put, Param } from '@nestjs/common';
import { Establishment, CreateEstablishmentBody, EstablishmentService } from './establishment.service';
import { handleException } from '../../utils/handleExceptions';

@Controller('establishments')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Post()
  async createEstablishment(@Body() body: CreateEstablishmentBody): Promise<Establishment> {
    try {
      return await this.establishmentService.createEstablishment(body);
    } catch (error) {
      console.error(error);
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }

  @Put(':id')
  async updateEstablishment(@Param('id') id: string, @Body() body: Establishment) {
    try {
      return await this.establishmentService.updateEstablishment(id, body);
    } catch (error) {
      console.error(error);
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }

  @Delete(':id')
  async deleteEstablishment(@Param('id') id: string) {
    try {
      return await this.establishmentService.deleteEstablishment(id);
    } catch (error) {
      console.error(error);
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }
}
