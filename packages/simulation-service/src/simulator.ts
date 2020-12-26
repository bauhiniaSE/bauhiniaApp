/* eslint-disable prefer-const */
import { IMap } from 'bauhinia-api/map';

import { BubbleList } from './bubble-list';

import { Direction } from './direction';
import { Facet } from './facet';
import { FacetList } from './facet-list';
import { ISimulationService } from './isimulation';
import { Weather } from './weather-constants';

export class Simulator implements ISimulationService {
  public facets: FacetList;
  public bubbles: BubbleList;

  public simulateFromScratch(map: IMap, sunDirection: Direction): void {
    this.processMap(map);
    this.facets.illuminateAndCrop(Weather.sunlightAngle, sunDirection);
    this.facets.facetHeatTransfer();
    throw new Error('Method not finished.');
  }
  public simulateFromCache(map: IMap, sunDirection: Direction): void {
    throw new Error('Method not implemented.');
  }
  public getTemperature(x: number, y: number, altitude?: number): number {
    throw new Error('Method not implemented.');
  }

  public processMap(map: IMap): void {
    map.tiles.forEach((building) => {
      if (building.height !== undefined) {
        this.facets.addFacet(
          new Facet(building.position.x, building.position.y, building.height, building.widthNS, Direction.W)
        );
        this.facets.addFacet(
          new Facet(building.position.x, building.position.y, building.height, building.widthWE, Direction.S)
        );
        this.facets.addFacet(
          new Facet(
            building.position.x + building.widthWE,
            building.position.y,
            building.height,
            building.widthNS,
            Direction.E
          )
        );
        this.facets.addFacet(
          new Facet(
            building.position.x,
            building.position.y + building.widthNS,
            building.height,
            building.widthWE,
            Direction.N
          )
        );
        this.facets.addFacet(
          new Facet(building.position.x, building.position.y, building.widthNS, building.widthWE, Direction.TOP)
        );
      }
    });

    /*let minX: number = map.tiles[0].position.x;
    let maxX: number = map.tiles[0].position.x + map.tiles[0].widthWE;
    let minY: number = map.tiles[0].position.y;
    let maxY: number = map.tiles[0].position.y + map.tiles[0].widthNS;*/
  }
}
