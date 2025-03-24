import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { EstablishmentService } from '../../src/establishment/establishment.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import * as Exceptions from '../../src/exceptions';
import * as establishmentFacade from '../../src/establishment/establishment.facade';

const mockSupabaseClient = {
  auth: {
    admin: {
      getUserById: jest.fn().mockReturnThis(),
    },
  },
};

const mockSupabaseService = {
  getClient: jest.fn().mockReturnValue(mockSupabaseClient),
};

jest.mock('../../src/establishment/establishment.facade', () => ({
  getEnterprise: jest.fn(),
  getEstablishment: jest.fn(),
  createEstablishment: jest.fn(),
  getEstablishmentById: jest.fn(), //id
  updateEstablishment: jest.fn(), //id + body
  deleteEstablishment: jest.fn(), //id
}));

describe('EstablishmentService', () => {
  let establishmentService: EstablishmentService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [EstablishmentService, { provide: SupabaseService, useValue: mockSupabaseService }],
    }).compile();

    establishmentService = moduleRef.get<EstablishmentService>(EstablishmentService);
  });

  describe('POST', () => {
    const enterpriseId = 'ent-123';
    const mockBody = { name: 'établissement A', enterprise_id: enterpriseId };
    const mockEstablishment = {
      id: '123',
      name: 'établissement A',
      enterprise_id: enterpriseId,
    };

    beforeEach(async () => {
      (establishmentFacade.getEnterprise as jest.Mock).mockResolvedValue({ error: null });
      (establishmentFacade.getEstablishment as jest.Mock).mockResolvedValue({ data: null, error: null });
      (establishmentFacade.createEstablishment as jest.Mock).mockResolvedValue({
        data: mockEstablishment,
        error: null,
      });
    });

    it('devrait créer un établissement et le renvoyer', async () => {
      const result = await establishmentService.createEstablishment(mockBody);

      expect(establishmentFacade.getEnterprise).toHaveBeenCalled();
      expect(establishmentFacade.getEstablishment).toHaveBeenCalled();
      expect(establishmentFacade.createEstablishment).toHaveBeenCalled();

      expect(result).toEqual(mockEstablishment);
    });

    it('devrait renvoyer une erreur si des données sont manquantes', async () => {
      const mockInvalidBody = { name: 'établissement A', enterprise_id: '' };

      await expect(establishmentService.createEstablishment(mockInvalidBody)).rejects.toThrow(
        Exceptions.InvalidEstablishmentDataException
      );
    });

    it("devrait renvoyer une erreur si l'entreprise n'est pas trouvée", async () => {
      (establishmentFacade.getEnterprise as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Enterprise not found' },
      });

      await expect(establishmentService.createEstablishment(mockBody)).rejects.toThrow(
        Exceptions.EnterpriseNotFoundException
      );

      expect(establishmentFacade.getEnterprise).toHaveBeenCalled();
    });

    it("devrait renvoyer une erreur s'il y a un prosblème dans la recherche d'établissement", async () => {
      const existingError = { message: 'Erreur de requête de base de données' };

      (establishmentFacade.getEstablishment as jest.Mock).mockResolvedValue({
        data: null,
        error: existingError,
      });

      await expect(establishmentService.createEstablishment(mockBody)).rejects.toThrow(
        new Exceptions.DatabaseQueryException(existingError)
      );
    });

    it('devrait renvoyer une erreur si un établissement avec le même nom existe déjà', async () => {
      (establishmentFacade.getEstablishment as jest.Mock).mockResolvedValue({ data: mockEstablishment, error: null });

      await expect(establishmentService.createEstablishment(mockBody)).rejects.toThrow(
        Exceptions.EstablishmentAlreadyExistsException
      );
    });

    it("devrait renvoyer une erreur s'il y a un problème à la création d'un établissement", async () => {
      (establishmentFacade.createEstablishment as jest.Mock).mockResolvedValue({
        data: null,
        error: 'Erreur mockée',
      });
      await expect(establishmentService.createEstablishment(mockBody)).rejects.toThrow(
        Exceptions.EstablishmentCreationException
      );
    });

    it('devrait renvoyer une erreur si un établissement est null après création', async () => {
      (establishmentFacade.createEstablishment as jest.Mock).mockResolvedValue({
        data: null,
        error: null,
      });
      await expect(establishmentService.createEstablishment(mockBody)).rejects.toThrow(
        Exceptions.EstablishmentNotFoundException
      );
    });
  });

  describe('PUT', () => {
    const enterpriseId = 'ent-123';
    const mockId = 'est-123';
    const mockBody = { id: mockId, name: 'établissement A', enterprise_id: enterpriseId };
    const mockEstablishment = {
      id: '123',
      name: 'établissement A',
      enterprise_id: enterpriseId,
    };

    beforeEach(async () => {
      (establishmentFacade.getEstablishmentById as jest.Mock).mockResolvedValue({ error: null });
      (establishmentFacade.getEstablishment as jest.Mock).mockResolvedValue({ data: null, error: null });
      (establishmentFacade.updateEstablishment as jest.Mock).mockResolvedValue({
        data: mockEstablishment,
        error: null,
      });
    });

    it('devrait mettre à jour un établissement et le renvoyer', async () => {
      const result = await establishmentService.updateEstablishment(mockBody.id, mockBody);

      expect(establishmentFacade.getEstablishmentById).toHaveBeenCalledWith(mockBody.id);
      expect(establishmentFacade.getEstablishment).toHaveBeenCalledWith(mockBody.name, mockBody.enterprise_id);
      expect(establishmentFacade.updateEstablishment).toHaveBeenCalledWith(mockBody.id, mockBody);

      expect(result).toEqual(mockEstablishment);
    });

    it('doit lever une BadRequestException si userId est manquant', async () => {
      const mockId = '';
      await expect(establishmentService.updateEstablishment(mockId, mockBody)).rejects.toThrow(BadRequestException);
    });

    it("doit renvoyer une erreur si l'établissement n'est pas trouvé", async () => {
      (establishmentFacade.getEstablishmentById as jest.Mock).mockResolvedValue({ error: { message: 'Erreur mocké' } });
      await expect(establishmentService.updateEstablishment(mockId, mockBody)).rejects.toThrow(
        Exceptions.EstablishmentNotFoundException
      );
    });

    it("doit renvoyer DatabaseQueryException si la recherche d'un établissement déclenche une erreur", async () => {
      (establishmentFacade.getEstablishment as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Erreur mocké' },
      });
      await expect(establishmentService.updateEstablishment(mockId, mockBody)).rejects.toThrow(
        Exceptions.DatabaseQueryException
      );
    });

    it('doit renvoyer une erreur si un établissement est trouvé avec le même nom', async () => {
      (establishmentFacade.getEstablishment as jest.Mock).mockResolvedValue({ data: mockEstablishment, error: null });
      await expect(establishmentService.updateEstablishment(mockId, mockBody)).rejects.toThrow(
        Exceptions.EstablishmentAlreadyExistsException
      );
    });

    it("doit renvoyer EstablishmentUpdateException si l'update d'un établissement déclenche une erreur", async () => {
      (establishmentFacade.updateEstablishment as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Erreur mocké' },
      });
      await expect(establishmentService.updateEstablishment(mockId, mockBody)).rejects.toThrow(
        Exceptions.EstablishmentUpdateException
      );
    });
  });

  describe('DELETE', () => {
    const mockId = 'est-123';

    it('devrait supprimer un établissement', async () => {
      (establishmentFacade.deleteEstablishment as jest.Mock).mockResolvedValue({ error: null });

      const result = await establishmentService.deleteEstablishment(mockId);
      expect(establishmentFacade.deleteEstablishment).toHaveBeenCalledWith(mockId);

      expect(result).toBe('ok');
    });

    it("devrait lever une exception si l'ID est invalide", async () => {
      const mockId = '';
      await expect(establishmentService.deleteEstablishment(mockId)).rejects.toThrow(BadRequestException);
    });

    it('devrait lever une exception si Supabase renvoie une erreur', async () => {
      (establishmentFacade.deleteEstablishment as jest.Mock).mockResolvedValue({ error: { message: 'Erreur mocké' } });
      await expect(establishmentService.deleteEstablishment(mockId)).rejects.toThrow(
        Exceptions.EstablishmentDeleteException
      );
    });
  });
});
