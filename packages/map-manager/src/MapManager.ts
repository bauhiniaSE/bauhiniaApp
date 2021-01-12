import { IMap } from 'bauhinia-api/map';
import { IObject } from 'bauhinia-api/object';
import { IMapRepository } from 'bauhinia-database-manager/map-repository';
import { IObjectsRepository } from 'bauhinia-database-manager/objects-repository';
import { IMapManager } from './IMapManager';

class MapManager implements IMapManager {

  private readonly objectRepository: IObjectRepository;
  private readonly mapRepository: IMapRepository;

export class MapManager implements IMapManager {
  private readonly objectRepository: IObjectsRepository<IObject>;
  private readonly mapRepository: IMapRepository<IMap>;

  public listAllUserGames(userId: string): IMap[] {
    throw new Error('Method not implemented.');
  }
  public createNewGame(mapId: string): boolean {
    throw new Error('Method not implemented.');
  }
  public listAllMapsToPlay(): IMap[] {
    throw new Error('Method not implemented.');
  }
  public saveGame(userId: string, game: IMap): void {
    throw new Error('Method not implemented.');
  }

  //==============================================================
  public getObjectHeight(objectId: string): number {
    throw new Error('Method not implemented.');
  }
  public getObjectWidth(objectId: string): number {
    throw new Error('Method not implemented.');
  }
  public getObjectLength(objectId: string): number {
    throw new Error('Method not implemented.');
  }
  public getObjectPrice(objectId: string): number {
    throw new Error('Method not implemented.');
  }
  public getObjectType(objectId: string): string {
    throw new Error('Method not implemented.');
  }
  public startGame(gameId: string): void {
    throw new Error('Method not implemented.');
  }
}
