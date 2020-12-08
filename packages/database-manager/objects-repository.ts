export interface IObjectsRepository<T> {
  getAll(): T[];
  get(id: string): T;
  remove(id: string): boolean;
  add(id: string, obj: T): boolean;
  set(id: string, obj: T): boolean;
}
