import { IMap } from 'bauhinia-api/map';
import { IObject } from 'bauhinia-api/object';
import { IUser } from 'bauhinia-api/user';

export interface IMapManager {
  listAllUserGames(login: string): Promise<IMap[]>;
  listAllBlueprints(): Promise<IMap[]>;
  getUser(login: string): Promise<IUser | number>;
  getTile(objectId: string): Promise<IObject | number>;
  getAllTiles(): Promise<IObject[]>;
}
