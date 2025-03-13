import { Test, TestingModule } from '@nestjs/testing';
import { ProfilService } from '../../src/profil/profil.service';
import { ProfilFacade } from '../../src/profil/profil.facade';
import { ProfileNotFoundException, ProfileUpdateException } from '../../src/exceptions/user.exceptions';

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
            getUserProfile: jest.fn(),
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

  describe('getUserProfile', () => {
    it('Renvoie les données du profil', async () => {
      const userId = 'user123';
      const userProfile = { user_id: userId, name: 'Jane Darc' };

      profilFacade.getUserProfile = jest.fn().mockResolvedValue(userProfile);

      const result = await profilService.getUserProfile(userId);

      expect(result).toEqual(userProfile);
      expect(profilFacade.getUserProfile).toHaveBeenCalledWith(userId);
    });

    it('Erreur quand le profil n\'est pas trouvé', async () => {
      const userId = 'user123';

      profilFacade.getUserProfile = jest.fn().mockRejectedValue(new Error('Profil(s) non trouvé(s), ou erreur lors de la requête.'));

      try {
        await profilService.getUserProfile(userId);
      } catch (error) {
        expect(error).toBeInstanceOf(ProfileNotFoundException);
        expect(error.message).toBe(`Profil(s) non trouvé(s), ou erreur lors de la requête.`);
      }
    });
  });

  describe('updateUserProfile', () => {
    it('Renvoie les données mises à jour', async () => {
      const userId = 'user123';
      const data = { name: 'Jane Darc de Rouen', email: 'jane@example.com', phone: '1234567890' };
      const updatedUser = { user_id: userId, name: 'Jane Darc de Rouen', email: 'jane@example.com', phone: '1234567890' };

      profilFacade.updateUserProfile = jest.fn().mockResolvedValue(updatedUser);

      const result = await profilService.updateUserProfile(userId, data);

      expect(result).toEqual(updatedUser);
      expect(profilFacade.updateUserProfile).toHaveBeenCalledWith(userId, data);
    });

    it('Renvoie une erreur quand l\'email est invalide', async () => {
      const userId = 'user123';
      const data = { name: 'Jane Doe', email: '', phone: '1234567890' };

      try {
        await profilService.updateUserProfile(userId, data);
      } catch (error) {
        expect(error.message).toBe('Email invalide !');
      }
    });

    it('Renvoie une erreur quand le téléphone est invalide', async () => {
      const userId = 'user123';
      const data = { name: 'Jane Doe', email: 'jane@example.com', phone: 1234567890 };

      try {
        await profilService.updateUserProfile(userId, data);
      } catch (error) {
        expect(error.message).toBe('Le numéro de téléphone fourni est trop long ou contient des caractères invalides.');
      }
    });

    it('Renvoie une erreur quand les infos ne peuvent pas être mises à jour', async () => {
      const userId = 'user123';
      const data = { name: 'Jane Doe', email: 'jane@example.com', phone: '1234567890' };

      profilFacade.updateUserProfile = jest.fn().mockRejectedValue(new Error('Erreur lors de la mise à jour du profil.'));

      try {
        await profilService.updateUserProfile(userId, data);
      } catch (error) {
        expect(error).toBeInstanceOf(ProfileUpdateException);
        expect(error.message).toBe(`Erreur lors de la mise à jour du profil.`);
      }
    });
  });
});
