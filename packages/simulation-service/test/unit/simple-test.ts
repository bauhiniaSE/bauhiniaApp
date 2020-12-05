import { expect } from 'chai';

import { Direction } from '../../src/direction';

import { Facet } from '../../src/facet';

import { FacetList, Overlapper } from '../../src/facetList';

describe('test', () => {
  it('facet cloning', () => {
    let f: Facet = new Facet(0, 10, 200, 100, Direction.S);
    let g: Facet = f.clone();
    expect(f.direction).equal(Direction.S);
    expect(g.direction).equal(Direction.S);
  });

  it('illumination', () => {
    let fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 0, 200, 100, Direction.S));
    expect(fl.facets[0].temperature).equal(0);
    fl.illuminateAndCrop(60, Direction.S);
    expect(fl.facets[0].direction).equal(Direction.S);
    expect(fl.facets[0].temperature > 0).to.be.true;
  });

  it('illumination with horizontal crop', () => {
    let fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 0, 100, 100, Direction.E));
    fl.addFacet(new Facet(20, 0, 100, 100, Direction.W));
    expect(fl.facets.length).equal(2);
    fl.illuminateAndCrop(30, Direction.E);

    expect(fl.facets.length).equal(3);
    expect(fl.facets[1].shadowed).to.be.true;
    expect(fl.facets[1].direction).equal(Direction.E);
    expect(fl.facets[1].temperature > 0).to.be.false;
    expect(fl.facets[2].shadowed).to.be.false;
    expect(fl.facets[2].direction).equal(Direction.E);
    expect(fl.facets[2].temperature > 0).to.be.true;

    expect(fl.facets[1].height).closeTo(88.05, 0.5);
    expect(fl.facets[2].height).closeTo(11.5, 0.5);
  });

  it('east-illumination with vertical crop', () => {
    let fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 0, 200, 100, Direction.E));
    fl.addFacet(new Facet(20, 20, 100, 60, Direction.W));
    fl.illuminateAndCrop(30, Direction.E);
    expect(fl.facets.length).equal(5);

    expect(fl.facets[1].shadowed).to.be.false;
    expect(fl.facets[1].width).equal(20);
    expect(fl.facets[1].height).equal(200);
    expect(fl.facets[2].shadowed).to.be.false;
    expect(fl.facets[2].width).equal(20);
    expect(fl.facets[2].height).equal(200);

    expect(fl.facets[3].shadowed).to.be.true;
    expect(fl.facets[3].width).equal(60);
    expect(fl.facets[3].height).closeTo(88.05, 0.5);

    expect(fl.facets[4].shadowed).to.be.false;
    expect(fl.facets[4].width).equal(60);
    expect(fl.facets[4].height).closeTo(111.5, 0.5);
  });

  it('south-illumination with vertical crop', () => {
    let fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 40, 200, 100, Direction.S));
    fl.addFacet(new Facet(20, 20, 100, 70, Direction.N));
    fl.illuminateAndCrop(30, Direction.S);
    expect(fl.facets.length).equal(5);

    expect(fl.facets[1].shadowed).to.be.false;
    expect(fl.facets[1].width).equal(20);
    expect(fl.facets[1].height).equal(200);
    expect(fl.facets[2].shadowed).to.be.false;
    expect(fl.facets[2].width).equal(10);
    expect(fl.facets[2].height).equal(200);

    expect(fl.facets[3].shadowed).to.be.true;
    expect(fl.facets[3].width).equal(70);
    expect(fl.facets[3].height).closeTo(88.05, 0.5);

    expect(fl.facets[4].shadowed).to.be.false;
    expect(fl.facets[4].width).equal(70);
    expect(fl.facets[4].height).closeTo(111.5, 0.5);
  });

  it('perpendicular facets do not shade each other', () => {
    let fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 0, 200, 100, Direction.E));
    fl.addFacet(new Facet(10, 50, 100, 50, Direction.N));
    fl.illuminateAndCrop(30, Direction.W);
    fl.illuminateAndCrop(30, Direction.S);
    expect(fl.facets.length).equal(2);

    expect(fl.facets[0].shadowed).to.be.false;
    expect(fl.facets[1].shadowed).to.be.false;
  });

  it('simpler illumination', () => {
    let fl: FacetList = new FacetList();
    fl.addFacet(new Facet(40, 0, 100, 40, Direction.N));
    fl.addFacet(new Facet(20, 20, 200, 50, Direction.S));
    fl.illuminateAndCrop(30, Direction.S);
    expect(fl.facets.length).equal(4);
  });

  it('multiple shadows on a single facet', () => {
    let fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 0, 100, 40, Direction.N));
    fl.addFacet(new Facet(20, 20, 200, 60, Direction.S));
    fl.addFacet(new Facet(50, 0, 100, 40, Direction.N));
    fl.illuminateAndCrop(30, Direction.S);
    expect(fl.facets.length).equal(7);

    let shadowedCount: number = 0;
    fl.facets.forEach((facet) => {
      if (facet.shadowed) shadowedCount++;
    });
    expect(shadowedCount).equal(2);
  });

  it('cascading shadow casting', () => {
    let fl: FacetList = new FacetList();
    fl.addFacet(new Facet(60, 0, 100, 40, Direction.E));
    fl.addFacet(new Facet(0, 0, 100, 60, Direction.E));
    fl.addFacet(new Facet(80, 0, 100, 80, Direction.W));
    fl.illuminateAndCrop(45, Direction.W);
    //fl.printAllFacets();
    expect(fl.facets.length).equal(7);

    let shadowedCount: number = 0;
    fl.facets.forEach((f) => {
      if (f.shadowed && f.x == 80 && f.y == 0 && f.width == 40 && f.height == 80) shadowedCount++;
    });
    expect(shadowedCount).equal(1);

    fl.facets.forEach((f) => {
      if (f.shadowed && f.x == 80 && f.y == 40 && f.width == 20 && f.height == 20) shadowedCount++;
    });
    expect(shadowedCount).equal(1);
  });

  it('cascading shadow casting reversed', () => {
    let fl: FacetList = new FacetList();
    fl.addFacet(new Facet(0, 0, 100, 60, Direction.E));
    fl.addFacet(new Facet(60, 0, 100, 40, Direction.E));
    fl.addFacet(new Facet(80, 0, 100, 80, Direction.W));
    fl.illuminateAndCrop(45, Direction.W);
    //fl.printAllFacets();
    expect(fl.facets.length).equal(7);

    let shadowedCount: number = 0;
    fl.facets.forEach((f) => {
      if (f.shadowed && f.x == 80 && f.y == 0 && f.width == 40 && f.height == 80) shadowedCount++;
    });
    expect(shadowedCount).equal(1);

    fl.facets.forEach((f) => {
      if (f.shadowed && f.x == 80 && f.y == 40 && f.width == 20 && f.height == 20) shadowedCount++;
    });
    expect(shadowedCount).equal(1);
  });

  it('overlapper test', () => {
    expect(Overlapper.checkOverlay(0, 10, 2, 8)).to.be.true;
    expect(Overlapper.checkOverlay(5, 10, 2, 8)).to.be.true;
    expect(Overlapper.checkOverlay(0, 5, 2, 8)).to.be.true;
    expect(Overlapper.checkOverlay(2, 8, 0, 5)).to.be.true;

    expect(Overlapper.checkOverlay(0, 4, 6, 8)).to.be.false;
    expect(Overlapper.checkOverlay(6, 9, 2, 4)).to.be.false;
  });
});
