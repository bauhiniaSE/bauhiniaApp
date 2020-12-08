import { IObjectsRepository } from '../objects-repository';

import { Repository } from './repository';

export class ItemRepository<T> extends Repository<T> implements IObjectsRepository<T> {
  public getAll(): T[] {
    throw new Error('Not implemented');
  }
}
