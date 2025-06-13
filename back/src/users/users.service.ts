import { Injectable } from '@nestjs/common';
import * as Exceptions from '../exceptions';
import { UsersFacade } from './users.facade';

@Injectable()
export class UsersService {
  constructor(private readonly usersFacade: UsersFacade) {}

  async getUser() {
    const { data: user, error } = await this.usersFacade.getUsers();
    if (error || !user) {
      throw new Exceptions.UserNotFoundException();
    }
    return user;
  }


}