import { Body, Controller, Get, HttpException, Param, Put } from '@nestjs/common';
import { ProfilService } from './profil.service';
import { handleException } from '../../utils/handleExceptions';

@Controller('profiles')
export class ProfilController {
  constructor(private readonly profilService: ProfilService) {}

  @Get(':user_id')
  async getUserProfile(@Param('user_id') userId: string) {
    try {
      return await this.profilService.getUserProfile(userId);
    } catch (error) {
      console.error(error);
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }

  @Put(':user_id')
  async updateUserProfil(@Param('user_id') userId: string, @Body() data: any) {
    try {
      return await this.profilService.updateUserProfile(userId, data);
    } catch (error) {
      console.error(error);
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }
}
