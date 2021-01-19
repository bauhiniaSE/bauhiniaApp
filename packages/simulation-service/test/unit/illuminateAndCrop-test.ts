import { expect } from 'chai';

import { Direction } from '../../src/direction';
import { DirectionHandler } from '../../src/direction-handler';

import { Facet } from '../../src/facet';

import { FacetList } from '../../src/facet-list';
import { Parameters } from '../../src/technical-parameters';

describe('illuminate and crop - test', () => {
  it('facet cloning', () => {
    const f: Facet = new Facet(0, 10, 200, 100, Direction.S);
    const g: Facet = f.clone();
    expect(f.direction).equal(Direction.S);
    expect(g.direction).equal(Direction.S);
  });

  it('illumination', () => {
    const fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 0, 200, 100, Direction.S));
    expect(fl.facets[0].temperature).equal(Parameters.facetStartingTemperature);
    fl.illuminateAndCrop(60, Direction.S);
    expect(fl.facets[0].direction).equal(Direction.S);
    expect(fl.facets[0].temperature > Parameters.facetStartingTemperature).to.be.true;
  });

  it('illumination with evaporation', () => {
    const fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 0, 200, 100, Direction.S));
    fl.addFacet(new Facet(0, 0, 200, 100, Direction.S));
    fl.addFacet(new Facet(0, 0, 200, 100, Direction.S));
    fl.facets[1].evapot = true;
    fl.facets[2].albedo = 0.6;
    expect(fl.facets[0].temperature).equal(Parameters.facetStartingTemperature);
    fl.illuminateAndCrop(60, Direction.S);
    //console.log(fl.facets[0].temperature, fl.facets[1].temperature, fl.facets[2].temperature);
    expect(fl.facets[0].direction).equal(Direction.S);
    expect(fl.facets[0].temperature > Parameters.facetStartingTemperature).to.be.true;
    expect(fl.facets[0].temperature).greaterThan(fl.facets[1].temperature + 1);
    expect(fl.facets[0].temperature).greaterThan(fl.facets[2].temperature + 1);
  });

  it('illumination with horizontal crop', () => {
    const fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 0, 100, 100, Direction.E));
    fl.addFacet(new Facet(20, 0, 100, 100, Direction.W));
    expect(fl.facets.length).equal(2);
    fl.illuminateAndCrop(30, Direction.E);

    expect(fl.facets.length).equal(3);
    let shadowedCount: number = 0;
    let eastFacingCount: number = 0;
    let westFacingCount: number = 0;
    fl.facets.forEach((facet) => {
      if (facet.shadowed) shadowedCount++;
      if (facet.direction === Direction.E) eastFacingCount++;
      if (facet.direction === Direction.W) westFacingCount++;
    });
    expect(shadowedCount).equal(1);
    expect(eastFacingCount).equal(2);
    expect(westFacingCount).equal(1);
  });

  it('lambda modification test', () => {
    const facet: Facet = new Facet(0, 0, 0, 0, Direction.S, 30);
    const fl: FacetList = new FacetList();
    const lambda = (f: Facet) => {
      const g = f.clone();
      g.height = 10;
      f = g.clone();
      fl.facets.push(f);
    };
    lambda(facet);
    expect(fl.facets.length).equal(1);
    expect(fl.facets[0].height).equal(10);
  });

  it('east-illumination with vertical crop', () => {
    const fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 0, 200, 100, Direction.E));
    fl.addFacet(new Facet(20, 20, 100, 60, Direction.W));
    fl.illuminateAndCrop(30, Direction.E);
    expect(fl.facets.length).equal(5);

    let shadowedCount: number = 0;
    let eastFacingCount: number = 0;
    let westFacingCount: number = 0;
    fl.facets.forEach((facet) => {
      if (facet.shadowed) shadowedCount++;
      if (facet.direction === Direction.E) eastFacingCount++;
      if (facet.direction === Direction.W) westFacingCount++;
    });
    expect(shadowedCount).equal(1);
    expect(eastFacingCount).equal(4);
    expect(westFacingCount).equal(1);
  });

  it('south-illumination with vertical crop', () => {
    const fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 40, 200, 100, Direction.S));
    fl.addFacet(new Facet(20, 20, 100, 70, Direction.N));
    fl.illuminateAndCrop(30, Direction.S);
    expect(fl.facets.length).equal(5);

    let shadowedCount: number = 0;
    let southFacingCount: number = 0;
    let northFacingCount: number = 0;
    fl.facets.forEach((facet) => {
      if (facet.shadowed) shadowedCount++;
      if (facet.direction === Direction.S) southFacingCount++;
      if (facet.direction === Direction.N) northFacingCount++;
    });
    expect(shadowedCount).equal(1);
    expect(southFacingCount).equal(4);
    expect(northFacingCount).equal(1);
  });

  it('perpendicular facets do not shade each other', () => {
    const fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 0, 200, 100, Direction.E));
    fl.addFacet(new Facet(10, 50, 100, 50, Direction.N));
    fl.illuminateAndCrop(30, Direction.W);
    fl.illuminateAndCrop(30, Direction.S);
    expect(fl.facets.length).equal(2);

    let shadowedCount: number = 0;
    fl.facets.forEach((facet) => {
      if (facet.shadowed) shadowedCount++;
    });
    expect(shadowedCount).equal(0);
  });

  it('simpler illumination', () => {
    const fl: FacetList = new FacetList();
    fl.addFacet(new Facet(20, 20, 200, 50, Direction.S));
    fl.addFacet(new Facet(40, 0, 100, 40, Direction.N));
    fl.illuminateAndCrop(30, Direction.S);
    expect(fl.facets.length).equal(4);
  });

  it('multiple shadows on a single facet', () => {
    const fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 0, 100, 40, Direction.N));
    fl.addFacet(new Facet(20, 20, 200, 60, Direction.S));
    fl.addFacet(new Facet(50, 0, 100, 40, Direction.N));
    fl.illuminateAndCrop(30, Direction.S);
    //expect(fl.facets.length).equal(7);

    let shadowedCount: number = 0;
    fl.facets.forEach((facet) => {
      if (facet.shadowed) shadowedCount++;
    });
    expect(shadowedCount).equal(2);
  });

  it('cascading shadow casting', () => {
    const fl: FacetList = new FacetList();
    fl.addFacet(new Facet(60, 0, 100, 40, Direction.E));
    fl.addFacet(new Facet(0, 0, 100, 60, Direction.E));
    fl.addFacet(new Facet(80, 0, 100, 80, Direction.W));
    fl.illuminateAndCrop(45, Direction.W);

    let shadowedArea: number = 0;
    let illuminatedArea: number = 0;
    fl.facets.forEach((f) => {
      if (f.shadowed) shadowedArea += f.width * f.height;
      else illuminatedArea += f.width * f.height;
    });
    expect(shadowedArea).closeTo(3600, 0.5);
    expect(illuminatedArea).closeTo(14400, 0.5);
  });

  it('cascading shadow casting reversed', () => {
    const fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 0, 100, 60, Direction.E));
    fl.addFacet(new Facet(60, 0, 100, 40, Direction.E));
    fl.addFacet(new Facet(80, 0, 100, 80, Direction.W));
    fl.illuminateAndCrop(45, Direction.W);

    let shadowedArea: number = 0;
    let illuminatedArea: number = 0;
    fl.facets.forEach((f) => {
      if (f.shadowed) shadowedArea += f.width * f.height;
      else illuminatedArea += f.width * f.height;
    });
    expect(shadowedArea).closeTo(3600, 0.8);
    expect(illuminatedArea).closeTo(14400, 0.8);
  });

  it('simple roof shading', () => {
    const fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 0, 100, 60, Direction.E));
    fl.addFacet(new Facet(20, 10, 45, 80, Direction.W));
    fl.addFacet(new Facet(20, 10, 80, 120, Direction.TOP, 45));
    fl.illuminateAndCrop(30, Direction.W);
    expect(fl.facets.length).equal(6);

    let shadowedCount: number = 0;
    fl.facets.forEach((facet) => {
      if (facet.shadowed) shadowedCount++;
    });
    expect(shadowedCount).equal(2);

    let shadowedArea: number = 0;
    let illuminatedArea: number = 0;
    fl.facets.forEach((f) => {
      if (f.shadowed) shadowedArea += f.width * f.height;
      else illuminatedArea += f.width * f.height;
    });
    expect(shadowedArea).closeTo(6013, 0.5);
    expect(illuminatedArea).closeTo(13187, 0.5);
  });

  it('complex roof shading', () => {
    const fl: FacetList = new FacetList();
    fl.addFacet(new Facet(120, 10, 80, 20, Direction.W));
    fl.addFacet(new Facet(100, 0, 30, 50, Direction.E));
    fl.addFacet(new Facet(0, 0, 50, 100, Direction.TOP, 30));
    fl.illuminateAndCrop(45, Direction.E);
    expect(fl.facets.length).equal(8);

    let shadowedCount: number = 0;
    fl.facets.forEach((facet) => {
      if (facet.shadowed) shadowedCount++;
    });
    expect(shadowedCount).equal(2);
  });

  it('full simulation', () => {
    const fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 0, 60, 80, Direction.W));
    fl.addFacet(new Facet(0, 0, 60, 10, Direction.S));
    fl.addFacet(new Facet(10, 0, 60, 80, Direction.E));
    fl.addFacet(new Facet(0, 80, 60, 10, Direction.N));
    fl.addFacet(new Facet(0, 0, 80, 10, Direction.TOP, 60));

    fl.addFacet(new Facet(40, 10, 30, 80, Direction.W));
    fl.addFacet(new Facet(40, 10, 30, 10, Direction.S));
    fl.addFacet(new Facet(50, 10, 30, 80, Direction.E));
    fl.addFacet(new Facet(40, 90, 30, 10, Direction.N));
    fl.addFacet(new Facet(40, 10, 80, 10, Direction.TOP, 30));

    fl.addFacet(new Facet(0, 120, 10, 10, Direction.W));
    fl.addFacet(new Facet(0, 120, 10, 10, Direction.S));
    fl.addFacet(new Facet(10, 120, 10, 10, Direction.E));
    fl.addFacet(new Facet(0, 130, 10, 10, Direction.N));
    fl.addFacet(new Facet(0, 120, 10, 10, Direction.TOP, 10));
    fl.illuminateAndCrop(20, Direction.W);

    let shadowedArea: number = 0;
    let illuminatedArea: number = 0;
    fl.facets.forEach((f) => {
      if (f.shadowed) shadowedArea += f.width * f.height;
      else illuminatedArea += f.width * f.height;
    });
    expect(shadowedArea).closeTo(2800, 0.5);
    expect(illuminatedArea).closeTo(15500, 0.5);
  });

  it('direction handler test', () => {
    expect(DirectionHandler.areOpposite(Direction.S, Direction.N)).to.be.true;
    expect(DirectionHandler.areOpposite(Direction.E, Direction.W)).to.be.true;

    expect(DirectionHandler.areOpposite(Direction.TOP, Direction.N)).to.be.false;
    expect(DirectionHandler.areOpposite(Direction.TOP, Direction.S)).to.be.false;
    expect(DirectionHandler.areOpposite(Direction.TOP, Direction.W)).to.be.false;
    expect(DirectionHandler.areOpposite(Direction.TOP, Direction.E)).to.be.false;
    expect(DirectionHandler.areOpposite(Direction.N, Direction.TOP)).to.be.false;
    expect(DirectionHandler.areOpposite(Direction.S, Direction.TOP)).to.be.false;
    expect(DirectionHandler.areOpposite(Direction.W, Direction.TOP)).to.be.false;
    expect(DirectionHandler.areOpposite(Direction.E, Direction.TOP)).to.be.false;

    expect(DirectionHandler.areOpposite(Direction.W, Direction.N)).to.be.false;
  });
});
