import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProfilFacade {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getUser(userId: string): Promise<any> {
    const supabase: SupabaseClient = this.supabaseService.getClient();

    return await supabase.auth.admin.getUserById(userId);

  }
  async getProfile(userId: string): Promise<any> {
    const supabase: SupabaseClient = this.supabaseService.getClient();

    return await supabase.from('profiles').select('*').eq('auth_id', userId).single();

  }

    async updateAuth(userId: string, data: any): Promise<any>{
      const supabase: SupabaseClient = this.supabaseService.getClient();
      
      const phone = data.phone;
      const email = data.email;

      return await supabase.auth.admin.updateUserById(userId, {
        email,
        phone,
      });

    }
    async updateProfile(userId: string, data: any): Promise<any>{
      const supabase: SupabaseClient = this.supabaseService.getClient();

      const firstname = data.firstname;
      const lastname = data.lastname;  
      
      return await supabase
      .from('profiles')
      .update({ lastname, firstname })
      .eq('auth_id', userId)
      .single();
  }
  }
   

  
  
  