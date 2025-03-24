import { SupabaseService } from '../supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';

const supabaseService = new SupabaseService();
const supabase = supabaseService.getClient();

export const getEnterprise = async (id: string) => {
  return await supabase.from('enterprises').select('*').eq('id', id).single();
};

export const getService = async (name: string, enterprise: string) => {
  return await supabase.from('services').select('*').eq('name', name).eq('enterprise_id', enterprise).maybeSingle();
};

export const createService = async (name: string, enterprise_id: string) => {
  return await supabase
    .from('services')
    .insert([
      {
        name,
        enterprise_id,
      },
    ])
    .select()
    .single();
};

export const getServiceById = async (id: string) => {
  return await supabase.from('services').select('*').eq('id', id).single();
};

export const updateService = async (id: string, body: Record<string, any>) => {
  return await supabase.from('services').update(body).eq('id', id).select().single();
};

export const deleteService = async (id: string) => {
  return await supabase.from('services').delete().eq('id', id);
};
