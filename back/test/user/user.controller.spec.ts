import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/user/user.controller';
import { UserService } from '../../src/user/user.service';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserEnterprise: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('GET :userId/enterprise', () => {
    it('devrait appeler EnterpriseService.getUserEnterprise avec les bons paramètres et retourner une entreprise', async () => {
      const userId = '123';
      const mockEnterpriseResponse = {
        id: 'abc',
        name: 'test1',
        created_at: '2025-02-27T15:08:53.666287',
        updated_at: '2025-02-27T15:08:53.666287',
      };

      const spy = jest.spyOn(userService, 'getUserEnterprise').mockResolvedValue(mockEnterpriseResponse);
      const result = await userController.getUserEnterprise(userId);

      expect(spy).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockEnterpriseResponse);
    });

    it('devrait lever une erreur en cas de problème avec EnterpriseService.getUserEnterprise', async () => {
      const userId = '123';

      jest.spyOn(userService, 'getUserEnterprise').mockRejectedValue({
        response: {
          message: 'Erreur mockée',
          statusCode: 500,
        },
      });

      await expect(userController.getUserEnterprise(userId)).rejects.toMatchObject({
        message: 'Erreur mockée',
        status: 500,
      });
    });
  });

  describe('POST', () => {
    const mockBody = { email: 'test@example.com', enterprise: 'abcde' };

    it('devrait appeler UserService.createUser avec les bons paramètres et retourner la réponse', async () => {
      const mockedProfile = { user_id: '1', firstname: '', lastname: '', id: 'aef33960' };
      const mockedUser = { id: '1', email: 'test@example.com', profile: mockedProfile };

      const spy = jest.spyOn(userService, 'createUser').mockResolvedValue(mockedUser);

      const result = await userController.createUser(mockBody);

      expect(spy).toHaveBeenCalledWith(mockBody);

      expect(result).toEqual(mockedUser);
    });

    it('devrait lever une erreur en cas de problème avec UserService.createUser', async () => {
      jest.spyOn(userService, 'createUser').mockRejectedValue({
        response: {
          message: 'Erreur mockée',
          statusCode: 500,
        },
      });

      await expect(userController.createUser(mockBody)).rejects.toMatchObject({
        message: 'Erreur mockée',
        status: 500,
      });
    });
  });

  describe('PUT', () => {
    it('devrait appeler UserService.updateUser avec les bons paramètres et retourner la réponse', async () => {
      const userId = '1';
      const mockedProfile = { user_id: '1', firstname: '', lastname: '', id: 'aef33960' };
      const mockedUser = { id: '1', email: 'updated@example.com', profile: mockedProfile };

      const spy = jest.spyOn(userService, 'updateUser').mockResolvedValue(mockedUser);

      const result = await userController.updateUser(userId, mockedUser);

      expect(spy).toHaveBeenCalledWith(userId, mockedUser);
      expect(result).toEqual(mockedUser);
    });

    it('devrait lever une erreur en cas de problème avec UserService.updateUser', async () => {
      const userId = '1';
      const mockedProfile = { user_id: '1', firstname: '', lastname: '', id: 'aef33960' };
      const mockedUser = { id: '1', email: 'updated@example.com', profile: mockedProfile };

      jest.spyOn(userService, 'updateUser').mockRejectedValue({
        response: {
          message: 'Erreur mockée',
          statusCode: 500,
        },
      });

      await expect(userController.updateUser(userId, mockedUser)).rejects.toMatchObject({
        message: 'Erreur mockée',
        status: 500,
      });
    });
  });

  describe('DELETE', () => {
    it('devrait appeler UserService.deleteUser avec les bons paramètres et retourner "ok', async () => {
      const mockId = '123';

      const spy = jest.spyOn(userService, 'deleteUser').mockResolvedValue('ok');

      const result = await userController.deleteUser(mockId);

      expect(spy).toHaveBeenCalledWith(mockId);
      expect(result).toEqual('ok');
    });

    it('devrait lever une erreur en cas de problème avec UserService.deleteUser', async () => {
      const mockId = '123';

      jest.spyOn(userService, 'deleteUser').mockRejectedValue({
        response: {
          message: 'Erreur mockée',
          statusCode: 500,
        },
      });

      await expect(userController.deleteUser(mockId)).rejects.toMatchObject({
        message: 'Erreur mockée',
        status: 500,
      });
    });
  });
});
