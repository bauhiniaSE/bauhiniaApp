interface IMapRepository {
  get(id: string): MyMap;
  remove(id: string): boolean;
  add(id: string, element: MyMap): boolean;
  set(id: string, element: MyMap): void;
  getAll(): MyElement[];
  getUsersAll(id: string): MyElement[];
}
