import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/user/user.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import * as userExceptions from '../../src/exceptions/user.exceptions';

const mockSupabaseClient = {
  auth: {
    admin: {
      listUsers: jest.fn().mockReturnThis(),
      createUser: jest.fn().mockReturnThis(),
      getUserById: jest.fn().mockReturnThis(),
      updateUserById: jest.fn().mockReturnThis(),
    },
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
};

const mockSupabaseService = {
  getClient: jest.fn().mockReturnValue(mockSupabaseClient),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: SupabaseService, useValue: mockSupabaseService }],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  // GET
  it('devrait appeler Supabase avec les bons paramètres et retourner les utilisateurs', async () => {
    const page = 1;
    const pageSize = 10;

    const mockUsers = { users: [{ id: '1', email: 'john@example.com' }] };
    const mockProfiles = [{ auth_id: '1', id: '101', firstname: 'John', lastname: 'Doe' }];

    // Mock de la récupération des utilisateurs via auth
    mockSupabaseClient.auth.admin.listUsers.mockResolvedValue({ data: mockUsers, error: null });

    // Mock de la récupération des profils avec un bon chaînage
    mockSupabaseClient.from.mockImplementation((tableName) => {
      if (tableName === 'profiles') {
        return {
          select: jest.fn().mockImplementation((columns: string, options?: { count?: string }) => {
            if (options?.count === 'exact') {
              return Promise.resolve({ data: null, count: 1, error: null });
            }
            return {
              in: jest.fn().mockResolvedValue({ data: mockProfiles, error: null }),
            };
          }),
        };
      }
      return { select: jest.fn().mockResolvedValue({ data: null, count: 1, error: null }) };
    });

    const result = await userService.getAllUsers(page, pageSize);

    expect(mockSupabaseClient.auth.admin.listUsers).toHaveBeenCalledWith({ page, perPage: pageSize });
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('profiles');
    expect(result).toEqual({
      users: [
        {
          id: '1',
          email: 'john@example.com',
          profile: { auth_id: '1', id: '101', firstname: 'John', lastname: 'Doe' },
        },
      ],
      totalPages: 1,
    });
  });

  it('devrait appeler Supabase et lever une erreur si Supabase renvoie une erreur dans la listes uttilisateurs', async () => {
    mockSupabaseClient.auth.admin.listUsers.mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    });

    await expect(userService.getAllUsers(1, 10)).rejects.toThrow('Utilisateur(s) non trouvé(s)');
  });

  // POST
  it('devrait créer un user et renvoie un objet user (avec son profil)', async () => {
    const mockUser = {
      email: 'test@example.com',
    };

    mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null,
    });

    mockSupabaseClient.from.mockImplementation((tableName) => {
      if (tableName === 'profiles') {
        return {
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { auth_id: '123', firstname: '', lastname: '' },
                error: null,
              }),
            }),
          }),
        };
      }
      return { insert: jest.fn() };
    });

    const result = await userService.createUser(mockUser);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('email', 'test@example.com');
    expect(result).toHaveProperty('profile');
  });

  it("devrait lever une InvalidUserDataException si l'email est invalide", async () => {
    const mockUser = {
      email: 'invalid-email',
    };

    await expect(userService.createUser(mockUser)).rejects.toThrow(userExceptions.InvalidUserDataException);
  });

  it("devrait lever une UserAlreadyExistsException si l'utilisateur existe déjà", async () => {
    const mockUser = {
      email: 'test@example.com',
    };

    mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
      data: null,
      error: { code: 'email_exists', message: 'Email already in use' },
    });

    await expect(userService.createUser(mockUser)).rejects.toThrow(userExceptions.UserAlreadyExistsException);
  });

  it("devrait lever une UserCreationException si la création de l'utilisateur échoue pour une autre raison", async () => {
    const mockUser = {
      email: 'test@example.com',
    };

    mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
      data: null,
      error: { code: 'other_error', message: 'Unknown error' },
    });

    await expect(userService.createUser(mockUser)).rejects.toThrow(userExceptions.UserCreationException);
  });

  it("devrait lever une UserCreationException si l'utilisateur est null après la création", async () => {
    const mockUser = {
      email: 'test@example.com',
    };

    mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(userService.createUser(mockUser)).rejects.toThrowError(userExceptions.UserCreationException);
  });

  it('devrait lever une ProfileCreationException si la création du profil échoue', async () => {
    const mockUser = {
      email: 'test@example.com',
    };

    mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null,
    });

    mockSupabaseClient.from.mockImplementation((tableName) => {
      if (tableName === 'profiles') {
        return {
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Profile creation failed' },
              }),
            }),
          }),
        };
      }
      return { insert: jest.fn() };
    });

    await expect(userService.createUser(mockUser)).rejects.toThrow(userExceptions.ProfileCreationException);
  });

  it("devrait lever une ProfileNotFoundException si le profil n'est pas retourné après insertion", async () => {
    const mockUser = {
      email: 'test@example.com',
    };

    mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null,
    });

    mockSupabaseClient.from.mockImplementation((tableName) => {
      if (tableName === 'profiles') {
        return {
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }),
        };
      }
      return { insert: jest.fn() };
    });

    await expect(userService.createUser(mockUser)).rejects.toThrowError(userExceptions.ProfileNotFoundException);
  });

  // PUT
  it('devrait mettre à jour un utilisateur et renvoyait un objet user (avec son profil)', async () => {
    const mockId = '123';
    const mockData = {
      email: 'test@example.com',
      profile: {
        id: 'profile-123',
        auth_id: '123',
        lastname: 'Doe',
        firstname: 'John',
      },
    };

    mockSupabaseClient.auth.admin.getUserById.mockResolvedValue({
      data: { user: { email: 'old@example.com' } },
      error: null,
    });

    mockSupabaseClient.auth.admin.updateUserById.mockResolvedValue({
      data: { user: { id: mockId, email: mockData.email } },
      error: null,
    });

    // profiles
    mockSupabaseClient.from.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'profile-123', auth_id: mockId, firstname: 'OldFirst', lastname: 'OldLast' },
        error: null,
      }),
    }));

    mockSupabaseClient.update.mockResolvedValue({ error: null });

    const result = await userService.updateUser(mockId, mockData);

    expect(result).toEqual({
      id: mockId,
      email: mockData.email,
      profile: {
        id: 'profile-123',
        auth_id: mockId,
        firstname: mockData.profile.firstname,
        lastname: mockData.profile.lastname,
      },
    });

    expect(mockSupabaseClient.auth.admin.updateUserById).toHaveBeenCalledWith(mockId, { email: mockData.email });
  });

  it("devrait lever InvalidEmailFormatException si l'email est invalide", async () => {
    const id = 'user-123';
    const body = { email: 'invalid-email' };

    await expect(userService.updateUser(id, body)).rejects.toThrow(userExceptions.InvalidEmailFormatException);
  });

  it("devrait lever UserNotFoundException si l'utilisateur n'existe pas", async () => {
    const id = 'user-123';
    const body = { email: 'new@example.com' };

    mockSupabaseService.getClient.mockReturnValue({
      auth: {
        admin: {
          getUserById: jest.fn().mockResolvedValue({ data: null, error: { message: 'User not found' } }),
        },
      },
    });

    await expect(userService.updateUser(id, body)).rejects.toThrow(userExceptions.UserNotFoundException);
  });

  it("devrait lever UserAlreadyExistsException si l'email est déjà pris", async () => {
    const id = 'user-123';
    const body = { email: 'new@example.com' };

    mockSupabaseService.getClient.mockReturnValue({
      auth: {
        admin: {
          getUserById: jest.fn().mockResolvedValue({ data: { user: { email: 'old@example.com' } }, error: null }),
          updateUserById: jest.fn().mockResolvedValue({ error: { message: 'Email already in use' } }),
        },
      },
    });

    await expect(userService.updateUser(id, body)).rejects.toThrow(userExceptions.UserAlreadyExistsException);
  });

  it('devrait lever ProfileNotFoundException si le profil est introuvable', async () => {
    const id = 'user-123';
    const body = { email: 'new@example.com' };

    mockSupabaseService.getClient.mockReturnValue({
      auth: {
        admin: {
          getUserById: jest.fn().mockResolvedValue({ data: { user: { email: 'old@example.com' } }, error: null }),
          updateUserById: jest.fn().mockResolvedValue({ error: null }),
        },
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Profile not found' } }),
      }),
    });

    await expect(userService.updateUser(id, body)).rejects.toThrow(userExceptions.ProfileNotFoundException);
  });

  it('devrait lever ProfileUpdateException si la mise à jour du profil échoue', async () => {
    const id = 'user-123';
    const mockData = {
      email: 'new@example.com',
      profile: {
        id: 'profile-123',
        auth_id: id,
        firstname: 'NewFirstName',
        lastname: 'NewLastName',
      },
    };

    mockSupabaseService.getClient.mockReturnValue({
      auth: {
        admin: {
          getUserById: jest.fn().mockResolvedValue({
            data: { user: { email: 'old@example.com' } },
            error: null,
          }),
          updateUserById: jest.fn().mockResolvedValue({ error: null }),
        },
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: 'profile-123', auth_id: id },
          error: null,
        }),
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: { message: 'Profile update failed' } }),
        }),
      }),
    });

    await expect(userService.updateUser(id, mockData)).rejects.toThrow(userExceptions.ProfileUpdateException);
  });
});
