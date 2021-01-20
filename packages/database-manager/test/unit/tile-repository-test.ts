import { expect } from 'chai';

import { IMaterial } from 'bauhinia-api/object';

import { TileRepository, Item } from '../../src/tile-repository';

let itemRepo: TileRepository;
let testItem: Item;

class Material implements IMaterial {
  public albedo: number;
  public density: number;
  public plant: boolean = true;
}

describe('tile-test', () => {
  beforeEach(() => {
    itemRepo = new TileRepository();
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

  it('tile-add-get-test', async () => {
    const isAdded = await itemRepo.updateTile(testItem);
    expect(isAdded).equal(0);
    const fromDatabaseItem = await itemRepo.getTile('test');
    expect(fromDatabaseItem).not.equal(400);
    if (fromDatabaseItem !== 400) {
      await itemRepo.removeTile('test');
      expect(fromDatabaseItem.id).equal(testItem.id);
      expect(fromDatabaseItem.widthNS).equal(testItem.widthNS);
      expect(fromDatabaseItem.widthWE).equal(testItem.widthWE);
      expect(fromDatabaseItem.height).equal(testItem.height);
      expect(fromDatabaseItem.canPlaceOn).equal(testItem.canPlaceOn);
      expect(fromDatabaseItem.material.albedo).equal(testItem.material.albedo);
      expect(fromDatabaseItem.material.density).equal(testItem.material.density);
      expect(fromDatabaseItem.price).equal(testItem.price);
    }
  }).timeout(5000);

  it('tile-get-error-test', async () => {
    expect(await itemRepo.getTile('a')).equal(400);
  }).timeout(5000);

  it('tile-remove-test', async () => {
    await itemRepo.updateTile(testItem);
    const isRemoved = await itemRepo.removeTile('test');
    expect(isRemoved).equal(0);
    expect(await itemRepo.getTile('test')).equal(400);
  }).timeout(5000);

  it('tile-remove-false-test', async () => {
    const isRemoved = await itemRepo.removeTile('a');
    expect(isRemoved).equal(400);
  }).timeout(5000);

  it('tile-update-test', async () => {
    await itemRepo.updateTile(testItem);
    const beforeUpdateItem = await itemRepo.getTile('test');
    expect(beforeUpdateItem).not.equal(400);
    if (beforeUpdateItem !== 400) {
      expect(beforeUpdateItem.canPlaceOn).equal(true);
      testItem.canPlaceOn = false;
      const updated = await itemRepo.updateTile(testItem);
      const updatedItem = await itemRepo.getTile('test');
      expect(updatedItem).not.equal(400);
      if (updatedItem !== 400) {
        await itemRepo.removeTile('test');
        expect(updated).equal(0);
        expect(updatedItem.canPlaceOn).equal(false);
      }
    }
  }).timeout(5000);

  it('tile-getAll-test', async () => {
    await itemRepo.updateTile(testItem);
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
    await itemRepo.updateTile(testItem2);
    const listOfItems = await itemRepo.getAllTiles();
    await itemRepo.removeTile('test');
    await itemRepo.removeTile('test2');
    expect(listOfItems.length).greaterThan(0);
  }).timeout(5000);
});
