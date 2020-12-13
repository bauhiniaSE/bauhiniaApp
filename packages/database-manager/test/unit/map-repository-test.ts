import { expect } from 'chai';

import { DatabaseManager } from '../../src/database-manager';

import { MapRepository } from '../../src/map-repository';

describe('maptest', () => {
  it('should return true', () => {
    const dbm: DatabaseManager = new DatabaseManager();
    const item: MapRepository<number> = new MapRepository<number>(dbm);
    expect(item.remove('fff')).equal(true);
  });
});
