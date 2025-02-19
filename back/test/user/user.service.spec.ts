import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../src/user/user.service";
import { SupabaseService } from "../../src/supabase/supabase.service";

const mockSupabaseClient = {
  auth: {
    admin: {
      listUsers: jest.fn(),
    },
  },
  from: jest.fn(),
};

const mockSupabaseService = {
  getClient: jest.fn().mockReturnValue(mockSupabaseClient),
};

describe("UserService", () => {
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: SupabaseService, useValue: mockSupabaseService }],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  it("devrait appeler Supabase avec les bons paramètres et retourner les utilisateurs", async () => {
    const page = 1;
    const pageSize = 10;

    const mockUsers = { users: [{ id: "1", email: "john@example.com" }] };
    const mockProfiles = [{ auth_id: "1", id: "101", firstname: "John", lastname: "Doe" }];

    // Mock de la récupération des utilisateurs via auth
    mockSupabaseClient.auth.admin.listUsers.mockResolvedValue({ data: mockUsers, error: null });

    // Mock de la récupération des profils avec un bon chaînage
    mockSupabaseClient.from.mockImplementation((tableName) => {
      if (tableName === "profiles") {
        return {
          select: jest.fn().mockImplementation((columns: string, options?: { count?: string }) => {
            if (options?.count === "exact") {
              return Promise.resolve({ data: null, count: 1, error: null });
            }
            return {
              in: jest.fn().mockResolvedValue({ data: mockProfiles, error: null }),
            };
          }),
        };
      }
      return { select: jest.fn().mockResolvedValue({ data: null, count: 1, error: null }) };
    });

    const result = await userService.getAllUsers(page, pageSize);

    expect(mockSupabaseClient.auth.admin.listUsers).toHaveBeenCalledWith({ page, perPage: pageSize });
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("profiles");
    expect(result).toEqual({
      users: [{ id: "1", email: "john@example.com", profile: { auth_id: "1", id: "101", firstname: "John", lastname: "Doe" } }],
      totalPages: 1,
    });
  });

  it("devrait lever une erreur si Supabase renvoie une erreur", async () => {
    mockSupabaseClient.auth.admin.listUsers.mockResolvedValue({
      data: null,
      error: { message: "Database error" },
    });

    await expect(userService.getAllUsers(1, 10)).rejects.toThrow("Utilisateur(s) non trouvé(s)");
  });
});
