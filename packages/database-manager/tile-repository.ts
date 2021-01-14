import { IObject } from 'bauhinia-api/object';

export interface ITileRepository {
  getAllTiles(): Promise<IObject[]>;
  updateTile(item: IObject): Promise<boolean>;
  getTile(id: string): Promise<IObject>;
  removeTile(id: string): Promise<boolean>;
  addTile(object: IObject): Promise<boolean>;
  terminate(): void;
}
