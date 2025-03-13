import { Test, TestingModule } from '@nestjs/testing';
import { EnterpriseController } from '../../src/enterprise/enterprise.controller';
import { EnterpriseService } from '../../src/enterprise/enterprise.service';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('EnterpriseController', () => {
  let enterpriseController: EnterpriseController;
  let enterpriseService: EnterpriseService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [EnterpriseController],
      providers: [
        {
          provide: EnterpriseService,
          useValue: {
            getUsers: jest.fn(),
            getEnterprises: jest.fn(),
          },
        },
      ],
    }).compile();

    enterpriseController = moduleRef.get<EnterpriseController>(EnterpriseController);
    enterpriseService = moduleRef.get<EnterpriseService>(EnterpriseService);
  });

  describe('GET :id/users', () => {
    it('devrait appeler EnterpriseService.getUsers avec les bons paramètres et retourner la réponse', async () => {
      const enterpriseId = '1';
      const page = 1;
      const pageSize = 10;
      const mockUsersResponse = { users: [{ id: '1', email: 'john@example.com' }], totalPages: 1 };

      const spy = jest.spyOn(enterpriseService, 'getUsers').mockResolvedValue(mockUsersResponse);

      const result = await enterpriseController.getUsers(enterpriseId, page, pageSize);

      expect(spy).toHaveBeenCalledWith(enterpriseId, page, pageSize);

      expect(result).toEqual(mockUsersResponse);
    });

    it('ne doit pas inclure les super_admins dans la réponse', async () => {
      const enterpriseId = '1';
      const page = 1;
      const pageSize = 10;

      const superAdminIds = ['999', '888'];

      const mockUsersResponse = {
        users: [
          { id: '1', email: 'john@example.com' },
          { id: '2', email: 'jane@example.com' },
        ],
        totalPages: 1,
      };

      jest.spyOn(enterpriseService, 'getUsers').mockResolvedValue(mockUsersResponse);

      const result = await enterpriseController.getUsers(enterpriseId, page, pageSize);

      expect(result.users.some((user) => superAdminIds.includes(user.id))).toBe(false);
    });

    it('devrait lever une erreur en cas de problème avec EnterpriseService.getUsers', async () => {
      const enterpriseId = '1';
      const page = 1;
      const pageSize = 10;

      jest.spyOn(enterpriseService, 'getUsers').mockRejectedValue({
        response: {
          message: 'Erreur mockée',
          statusCode: 500,
        },
      });

      await expect(enterpriseController.getUsers(enterpriseId, page, pageSize)).rejects.toMatchObject({
        message: 'Erreur mockée',
        status: 500,
      });
    });
  });

  describe('GET', () => {
    it('devrait appeler EnterpriseService.getEnterprises et retourner la réponse', async () => {
      const mockEnterprises = [
        {
          id: 'ent-123',
          name: 'Hello',
          created_at: '',
        },
        {
          id: 'ent-456',
          name: 'Hola',
          created_at: '',
        },
        {
          id: 'ent-789',
          name: 'Bonjour',
          created_at: '',
        },
      ];

      const spy = jest.spyOn(enterpriseService, 'getEnterprises').mockResolvedValue(mockEnterprises);
      const result = await enterpriseController.getEnterprises();

      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(mockEnterprises);
    });

    it('devrait lever une erreur en cas de problème avec EnterpriseService.getEnterprises', async () => {
      jest.spyOn(enterpriseService, 'getEnterprises').mockRejectedValue({
        response: {
          message: 'Erreur mockée',
          statusCode: 500,
        },
      });

      await expect(enterpriseController.getEnterprises()).rejects.toMatchObject({
        message: 'Erreur mockée',
        status: 500,
      });
    });
  });
});
