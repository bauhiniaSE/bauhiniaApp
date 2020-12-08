import { expect } from 'chai';

import { DatabaseManager } from '../../src/database-manager';

import { MapRepository } from '../../src/map-repository';

describe('maptest', () => {
  it('should return true', () => {
    let dbm: DatabaseManager = new DatabaseManager();
    let item: MapRepository<number> = new MapRepository<number>(dbm);
    expect(item.remove('fff')).equal(true);
  });
});
