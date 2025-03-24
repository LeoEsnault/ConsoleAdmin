import { Test, TestingModule } from '@nestjs/testing';
import { EstablishmentController } from '../../src/establishment/establishment.controller';
import { EstablishmentService } from '../../src/establishment/establishment.service';
import { deleteEstablishment, updateEstablishment } from 'src/establishment/establishment.facade';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('EstablishmentController', () => {
  let establishmentController: EstablishmentController;
  let establishmentService: EstablishmentService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [EstablishmentController],
      providers: [
        {
          provide: EstablishmentService,
          useValue: {
            createEstablishment: jest.fn(),
            updateEstablishment: jest.fn(),
            deleteEstablishment: jest.fn(),
          },
        },
      ],
    }).compile();

    establishmentController = moduleRef.get<EstablishmentController>(EstablishmentController);
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

    it('devrait appeler EstablishmentService.createEstablishment et retourner la réponse', async () => {
      const spy = jest.spyOn(establishmentService, 'createEstablishment').mockResolvedValue(mockEstablishment);
      const result = await establishmentController.createEstablishment(mockBody);

      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockEstablishment);
    });

    it('devrait lever une erreur en cas de problème avec EstablishmentService.createEstablishment', async () => {
      jest.spyOn(establishmentService, 'createEstablishment').mockRejectedValue({
        response: {
          message: 'Erreur mockée',
          statusCode: 500,
        },
      });

      await expect(establishmentController.createEstablishment(mockBody)).rejects.toMatchObject({
        message: 'Erreur mockée',
        status: 500,
      });
    });
  });

  describe('PUT', () => {
    const establishmentId = 'est-123';
    const mockedBody = { id: 'est-123', name: 'Hello', enterprise_id: 'ent-123' };

    it('devrait EstablishmentService.updateEstablishment avec les bons paramètres', async () => {
      const spy = jest.spyOn(establishmentService, 'updateEstablishment').mockResolvedValue(mockedBody);

      const result = await establishmentController.updateEstablishment(establishmentId, mockedBody);

      expect(spy).toHaveBeenCalledWith(establishmentId, mockedBody);
      expect(result).toEqual(mockedBody);
    });

    it('devrait lever une erreur en cas de problème avec EstablishmentService.updateEstablishment', async () => {
      jest.spyOn(establishmentService, 'updateEstablishment').mockRejectedValue({
        response: {
          message: 'Erreur mockée',
          statusCode: 500,
        },
      });

      await expect(establishmentController.updateEstablishment(establishmentId, mockedBody)).rejects.toMatchObject({
        message: 'Erreur mockée',
        status: 500,
      });
    });
  });

  describe('DELETE', () => {
    const mockId = 'est-123';

    it('devrait appeler EstablishmentService.deleteEstablishment avec les bons paramètres et retourner "ok', async () => {
      const spy = jest.spyOn(establishmentService, 'deleteEstablishment').mockResolvedValue('ok');

      const result = await establishmentController.deleteEstablishment(mockId);

      expect(spy).toHaveBeenCalledWith(mockId);
      expect(result).toEqual('ok');
    });

    it('devrait lever une erreur en cas de problème avec EstablishmentService.deleteEstablishment', async () => {
      jest.spyOn(establishmentService, 'deleteEstablishment').mockRejectedValue({
        response: {
          message: 'Erreur mockée',
          statusCode: 500,
        },
      });

      await expect(establishmentController.deleteEstablishment(mockId)).rejects.toMatchObject({
        message: 'Erreur mockée',
        status: 500,
      });
    });
  });
});
