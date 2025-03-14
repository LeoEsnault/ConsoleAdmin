import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProfilFacade {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getUserProfile(userId: string): Promise<any> {
    const supabase: SupabaseClient = this.supabaseService.getClient();

    const { data: user } = await supabase.auth.admin.getUserById(userId);

    const { data } = await supabase.from('profiles').select('*').eq('auth_id', userId).single();

    return { data, user };
  }

  async updateUserProfile(userId: string, data: any): Promise<any> {
    const supabase: SupabaseClient = this.supabaseService.getClient();

    const firstname = data.firstname;
    const lastname = data.lastname;
    const phone = data.phone;
    const email = data.email;

    const { data: user } = await supabase.auth.admin.updateUserById(userId, {
      email,
      phone,
    });

    const { data: updatedUser } = await supabase
      .from('profiles')
      .update({ lastname, firstname })
      .eq('auth_id', userId)
      .single();

    return { updatedUser, user };
  }
}
