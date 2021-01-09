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
    await itemRepo.removeTail('test');
  });
});

describe('item-get-exception-test', () => {
  it('should throw error', async () => {
    const isAdded = await itemRepo.addTail(testItem);
    expect(isAdded).equal(true);
    await expect(itemRepo.getTail('tree')).to.be.rejectedWith(Error);
    await itemRepo.removeTail('test');
  });
});

describe('item-remove-test', () => {
  it('should return true and throw error', async () => {
    await itemRepo.addTail(testItem);
    const isRemoved = await itemRepo.removeTail('test');
    expect(isRemoved).equal(true);
    await expect(itemRepo.getTail('test')).to.be.rejectedWith(Error);
  });
});

describe('item-remove-not-existing-object-test', () => {
  it('should return true', async () => {
    const isRemoved = await itemRepo.removeTail('tree');
    expect(isRemoved).equal(false);
  });
});

describe('item-update-test', () => {
  it('should return true and check if item was updated', async () => {
    await itemRepo.addTail(testItem);
    const beforeUpdateItem = await itemRepo.getTail('test');
    expect(beforeUpdateItem.canPlaceOn).equal(true);
    testItem.canPlaceOn = false;
    const updated = await itemRepo.updateTail(testItem);
    expect(updated).equal(true);
    const updatedItem = await itemRepo.getTail('test');
    expect(updatedItem.canPlaceOn).equal(false);
    await itemRepo.removeTail('test');
  });
});

describe('item-update-test', () => {
  it('should return false', async () => {
    const updated = await itemRepo.updateTail(testItem);
    expect(updated).equal(false);
  });
});

describe('item-getAll-test', () => {
  it('should return list of items', async () => {
    await itemRepo.addTail(testItem);
    const testItem2 = new Item();
    const material: Material = new Material();
    material.albedo = 4;
    material.density = 5;
    testItem2.id = 'test2';
    testItem2.widthNS = 1;
    testItem2.widthWE = 2;
    testItem2.height = 3;
    testItem2.canPlaceOn = true;
    testItem2.material = material;
    testItem2.price = 10;
    await itemRepo.addTail(testItem2);
    const listOfItems = await itemRepo.getAllTails();
    expect(listOfItems.length).equal(2);
    expect(listOfItems[0].id).equal('test2');
    expect(listOfItems[1].id).equal('test');
    await itemRepo.removeTail('test');
    await itemRepo.removeTail('test2');
  });
});

describe('item-getAll-empty-database-test', () => {
  it('should throw error', async () => {
    await expect(itemRepo.getAllTails()).to.be.rejectedWith(Error);
  });
});
