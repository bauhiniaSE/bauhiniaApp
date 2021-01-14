import { IMap } from 'bauhinia-api/map';
import { IObject } from 'bauhinia-api/object';
import { IUser } from 'bauhinia-api/user';

export interface IMapManager {
  listAllUserGames(login: string): IMap[];
  listAllBlueprints(): IMap[];
  getUser(login: string): IUser;
  getTile(objectId: string): IObject;
  getAllTiles(objectId: string): string;
  getTileHeight(objectId: string): number;
  getTileWidthNS(objectId: string): number;
  getTileWidthWE(objectId: string): number;
  getTilePrice(objectId: string): number;
  getTileMaterial(objectId: string): string;
  getTileCanPlaceOn(objectId: string): string;
}
