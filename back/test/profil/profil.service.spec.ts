import { Test, TestingModule } from '@nestjs/testing';
import { ProfilService } from '../../src/profil/profil.service';
import { ProfilFacade } from '../../src/profil/profil.facade';

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
    it('Renvois les datas ', async () => {
      const userId = 'user123';
      const userProfile = { user_id: userId, name: 'jane darc' };

      profilFacade.getUserProfile = jest.fn().mockResolvedValue(userProfile);

      const result = await profilService.getUserProfile(userId);

      expect(result).toEqual(userProfile);
      expect(profilFacade.getUserProfile).toHaveBeenCalledWith(userId);
    });

    it('erreur quand userId pas trouvé', async () => {
      const userId = 'user123';

      profilFacade.getUserProfile = jest.fn().mockRejectedValue(new Error('Profil(s) non trouvé(s), Ou erreur lors de la requête.'));

      try {
        await profilService.getUserProfile(userId);
      } catch (error) {
        expect(error.message).toBe('Profil(s) non trouvé(s), Ou erreur lors de la requête.');
      }
    });
  });

  describe('updateUserProfile', () => {
    it('renvois les données mis à jour', async () => {
      const userId = 'user123';
      const data = { name: 'Jane darc de rouen' };
      const updatedUser = { user_id: userId, name: 'Jane darc de rouen' };


      profilFacade.updateUserProfile = jest.fn().mockResolvedValue(updatedUser);

      const result = await profilService.updateUserProfile(userId, data);

      expect(result).toEqual(updatedUser);
      expect(profilFacade.updateUserProfile).toHaveBeenCalledWith(userId, data);
    });

    it('Renvois une erreur quand les infos ne peuvent pas etre update', async () => {
      const userId = 'user123';
      const data = { name: 'Jane Doe' };

    
      profilFacade.updateUserProfile = jest.fn().mockRejectedValue(new Error('Erreur lors de la mise à jour du profil.'));

      try {
        await profilService.updateUserProfile(userId, data);
      } catch (error) {
        expect(error.message).toBe('Erreur lors de la mise à jour du profil.');
      }
    });
  });
});
