import { IMap } from 'bauhinia-api/map';

export interface IMapManager {
  listAllUserGames(userId: string): IMap[];
  createNewGame(mapId: string): boolean;
  listAllMapsToPlay(): IMap[];
  saveGame(userId: string, game: IMap): void;
  getObjectHeight(objectId: string): number;
  //================================================
  getObjectWidth(objectId: string): number;
  getObjectLength(objectId: string): number;
  getObjectPrice(objectId: string): number;
  getObjectType(objectId: string): string;
  startGame(gameId: string): void;
}
