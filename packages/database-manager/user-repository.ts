export interface IUserRepository<T> {
  get(id: string): T;
  remove(id: string): boolean;
  add(id: string, obj: T): boolean;
  set(id: string, obj: T): boolean;
  getUserGames(id: string): string[];
}
