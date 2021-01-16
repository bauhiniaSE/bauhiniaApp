import { IUser } from 'bauhinia-api/user';

export interface IUserRepository {
  getUser(login: string): Promise<IUser>;
  removeUser(login: string): Promise<boolean>;
  addUser(user: IUser): Promise<boolean>;
  updateUser(user: IUser): Promise<boolean>;
  terminate(): void;
}
