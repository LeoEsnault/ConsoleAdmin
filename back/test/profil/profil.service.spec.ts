import { ProfilService } from '../../src/profil/profil.service';
import { ProfilFacade } from '../../src/profil/profil.facade';
import * as Exceptions from '../../src/exceptions';
import { isValidEmail, isValidPhone, MAX_NAME_LENGTH } from '../../utils/isValidEmail';

jest.mock('../../src/profil/profil.facade');

describe('ProfilService', () => {
  let profilService: ProfilService;
  let profilFacade: jest.Mocked<ProfilFacade>;

  beforeEach(() => {
    profilFacade = {
      getUser: jest.fn(),
      getProfile: jest.fn(),
      updateAuth: jest.fn(),
      updateProfile: jest.fn(),
    } as unknown as jest.Mocked<ProfilFacade>;
    
    profilService = new ProfilService(profilFacade);
  });

  describe('getUserProfile', () => {
    it('devrait retourner le profil utilisateur si tout est bon', async () => {
      profilFacade.getUser.mockResolvedValue({ data: { id: '123', name: 'Test' }, error: null });
      profilFacade.getProfile.mockResolvedValue({ data: { age: 30 }, error: null });

      const result = await profilService.getUserProfile('123');

      expect(result).toEqual({ user: { id: '123', name: 'Test' }, profile: { age: 30 } });
    });

    it('devrait lever une exception si l’utilisateur est introuvable', async () => {
      profilFacade.getUser.mockResolvedValue({ data: null, error: true });

      await expect(profilService.getUserProfile('123')).rejects.toThrow(Exceptions.UserNotFoundException);
    });

    it('devrait lever une exception si le profil est introuvable', async () => {
      profilFacade.getUser.mockResolvedValue({ data: { id: '123' }, error: null });
      profilFacade.getProfile.mockResolvedValue({ data: null, error: true });

      await expect(profilService.getUserProfile('123')).rejects.toThrow(Exceptions.ProfileNotFoundException);
    });
  });

  describe('updateUserProfile', () => {
    it('devrait lever une exception si le nom ou prénom est trop long', async () => {
      const data = { firstname: 'A'.repeat(MAX_NAME_LENGTH + 1), lastname: 'Doe', email: 'test@test.com', phone: '0612345678' };

      await expect(profilService.updateUserProfile('123', data)).rejects.toThrow(Exceptions.InvalidFormatException);
    });

    it('devrait lever une exception si l’email ou téléphone est invalide', async () => {
      const data = { firstname: 'John', lastname: 'Doe', email: 'invalid', phone: '0000' };

      await expect(profilService.updateUserProfile('123', data)).rejects.toThrow(Exceptions.InvalidFormatException);
    });

    it('devrait lever une exception si updateAuth échoue', async () => {
      const data = { firstname: 'John', lastname: 'Doe', email: 'test@test.com', phone: '0612345678' };
      profilFacade.updateAuth.mockResolvedValue({ data: null, error: true });

      await expect(profilService.updateUserProfile('123', data)).rejects.toThrow(Exceptions.ProfileUpdateException);
    });

    it('devrait lever une exception si updateProfile échoue', async () => {
      const data = { firstname: 'John', lastname: 'Doe', email: 'test@test.com', phone: '0612345678' };
      profilFacade.updateAuth.mockResolvedValue({ data: {}, error: null });
      profilFacade.updateProfile.mockResolvedValue({ data: null, error: true });

      await expect(profilService.updateUserProfile('123', data)).rejects.toThrow(Exceptions.ProfileUpdateException);
    });

    it('devrait mettre à jour le profil correctement', async () => {
      const data = { firstname: 'John', lastname: 'Doe', email: 'test@test.com', phone: '0612345678' };
      profilFacade.updateAuth.mockResolvedValue({ data: { authUpdated: true }, error: null });
      profilFacade.updateProfile.mockResolvedValue({ data: { profileUpdated: true }, error: null });

      const result = await profilService.updateUserProfile('123', data);

      expect(result).toEqual({ profilUpdateAuth: { authUpdated: true }, profilUpdate: { profileUpdated: true } });
    });
  });
});
