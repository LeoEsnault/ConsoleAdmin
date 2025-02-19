import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "../../src/user/user.controller";
import { UserService } from "../../src/user/user.service";

describe("UserController", () => {
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
          },
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  it("devrait appeler UserService.getAllUsers avec les bons paramètres et retourner la réponse", async () => {
    const page = 1;
    const pageSize = 10;
    const mockUsersResponse = { users: [{ id: "1", email: "john@example.com" }], totalPages: 1 };

    const spy = jest.spyOn(userService, "getAllUsers").mockResolvedValue(mockUsersResponse);

    const result = await userController.getAllUsers(page, pageSize);

    expect(spy).toHaveBeenCalledWith(page, pageSize);

    expect(result).toEqual(mockUsersResponse);
  });

  it("devrait lever une erreur en cas de problème avec UserService", async () => {
    const page = 1;
    const pageSize = 10;

    jest.spyOn(userService, "getAllUsers").mockRejectedValue(new Error("Erreur générique"));
    await expect(userController.getAllUsers(page, pageSize)).rejects.toThrow("Erreur interne du serveur");
  });
});
