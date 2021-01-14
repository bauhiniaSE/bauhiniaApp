import { expect } from 'chai';

import { IObject, IMaterial } from 'bauhinia-api/object';

import { TileRepository } from '../../src/tile-repository';

let itemRepo: TileRepository;
let testItem: Item;

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

describe('item-test', () => {
  beforeEach(() => {
    itemRepo = new TileRepository('test_tile');
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

  it('item-add-get-test', async () => {
    const isAdded = await itemRepo.addTile(testItem);
    expect(isAdded).equal(true);
    const fromDatabaseItem: IObject = await itemRepo.getTile('test');
    await itemRepo.removeTile('test');
    expect(fromDatabaseItem.id).equal(testItem.id);
    expect(fromDatabaseItem.widthNS).equal(testItem.widthNS);
    expect(fromDatabaseItem.widthWE).equal(testItem.widthWE);
    expect(fromDatabaseItem.height).equal(testItem.height);
    expect(fromDatabaseItem.canPlaceOn).equal(testItem.canPlaceOn);
    expect(fromDatabaseItem.material.albedo).equal(testItem.material.albedo);
    expect(fromDatabaseItem.material.density).equal(testItem.material.density);
    expect(fromDatabaseItem.price).equal(testItem.price);
  });

  it('item-get-error-test', async () => {
    await expect(itemRepo.getTile('a')).to.be.rejectedWith(Error);
  });

  it('item-remove-test', async () => {
    await itemRepo.addTile(testItem);
    const isRemoved = await itemRepo.removeTile('test');
    expect(isRemoved).equal(true);
    await expect(itemRepo.getTile('test')).to.be.rejectedWith(Error);
  });

  it('item-remove-false-test', async () => {
    const isRemoved = await itemRepo.removeTile('a');
    expect(isRemoved).equal(false);
  });

  it('item-update-test', async () => {
    await itemRepo.addTile(testItem);
    const beforeUpdateItem = await itemRepo.getTile('test');
    expect(beforeUpdateItem.canPlaceOn).equal(true);
    testItem.canPlaceOn = false;
    const updated = await itemRepo.updateTile(testItem);
    const updatedItem = await itemRepo.getTile('test');
    await itemRepo.removeTile('test');
    expect(updated).equal(true);
    expect(updatedItem.canPlaceOn).equal(false);
  });

  it('item-update-false-test', async () => {
    const updated = await itemRepo.updateTile(testItem);
    expect(updated).equal(false);
  });

  it('item-getAll-test', async () => {
    await itemRepo.addTile(testItem);
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
    await itemRepo.addTile(testItem2);
    const listOfItems = await itemRepo.getAllTiles();
    await itemRepo.removeTile('test');
    await itemRepo.removeTile('test2');
    expect(listOfItems.length).equal(2);
  });

  it('item-getAll-Error-test', async () => {
    await expect(itemRepo.getAllTiles()).to.be.rejectedWith(Error);
  });
});
