import { SupabaseService } from '../supabase/supabase.service';

const supabaseService = new SupabaseService();
const supabase = supabaseService.getClient();

export const getEnterprise = async (id: string) => {
  return await supabase.from('enterprises').select('*').eq('id', id).single();
};

export const getSuperAdmin = async () => {
  return await supabase.from('user_roles').select('user_id').eq('role', 'super_admin');
};

export const getProfiles = async (id: string, page: number, pageSize: number, superAdminIds: string[]) => {
  return await supabase
    .from('profiles')
    .select('user_id, id, firstname, lastname, enterprise_id', { count: 'exact' })
    .eq('enterprise_id', id)
    .not('user_id', 'in', `(${superAdminIds.join(',')})`) // exclure super_admin
    .range((page - 1) * pageSize, page * pageSize - 1);
};

export const getEnterprises = async () => {
  return await supabase.from('enterprises').select('*');
};
