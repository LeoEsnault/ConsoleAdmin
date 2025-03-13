import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PostgrestError } from '@supabase/supabase-js';
import * as userExceptions from '../exceptions/user.exceptions';
import * as enterpriseExceptions from '../exceptions/enterprise.exceptions';
import * as userFacade from './user.facade';
import * as roleExceptions from '../exceptions/role.exceptions';

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
  enterprise_id?: string;
}

export interface CreateUser {
  email: string;
  enterprise: string;
}

@Injectable()
export class UserService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getUserEnterprise(userId: string) {
    if (!userId) {
      throw new BadRequestException('Missing userId');
    }

    const { error: getUserError } = await userFacade.getUserById(userId);

    if (getUserError) {
      throw new userExceptions.UserNotFoundException();
    }

    const { data: profile, error: profilesError } = await userFacade.getProfiles(userId);

    if (profilesError || !profile) {
      throw new userExceptions.ProfileNotFoundException();
    }

    const { data: enterprise, error: enterpriseError } = await userFacade.getEnterprise(profile.enterprise_id);

    if (enterpriseError) {
      return {};
    }

    return enterprise || {};
  }

  async createUser(body: CreateUser): Promise<User> {
    if (!body.email || !isValidEmail(body.email) || !body.enterprise) {
      throw new userExceptions.InvalidUserDataException();
    }

    const { data: enterprise, error: enterpriseError } = await userFacade.getEnterprise(body.enterprise);

    if (enterpriseError) {
      throw new enterpriseExceptions.EnterpriseNotFoundException();
    }

    const { data: user, error: authError } = await userFacade.createUser(body.email);

    if (authError) {
      if (authError.code === 'email_exists') {
        throw new userExceptions.UserAlreadyExistsException();
      }

      throw new userExceptions.UserCreationException();
    }

    if (!user || !user.user) {
      throw new userExceptions.UserCreationException();
    }

    const { error: roleError } = await userFacade.createRole(user.user.id);

    if (roleError) {
      throw new roleExceptions.RoleNotFoundException();
    }

    const { data: profile, error: profileError }: { data: Profile | null; error: PostgrestError | null } =
      await userFacade.createProfile(user.user.id, enterprise.id);

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
    if (body.email) {
      if (!isValidEmail(body.email)) {
        throw new userExceptions.InvalidEmailFormatException();
      }

      const { data: existingUser, error: getUserError } = await userFacade.getUserById(id);

      if (getUserError) {
        throw new userExceptions.UserNotFoundException();
      }

      if (existingUser?.user?.email != body.email) {
        const { error: userError } = await userFacade.updateUserById(id, body.email);

        if (userError) {
          throw new userExceptions.UserAlreadyExistsException();
        }
      }
    }

    const { data: profile, error: profileError } = await userFacade.getProfiles(id);

    if (profileError || !profile) {
      throw new userExceptions.ProfileNotFoundException();
    }

    if (body?.profile?.firstname || body?.profile?.lastname) {
      const { error: profileUpdateError } = await userFacade.updateProfile(
        profile.id,
        body.profile.lastname,
        body.profile.firstname
      );

      if (profileUpdateError) {
        throw new userExceptions.ProfileUpdateException();
      }
    }

    if (body?.profile?.enterprise_id) {
      const { error: enterpriseError } = await userFacade.updateProfileEnterprise(
        profile.id,
        body.profile.enterprise_id
      );

      if (enterpriseError) {
        throw new userExceptions.ProfileUpdateException();
      }
    }

    return {
      id,
      email: body.email,
      profile: {
        id: profile.id,
        user_id: id,
        firstname: body?.profile?.firstname || profile.firstname,
        lastname: body?.profile?.lastname || profile.lastname,
      },
    };
  }

  async deleteUser(id: string) {
    if (!id) {
      throw new userExceptions.InvalidUserDataException();
    }

    const { data: role, error: roleError } = await userFacade.getRole(id);

    if (roleError) {
      throw new roleExceptions.RoleNotFoundException();
    }

    if (role?.role === 'super_admin') {
      throw new userExceptions.UserDeleteException();
    }

    const { error } = await userFacade.deleteUser(id);

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
