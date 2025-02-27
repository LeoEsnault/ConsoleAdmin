import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';
import { PostgrestError } from '@supabase/supabase-js';
import * as userExceptions from '../exceptions/user.exceptions';

export interface User {
  id: string;
  email?: string;
  profile?: Profile;
}

export interface Profile {
  auth_id: string;
  id: string;
  firstname: string;
  lastname: string;
}

export interface CreateUser {
  email: string;
}

@Injectable()
export class UserService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllUsers(page: number, pageSize: number) {
    if (page < 1 || pageSize < 1) {
      throw new BadRequestException('page et pageSize doivent être supérieurs à 0');
    }

    const supabase = this.supabaseService.getClient();

    // get user.auth
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers({
      page: page,
      perPage: pageSize,
    });

    if (usersError) {
      throw new userExceptions.UserNotFoundException();
    }

    const userIds = users.users.map((user) => user.id);
    // get profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('auth_id, id, firstname, lastname')
      .in('auth_id', userIds);

    if (profilesError) {
      throw new userExceptions.ProfileNotFoundException();
    }

    // match profiles // auth.users
    const usersWithProfiles: User[] = users.users.map((user) => {
      const userProfile = profiles.find((profile) => profile.auth_id === user.id);
      return { ...user, profile: userProfile };
    });

    // create pagination
    const { count: totalUsers, error: totalUsersError } = await supabase
      .from('profiles')
      .select('auth_id', { count: 'exact' });

    if (totalUsersError) {
      throw new InternalServerErrorException(
        `Erreur lors de la récupération de tous les utilisateurs : ${totalUsersError.message}`
      );
    }

    if (totalUsers === null) {
      throw new Error("Impossible de récupérer le nombre total d'utilisateurs");
    }

    const totalUsersCount = totalUsers ?? 0;
    const totalPages = Math.ceil((totalUsersCount || 0) / pageSize);

    return {
      users: usersWithProfiles || [],
      totalPages,
    };
  }

  async createUser(body: CreateUser): Promise<User> {
    const supabase = this.supabaseService.getClient();

    if (!body.email || !isValidEmail(body.email)) {
      throw new userExceptions.InvalidUserDataException();
    }

    const uuid: string = uuidv4();
    const { data: user, error: authError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: uuid,
    });

    if (authError) {
      if (authError.code === 'email_exists') {
        throw new userExceptions.UserAlreadyExistsException();
      }

      throw new userExceptions.UserCreationException();
    }

    if (!user || !user.user) {
      throw new userExceptions.UserCreationException();
    }

    const { data: profile, error: profileError }: { data: Profile | null; error: PostgrestError | null } =
      await supabase
        .from('profiles')
        .insert([
          {
            auth_id: user.user.id,
            firstname: '',
            lastname: '',
          },
        ])
        .select()
        .single();

    if (profileError) {
      throw new userExceptions.ProfileCreationException();
    }

    if (!profile) {
      throw new userExceptions.ProfileNotFoundException();
    }

    return {
      id: user.user.id,
      email: user.user.email,
      profile,
    };
  }

  async updateUser(id: string, body: Partial<User>): Promise<User> {
    const supabase = this.supabaseService.getClient();
    if (body.email) {
      if (!isValidEmail(body.email)) {
        throw new userExceptions.InvalidEmailFormatException();
      }

      const { data: existingUser, error: getUserError } = await supabase.auth.admin.getUserById(id);

      if (getUserError) {
        throw new userExceptions.UserNotFoundException();
      }

      if (existingUser?.user?.email != body.email) {
        const { error: userError } = await supabase.auth.admin.updateUserById(id, {
          email: body.email,
        });

        if (userError) {
          throw new userExceptions.UserAlreadyExistsException();
        }
      }
    }

    const { data: profile, error: profileError } = await supabase.from('profiles').select().eq('auth_id', id).single();

    if (profileError || !profile) {
      throw new userExceptions.ProfileNotFoundException();
    }

    if (body?.profile?.firstname || body?.profile?.lastname) {
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          firstname: body.profile.firstname,
          lastname: body.profile.lastname,
        })
        .eq('id', profile.id);

      if (profileUpdateError) {
        throw new userExceptions.ProfileUpdateException();
      }
    }

    return {
      id,
      email: body.email,
      profile: {
        id: profile.id,
        auth_id: id,
        firstname: body?.profile?.firstname || profile.firstname,
        lastname: body.profile?.lastname || profile.lastname,
      },
    };
  }

  async deleteUser(id: string) {
    const supabase = this.supabaseService.getClient();

    if (!id) {
      throw new userExceptions.InvalidUserDataException();
    }

    const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      throw new userExceptions.UserDeleteException();
    }

    return 'ok';
  }
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@_]+(\.[^\s@_]+)+$/;
  return emailRegex.test(email);
};
