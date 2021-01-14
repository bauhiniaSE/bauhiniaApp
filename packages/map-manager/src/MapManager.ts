/* eslint-disable prettier/prettier */
import { IMap } from 'bauhinia-api/map';
import { IObject } from 'bauhinia-api/object';
import { IUser } from 'bauhinia-api/user';
import { IMapRepository } from 'bauhinia-database-manager/map-repository';
import { ITileRepository } from 'bauhinia-database-manager/tile-repository';
import { IUserRepository } from 'bauhinia-database-manager/user-repository';

import { IMapManager } from './IMapManager';

export class MapManager implements IMapManager {
  private readonly tileRepository: ITileRepository;
  private readonly mapRepository: IMapRepository;
  private readonly userRepository: IUserRepository;

  public listAllUserGames(login: string): IMap[]{
    this.mapRepository.getAllUserMaps(login).then((maps) => {
      return maps;
    })
    throw new Error('Unsuccesful return!!!');
  }

  public listAllBlueprints(): IMap[] {
    this.mapRepository.getAllBlueprints().then((blueprints) => {
      return blueprints
    })
    throw new Error('Unsuccesful return!!!');
  }

  public getUser(login: string): IUser {
    this.userRepository.getUser(login).then((user) => {
      return user
    })
    throw new Error('Unsuccesful return!!!');
  }

  public getTile(objectId: string): IObject {
    this.tileRepository.getTile(objectId).then((tile) => {
      return tile
    })
    throw new Error('Unsuccesful return!!!');
  }

  public getAllTiles(objectId: string): string {
    this.tileRepository.getAllTiles().then((tiles) => {
      return tiles
    })
    throw new Error('Unsuccesful return!!!');
  }


  public getTileHeight(objectId: string): number {
    this.tileRepository.getTile(objectId).then((tile) => {
      return tile.height
    })
    throw new Error('Unsuccesful return!!!');
  }
  
  public getTileWidthNS(objectId: string): number {
    this.tileRepository.getTile(objectId).then((tile) => {
      return tile.widthNS
    })
    throw new Error('Unsuccesful return!!!');  
  }
    
  public getTileWidthWE(objectId: string): number {
    this.tileRepository.getTile(objectId).then((tile) => {
      return tile.widthWE
    })
    throw new Error('Unsuccesful return!!!');  
  }

  public getTilePrice(objectId: string): number {
    this.tileRepository.getTile(objectId).then((tile) => {
      return tile.price
    })
    throw new Error('Unsuccesful return!!!');  
  }

  public getTileMaterial(objectId: string): string {
    this.tileRepository.getTile(objectId).then((tile) => {
      return tile.material
    })
    throw new Error('Unsuccesful return!!!');
  }

  public getTileCanPlaceOn(objectId: string): string {
    this.tileRepository.getTile(objectId).then((tile) => {
      return tile.canPlaceOn
    })
    throw new Error('Unsuccesful return!!!');
  }
}
