import { IDatabaseManager } from './idatabase-manager';

export class Repository<T> {
  protected readonly dbManager: IDatabaseManager;
  constructor(manager: IDatabaseManager) {
    this.dbManager = manager;
  }
  public get(id: string): T {
    throw new Error('Not implemented');
  }
  public remove(id: string): boolean {
    return true;
  }
  public add(id: string, obj: T): boolean {
    return true;
  }
  public set(id: string, obj: T): boolean {
    return true;
  }
}
