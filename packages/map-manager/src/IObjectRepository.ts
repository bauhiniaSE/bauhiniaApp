interface IObjectRepository {
  get(id: string): MyElement;
  remove(id: string): boolean;
  add(id: string, element: MyElement): boolean;
  set(id: string, element: MyElement): void;
  getAll(): MyElement[];
}
