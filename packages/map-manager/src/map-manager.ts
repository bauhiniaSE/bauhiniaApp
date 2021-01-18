import { IMapRepository } from 'bauhinia-database-manager/map-repository';
import { ITileRepository } from 'bauhinia-database-manager/tile-repository';
import { IUserRepository } from 'bauhinia-database-manager/user-repository';

import { IMapManager } from './imap-manager';

export class MapManager implements IMapManager {
  private readonly tileRepository: ITileRepository;
  private readonly mapRepository: IMapRepository;
  private readonly userRepository: IUserRepository;

  constructor(tileRepository: ITileRepository, mapRepository: IMapRepository, userRepository: IUserRepository) {
    this.tileRepository = tileRepository;
    this.mapRepository = mapRepository;
    this.userRepository = userRepository;
  }

  public listAllUserGames(login: string) {
    return this.mapRepository.getAllUserMaps(login);
  }

  public listAllBlueprints() {
    return this.mapRepository.getAllBlueprints();
  }

  public getUser(login: string) {
    return this.userRepository.getUser(login);
  }

  public getTile(objectId: string) {
    return this.tileRepository.getTile(objectId);
  }

  public getAllTiles() {
    return this.tileRepository.getAllTiles();
  }
}
