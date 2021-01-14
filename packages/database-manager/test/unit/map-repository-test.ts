import { expect } from 'chai';

import { IMap, IObjectOnMap } from 'bauhinia-api/map';

import { MapRepository } from '../../src/map-repository';

let testMapRepo: MapRepository;
let testMap: TestMap;

describe('map-test', () => {
  beforeEach(() => {
    testMapRepo = new MapRepository('test_map');
    testMap = new TestMap();
    testMap.id = 'test';
    testMap.height = 1;
    testMap.width = 2;
    testMap.login = 'login';
    testMap.isBlueprint = false;
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
    const fromDatabaseMap = await testMapRepo.getMap('test', 'login');
    await testMapRepo.removeMap('test', 'login');
    expect(isAdded).equal(true);
    expect(fromDatabaseMap.id).equal(testMap.id);
    expect(fromDatabaseMap.height).equal(testMap.height);
    expect(fromDatabaseMap.width).equal(testMap.width);
    expect(fromDatabaseMap.tiles.length).equal(testMap.tiles.length);
    expect(fromDatabaseMap.tiles[0].id).equal(testMap.tiles[0].id);
  }).timeout(5000);

  it('map-get-error-test', async () => {
    await expect(testMapRepo.getMap('a', 'login')).to.be.rejectedWith(Error);
  }).timeout(5000);

  it('map-remove-test', async () => {
    await testMapRepo.addMap(testMap);
    const isRemoved = await testMapRepo.removeMap('test', 'login');
    expect(isRemoved).equal(true);
  }).timeout(5000);

  it('map-remove-false-test', async () => {
    const isRemoved = await testMapRepo.removeMap('a', 'login');
    expect(isRemoved).equal(false);
  }).timeout(5000);

  it('map-update-test', async () => {
    await testMapRepo.addMap(testMap);
    const beforeUpdateMap = await testMapRepo.getMap('test', 'login');
    expect(beforeUpdateMap.height).equal(testMap.height);
    testMap.height = 4;
    const isUpdated = await testMapRepo.updateMap(testMap);
    const afterUpdateMap = await testMapRepo.getMap('test', 'login');
    await testMapRepo.removeMap('test', 'login');
    expect(isUpdated).equal(true);
    expect(afterUpdateMap.height).equal(4);
  }).timeout(5000);

  it('map-update-false-test', async () => {
    const isUpdated = await testMapRepo.updateMap(testMap);
    expect(isUpdated).equal(false);
  }).timeout(5000);

  it('map-getAllUserMaps-test', async () => {
    await testMapRepo.addMap(testMap);
    const testMap2 = new TestMap();
    testMap2.id = 'test2';
    testMap2.height = 1;
    testMap2.width = 2;
    testMap2.login = 'login';
    testMap2.isBlueprint = false;
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

    const testMap3 = new TestMap();
    testMap3.id = 'test3';
    testMap3.height = 1;
    testMap3.width = 2;
    testMap3.login = 'admin';
    testMap3.isBlueprint = false;
    const temp1: IObjectOnMap = {
      id: 'test3',
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
    testMap3.tiles = [];
    testMap3.tiles.push(temp1);
    await testMapRepo.addMap(testMap2);
    await testMapRepo.addMap(testMap3);
    const list = await testMapRepo.getAllUserMaps('login');
    await testMapRepo.removeMap('test', 'login');
    await testMapRepo.removeMap('test2', 'login');
    await testMapRepo.removeMap('test3', 'admin');
    expect(list.length).equal(2);
  }).timeout(5000);

  it('map-getAllUserMaps-error-test', async () => {
    await expect(testMapRepo.getAllUserMaps('a')).to.be.rejectedWith(Error);
  }).timeout(5000);

  it('map-getAllBlueprints-test', async () => {
    await testMapRepo.addMap(testMap);
    const testMap2 = new TestMap();
    testMap2.id = 'test2';
    testMap2.height = 1;
    testMap2.width = 2;
    testMap2.login = 'admin';
    testMap2.isBlueprint = true;
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

    const testMap3 = new TestMap();
    testMap3.id = 'test3';
    testMap3.height = 1;
    testMap3.width = 2;
    testMap3.login = 'admin';
    testMap3.isBlueprint = true;
    const temp1: IObjectOnMap = {
      id: 'test3',
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
    testMap3.tiles = [];
    testMap3.tiles.push(temp1);
    await testMapRepo.addMap(testMap2);
    await testMapRepo.addMap(testMap3);
    const list = await testMapRepo.getAllBlueprints();
    await testMapRepo.removeMap('test', 'login');
    await testMapRepo.removeMap('test2', 'admin');
    await testMapRepo.removeMap('test3', 'admin');
    expect(list.length).equal(2);
  }).timeout(5000);

  it('map-getAllUserMapsIds-test', async () => {
    await testMapRepo.addMap(testMap);
    const testMap2 = new TestMap();
    testMap2.id = 'test2';
    testMap2.height = 1;
    testMap2.width = 2;
    testMap2.login = 'login';
    testMap2.isBlueprint = false;
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

    const testMap3 = new TestMap();
    testMap3.id = 'test3';
    testMap3.height = 1;
    testMap3.width = 2;
    testMap3.login = 'admin';
    testMap3.isBlueprint = false;
    const temp1: IObjectOnMap = {
      id: 'test3',
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
    testMap3.tiles = [];
    testMap3.tiles.push(temp1);
    await testMapRepo.addMap(testMap2);
    await testMapRepo.addMap(testMap3);
    const list = await testMapRepo.getAllUserMapsIds('login');
    await testMapRepo.removeMap('test', 'login');
    await testMapRepo.removeMap('test2', 'login');
    await testMapRepo.removeMap('test3', 'admin');
    expect(list.length).equal(2);
  }).timeout(5000);

  it('map-getAllUserMapsIds-error-test', async () => {
    await expect(testMapRepo.getAllUserMapsIds('a')).to.be.rejectedWith(Error);
  }).timeout(5000);
});
class TestMap implements IMap {
  public login: string;
  public isBlueprint: boolean;
  public id: string;
  public height: number;
  public width: number;
  public tiles: IObjectOnMap[];
}
