/* eslint-disable prefer-const */
import { IMap, IObjectOnMap } from 'bauhinia-api/map';

import { Bubble } from './bubble';

import { BubbleList } from './bubble-list';

import { Direction } from './direction';
import { Facet, HowToCrop } from './facet';
import { FacetList } from './facet-list';
import { ISimulationService } from './isimulation';
import { Parameters } from './technical-parameters';
import { Weather } from './weather-constants';

export class Simulator implements ISimulationService {
  public facets: FacetList = new FacetList();
  public bubbles: BubbleList = new BubbleList();

  public simulateFromScratch(map: IMap, sunDirection: Direction, sunlightAngle?: number): void {
    Weather.sunlightAngle = sunlightAngle || 60;
    this.processMap(map);
    if (this.facets.facets.length > 0) {
      this.facets.illuminateAndCrop(Weather.sunlightAngle, sunDirection);
      this.facets.facetHeatTransfer();
      this.bubbles.horizontalHeatTransfer();
    }
  }

  public getTemperature(x: number, y: number, altitude?: number): number {
    return this.bubbles.findTemperatureAtXY(x, y);
  }

  public processMap(map: IMap): void {
    let buildings3D: IObjectOnMap[] = [];
    let groundToCrop: IObjectOnMap[] = [];
    let groundReady: IObjectOnMap[] = [];

    map.tiles.forEach((object) => {
      if (object.height !== undefined && object.height !== 0) buildings3D.push(object);
      else if (!object.canPlaceOn) groundReady.push(object);
      else groundToCrop.push(object);
    });

    let groundFList: FacetList = new FacetList();
    let overlappers: FacetList = new FacetList();

    groundToCrop.forEach((surface) => {
      groundFList.addFacet(
        new Facet(
          surface.position.x,
          surface.position.y,
          surface.widthNS,
          surface.widthWE,
          Direction.TOP,
          0,
          surface.material.albedo,
          false,
          surface.material.density
        )
      );
    });

    groundReady.forEach((surface) => {
      overlappers.addFacet(
        new Facet(
          surface.position.x,
          surface.position.y,
          surface.widthNS,
          surface.widthWE,
          Direction.TOP,
          0,
          surface.material.albedo,
          false,
          surface.material.density
        )
      );
    });

    buildings3D.forEach((building) => {
      if (building.height !== undefined) {
        this.facets.addFacet(
          new Facet(
            building.position.x,
            building.position.y,
            building.height,
            building.widthNS,
            Direction.W,
            0,
            building.material.albedo,
            false,
            building.material.density
          )
        );
        this.facets.addFacet(
          new Facet(
            building.position.x,
            building.position.y,
            building.height,
            building.widthWE,
            Direction.S,
            0,
            building.material.albedo,
            false,
            building.material.density
          )
        );
        this.facets.addFacet(
          new Facet(
            building.position.x + building.widthWE,
            building.position.y,
            building.height,
            building.widthNS,
            Direction.E,
            0,
            building.material.albedo,
            false,
            building.material.density
          )
        );
        this.facets.addFacet(
          new Facet(
            building.position.x,
            building.position.y + building.widthNS,
            building.height,
            building.widthWE,
            Direction.N,
            0,
            building.material.albedo,
            false,
            building.material.density
          )
        );
        overlappers.addFacet(
          new Facet(
            building.position.x,
            building.position.y,
            building.widthNS,
            building.widthWE,
            Direction.TOP,
            building.height,
            building.material.albedo,
            false,
            building.material.density
          )
        );

        let counter: number = 0;
        let timeLimit: number = (groundFList.facets.length + overlappers.facets.length) * Parameters.loopLimitFactor;
        let halfResult: Facet[] = [];

        this.facets.facets = this.facets.facets.concat(overlappers.facets);
        this.facets.cropFacetsByBubbles();
        groundFList.cropFacetsByBubbles();

        while (groundFList.facets.length > 0 && counter < timeLimit) {
          counter++;
          const floor: Facet = groundFList.facets.shift() || new Facet(-1, 0, -1, 0, Direction.N);
          floor.howToCrop = HowToCrop.ROOFY_BY_X;
          if (floor.direction === Direction.TOP) {
            let uncropped: boolean = true;
            overlappers.facets.forEach((overlapper) => {
              if (floor.y < overlapper.y + overlapper.height && floor.y + floor.height > overlapper.y) {
                if (
                  floor.x < overlapper.x + overlapper.width &&
                  floor.x + floor.width > overlapper.x + overlapper.width &&
                  uncropped
                ) {
                  floor.crop(overlapper.x + overlapper.width);
                  groundFList.facets.push(floor.lowerHalf);
                  groundFList.facets.push(floor.upperHalf);
                  uncropped = false;
                } else if (floor.x + floor.width > overlapper.x && floor.x < overlapper.x && uncropped) {
                  floor.crop(overlapper.x);
                  groundFList.facets.push(floor.lowerHalf);
                  groundFList.facets.push(floor.upperHalf);
                  uncropped = false;
                }
              }
            });
            if (uncropped) {
              halfResult.push(floor);
            }
          }
        }

        counter = 0;
        let resultGroundFList: FacetList = new FacetList();
        while (halfResult.length > 0 && counter < timeLimit) {
          counter++;
          const floor: Facet = halfResult.shift() || new Facet(-1, 0, -1, 0, Direction.N);
          floor.howToCrop = HowToCrop.ROOFY_BY_Y;
          if (floor.direction === Direction.TOP) {
            let uncropped: boolean = true;
            overlappers.facets.forEach((overlapper) => {
              if (floor.x < overlapper.x + overlapper.width && floor.x + floor.width > overlapper.x) {
                if (
                  floor.y < overlapper.y + overlapper.height &&
                  floor.y + floor.height > overlapper.y + overlapper.height &&
                  uncropped
                ) {
                  floor.crop(overlapper.y + overlapper.height);
                  halfResult.push(floor.lowerHalf);
                  halfResult.push(floor.upperHalf);
                  uncropped = false;
                } else if (floor.y + floor.height > overlapper.y && floor.y < overlapper.y && uncropped) {
                  floor.crop(overlapper.y);
                  halfResult.push(floor.lowerHalf);
                  halfResult.push(floor.upperHalf);
                  uncropped = false;
                }
              }
            });
            if (uncropped) {
              resultGroundFList.facets.push(floor);
            }
          }
        }

        resultGroundFList.facets.forEach((floor) => {
          let duplicate: boolean = false;
          overlappers.facets.forEach((overlapper) => {
            if (
              floor.x >= overlapper.x &&
              floor.y >= overlapper.y &&
              floor.x + floor.width <= overlapper.x + overlapper.width &&
              floor.y + floor.height <= overlapper.y + overlapper.height
            ) {
              duplicate = true;
            }
          });
          if (!duplicate) {
            this.facets.facets.push(floor);
          }
        });
      }
    });

    this.bubbles = new BubbleList();
    const bubbleCountInARow: number = Math.ceil(map.width / Parameters.bubbleGrain);
    const bubbleCount: number = bubbleCountInARow * Math.ceil(map.height / Parameters.bubbleGrain);
    for (let index = 0; index < bubbleCount; index++) {
      this.bubbles.bubbles.push(new Bubble());
      this.bubbles.bubbles[index].x = (index % bubbleCountInARow) * Parameters.bubbleGrain;
      this.bubbles.bubbles[index].y = Math.floor(index / bubbleCountInARow) * Parameters.bubbleGrain;
    }
    for (let index = bubbleCountInARow; index < bubbleCount; index++) {
      this.bubbles.bubbles[index].southBubble = this.bubbles.bubbles[index - bubbleCountInARow];
    }
    for (let index = 0; index < bubbleCount; index++) {
      if (index % bubbleCountInARow !== 0) {
        this.bubbles.bubbles[index].westBubble = this.bubbles.bubbles[index - 1];
      }
    }

    this.facets.facets.forEach((facet) => {
      const bubbleNo: number =
        Math.floor(facet.x / Parameters.bubbleGrain) + Math.floor(facet.y / Parameters.bubbleGrain) * bubbleCountInARow;
      facet.assignBubble(this.bubbles.bubbles[bubbleNo]);
    });
  }
}
