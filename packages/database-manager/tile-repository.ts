import { IObject } from 'bauhinia-api/object';

export interface ITileRepository {
  getAllTiles(): Promise<IObject[]>;
  updateTile(item: IObject): Promise<number>;
  getTile(id: string): Promise<IObject | number>;
  removeTile(id: string): Promise<number>;
  terminate(): void;
}

export { TileRepository } from './src/tile-repository';
