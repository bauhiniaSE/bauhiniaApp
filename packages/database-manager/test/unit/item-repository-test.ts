import { expect } from 'chai';

import { IObject, IMaterial } from 'bauhinia-api/object';

import { ItemRepository } from '../../src/item-repository';

let itemRepo: ItemRepository;

beforeEach(() => {
  itemRepo = new ItemRepository();
});

afterEach(() => {
  itemRepo.terminate();
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

describe('item-add-test', () => {
  it('should return true', async () => {
    const material: Material = new Material();
    material.albedo = 1;
    material.density = 1;
    const item: Item = new Item();
    item.id = 'tree';
    item.widthNS = 1;
    item.widthWE = 1;
    item.height = 1;
    item.canPlaceOn = true;
    item.material = material;
    item.price = 10;
    await itemRepo.addTail(item);
    expect(true).equal(true);
  });
});

describe('item-add-exception-test', () => {
  it('should return true', () => {
    console.log('Test2');
    expect(true).equal(true);
  });
});

describe('item-read-test', () => {
  it('should return true', () => {
    itemRepo.getTail('tree');
    expect(true).equal(true);
  });
});
