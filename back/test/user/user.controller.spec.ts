import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/user/user.controller';
import { UserService } from '../../src/user/user.service';

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
            getAllUsers: jest.fn(),
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

  // GET
  it('devrait appeler UserService.getAllUsers avec les bons paramètres et retourner la réponse', async () => {
    const page = 1;
    const pageSize = 10;
    const mockUsersResponse = { users: [{ id: '1', email: 'john@example.com' }], totalPages: 1 };

    const spy = jest.spyOn(userService, 'getAllUsers').mockResolvedValue(mockUsersResponse);

    const result = await userController.getAllUsers(page, pageSize);

    expect(spy).toHaveBeenCalledWith(page, pageSize);

    expect(result).toEqual(mockUsersResponse);
  });

  it('devrait lever une erreur en cas de problème avec UserService.getAllUsers', async () => {
    const page = 1;
    const pageSize = 10;

    jest.spyOn(userService, 'getAllUsers').mockRejectedValue(new Error('Erreur générique'));
    await expect(userController.getAllUsers(page, pageSize)).rejects.toThrow('Erreur interne du serveur');
  });

  // POST
  it('devrait appeler UserService.createUser avec les bons paramètres et retourner la réponse', async () => {
    const createUser = { email: 'test@example.com' };
    const mockedProfile = { auth_id: '1', firstname: '', lastname: '', id: 'aef33960' };
    const mockedUser = { id: '1', email: 'test@example.com', profile: mockedProfile };

    const spy = jest.spyOn(userService, 'createUser').mockResolvedValue(mockedUser);

    const result = await userController.createUser(createUser);

    expect(spy).toHaveBeenCalledWith(createUser);

    expect(result).toEqual(mockedUser);
  });

  it('devrait lever une erreur en cas de problème avec UserService.createUser', async () => {
    const mockUser = { email: 'test@example.com' };

    jest.spyOn(userService, 'createUser').mockRejectedValue(new Error('Erreur générique'));

    await expect(userController.createUser(mockUser)).rejects.toThrow('Erreur interne du serveur');
  });

  it('devrait appeler UserService.createUser avec les bons paramètres et retourner la réponse', async () => {
    const createUser = { email: 'test@example.com' };
    const mockedProfile = { auth_id: '1', firstname: '', lastname: '', id: 'aef33960' };
    const mockedUser = { id: '1', email: 'test@example.com', profile: mockedProfile };

    const spy = jest.spyOn(userService, 'createUser').mockResolvedValue(mockedUser);

    const result = await userController.createUser(createUser);

    expect(spy).toHaveBeenCalledWith(createUser);

    expect(result).toEqual(mockedUser);
  });

  // PUT
  it('devrait appeler UserService.updateUser avec les bons paramètres et retourner la réponse', async () => {
    const userId = '1';
    const mockedProfile = { auth_id: '1', firstname: '', lastname: '', id: 'aef33960' };
    const mockedUser = { id: '1', email: 'updated@example.com', profile: mockedProfile };

    const spy = jest.spyOn(userService, 'updateUser').mockResolvedValue(mockedUser);

    const result = await userController.updateUser(userId, mockedUser);

    expect(spy).toHaveBeenCalledWith(userId, mockedUser);
    expect(result).toEqual(mockedUser);
  });

  it('devrait lever une erreur en cas de problème avec UserService.updateUser', async () => {
    const userId = '1';
    const mockedProfile = { auth_id: '1', firstname: '', lastname: '', id: 'aef33960' };
    const mockedUser = { id: '1', email: 'updated@example.com', profile: mockedProfile };

    jest.spyOn(userService, 'updateUser').mockRejectedValue(new Error('Erreur générique'));

    await expect(userController.updateUser(userId, mockedUser)).rejects.toThrow('Erreur interne du serveur');
  });

  // DELETE
  it('devrait appeler UserService.deleteUser avec les bons paramètres et retourner "ok', async () => {
    const mockId = '123';

    const spy = jest.spyOn(userService, 'deleteUser').mockResolvedValue('ok');

    const result = await userController.deleteUser(mockId);

    expect(spy).toHaveBeenCalledWith(mockId);
    expect(result).toEqual('ok');
  });

  it('devrait lever une erreur en cas de problème avec UserService.deleteUser', async () => {
    const mockId = '123';

    jest.spyOn(userService, 'deleteUser').mockRejectedValue(new Error('Erreur générique'));

    await expect(userController.deleteUser(mockId)).rejects.toThrow('Erreur interne du serveur');
  });
});
