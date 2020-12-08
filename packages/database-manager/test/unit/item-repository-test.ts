import { expect } from 'chai';

import { DatabaseManager } from '../../src/database-manager';

import { ItemRepository } from '../../src/item-repository';

describe('test', () => {
  it('should return true', () => {
    let dbm: DatabaseManager = new DatabaseManager();
    let item: ItemRepository<T> = new ItemRepository<T>(dbm);
    expect(true).equal(true);
  });
});
