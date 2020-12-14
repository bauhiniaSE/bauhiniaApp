export interface IMapRepository<T> {
  getAll(): T[];
  getUsersAll(id: string): T[];
  getUserGame(userId: string, mapid: string): T;
  get(id: string): T;
  remove(id: string): boolean;
  add(id: string, obj: T): boolean;
  set(id: string, obj: T): boolean;
}
