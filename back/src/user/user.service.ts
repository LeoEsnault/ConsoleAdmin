import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UserNotFoundException, ProfileNotFoundException } from '../exceptions/user.exceptions';

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
      throw new UserNotFoundException();
    }

    const userIds = users.users.map((user) => user.id);
    // get profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('auth_id, id, firstname, lastname')
      .in('auth_id', userIds);

    if (profilesError) {
      throw new ProfileNotFoundException();
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
}
