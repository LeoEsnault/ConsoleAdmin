import { Body, Query, Controller, HttpException, Post, Delete, Put, Param } from '@nestjs/common';
import { Service, CreateServiceBody, ServiceService } from './service.service';
import { handleException } from '../../utils/handleExceptions';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  async createService(@Body() body: CreateServiceBody): Promise<Service> {
    try {
      return await this.serviceService.createService(body);
    } catch (error) {
      console.error(error);
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }

  @Put(':id')
  async updateService(@Param('id') id: string, @Body() body: Service) {
    try {
      return await this.serviceService.updateService(id, body);
    } catch (error) {
      console.error(error);
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }

  @Delete(':id')
  async deleteService(@Param('id') id: string) {
    try {
      return await this.serviceService.deleteService(id);
    } catch (error) {
      console.error(error);
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }
}
