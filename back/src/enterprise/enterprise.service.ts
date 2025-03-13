import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import * as userExceptions from '../exceptions/user.exceptions';
import * as enterpriseExceptions from '../exceptions/enterprise.exceptions';
import * as enterpriseFacade from './enterprise.facade';

export interface User {
  id: string;
  email?: string;
  profile?: Profile;
}

export interface Profile {
  user_id: string;
  id: string;
  firstname: string;
  lastname: string;
}

@Injectable()
export class EnterpriseService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getUsers(id: string, page: number, pageSize: number) {
    if (!id) {
      throw new BadRequestException('Missing Id');
    }

    if (page < 1 || pageSize < 1) {
      throw new BadRequestException('Invalid value of page et pageSize, need to be above 0');
    }

    const supabase = this.supabaseService.getClient();

    // get enterprise
    const { data: enterprise, error: enterpriseError } = await enterpriseFacade.getEnterprise(id);

    if (enterpriseError || !enterprise) {
      throw new enterpriseExceptions.EnterpriseNotFoundException();
    }

    // get super_admin
    const { data: roles, error: rolesError } = await enterpriseFacade.getSuperAdmin();

    if (rolesError) {
      console.warn('Erreur lors de la récupération des rôles super_admin:', rolesError);
    }

    const superAdminIds = roles?.map((role) => role.user_id) || [];

    // get profiles
    const {
      data: profiles,
      count: profilesCount,
      error: profilesError,
    } = await enterpriseFacade.getProfiles(id, page, pageSize, superAdminIds);

    if (profilesError) {
      console.error('Erreur', profilesError);
      throw new userExceptions.ProfileNotFoundException();
    }

    if (!profiles || profiles.length === 0) {
      return { users: [], totalPages: 0 };
    }

    const totalUsersCount = profilesCount ?? 0;

    const userIds = profiles.map((profile) => profile.user_id);
    const matchedUsers: User[] = [];

    for (const userId of userIds) {
      const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (userError) {
        console.warn(`Erreur lors de la récupération de l'utilisateur ${userId}: ${userError.message}`);
        continue;
      }
      matchedUsers.push(user.user);
    }

    const usersWithProfiles: User[] = matchedUsers.map((user) => {
      const userProfile = profiles.find((profile) => profile.user_id === user.id);
      return { ...user, profile: userProfile };
    });

    const totalPages = Math.ceil(totalUsersCount / pageSize);

    return {
      users: usersWithProfiles || [],
      totalPages,
    };
  }

  async getEnterprises() {
    const { data: enterprises, error: enterprisesError } = await enterpriseFacade.getEnterprises();

    if (enterprisesError) {
      throw new enterpriseExceptions.EnterpriseNotFoundException();
    }

    return enterprises;
  }
}
