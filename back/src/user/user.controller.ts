import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe, HttpException, HttpStatus } from "@nestjs/common";
import { UserNotFoundException, ProfileNotFoundException } from "../exceptions/user.exceptions";
import { UserService } from "./user.service";
import { User } from "./user.service";

interface GetUsersResponse {
  users: User[];
  totalPages: number;
}

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getAllUsers(@Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number, @Query("pageSize", new DefaultValuePipe(10), ParseIntPipe) pageSize: number): Promise<GetUsersResponse> {
    try {
      const response = await this.userService.getAllUsers(page, pageSize);
      return response;
    } catch (error) {
      const { message, status } = handleException(error);
      throw new HttpException(message, status);
    }
  }
}

export function handleException(error: unknown): { message: string, status: HttpStatus } {
  if (error instanceof UserNotFoundException || error instanceof ProfileNotFoundException) {
    return { message: error.message, status: HttpStatus.NOT_FOUND };
  }

  //console.error('Erreur inconnue :', error);
  return { message: 'Erreur interne du serveur', status: HttpStatus.INTERNAL_SERVER_ERROR };
}
