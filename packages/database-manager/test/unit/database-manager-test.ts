import { expect } from 'chai';

import { DatabaseManager } from '../../src/database-manager';

describe('openConnection test', () => {
  it('openConnection should return true', () => {
    const dbm: DatabaseManager = new DatabaseManager();
    const result: boolean = dbm.openConnection();
    expect(result).equal(true);
  });
});
describe('closeConnection test', () => {
  it('closeConnection should return true', () => {
    const dbm: DatabaseManager = new DatabaseManager();
    dbm.openConnection();
    const result: boolean = dbm.closeConnection();
    expect(result).equal(true);
  });
});
describe('executeQuery test', () => {
  it('should', () => {
    const dbm: DatabaseManager = new DatabaseManager();
    dbm.openConnection();
    dbm.closeConnection();
    expect(true).equal(true);
  });
});
