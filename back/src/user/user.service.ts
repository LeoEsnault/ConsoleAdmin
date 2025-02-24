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
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@_]+(\.[^\s@_]+)+$/;
  return emailRegex.test(email);
};
