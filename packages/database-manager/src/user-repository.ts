import { IUserRepository } from '../user-repository';

import { Repository } from './repository';

export class UserRepository<T> extends Repository<T> implements IUserRepository<T> {
  public getUserGames(id: string): string[] {
    throw new Error('Not implemented');
  }
}
