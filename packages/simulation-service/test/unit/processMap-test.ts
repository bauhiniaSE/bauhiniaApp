import { IMap } from 'bauhinia-api/map';
import { expect } from 'chai';

import { Direction } from '../../src/direction';
import { Facet } from '../../src/facet';
import { FacetList } from '../../src/facet-list';
import { Simulator } from '../../src/simulator';

describe('process map - test', () => {
  let facetCount: number = 0;

  it('crop facets by bubble grain', () => {
    const fl: FacetList = new FacetList();
    fl.addFacet(new Facet(20, 0, 10, 120, Direction.E));
    fl.cropFacetsByBubbles(50);
    expect(fl.facets.length).equal(3);

    let lowestFound: boolean = false;
    let middleFound: boolean = false;
    let uppestFound: boolean = false;
    fl.facets.forEach((facet) => {
      //console.log(facet.y, facet.width);
      if (facet.x === 20 && facet.height === 10 && facet.direction === Direction.E) {
        if (facet.y === 0 && facet.width === 50) lowestFound = true;
        else if (facet.y === 50 && facet.width === 50) middleFound = true;
        else if (facet.y === 100 && facet.width === 20) uppestFound = true;
      }
    });
    expect(lowestFound).to.be.true;
    expect(middleFound).to.be.true;
    expect(uppestFound).to.be.true;
  });

  it('simple processing', () => {
    const s: Simulator = new Simulator();
    const m: IMap = {
      id: '',
      height: 300,
      width: 300,
      tiles: [
        {
          id: 'gebouw',
          widthWE: 120,
          widthNS: 100,
          height: 10,

          canPlaceOn: false,
          material: {
            albedo: 1,
            density: 2,
          },
          price: 0,
          position: {
            x: 20,
            y: 0,
            layer: 3,
          },
        },
      ],
    };
    s.processMap(m);
    //s.facets.printAllFacets();

    let firstSampleFound: boolean = false;
    let secndSampleFound: boolean = false;
    let thirdSampleFound: boolean = false;
    s.facets.facets.forEach((facet) => {
      //console.log(facet.y, facet.width);
      if (
        facet.x === 50 &&
        facet.y === 100 &&
        facet.height === 10 &&
        facet.width === 50 &&
        facet.direction === Direction.N &&
        facet.bottom === 0
      )
        firstSampleFound = true;
      else if (
        facet.x === 20 &&
        facet.y === 0 &&
        facet.height === 50 &&
        facet.width === 30 &&
        facet.direction === Direction.TOP &&
        facet.bottom === 10
      )
        secndSampleFound = true;
      else if (
        facet.x === 140 &&
        facet.y === 50 &&
        facet.height === 10 &&
        facet.width === 50 &&
        facet.direction === Direction.E &&
        facet.bottom === 0
      )
        thirdSampleFound = true;
    });
    expect(firstSampleFound).to.be.true;
    expect(secndSampleFound).to.be.true;
    expect(thirdSampleFound).to.be.true;
  });

  it('complex processing', () => {
    const s: Simulator = new Simulator();
    const m: IMap = {
      id: '',
      height: 50,
      width: 50,
      tiles: [
        {
          id: 'gebouw',
          widthWE: 20,
          widthNS: 20,
          height: 100,

          canPlaceOn: false,
          material: {
            albedo: 0,
            density: 2,
          },
          price: 0,
          position: {
            x: 10,
            y: 15,
            layer: 1,
          },
        },
        {
          id: 'groend',
          widthWE: 50,
          widthNS: 50,

          canPlaceOn: true,
          material: {
            albedo: 1,
            density: 2,
          },
          price: 0,
          position: {
            x: 0,
            y: 0,
            layer: 0,
          },
        },
        {
          id: 'straat',
          widthWE: 30,
          widthNS: 10,

          canPlaceOn: false,
          material: {
            albedo: 0,
            density: 2,
          },
          price: 0,
          position: {
            x: 20,
            y: 40,
            layer: 1,
          },
        },
      ],
    };
    s.processMap(m);
    //s.facets.printAllFacets();
    let topArea: number = 0;
    let groundArea: number = 0;
    s.facets.facets.forEach((f) => {
      if (f.direction === Direction.TOP) topArea += f.width * f.height;
      if (f.direction === Direction.TOP && f.albedo === 1) groundArea += f.width * f.height;
    });
    expect(topArea).closeTo(2500, 0.5);
    expect(groundArea).closeTo(1800, 0.5);
    facetCount = s.facets.facets.length;
  });

  it('complex processing across bubbles', () => {
    const s: Simulator = new Simulator();
    const m: IMap = {
      id: '',
      height: 50,
      width: 100,
      tiles: [
        {
          id: 'gebouw',
          widthWE: 20,
          widthNS: 20,
          height: 100,

          canPlaceOn: false,
          material: {
            albedo: 0,
            density: 2,
          },
          price: 0,
          position: {
            x: 10,
            y: 15,
            layer: 1,
          },
        },
        {
          id: 'groend',
          widthWE: 100,
          widthNS: 50,

          canPlaceOn: true,
          material: {
            albedo: 1,
            density: 2,
          },
          price: 0,
          position: {
            x: 0,
            y: 0,
            layer: 0,
          },
        },
        {
          id: 'straat',
          widthWE: 30,
          widthNS: 10,

          canPlaceOn: false,
          material: {
            albedo: 0,
            density: 2,
          },
          price: 0,
          position: {
            x: 20,
            y: 40,
            layer: 1,
          },
        },
      ],
    };
    s.processMap(m);
    //s.facets.printAllFacets();
    let topArea: number = 0;
    let groundArea: number = 0;
    s.facets.facets.forEach((f) => {
      if (f.direction === Direction.TOP) topArea += f.width * f.height;
      if (f.direction === Direction.TOP && f.albedo === 1) groundArea += f.width * f.height;
    });
    expect(topArea).closeTo(5000, 0.5);
    expect(groundArea).closeTo(4300, 0.5);
    expect(s.facets.facets.length).equal(facetCount + 1);
  });
});
