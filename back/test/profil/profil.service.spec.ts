import { Test, TestingModule } from '@nestjs/testing';
import { ProfilService } from '../../src/profil/profil.service';
import { ProfilFacade } from '../../src/profil/profil.facade';
import * as Exceptions from '../../src/exceptions';
import { isValidEmail, isValidPhone } from '../../utils/isValidEmail';

jest.mock('../../utils/isValidEmail', () => ({
  isValidEmail: jest.fn(),
  isValidPhone: jest.fn(),
}));

describe('ProfilService', () => {
  let profilService: ProfilService;
  let profilFacade: ProfilFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilService,
        {
          provide: ProfilFacade,
          useValue: {
            getUser: jest.fn(),
            getProfile: jest.fn(),
            updateUserProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    profilService = module.get<ProfilService>(ProfilService);
    profilFacade = module.get<ProfilFacade>(ProfilFacade);
  });

  it('service existe', () => {
    expect(profilService).toBeDefined();
  });

  describe('updateUserProfile', () => {
    it('devrait lancer une exception si la mise à jour échoue', async () => {
      const userId = '12345';
      const data = { name: 'Test' };

      // Simulation de l'échec lors de la mise à jour du profil
      profilFacade.updateUserProfile = jest.fn().mockRejectedValue(new Error('Erreur lors de la mise à jour du profil'));

      // Vérification que l'exception ProfileUpdateException est bien levée
      await expect(profilService.updateUserProfile(userId, data))
        .rejects
        .toThrow(Exceptions.InvalidFormatException);
    });
  });

  describe('getUserProfile', () => {
    it('devrait lancer une exception UserNotFoundException si l\'utilisateur n\'est pas trouvé', async () => {
      const userId = '12345';

      // Mock de getUser pour renvoyer une erreur de type "User not found"
      profilFacade.getUser = jest.fn().mockResolvedValue({ error: 'User not found' });

      // Vérification que UserNotFoundException est bien lancée
      await expect(profilService.getUserProfile(userId))
        .rejects
        .toThrow(Exceptions.UserNotFoundException);
    });

    it('devrait lancer une exception ProfileNotFoundException si le profil n\'est pas trouvé', async () => {
      const userId = '12345';

      // Mock de getUser pour renvoyer un utilisateur valide
      profilFacade.getUser = jest.fn().mockResolvedValue({ user: { id: userId } });

      // Mock de getProfile pour simuler une erreur "Profile not found"
      profilFacade.getProfile = jest.fn().mockResolvedValue({ error: 'Profile not found' });

      // Vérification que ProfileNotFoundException est bien lancée
      await expect(profilService.getUserProfile(userId))
        .rejects
        .toThrow(Exceptions.ProfileNotFoundException);
    });

    it('devrait récupérer le profil utilisateur si tout va bien', async () => {
      const userId = '12345';
    
      const userData = {
        id: userId,
        name: 'Test User',
      };
    
      const profileData = {
        profile: {
          bio: 'Test Bio',
        },
      };
    
      // Mock de getUser et getProfile
      profilFacade.getUser = jest.fn().mockResolvedValue({ user: userData });
      profilFacade.getProfile = jest.fn().mockResolvedValue(profileData);
    
      // Résultat attendu avec la structure complète
      const expectedResult = {
        user: userData,
        profile: profileData.profile,
      };
    
      const result = await profilService.getUserProfile(userId);
    
      // Vérification de l'égalité profonde
      expect(result).toEqual(expectedResult);
    
      expect(profilFacade.getUser).toHaveBeenCalledWith(userId);
      expect(profilFacade.getProfile).toHaveBeenCalledWith(userId);
    });
    
  });
});