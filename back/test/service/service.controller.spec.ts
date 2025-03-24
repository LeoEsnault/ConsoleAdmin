import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from '../../src/service/service.controller';
import { ServiceService } from '../../src/service/service.service';
import { deleteService, updateService } from 'src/service/service.facade';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('ServiceController', () => {
  let serviceController: ServiceController;
  let serviceService: ServiceService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [
        {
          provide: ServiceService,
          useValue: {
            createService: jest.fn(),
            updateService: jest.fn(),
            deleteService: jest.fn(),
          },
        },
      ],
    }).compile();

    serviceController = moduleRef.get<ServiceController>(ServiceController);
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

    it('devrait appeler ServiceService.createService et retourner la réponse', async () => {
      const spy = jest.spyOn(serviceService, 'createService').mockResolvedValue(mockService);
      const result = await serviceController.createService(mockBody);

      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockService);
    });

    it('devrait lever une erreur en cas de problème avec ServiceService.createService', async () => {
      jest.spyOn(serviceService, 'createService').mockRejectedValue({
        response: {
          message: 'Erreur mockée',
          statusCode: 500,
        },
      });

      await expect(serviceController.createService(mockBody)).rejects.toMatchObject({
        message: 'Erreur mockée',
        status: 500,
      });
    });
  });

  describe('PUT', () => {
    const serviceId = 'est-123';
    const mockedBody = { id: 'est-123', name: 'Hello', enterprise_id: 'ent-123' };

    it('devrait serviceService.updateService avec les bons paramètres', async () => {
      const spy = jest.spyOn(serviceService, 'updateService').mockResolvedValue(mockedBody);

      const result = await serviceController.updateService(serviceId, mockedBody);

      expect(spy).toHaveBeenCalledWith(serviceId, mockedBody);
      expect(result).toEqual(mockedBody);
    });

    it('devrait lever une erreur en cas de problème avec serviceService.updateService', async () => {
      jest.spyOn(serviceService, 'updateService').mockRejectedValue({
        response: {
          message: 'Erreur mockée',
          statusCode: 500,
        },
      });

      await expect(serviceController.updateService(serviceId, mockedBody)).rejects.toMatchObject({
        message: 'Erreur mockée',
        status: 500,
      });
    });
  });

  describe('DELETE', () => {
    const mockId = 'est-123';

    it('devrait appeler serviceService.deleteService avec les bons paramètres et retourner "ok', async () => {
      const spy = jest.spyOn(serviceService, 'deleteService').mockResolvedValue('ok');

      const result = await serviceController.deleteService(mockId);

      expect(spy).toHaveBeenCalledWith(mockId);
      expect(result).toEqual('ok');
    });

    it('devrait lever une erreur en cas de problème avec serviceService.deleteService', async () => {
      jest.spyOn(serviceService, 'deleteService').mockRejectedValue({
        response: {
          message: 'Erreur mockée',
          statusCode: 500,
        },
      });

      await expect(serviceController.deleteService(mockId)).rejects.toMatchObject({
        message: 'Erreur mockée',
        status: 500,
      });
    });
  });
});
