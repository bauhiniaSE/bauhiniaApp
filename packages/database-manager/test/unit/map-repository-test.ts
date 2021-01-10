import { expect } from 'chai';

import { IMap, IObjectOnMap } from 'bauhinia-api/map';

import { MapRepository } from '../../src/map-repository';

let testMapRepo: MapRepository;
let testMap: TestMap;
/*
beforeEach(() => {
  testMapRepo = new MapRepository();
  testMap = new TestMap();
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
  testMap.tiles.push(temp);
  console.log('Start');
});

afterEach(() => {
  testMapRepo.terminate();
  console.log('End');
});
*/

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

  it('should return true', async () => {
    const isAdded = await testMapRepo.addMap(testMap);
    expect(isAdded).equal(true);
  });
});

class TestMap implements IMap {
  public id: string;
  public height: number;
  public width: number;
  public tiles: IObjectOnMap[];
}
