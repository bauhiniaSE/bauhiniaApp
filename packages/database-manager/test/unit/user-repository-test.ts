import { expect } from 'chai';

import { DatabaseManager } from '../../src/database-manager';

import { UserRepository } from '../../src/user-repository';

describe('usertest', () => {
  it('should return true', () => {
    let dbm: DatabaseManager = new DatabaseManager();
    let item: UserRepository<number> = new UserRepository<number>(dbm);
    expect(item.remove('fff')).equal(true);
  });
});
