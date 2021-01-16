/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Direction } from './direction';

import { DirectionHandler } from './direction-handler';
import { Facet, HowToCrop } from './facet';
import { Shadow } from './shadow';
import { Parameters } from './technical-parameters';
import { Weather } from './weather-constants';

export class FacetList {
  public facets: Facet[] = [];
  private timeLimit: number;

  public cropFacetsByBubbles() {
    const horizontals: Facet[] = [];
    const verticals: Facet[] = [];
    const roofs: Facet[] = [];

    this.timeLimit = this.facets.length * Parameters.loopLimitFactor;
    let counter: number = 0;

    const result: Facet[] = [];
    this.facets.forEach((facet) => {
      switch (facet.direction) {
        case Direction.N:
        case Direction.S:
          horizontals.push(facet);
          break;
        case Direction.E:
        case Direction.W:
          verticals.push(facet);
          break;
        case Direction.TOP:
          roofs.push(facet);
          break;
      }
    });

    while (horizontals.length > 0 && counter < this.timeLimit) {
      counter++;
      const wall: Facet = horizontals.shift() || new Facet(-1, 0, -1, 0, Direction.TOP);
      if (wall.direction !== Direction.TOP) {
        wall.howToCrop = HowToCrop.BY_X;
        if (
          Math.floor(wall.x / Parameters.bubbleGrain) !==
          Math.ceil((wall.x + wall.width) / Parameters.bubbleGrain) - 1
        ) {
          wall.crop((Math.floor(wall.x / Parameters.bubbleGrain) + 1) * Parameters.bubbleGrain);
          result.push(wall.lowerHalf);
          horizontals.push(wall.upperHalf);
        } else {
          result.push(wall);
        }
      }
    }

    counter = 0;
    while (verticals.length > 0 && counter < this.timeLimit) {
      counter++;
      const wall: Facet = verticals.shift() || new Facet(-1, 0, -1, 0, Direction.TOP);
      if (wall.direction !== Direction.TOP) {
        wall.howToCrop = HowToCrop.BY_Y;
        if (
          Math.floor(wall.y / Parameters.bubbleGrain) !==
          Math.ceil((wall.y + wall.width) / Parameters.bubbleGrain) - 1
        ) {
          wall.crop((Math.floor(wall.y / Parameters.bubbleGrain) + 1) * Parameters.bubbleGrain);
          result.push(wall.lowerHalf);
          verticals.push(wall.upperHalf);
        } else {
          result.push(wall);
        }
      }
    }

    counter = 0;
    const halfResult: Facet[] = [];
    while (roofs.length > 0 && counter < this.timeLimit) {
      counter++;
      const roof: Facet = roofs.shift() || new Facet(-1, 0, -1, 0, Direction.N);
      if (roof.direction === Direction.TOP) {
        roof.howToCrop = HowToCrop.ROOFY_BY_X;
        if (
          Math.floor(roof.x / Parameters.bubbleGrain) !==
          Math.ceil((roof.x + roof.width) / Parameters.bubbleGrain) - 1
        ) {
          roof.crop((Math.floor(roof.x / Parameters.bubbleGrain) + 1) * Parameters.bubbleGrain);
          halfResult.push(roof.lowerHalf);
          roofs.push(roof.upperHalf);
        } else {
          halfResult.push(roof);
        }
      }
    }

    counter = 0;
    while (halfResult.length > 0 && counter < this.timeLimit) {
      counter++;
      const roof: Facet = halfResult.shift() || new Facet(-1, 0, -1, 0, Direction.N);
      if (roof.direction === Direction.TOP) {
        roof.howToCrop = HowToCrop.ROOFY_BY_Y;
        if (
          Math.floor(roof.y / Parameters.bubbleGrain) !==
          Math.ceil((roof.y + roof.height) / Parameters.bubbleGrain) - 1
        ) {
          roof.crop((Math.floor(roof.y / Parameters.bubbleGrain) + 1) * Parameters.bubbleGrain);
          result.push(roof.lowerHalf);
          halfResult.push(roof.upperHalf);
        } else {
          result.push(roof);
        }
      }
    }

    this.facets = result;
    this.consolidateFacets();
  }

  private consolidateFacets() {
    let counter: number = 0;
    for (counter = 0; counter < this.facets.length; counter++) {
      if (this.facets[counter].width <= Parameters.careLimit || this.facets[counter].height <= Parameters.careLimit) {
        this.facets.splice(counter, 1);
        counter--;
      } else {
        this.facets[counter].x = this.roundNumber(this.facets[counter].x);
        this.facets[counter].y = this.roundNumber(this.facets[counter].y);
        this.facets[counter].width = this.roundNumber(this.facets[counter].width);
        this.facets[counter].height = this.roundNumber(this.facets[counter].height);
      }
    }
  }

  private roundNumber(input: number): number {
    return Math.round(input / Parameters.careLimit / 5) * Parameters.careLimit * 5;
  }

  public facetHeatTransfer() {
    this.facets.forEach((facet) => {
      facet.transferHeat();
    });
  }

  private illuminateFacets(sunAngle: number, sunDirection: Direction): void {
    this.facets.forEach((facet) => {
      let incidenceSin: number = 0;
      if (!facet.shadowed) {
        if (facet.direction === Direction.TOP) {
          incidenceSin = Math.cos(((90 - sunAngle) * Math.PI) / 180);
        } else if (facet.direction === sunDirection) {
          incidenceSin = Math.cos((sunAngle * Math.PI) / 180);
        }
        facet.temperature +=
          (Weather.sunPower * (1 - facet.albedo) * incidenceSin) / (facet.density * facet.specificHeat);
      }
    });
  }

  public addFacet(facet: Facet) {
    this.facets.push(facet);
  }

  public illuminateAndCrop(sunAngle: number, sunDirection: Direction) {
    //SETUP
    const castingWalls: Facet[] = [];
    const toSunWalls: Facet[] = [];
    const shadows: Shadow[] = [];
    const passives: Facet[] = [];

    const vertCropped: Facet[] = [];
    const result: Facet[] = [];

    this.timeLimit = this.facets.length * Parameters.loopLimitFactor;

    //FACET SORTING
    this.facets.forEach((facet) => {
      switch (facet.direction) {
        case sunDirection:
          toSunWalls.push(facet);
          break;
        case DirectionHandler.getOpposite(sunDirection):
          castingWalls.push(facet);
          break;
        case Direction.TOP:
          toSunWalls.push(facet);
          break;
        default:
          passives.push(facet);
      }
    });

    //SHADOW CREATION
    const tangent: number = Math.tan((sunAngle * Math.PI) / 180);
    castingWalls.forEach((wall) => {
      if (DirectionHandler.isWE(sunDirection)) {
        shadows.push(new Shadow(wall.height, tangent, wall.y, wall.y + wall.width, wall.x));
      } else if (DirectionHandler.isNS(sunDirection)) {
        shadows.push(new Shadow(wall.height, tangent, wall.x, wall.x + wall.width, wall.y));
      }
    });

    //VERTICAL CROP
    let counter: number = 0;
    while (toSunWalls.length > 0 && counter < this.timeLimit) {
      counter++;
      const sunWall: Facet = toSunWalls.shift() || new Facet(0, 0, -1, 0, Direction.TOP);
      if (sunWall.height === -1 && sunWall.direction === Direction.TOP) {
        break;
      }
      let lowerBoundary: number;
      let upperBoundary: number;
      if (sunWall.direction === Direction.TOP) {
        if (DirectionHandler.isWE(sunDirection)) {
          lowerBoundary = sunWall.y;
          upperBoundary = sunWall.y + sunWall.height;
          sunWall.howToCrop = HowToCrop.ROOFY_BY_Y;
        } else if (DirectionHandler.isNS(sunDirection)) {
          lowerBoundary = sunWall.x;
          upperBoundary = sunWall.x + sunWall.width;
          sunWall.howToCrop = HowToCrop.ROOFY_BY_X;
        }
      } else if (DirectionHandler.isWE(sunDirection)) {
        lowerBoundary = sunWall.y;
        upperBoundary = sunWall.y + sunWall.width;
        sunWall.howToCrop = HowToCrop.BY_Y;
      } else if (DirectionHandler.isNS(sunDirection)) {
        lowerBoundary = sunWall.x;
        upperBoundary = sunWall.x + sunWall.width;
        sunWall.howToCrop = HowToCrop.BY_X;
      }

      let uncropped: boolean = true;
      shadows.forEach((shadow) => {
        if (lowerBoundary < shadow.upperBoundary && upperBoundary > shadow.upperBoundary && uncropped) {
          sunWall.crop(shadow.upperBoundary);
          uncropped = false;
          toSunWalls.push(sunWall.lowerHalf);
          toSunWalls.push(sunWall.upperHalf);
        } else if (upperBoundary > shadow.lowerBoundary && lowerBoundary < shadow.lowerBoundary && uncropped) {
          sunWall.crop(shadow.lowerBoundary);
          uncropped = false;
          toSunWalls.push(sunWall.lowerHalf);
          toSunWalls.push(sunWall.upperHalf);
        }
      });
      if (uncropped) {
        vertCropped.push(sunWall);
      }
    }

    //HORIZONTAL CROP
    counter = 0;
    while (vertCropped.length > 0 && counter < this.timeLimit) {
      counter++;
      const sunWall: Facet = vertCropped.shift() || new Facet(0, 0, -1, 0, Direction.TOP);
      if (sunWall.height === -1 && sunWall.direction === Direction.TOP) {
        break;
      }
      let lowerBoundary: number;
      let upperBoundary: number;
      let anchor: number;
      let shouldAnchorBeMore: boolean;
      let isRoof: boolean = false;
      let depth: number;
      if (sunWall.direction === Direction.TOP) {
        isRoof = true;
        if (DirectionHandler.isWE(sunDirection)) {
          depth = sunWall.width;
          lowerBoundary = sunWall.y;
          upperBoundary = sunWall.y + sunWall.height;
          sunWall.howToCrop = HowToCrop.ROOFY_BY_X;
          if (sunDirection === Direction.W) {
            anchor = sunWall.x;
          } else {
            anchor = sunWall.x + sunWall.width;
          }
        } else if (DirectionHandler.isNS(sunDirection)) {
          depth = sunWall.height;
          lowerBoundary = sunWall.x;
          upperBoundary = sunWall.x + sunWall.width;
          sunWall.howToCrop = HowToCrop.ROOFY_BY_Y;
          if (sunDirection === Direction.N) {
            anchor = sunWall.y;
          } else {
            anchor = sunWall.y + sunWall.height;
          }
        }
      } else if (DirectionHandler.isWE(sunDirection)) {
        lowerBoundary = sunWall.y;
        upperBoundary = sunWall.y + sunWall.width;
        anchor = sunWall.x;
        sunWall.howToCrop = HowToCrop.BY_ALTITUDE;
      } else if (DirectionHandler.isNS(sunDirection)) {
        lowerBoundary = sunWall.x;
        upperBoundary = sunWall.x + sunWall.width;
        anchor = sunWall.y;
        sunWall.howToCrop = HowToCrop.BY_ALTITUDE;
      }
      if (DirectionHandler.isWS(sunDirection)) {
        shouldAnchorBeMore = true;
      } else if (DirectionHandler.isEN(sunDirection)) {
        shouldAnchorBeMore = false;
      }

      let uncropped: boolean = true;
      shadows.forEach((shadow) => {
        if (
          shouldAnchorBeMore === anchor > shadow.startingPoint &&
          upperBoundary <= shadow.upperBoundary &&
          lowerBoundary >= shadow.lowerBoundary &&
          uncropped
        ) {
          const distance: number = Math.abs(anchor - shadow.startingPoint);
          if (isRoof) {
            const shadowLength: number = shadow.getLengthAt(sunWall.bottom);
            const shadowDepth: number = shadowLength - distance;
            let shadeLower: boolean;
            let shadowCut: number;
            if (DirectionHandler.isWS(sunDirection)) {
              shadowCut = shadow.startingPoint + shadowLength;
              shadeLower = true;
            } else {
              shadowCut = shadow.startingPoint - shadowLength;
              shadeLower = false;
            }
            if (shadowCut > anchor === DirectionHandler.isWS(sunDirection) && shadowDepth < anchor + depth) {
              sunWall.crop(shadowCut);
              if (shadeLower) {
                sunWall.lowerHalf.shadowed = true;
                result.push(sunWall.lowerHalf);
                vertCropped.push(sunWall.upperHalf);
              } else {
                sunWall.upperHalf.shadowed = true;
                vertCropped.push(sunWall.lowerHalf);
                result.push(sunWall.upperHalf);
              }
              uncropped = false;
            } else if (shadowDepth > depth) {
              uncropped = false;
              sunWall.shadowed = true;
              result.push(sunWall);
            }
          } else {
            const shadowHeight: number = shadow.getHeightAt(distance);
            if (shadowHeight < sunWall.height + sunWall.bottom && shadowHeight > sunWall.bottom) {
              sunWall.crop(shadowHeight);
              result.push(sunWall.lowerHalf);
              vertCropped.push(sunWall.upperHalf);
              uncropped = false;
            } else if (shadowHeight > sunWall.height + sunWall.bottom) {
              uncropped = false;
              sunWall.shadowed = true;
              result.push(sunWall);
            }
          }
        }
      });
      if (uncropped) {
        result.push(sunWall);
      }
    }

    this.facets = result;
    this.facets = this.facets.concat(passives);
    this.facets = this.facets.concat(castingWalls);

    this.consolidateFacets();
    this.illuminateFacets(sunAngle, sunDirection);
  }
}
