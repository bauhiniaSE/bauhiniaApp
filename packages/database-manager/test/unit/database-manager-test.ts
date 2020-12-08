import { expect } from 'chai';

import { DatabaseManager } from '../../src/database-manager';

describe('openConnection test', () => {
  it('openConnection should return true', () => {
    let dbm: DatabaseManager = new DatabaseManager();
    let result: boolean = dbm.openConnection();
    expect(result).equal(true);
  });
});
describe('closeConnection test', () => {
  it('closeConnection should return true', () => {
    let dbm: DatabaseManager = new DatabaseManager();
    dbm.openConnection();
    let result: boolean = dbm.closeConnection();
    expect(result).equal(true);
  });
});
describe('executeQuery test', () => {
  it('should', () => {
    let dbm: DatabaseManager = new DatabaseManager();
    dbm.openConnection();
    let rows: any = dbm.executeQuery('SELECT id as id, name as name FROM objects');
    rows.array.forEach((row: any) => {
      console.log(row.name);
    });
    dbm.closeConnection();
    expect(true).equal(true);
  });
});
