import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import * as Exceptions from '../exceptions';
import { MIN_LENGHT_PASSWORD } from '../../utils/isValidEmail';

@Injectable()
export class UpdatePasswordService {
    constructor(private readonly supabaseService: SupabaseService) {}

    async updatePassword(id: string, newPassword: string): Promise<any> {
        const supabase = this.supabaseService.getClient();
    
        const { error } = await supabase.auth.admin.updateUserById(
            id,
            {password: newPassword}
        );

        if (newPassword && newPassword.length < MIN_LENGHT_PASSWORD) {
            throw new Exceptions.InvalidFormatException('Mot de passe trop court')
        }

        if (error) {
            throw new Exceptions.ProfileUpdateException('Votre Mot de passe n\'a pas était mis à jour ');
        }

        return ;
    }
}