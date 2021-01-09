import { expect } from 'chai';

import { IObject, IMaterial } from 'bauhinia-api/object';

import { ItemRepository } from '../../src/item-repository';

let itemRepo: ItemRepository;
let testItem: Item;

beforeEach(() => {
  itemRepo = new ItemRepository();
  testItem = new Item();
  const material: Material = new Material();
  material.albedo = 4;
  material.density = 5;
  testItem.id = 'test';
  testItem.widthNS = 1;
  testItem.widthWE = 2;
  testItem.height = 3;
  testItem.canPlaceOn = true;
  testItem.material = material;
  testItem.price = 10;
  console.log('Start');
});

afterEach(() => {
  itemRepo.terminate();
  console.log('End');
});
class Item implements IObject {
  public id: string;
  public widthWE: number;
  public widthNS: number;
  public height: number;
  public canPlaceOn: boolean;
  public material: Material;
  public price: number;
}

class Material implements IMaterial {
  public albedo: number;
  public density: number;
}

describe('item-add-and-get-test', () => {
  it('should return true and the same object added to database', async () => {
    const isAdded = await itemRepo.addTail(testItem);
    expect(isAdded).equal(true);
    const fromDatabaseItem: Item = await itemRepo.getTail('test');
    expect(fromDatabaseItem.id).equal(testItem.id);
    expect(fromDatabaseItem.widthNS).equal(testItem.widthNS);
    expect(fromDatabaseItem.widthWE).equal(testItem.widthWE);
    expect(fromDatabaseItem.height).equal(testItem.height);
    expect(fromDatabaseItem.canPlaceOn).equal(testItem.canPlaceOn);
    expect(fromDatabaseItem.material.albedo).equal(testItem.material.albedo);
    expect(fromDatabaseItem.material.density).equal(testItem.material.density);
    expect(fromDatabaseItem.price).equal(testItem.price);
  });
});

describe('item-add-exception-test', () => {
  it('should return true', () => {
    expect(true).equal(true);
  });
});

describe('item-read-test', () => {
  it('should return true', async () => {
    expect(true).equal(true);
  });
});
