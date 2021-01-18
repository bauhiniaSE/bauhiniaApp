import { expect } from 'chai';

import { IMap, IObjectOnMap } from 'bauhinia-api/map';

import { MapRepository } from '../../src/map-repository';

let testMapRepo: MapRepository;
let testMap: TestMap;

describe('map-test', () => {
  beforeEach(() => {
    testMapRepo = new MapRepository();
    testMap = new TestMap();
    testMap.id = 'test';
    testMap.height = 1;
    testMap.width = 2;
    testMap.login = 'login';
    testMap.isBlueprint = false;
    const temp: IObjectOnMap = {
      id: 'test',
      image: '',
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
    const isAdded = await testMapRepo.updateMap(testMap);
    const fromDatabaseMap = await testMapRepo.getMap('test', 'login');
    expect(fromDatabaseMap).not.equal(400);
    await testMapRepo.removeMap('test', 'login');
    expect(isAdded).equal(0);
    if (fromDatabaseMap !== 400) {
      expect(fromDatabaseMap.id).equal(testMap.id);
      expect(fromDatabaseMap.height).equal(testMap.height);
      expect(fromDatabaseMap.width).equal(testMap.width);
      expect(fromDatabaseMap.tiles.length).equal(testMap.tiles.length);
      expect(fromDatabaseMap.tiles[0].id).equal(testMap.tiles[0].id);
    }
  }).timeout(5000);

  it('map-get-error-test', async () => {
    expect(await testMapRepo.getMap('a', 'login')).equal(400);
  }).timeout(5000);

  it('map-remove-test', async () => {
    await testMapRepo.updateMap(testMap);
    const isRemoved = await testMapRepo.removeMap('test', 'login');
    expect(isRemoved).equal(0);
  }).timeout(5000);

  it('map-remove-false-test', async () => {
    const isRemoved = await testMapRepo.removeMap('a', 'login');
    expect(isRemoved).equal(200);
  }).timeout(5000);

  it('map-update-test', async () => {
    await testMapRepo.updateMap(testMap);
    const beforeUpdateMap = await testMapRepo.getMap('test', 'login');
    expect(beforeUpdateMap).not.equal(400);
    if (beforeUpdateMap !== 400) {
      expect(beforeUpdateMap.height).equal(testMap.height);
      testMap.height = 4;
      const isUpdated = await testMapRepo.updateMap(testMap);
      const afterUpdateMap = await testMapRepo.getMap('test', 'login');
      await testMapRepo.removeMap('test', 'login');
      expect(isUpdated).equal(0);
      expect(afterUpdateMap).not.equal(400);
      if (afterUpdateMap !== 400) {
        expect(afterUpdateMap.height).equal(4);
      }
    }
  }).timeout(5000);

  it('map-getAllUserMaps-test', async () => {
    await testMapRepo.updateMap(testMap);
    const testMap2 = new TestMap();
    testMap2.id = 'test2';
    testMap2.height = 1;
    testMap2.width = 2;
    testMap2.login = 'login';
    testMap2.isBlueprint = false;
    const temp: IObjectOnMap = {
      id: 'test2',
      image: '',
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
      image: '',
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
    await testMapRepo.updateMap(testMap2);
    await testMapRepo.updateMap(testMap3);
    const list = await testMapRepo.getAllUserMaps('login');
    await testMapRepo.removeMap('test', 'login');
    await testMapRepo.removeMap('test2', 'login');
    await testMapRepo.removeMap('test3', 'admin');
    expect(list.length).equal(2);
  }).timeout(5000);

  it('map-getAllUserMaps-error-test', async () => {
    expect(await testMapRepo.getAllUserMaps('a')).deep.equal([]);
  }).timeout(5000);

  it('map-getAllBlueprints-test', async () => {
    await testMapRepo.updateMap(testMap);
    const testMap2 = new TestMap();
    testMap2.id = 'test2';
    testMap2.height = 1;
    testMap2.width = 2;
    testMap2.login = 'admin';
    testMap2.isBlueprint = true;
    const temp: IObjectOnMap = {
      id: 'test2',
      image: '',
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
      image: '',
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
    await testMapRepo.updateMap(testMap2);
    await testMapRepo.updateMap(testMap3);
    const list = await testMapRepo.getAllBlueprints();
    await testMapRepo.removeMap('test', 'login');
    await testMapRepo.removeMap('test2', 'admin');
    await testMapRepo.removeMap('test3', 'admin');
    expect(list.length).equal(2);
  }).timeout(5000);

  it('map-getAllUserMapsIds-test', async () => {
    await testMapRepo.updateMap(testMap);
    const testMap2 = new TestMap();
    testMap2.id = 'test2';
    testMap2.height = 1;
    testMap2.width = 2;
    testMap2.login = 'login';
    testMap2.isBlueprint = false;
    const temp: IObjectOnMap = {
      id: 'test2',
      image: '',
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
      image: '',
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
    await testMapRepo.updateMap(testMap2);
    await testMapRepo.updateMap(testMap3);
    const list = await testMapRepo.getAllUserMapsIds('login');
    await testMapRepo.removeMap('test', 'login');
    await testMapRepo.removeMap('test2', 'login');
    await testMapRepo.removeMap('test3', 'admin');
    expect(list.length).equal(2);
  }).timeout(5000);

  it('map-getAllUserMapsIds-error-test', async () => {
    expect(await testMapRepo.getAllUserMapsIds('a')).deep.equal([]);
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
