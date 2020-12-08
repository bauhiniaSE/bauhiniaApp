import { expect } from 'chai';

import { DatabaseManager } from '../../src/database-manager';

import { ItemRepository } from '../../src/item-repository';

describe('itemtest', () => {
  it('should return true', () => {
    let dbm: DatabaseManager = new DatabaseManager();
    let item: ItemRepository<number> = new ItemRepository<number>(dbm);
    expect(item.remove('fff')).equal(true);
  });
});
