import { IUser } from 'bauhinia-api/user';

export interface IUserRepository {
  getUser(login: string): Promise<IUser | number>;
  removeUser(login: string): Promise<number>;
  addUser(user: IUser): Promise<number>;
  updateUser(user: IUser): Promise<number>;
  terminate(): void;
}

export { UserRepository } from './src/user-repository';
