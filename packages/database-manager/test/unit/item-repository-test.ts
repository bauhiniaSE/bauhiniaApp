import { expect } from 'chai';

import { DatabaseManager } from '../../src/database-manager';

import { ItemRepository } from '../../src/item-repository';

describe('itemtest', () => {
  it('should return true', () => {
    const dbm: DatabaseManager = new DatabaseManager();
    const item: ItemRepository<number> = new ItemRepository<number>(dbm);
    expect(item.remove('fff')).equal(true);
  });
});
