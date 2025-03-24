import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePasswordService } from '../../src/updatePassword/updatePassword.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import * as Exceptions from '../../src/exceptions';

// Mock de Supabase
const supabaseMock = {
  auth: {
    admin: {
      // On mock ici la méthode updateUserById
      updateUserById: jest.fn(),
    },
    getUser: jest.fn(),
  },
};

describe('UpdatePasswordService', () => {
  let service: UpdatePasswordService;
  let supabaseService: SupabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePasswordService,
        {
          provide: SupabaseService,
          useValue: {
            getClient: jest.fn().mockReturnValue(supabaseMock), // Utilisation du mock ici
          },
        },
      ],
    }).compile();

    service = module.get<UpdatePasswordService>(UpdatePasswordService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  it('should update password successfully', async () => {
    const id = 'user_id';
    const newPassword = 'new_password';

    // Mock de updateUserById : Mise à jour réussie
    const updateUserByIdMock = jest.spyOn(supabaseMock.auth.admin, 'updateUserById').mockResolvedValue({
      error: null,
    });

    // Appel de la méthode updatePassword
    await expect(service.updatePassword(id, newPassword)).resolves.toEqual(undefined);

    // Vérification que updateUserById a bien été appelé avec les bons arguments
    expect(updateUserByIdMock).toHaveBeenCalledWith(id, { password: newPassword });
  });

  it('should throw ProfileUpdateException if updateUserById fails', async () => {
    const id = 'user_id';
    const newPassword = 'new_password';

    // Mock de updateUserById avec une erreur
    const updateUserByIdMock = jest.spyOn(supabaseMock.auth.admin, 'updateUserById').mockResolvedValue({
      data: null,
      error: 'some_error',
    });

    // Vérification que l'erreur est bien levée
    await expect(service.updatePassword(id, newPassword)).rejects.toThrow(Exceptions.ProfileUpdateException);

    // Vérification que updateUserById a bien été appelé
    expect(updateUserByIdMock).toHaveBeenCalledWith(id, { password: newPassword });
  });

  it('should throw UserNotFoundException if getUser fails', async () => {
    const id = 'invalid_user_id';
    const newPassword = 'new_password';

    // Mock de getUser avec une erreur
    const getUserMock = jest.spyOn(supabaseMock.auth, 'getUser').mockResolvedValue({
      data: null,
      error: 'user_not_found',
    });

    // Vérification que l'erreur est bien levée
    await expect(service.updatePassword(id, newPassword)).rejects.toThrow(Exceptions.ProfileUpdateException)

  });


  it('devrait lever une exception si le mdp est trop court', async () => {
    const newPassword = 'court';

    await expect(service.updatePassword('123', newPassword)).rejects.toThrow(Exceptions.InvalidFormatException);
  });
});
