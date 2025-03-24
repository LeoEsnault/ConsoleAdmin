import { SupabaseService } from '../supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';

const supabaseService = new SupabaseService();
const supabase = supabaseService.getClient();

export const getEnterprise = async (id: string) => {
  return await supabase.from('enterprises').select('*').eq('id', id).single();
};

export const getEstablishment = async (name: string, enterprise: string) => {
  return await supabase
    .from('establishments')
    .select('*')
    .eq('name', name)
    .eq('enterprise_id', enterprise)
    .maybeSingle();
};

export const createEstablishment = async (name: string, enterprise_id: string) => {
  return await supabase
    .from('establishments')
    .insert([
      {
        name,
        enterprise_id,
      },
    ])
    .select()
    .single();
};

export const getEstablishmentById = async (id: string) => {
  return await supabase.from('establishments').select('*').eq('id', id).single();
};

export const updateEstablishment = async (id: string, body: Record<string, any>) => {
  return await supabase.from('establishments').update(body).eq('id', id).select().single();
};

export const deleteEstablishment = async (id: string) => {
  return await supabase.from('establishments').delete().eq('id', id);
};
