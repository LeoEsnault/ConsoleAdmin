import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { EnterpriseService } from '../../src/enterprise/enterprise.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import * as Exceptions from '../../src/exceptions';
import * as enterpriseFacade from '../../src/enterprise/enterprise.facade';

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

jest.mock('../../src/enterprise/enterprise.facade', () => ({
  getEnterprise: jest.fn(),
  getProfiles: jest.fn(),
  getSuperAdmin: jest.fn(),
  getEnterprises: jest.fn(),
}));

describe('EnterpriseService', () => {
  let enterpriseService: EnterpriseService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [EnterpriseService, { provide: SupabaseService, useValue: mockSupabaseService }],
    }).compile();

    enterpriseService = moduleRef.get<EnterpriseService>(EnterpriseService);
  });

  const enterpriseId = '123';
  const page = 1;
  const pageSize = 10;
  const superAdminIds = ['888', '999'];
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

  describe('GET :id/users', () => {
    it('devrait appeler Supabase avec les bons paramètres et retourner les utilisateurs', async () => {
      (enterpriseFacade.getEnterprise as jest.Mock).mockResolvedValue({ data: { id: '123' }, error: null });
      (enterpriseFacade.getProfiles as jest.Mock).mockResolvedValueOnce({
        data: [{ user_id: '1', enterprise_id: '123', id: '101', firstname: 'John', lastname: 'Doe' }],
        count: 1,
        error: null,
      });
      (enterpriseFacade.getSuperAdmin as jest.Mock).mockResolvedValueOnce({
        data: [{ user_id: '888' }, { user_id: '999' }],
        error: null,
      });

      mockSupabaseClient.auth.admin.getUserById.mockResolvedValueOnce({
        data: { user: { id: '1', email: 'john@example.com' } },
        error: null,
      });

      const result = await enterpriseService.getUsers(enterpriseId, page, pageSize);

      expect(enterpriseFacade.getEnterprise).toHaveBeenCalledWith(enterpriseId);
      expect(enterpriseFacade.getSuperAdmin).toHaveBeenCalledWith();
      expect(enterpriseFacade.getProfiles).toHaveBeenCalledWith(enterpriseId, page, pageSize, superAdminIds);

      expect(result).toEqual({
        users: [
          {
            id: '1',
            email: 'john@example.com',
            profile: { user_id: '1', id: '101', firstname: 'John', lastname: 'Doe', enterprise_id: enterpriseId },
          },
        ],
        totalPages: 1,
      });
    });

    it('devrait renvoyer une erreur si l`entreprise n`existe pas', async () => {
      (enterpriseFacade.getEnterprise as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Enterprise not found' },
      });

      await expect(enterpriseService.getUsers(enterpriseId, page, pageSize)).rejects.toThrow(
        Exceptions.EnterpriseNotFoundException
      );

      expect(enterpriseFacade.getEnterprise).toHaveBeenCalledWith(enterpriseId);
    });

    it('devrait renvoyer une erreur si les profils ne sont pas trouvés', async () => {
      (enterpriseFacade.getSuperAdmin as jest.Mock).mockResolvedValueOnce({
        data: [{ user_id: '888' }, { user_id: '999' }],
        error: null,
      });

      (enterpriseFacade.getProfiles as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Profiles not found' },
      });

      await expect(enterpriseService.getUsers(enterpriseId, page, pageSize)).rejects.toThrow(
        Exceptions.ProfileNotFoundException
      );

      expect(enterpriseFacade.getProfiles).toHaveBeenCalledWith(enterpriseId, page, pageSize, superAdminIds);
    });

    it('devrait retourner un tableau vide si aucun profil n`est trouvé', async () => {
      (enterpriseFacade.getEnterprise as jest.Mock).mockResolvedValue({ data: { id: '123' }, error: null });
      (enterpriseFacade.getProfiles as jest.Mock).mockResolvedValueOnce({
        data: [],
        count: 0,
        error: null,
      });
      (enterpriseFacade.getSuperAdmin as jest.Mock).mockResolvedValueOnce({
        data: [{ user_id: '888' }, { user_id: '999' }],
        error: null,
      });

      const result = await enterpriseService.getUsers(enterpriseId, page, pageSize);
      expect(result).toEqual({
        users: [],
        totalPages: 0,
      });
    });

    it('devrait renvoyer une erreur si `id` est vide', async () => {
      await expect(enterpriseService.getUsers('', page, pageSize)).rejects.toThrow(BadRequestException);
    });

    it('devrait renvoyer une erreur si `page` ou `pageSize` sont inférieurs à 1', async () => {
      await expect(enterpriseService.getUsers(enterpriseId, 0, pageSize)).rejects.toThrow(BadRequestException);
      await expect(enterpriseService.getUsers(enterpriseId, page, 0)).rejects.toThrow(BadRequestException);
    });
  });

  describe('GET', () => {
    it('devrait appeler Supabase avec les bons paramètres et retourner les utilisateurs', async () => {
      (enterpriseFacade.getEnterprises as jest.Mock).mockResolvedValue({ data: mockEnterprises, error: null });

      const result = await enterpriseService.getEnterprises();

      expect(enterpriseFacade.getEnterprises).toHaveBeenCalled();

      expect(result).toEqual(mockEnterprises);
    });

    it('devrait renvoyer une erreur si les entreprises ne sont pas trouvées', async () => {
      (enterpriseFacade.getEnterprises as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Enterprise not found' },
      });

      await expect(enterpriseService.getEnterprises()).rejects.toThrow(Exceptions.EnterpriseNotFoundException);

      expect(enterpriseFacade.getEnterprises).toHaveBeenCalled();
    });
  });
});
