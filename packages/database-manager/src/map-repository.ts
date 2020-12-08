import { IMapRepository } from '../map-repository';

import { Repository } from './repository';

export class MapRepository<T> extends Repository<T> implements IMapRepository<T> {
  public getAll(): T[] {
    throw new Error('Not implemented');
  }
  public getUsersAll(id: string): T[] {
    throw new Error('Not implemented');
  }
  public getUserGame(userId: string, mapid: string): T {
    throw new Error('Not implemented');
  }
}
