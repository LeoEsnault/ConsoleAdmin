import { Test, TestingModule } from '@nestjs/testing';
import { ProfilController } from '../../src/profil/profil.controller';
import { ProfilService } from '../../src/profil/profil.service';
import { ProfileNotFoundException } from '../../src/exceptions/user.exceptions'


const mockProfilService = {
  getUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
};

describe('ProfilController', () => {
  let profilController: ProfilController;
  let profilService: ProfilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilController],
      providers: [
        { provide: ProfilService, useValue: mockProfilService },
      ],
    }).compile();

    profilController = module.get<ProfilController>(ProfilController);
    profilService = module.get<ProfilService>(ProfilService);
  });

  it('Le controlleur existe', () => {
    expect(profilController).toBeDefined();
  });

  describe('getUserProfile', () => {
    it('ProfileNotFoundException si pas de userId', async () => {
      try {
        await profilController.getUserProfile(''); 
      } catch (error) {
        expect(error).toBeInstanceOf(ProfileNotFoundException);
        expect(error.message).toBe('Profil(s) non trouvé(s), Ou erreur lors de la requête.');
      }
    });

    it('si userId valide renvois les infos', async () => {
      const userId = '1';
      const mockProfile = { user_id: '1', name: 'Jane darc' };

     
      mockProfilService.getUserProfile.mockResolvedValue(mockProfile);

      const result = await profilController.getUserProfile(userId);

      expect(result).toEqual(mockProfile);
      expect(mockProfilService.getUserProfile).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateUserProfil', () => {
    it('ProfileNotFoundException si le userId nest pas reconnu ', async () => {
      try {
        await profilController.updateUserProfil('', { name: 'Jane darc'}); 
      } catch (error) {
        expect(error).toBeInstanceOf(ProfileNotFoundException);
        expect(error.message).toBe('Profil(s) non trouvé(s), Ou erreur lors de la requête.');
      }
    });

    it('met à jour le profil quand userId est valide', async () => {
      const userId = '1';
      const updateData = { name: 'Jane darc de rouen' };
      const updatedProfile = { user_id: '1', name: 'Jane darc de rouen' };

     
      mockProfilService.updateUserProfile.mockResolvedValue(updatedProfile);

      const result = await profilController.updateUserProfil(userId, updateData);

      expect(result).toEqual(updatedProfile);
      expect(mockProfilService.updateUserProfile).toHaveBeenCalledWith(userId, updateData);
    });
  });
});
