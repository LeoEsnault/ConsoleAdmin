import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ServiceService } from '../../src/service/service.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import * as Exceptions from '../../src/exceptions';
import * as serviceFacade from '../../src/service/service.facade';

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

jest.mock('../../src/service/service.facade', () => ({
  getEnterprise: jest.fn(),
  getService: jest.fn(),
  createService: jest.fn(),
  getServiceById: jest.fn(), //id
  updateService: jest.fn(), //id + body
  deleteService: jest.fn(), //id
}));

describe('Serviceservice', () => {
  let serviceService: ServiceService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [ServiceService, { provide: SupabaseService, useValue: mockSupabaseService }],
    }).compile();

    serviceService = moduleRef.get<ServiceService>(ServiceService);
  });

  describe('POST', () => {
    const enterpriseId = 'ent-123';
    const mockBody = { name: 'service A', enterprise_id: enterpriseId };
    const mockService = {
      id: '123',
      name: 'service A',
      enterprise_id: enterpriseId,
    };

    beforeEach(async () => {
      (serviceFacade.getEnterprise as jest.Mock).mockResolvedValue({ error: null });
      (serviceFacade.getService as jest.Mock).mockResolvedValue({ data: null, error: null });
      (serviceFacade.createService as jest.Mock).mockResolvedValue({
        data: mockService,
        error: null,
      });
    });

    it('devrait créer un service et le renvoyer', async () => {
      const result = await serviceService.createService(mockBody);

      expect(serviceFacade.getEnterprise).toHaveBeenCalled();
      expect(serviceFacade.getService).toHaveBeenCalled();
      expect(serviceFacade.createService).toHaveBeenCalled();

      expect(result).toEqual(mockService);
    });

    it('devrait renvoyer une erreur si des données sont manquantes', async () => {
      const mockInvalidBody = { name: 'service A', enterprise_id: '' };

      await expect(serviceService.createService(mockInvalidBody)).rejects.toThrow(
        Exceptions.InvalidServiceDataException
      );
    });

    it("devrait renvoyer une erreur si l'entreprise n'est pas trouvée", async () => {
      (serviceFacade.getEnterprise as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Enterprise not found' },
      });

      await expect(serviceService.createService(mockBody)).rejects.toThrow(Exceptions.EnterpriseNotFoundException);

      expect(serviceFacade.getEnterprise).toHaveBeenCalled();
    });

    it("devrait renvoyer une erreur s'il y a un problème dans la recherche d'un service", async () => {
      const existingError = { message: 'Erreur de requête de base de données' };

      (serviceFacade.getService as jest.Mock).mockResolvedValue({
        data: null,
        error: existingError,
      });

      await expect(serviceService.createService(mockBody)).rejects.toThrow(
        new Exceptions.DatabaseQueryServiceException(existingError)
      );
    });

    it('devrait renvoyer une erreur si un service avec le même nom existe déjà', async () => {
      (serviceFacade.getService as jest.Mock).mockResolvedValue({ data: mockService, error: null });

      await expect(serviceService.createService(mockBody)).rejects.toThrow(Exceptions.ServiceAlreadyExistsException);
    });

    it("devrait renvoyer une erreur s'il y a un problème à la création d'un service", async () => {
      (serviceFacade.createService as jest.Mock).mockResolvedValue({
        data: null,
        error: 'Erreur mockée',
      });
      await expect(serviceService.createService(mockBody)).rejects.toThrow(Exceptions.ServiceCreationException);
    });

    it('devrait renvoyer une erreur si un service est null après création', async () => {
      (serviceFacade.createService as jest.Mock).mockResolvedValue({
        data: null,
        error: null,
      });
      await expect(serviceService.createService(mockBody)).rejects.toThrow(Exceptions.ServiceNotFoundException);
    });
  });

  describe('PUT', () => {
    const enterpriseId = 'ent-123';
    const mockId = 'est-123';
    const mockBody = { id: mockId, name: 'service A', enterprise_id: enterpriseId };
    const mockService = {
      id: '123',
      name: 'service A',
      enterprise_id: enterpriseId,
    };

    beforeEach(async () => {
      (serviceFacade.getServiceById as jest.Mock).mockResolvedValue({ error: null });
      (serviceFacade.getService as jest.Mock).mockResolvedValue({ data: null, error: null });
      (serviceFacade.updateService as jest.Mock).mockResolvedValue({
        data: mockService,
        error: null,
      });
    });

    it('devrait mettre à jour un service et le renvoyer', async () => {
      const result = await serviceService.updateService(mockBody.id, mockBody);

      expect(serviceFacade.getServiceById).toHaveBeenCalledWith(mockBody.id);
      expect(serviceFacade.getService).toHaveBeenCalledWith(mockBody.name, mockBody.enterprise_id);
      expect(serviceFacade.updateService).toHaveBeenCalledWith(mockBody.id, mockBody);

      expect(result).toEqual(mockService);
    });

    it('doit lever une BadRequestException si userId est manquant', async () => {
      const mockId = '';
      await expect(serviceService.updateService(mockId, mockBody)).rejects.toThrow(BadRequestException);
    });

    it("doit renvoyer une erreur si l'service n'est pas trouvé", async () => {
      (serviceFacade.getServiceById as jest.Mock).mockResolvedValue({ error: { message: 'Erreur mocké' } });
      await expect(serviceService.updateService(mockId, mockBody)).rejects.toThrow(Exceptions.ServiceNotFoundException);
    });

    it("doit renvoyer DatabaseQueryServiceException si la recherche d'un service déclenche une erreur", async () => {
      (serviceFacade.getService as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Erreur mocké' },
      });
      await expect(serviceService.updateService(mockId, mockBody)).rejects.toThrow(
        Exceptions.DatabaseQueryServiceException
      );
    });

    it('doit renvoyer une erreur si un service est trouvé avec le même nom', async () => {
      (serviceFacade.getService as jest.Mock).mockResolvedValue({ data: mockService, error: null });
      await expect(serviceService.updateService(mockId, mockBody)).rejects.toThrow(
        Exceptions.ServiceAlreadyExistsException
      );
    });

    it("doit renvoyer ServiceUpdateException si l'update d'un service déclenche une erreur", async () => {
      (serviceFacade.updateService as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Erreur mocké' },
      });
      await expect(serviceService.updateService(mockId, mockBody)).rejects.toThrow(Exceptions.ServiceUpdateException);
    });
  });

  describe('DELETE', () => {
    const mockId = 'est-123';

    it('devrait supprimer un service', async () => {
      (serviceFacade.deleteService as jest.Mock).mockResolvedValue({ error: null });

      const result = await serviceService.deleteService(mockId);
      expect(serviceFacade.deleteService).toHaveBeenCalledWith(mockId);

      expect(result).toBe('ok');
    });

    it("devrait lever une exception si l'ID est invalide", async () => {
      const mockId = '';
      await expect(serviceService.deleteService(mockId)).rejects.toThrow(BadRequestException);
    });

    it('devrait lever une exception si Supabase renvoie une erreur', async () => {
      (serviceFacade.deleteService as jest.Mock).mockResolvedValue({ error: { message: 'Erreur mocké' } });
      await expect(serviceService.deleteService(mockId)).rejects.toThrow(Exceptions.ServiceDeleteException);
    });
  });
});
