import { Controller, Put, Param, Body } from '@nestjs/common';
import { UpdatePasswordService } from './updatePassword.service';
import * as Exceptions from '../exceptions';

@Controller('update')
export class UpdatePasswordController {
    constructor(private readonly updatePasswordService: UpdatePasswordService) {}

    @Put(':id')
    async updatePassword(
        @Param('id') id: string,  
        @Body('newPassword') newPassword: string, 
    ) {
     const error =  await this.updatePasswordService.updatePassword(id, newPassword)

        if (error){
            throw new Exceptions.ProfileUpdateException()
        }
    }
}
