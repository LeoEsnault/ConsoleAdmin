import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service'; 

@Injectable()
export class ProfilFacade {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getUserProfile(userId: string): Promise<any> {
    const supabase: SupabaseClient = this.supabaseService.getClient();

    const { data: user, error: authError } = await supabase.auth.admin.getUserById(userId)

    if (authError) {
      throw authError
    }


    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_id', userId)
      .single();

    if (error) {
      throw error; 
    }

    return { data, user };
  };

  async updateUserProfile(userId: string, data: any): Promise<any> {
    const supabase: SupabaseClient = this.supabaseService.getClient();

    const phone = data.phone;
    const email = data.email;
    const firstname = data.firstname
    const lastname = data.lastname

    if (!email || typeof email !== "string") {
      throw new Error("Email invalide !");
  }
  
  if (phone && typeof phone !== "string") {
      throw new Error("Numéro de téléphone invalide !");
  }

    const { data: user, error: authError } = await supabase.auth.admin.updateUserById(userId, {
      email,
      phone
    } )

    if (authError) {
      throw authError
    }

    const { data: updatedUser, error } = await supabase
      .from('profiles')
      .update({lastname, firstname})
      .eq('auth_id', userId)
      .single();

    if (error) {
      throw error; 
    }

    return { updatedUser, user };
  }
}
