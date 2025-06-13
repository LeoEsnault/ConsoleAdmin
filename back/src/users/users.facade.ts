import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersFacade {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getUsers(): Promise<any> {
    const supabase: SupabaseClient = this.supabaseService.getClient();
    return await supabase.from('profiles').select('*');
  }
}