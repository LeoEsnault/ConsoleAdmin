import { SupabaseService } from '../supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';

const supabaseService = new SupabaseService();
const supabase = supabaseService.getClient();

export const getUserById = async (id: string) => {
  return await supabase.auth.admin.getUserById(id);
};

export const getProfiles = async (userIds: string | string[]) => {
  let query = supabase.from('profiles').select('user_id, id, firstname, lastname, enterprise_id') as any;

  if (Array.isArray(userIds)) {
    query = query.in('user_id', userIds); // Plusieurs utilisateurs
  } else {
    query = query.eq('user_id', userIds).single(); // 1 utilisateur
  }

  return await query;
};

export const getEnterprise = async (enterpriseId: string) => {
  return await supabase
    .from('enterprises')
    .select(
      `
    *,
    establishments (*)
  `
    )
    .eq('id', enterpriseId)
    .single();
};

export const createPagination = async () => {
  return await supabase.from('profiles').select('user_id', { count: 'exact' });
};

export const createUser = async (email: string) => {
  const uuid: string = uuidv4();

  return await supabase.auth.admin.createUser({
    email: email,
    password: uuid,
  });
};

export const createRole = async (id: string) => {
  return await supabase
    .from('user_roles')
    .insert([
      {
        user_id: id,
        role: 'utilisateur',
      },
    ])
    .select()
    .single();
};

export const createProfile = async (userId: string, enterpriseId: string) => {
  return await supabase
    .from('profiles')
    .insert([
      {
        user_id: userId,
        firstname: '',
        lastname: '',
        enterprise_id: enterpriseId,
      },
    ])
    .select()
    .single();
};

export const updateUserById = async (userId: string, email: string) => {
  return await supabase.auth.admin.updateUserById(userId, {
    email,
  });
};

export const updateProfile = async (profileId: string, lastname: string, firstname: string) => {
  return await supabase
    .from('profiles')
    .update({
      firstname,
      lastname,
    })
    .eq('id', profileId);
};

export const updateProfileEnterprise = async (profileId: string, enterpriseId: string) => {
  return await supabase.from('profiles').update({ enterprise_id: enterpriseId }).eq('id', profileId);
};

export const getRole = async (id: string) => {
  return await supabase.from('user_roles').select().eq('user_id', id).single();
};

export const deleteUser = async (id: string) => {
  return await supabase.auth.admin.deleteUser(id);
};
