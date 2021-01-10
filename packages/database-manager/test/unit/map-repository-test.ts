import { expect } from 'chai';

import { IMap, IObjectOnMap } from 'bauhinia-api/map';

import { MapRepository } from '../../src/map-repository';

let testMapRepo: MapRepository;
let testMap: TestMap;

describe('map-add-test', () => {
  beforeEach(() => {
    testMapRepo = new MapRepository();
    testMap = new TestMap();
    testMap.id = 'test';
    testMap.height = 1;
    testMap.width = 2;
    const temp: IObjectOnMap = {
      id: 'test',
      widthWE: 1,
      widthNS: 2,
      height: 1,

      canPlaceOn: true,
      material: {
        albedo: 1,
        density: 2,
      },
      price: 10,
      position: {
        x: 1,
        y: 2,
        layer: 3,
      },
    };
    testMap.tiles = [];
    testMap.tiles.push(temp);
    console.log('Start');
  });

  afterEach(() => {
    testMapRepo.terminate();
    console.log('End');
  });

  it('map-add-get-test', async () => {
    const isAdded = await testMapRepo.addMap(testMap);
    const fromDatabaseMap = await testMapRepo.getMap('test');
    await testMapRepo.removeMap('test');
    expect(isAdded).equal(true);
    expect(fromDatabaseMap.id).equal(testMap.id);
    expect(fromDatabaseMap.height).equal(testMap.height);
    expect(fromDatabaseMap.width).equal(testMap.width);
    expect(fromDatabaseMap.tiles.length).equal(testMap.tiles.length);
    expect(fromDatabaseMap.tiles[0].id).equal(testMap.tiles[0].id);
  });

  it('map-get-error-test', async () => {
    await expect(testMapRepo.getMap('a')).to.be.rejectedWith(Error);
  });

  it('map-remove-test', async () => {
    await testMapRepo.addMap(testMap);
    const isRemoved = await testMapRepo.removeMap('test');
    expect(isRemoved).equal(true);
  });

  it('map-remove-false-test', async () => {
    const isRemoved = await testMapRepo.removeMap('a');
    expect(isRemoved).equal(false);
  });

  it('map-update-test', async () => {
    await testMapRepo.addMap(testMap);
    const beforeUpdateMap = await testMapRepo.getMap('test');
    expect(beforeUpdateMap.height).equal(testMap.height);
    testMap.height = 4;
    const isUpdated = await testMapRepo.updateMap(testMap);
    const afterUpdateMap = await testMapRepo.getMap('test');
    await testMapRepo.removeMap('test');
    expect(isUpdated).equal(true);
    expect(afterUpdateMap.height).equal(4);
  });

  it('map-update-false-test', async () => {
    const isUpdated = await testMapRepo.updateMap(testMap);
    expect(isUpdated).equal(false);
  });

  it('map-getAll-test', async () => {
    await testMapRepo.addMap(testMap);
    const testMap2 = new TestMap();
    testMap2.id = 'test2';
    testMap2.height = 1;
    testMap2.width = 2;
    const temp: IObjectOnMap = {
      id: 'test2',
      widthWE: 1,
      widthNS: 2,
      height: 1,

      canPlaceOn: true,
      material: {
        albedo: 1,
        density: 2,
      },
      price: 10,
      position: {
        x: 1,
        y: 2,
        layer: 3,
      },
    };
    testMap2.tiles = [];
    testMap2.tiles.push(temp);
    await testMapRepo.addMap(testMap2);
    const list = await testMapRepo.getAllMaps();
    await testMapRepo.removeMap('test');
    await testMapRepo.removeMap('test2');
    expect(list.length).equal(2);
  });

  it('map-getAll-error-test', async () => {
    await expect(testMapRepo.getAllMaps()).to.be.rejectedWith(Error);
  });
});

class TestMap implements IMap {
  public id: string;
  public height: number;
  public width: number;
  public tiles: IObjectOnMap[];
}
