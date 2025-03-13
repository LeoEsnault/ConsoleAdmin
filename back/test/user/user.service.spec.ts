import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UserService } from '../../src/user/user.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import * as userExceptions from '../../src/exceptions/user.exceptions';
import * as enterpriseExceptions from '../../src/exceptions/enterprise.exceptions';
import * as roleExceptions from '../../src/exceptions/role.exceptions';
import * as userFacade from '../../src/user/user.facade';

const mockSupabaseClient = {
  auth: {
    admin: {
      listUsers: jest.fn().mockReturnThis(),
      createUser: jest.fn().mockReturnThis(),
      getUserById: jest.fn().mockReturnThis(),
      updateUserById: jest.fn().mockReturnThis(),
      deleteUser: jest.fn(),
    },
  },
};

const mockSupabaseService = {
  getClient: jest.fn().mockReturnValue(mockSupabaseClient),
};

jest.mock('../../src/user/user.facade', () => ({
  listUsers: jest.fn(),
  getUserById: jest.fn(),
  getProfiles: jest.fn(),
  getEnterprise: jest.fn(),
  createPagination: jest.fn(),
  createUser: jest.fn(),
  createRole: jest.fn(),
  createProfile: jest.fn(),
  updateUserById: jest.fn(),
  updateProfile: jest.fn(),
  updateProfileEnterprise: jest.fn(),
  getRole: jest.fn(),
  deleteUser: jest.fn(),
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: SupabaseService, useValue: mockSupabaseService }],
    }).compile();
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('GET UserEnterprise', () => {
    const mockId = '123';
    const mockProfile = { id: 'profile-123', user_id: mockId, enterprise_id: '456' };
    const mockEnterprise = {
      id: 'ent-123',
      name: 'enter-prise',
    };

    beforeEach(async () => {
      (userFacade.getUserById as jest.Mock).mockResolvedValue({ data: { id: mockId }, error: null });
      (userFacade.getProfiles as jest.Mock).mockResolvedValue({ data: mockProfile, error: null });
      (userFacade.getEnterprise as jest.Mock).mockResolvedValue({ data: mockEnterprise, error: null });
    });

    it('devrait retourner les informations de l’entreprise si tout est valide', async () => {
      const result = await userService.getUserEnterprise(mockId);

      expect(userFacade.getUserById).toHaveBeenCalledWith(mockId);
      expect(userFacade.getProfiles).toHaveBeenCalledWith(mockId);
      expect(userFacade.getEnterprise).toHaveBeenCalledWith(mockProfile.enterprise_id);

      expect(result).toEqual(mockEnterprise);
    });

    it('doit lever une BadRequestException si userId est manquant', async () => {
      const mockId = '';
      await expect(userService.getUserEnterprise(mockId)).rejects.toThrow(BadRequestException);
    });

    it('doit lever une UserNotFoundException si l’utilisateur n’existe pas', async () => {
      (userFacade.getUserById as jest.Mock).mockResolvedValue({ data: null, error: 'User not found' });
      await expect(userService.getUserEnterprise(mockId)).rejects.toThrow(userExceptions.UserNotFoundException);
      expect(userFacade.getUserById).toHaveBeenCalledWith(mockId);
    });

    it('doit lever une ProfileNotFoundException si le profil n’existe pas', async () => {
      (userFacade.getProfiles as jest.Mock).mockResolvedValue({ data: null, error: 'Profil not found' });

      await expect(userService.getUserEnterprise(mockId)).rejects.toThrow(userExceptions.ProfileNotFoundException);
      expect(userFacade.getProfiles).toHaveBeenCalledWith(mockId);
    });

    it('doit retourner un objet vide si l’entreprise n’est pas trouvée', async () => {
      (userFacade.getEnterprise as jest.Mock).mockResolvedValue({ data: null, error: 'Enterprise not found' });

      const result = await userService.getUserEnterprise(mockId);

      expect(userFacade.getEnterprise).toHaveBeenCalledWith(mockProfile.enterprise_id);
      expect(result).toEqual({});
    });
  });

  describe('POST', () => {
    const mockBody = {
      email: 'test@example.com',
      enterprise: 'ent-123',
    };

    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      enterprise: 'ent-123',
    };

    const mockProfile = {
      user_id: 'user-123',
      lastname: 'profile-last',
      firstname: 'profile-first',
      enterprise_id: 'ent-123',
    };

    const mockEnterprise = {
      id: 'ent-123',
      name: 'enter-prise',
    };

    beforeEach(async () => {
      (userFacade.getEnterprise as jest.Mock).mockResolvedValue({ data: mockEnterprise, error: null });
      (userFacade.createUser as jest.Mock).mockResolvedValue({ data: { user: mockUser }, error: null });
      (userFacade.createRole as jest.Mock).mockResolvedValue({ error: null });
      (userFacade.createProfile as jest.Mock).mockResolvedValue({
        data: mockProfile,
        error: null,
      });
    });

    it('devrait créer un user et renvoie un objet user (avec son profil)', async () => {
      const result = await userService.createUser(mockBody);

      expect(userFacade.getEnterprise).toHaveBeenCalledWith(mockBody.enterprise);
      expect(userFacade.createUser).toHaveBeenCalledWith(mockBody.email);
      expect(userFacade.createRole).toHaveBeenCalledWith(mockUser.id);
      expect(userFacade.createProfile).toHaveBeenCalledWith(mockUser.id, mockEnterprise.id);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        profile: mockProfile,
      });
    });

    it("devrait lever une InvalidUserDataException si l'email est invalide", async () => {
      const mockBody = {
        email: 'invalid-email',
        enterprise: '123',
      };

      await expect(userService.createUser(mockBody)).rejects.toThrow(userExceptions.InvalidUserDataException);
    });

    it("devrait lever une EnterpriseNotFoundException si l'entreprise n'est pas trouvé", async () => {
      const mockBody = {
        email: 'test@example.com',
        enterprise: 'invalid',
      };

      (userFacade.getEnterprise as jest.Mock).mockResolvedValue({ data: null, error: { message: 'Not found' } });

      await expect(userService.createUser(mockBody)).rejects.toThrow(enterpriseExceptions.EnterpriseNotFoundException);

      expect(userFacade.getEnterprise).toHaveBeenCalledWith(mockBody.enterprise);
    });

    it("devrait lever une UserAlreadyExistsException si l'utilisateur existe déjà", async () => {
      (userFacade.createUser as jest.Mock).mockResolvedValue({
        data: null,
        error: { code: 'email_exists', message: 'Email already in use' },
      });

      await expect(userService.createUser(mockBody)).rejects.toThrow(userExceptions.UserAlreadyExistsException);

      expect(userFacade.createUser).toHaveBeenCalledWith(mockBody.email);
    });

    it("devrait lever une UserCreationException si la création de l'utilisateur échoue pour une autre raison", async () => {
      (userFacade.createUser as jest.Mock).mockResolvedValue({
        data: null,
        error: { code: 'other_error', message: 'Unknown error' },
      });

      await expect(userService.createUser(mockBody)).rejects.toThrow(userExceptions.UserCreationException);

      expect(userFacade.createUser).toHaveBeenCalledWith(mockBody.email);
    });

    it("devrait lever une UserCreationException si l'utilisateur est null après la création", async () => {
      (userFacade.createUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await expect(userService.createUser(mockBody)).rejects.toThrow(userExceptions.UserCreationException);

      expect(userFacade.createUser).toHaveBeenCalledWith(mockBody.email);
    });

    it('devrait lever une RoleNotFoundException si la création du rôle échoue', async () => {
      (userFacade.createRole as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: "Rôle de l'utilisateur non trouvé." },
      });

      await expect(userService.createUser(mockBody)).rejects.toThrow(roleExceptions.RoleNotFoundException);

      expect(userFacade.createRole).toHaveBeenCalledWith(mockUser.id);
    });

    it('devrait lever une ProfileCreationException si la création du profil échoue', async () => {
      (userFacade.createProfile as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Profile creation failed' },
      });

      await expect(userService.createUser(mockBody)).rejects.toThrow(userExceptions.ProfileCreationException);

      expect(userFacade.createProfile).toHaveBeenCalledWith(mockUser.id, mockEnterprise.id);
    });

    it("devrait lever une ProfileNotFoundException si le profil n'est pas retourné après insertion", async () => {
      (userFacade.createProfile as jest.Mock).mockResolvedValue({
        data: null,
        error: null,
      });

      await expect(userService.createUser(mockBody)).rejects.toThrow(userExceptions.ProfileNotFoundException);

      expect(userFacade.createProfile).toHaveBeenCalledWith(mockUser.id, mockEnterprise.id);
    });
  });

  describe('PUT', () => {
    const mockId = '123';
    const mockProfileId = 'profile-123';
    const mockBody = {
      email: 'test@example.com',
      profile: {
        id: mockProfileId,
        user_id: '123',
        lastname: 'Doe',
        firstname: 'John',
        enterprise_id: 'ent-123',
      },
    };

    beforeEach(async () => {
      (userFacade.getUserById as jest.Mock).mockResolvedValue({ data: { id: mockId }, error: null });
      (userFacade.updateUserById as jest.Mock).mockResolvedValue({ error: null });
      (userFacade.getProfiles as jest.Mock).mockResolvedValue({ data: { id: mockProfileId }, error: null });
      (userFacade.updateProfile as jest.Mock).mockResolvedValue({ error: null });
      (userFacade.updateProfileEnterprise as jest.Mock).mockResolvedValue({ error: null });
    });

    it('devrait mettre à jour un utilisateur et renvoyait un objet user (avec son profil)', async () => {
      const result = await userService.updateUser(mockId, mockBody);

      expect(userFacade.getUserById).toHaveBeenCalledWith(mockId);
      expect(userFacade.updateUserById).toHaveBeenCalledWith(mockId, mockBody.email);
      expect(userFacade.getProfiles).toHaveBeenCalledWith(mockId);
      expect(userFacade.updateProfile).toHaveBeenCalledWith(
        mockProfileId,
        mockBody.profile.lastname,
        mockBody.profile.firstname
      );
      expect(userFacade.updateProfileEnterprise).toHaveBeenCalledWith(mockProfileId, mockBody.profile.enterprise_id);

      expect(result).toEqual({
        id: mockId,
        email: mockBody.email,
        profile: {
          id: mockProfileId,
          user_id: mockId,
          lastname: mockBody.profile.lastname,
          firstname: mockBody.profile.firstname,
        },
      });
    });

    it("devrait lever InvalidEmailFormatException si l'email est invalide", async () => {
      const mockBody = { email: 'invalid-email' };

      await expect(userService.updateUser(mockId, mockBody)).rejects.toThrow(
        userExceptions.InvalidEmailFormatException
      );
    });

    it("devrait lever UserNotFoundException si l'utilisateur n'existe pas", async () => {
      (userFacade.getUserById as jest.Mock).mockResolvedValue({ data: null, error: { message: 'User not found' } });

      await expect(userService.updateUser(mockId, mockBody)).rejects.toThrow(userExceptions.UserNotFoundException);
    });

    it("devrait lever UserAlreadyExistsException si l'email est déjà pris", async () => {
      (userFacade.updateUserById as jest.Mock).mockResolvedValue({ error: { message: 'Email already in use' } });

      await expect(userService.updateUser(mockId, mockBody)).rejects.toThrow(userExceptions.UserAlreadyExistsException);
    });

    it('devrait lever ProfileNotFoundException si le profil est introuvable', async () => {
      (userFacade.getProfiles as jest.Mock).mockResolvedValue({ data: null, error: { message: 'Profile not found' } });

      await expect(userService.updateUser(mockId, mockBody)).rejects.toThrow(userExceptions.ProfileNotFoundException);
    });

    it('devrait lever ProfileUpdateException si la mise à jour du profil échoue avec nom et prénom', async () => {
      (userFacade.updateProfile as jest.Mock).mockResolvedValue({ error: { message: 'Profile update failed' } });

      await expect(userService.updateUser(mockId, mockBody)).rejects.toThrow(userExceptions.ProfileUpdateException);
    });

    it("devrait lever ProfileUpdateException si la mise à jour du profil échoue avec l'entreprise", async () => {
      (userFacade.updateProfileEnterprise as jest.Mock).mockResolvedValue({
        error: { message: 'Profile update failed' },
      });

      await expect(userService.updateUser(mockId, mockBody)).rejects.toThrow(userExceptions.ProfileUpdateException);
    });
  });

  describe('DELETE', () => {
    const mockId = '123';
    const mockUserRole = {
      id: 'role-123',
      user_id: 'user-123',
      role: 'utilisateur',
    };

    const mockSuperAdminRole = {
      id: 'role-456',
      user_id: 'user-456',
      role: 'super_admin',
    };

    it('devrait supprimer un utilisateur', async () => {
      (userFacade.getRole as jest.Mock).mockResolvedValue({ data: mockUserRole, error: null });
      (userFacade.deleteUser as jest.Mock).mockResolvedValue({ error: null });

      const result = await userService.deleteUser(mockId);
      expect(userFacade.getRole).toHaveBeenCalledWith(mockId);
      expect(userFacade.deleteUser).toHaveBeenCalledWith(mockId);

      expect(result).toBe('ok');
    });

    it("devrait lever une exception si l'ID est invalide", async () => {
      const mockId = '';
      await expect(userService.deleteUser(mockId)).rejects.toThrow(userExceptions.InvalidUserDataException);
    });

    it('devrait lever une exception si les rôle est introuvable', async () => {
      (userFacade.getRole as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: "Rôle de l'utilisateur non trouvé" },
      });

      await expect(userService.deleteUser(mockId)).rejects.toThrow(roleExceptions.RoleNotFoundException);
    });

    it('devrait lever une exception si le user a un rôle super_admin', async () => {
      (userFacade.getRole as jest.Mock).mockResolvedValue({ data: mockSuperAdminRole, error: null });
      await expect(userService.deleteUser(mockId)).rejects.toThrow(userExceptions.UserDeleteException);
    });

    it('devrait lever une exception si Supabase renvoie une erreur', async () => {
      (userFacade.deleteUser as jest.Mock).mockResolvedValue({ error: { message: 'Erreur mocké' } });
      await expect(userService.deleteUser(mockId)).rejects.toThrow(userExceptions.UserDeleteException);
    });
  });
});
