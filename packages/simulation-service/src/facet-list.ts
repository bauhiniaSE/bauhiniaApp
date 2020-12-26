import { Direction } from './direction';

import { DirectionHandler } from './direction-handler';
import { Facet, HowToCrop } from './facet';
import { Shadow } from './shadow';
import { Weather } from './weather-constants';

export class FacetList {
  public facets: Facet[] = [];

  private consolidateFacets() {
    let counter: number = 0;
    for (counter = 0; counter < this.facets.length; counter++) {
      if (this.facets[counter].duplicated || this.facets[counter].width <= 0 || this.facets[counter].height <= 0) {
        this.facets.splice(counter, 1);
        counter--;
        //console.log('Consolidation');
      }
    }
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

  //robocza funkcja, zniknie w gotowej wersji, nie krzycz Bartek ;P
  public printAllFacets(parray?: Facet[]) {
    const array: Facet[] = parray || this.facets;
    array.forEach((facet) => {
      console.log(
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        'x: ' +
          facet.x.toLocaleString() +
          ', y: ' +
          facet.y.toLocaleString() +
          '; h: ' +
          facet.height.toLocaleString() +
          ', w: ' +
          facet.width.toLocaleString() +
          '; sh: ' +
          facet.shadowed.toString() +
          '; b: ' +
          facet.bottom.toLocaleString() +
          '; du: ' +
          facet.direction.toLocaleString()
      );
    });
    console.log(' ');
  }

  public illuminateAndCrop(sunAngle: number, sunDirection: Direction) {
    //SETUP
    const castingWalls: Facet[] = [];
    const toSunWalls: Facet[] = [];
    const shadows: Shadow[] = [];
    const passives: Facet[] = [];

    const vertCropped: Facet[] = [];
    const result: Facet[] = [];

    const timeLimit: number = this.facets.length * 20;

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
    while (toSunWalls.length > 0 && counter < timeLimit) {
      counter++;
      const sunWall: Facet = toSunWalls.shift() || new Facet(0, 0, -1, 0, Direction.TOP);
      if (sunWall.height === -1 && sunWall.direction === Direction.TOP) {
        break;
      }
      let lowerBoundary: number;
      let upperBoundary: number;
      //let crop: any;
      if (sunWall.direction === Direction.TOP) {
        if (DirectionHandler.isWE(sunDirection)) {
          lowerBoundary = sunWall.y;
          upperBoundary = sunWall.y + sunWall.height;
          sunWall.howToCrop = HowToCrop.ROOFY_BY_Y;
          //crop = cropRoofByY;
        } else if (DirectionHandler.isNS(sunDirection)) {
          lowerBoundary = sunWall.x;
          upperBoundary = sunWall.x + sunWall.width;
          sunWall.howToCrop = HowToCrop.ROOFY_BY_X;
          //crop = cropRoofByX;
        }
      } else if (DirectionHandler.isWE(sunDirection)) {
        lowerBoundary = sunWall.y;
        upperBoundary = sunWall.y + sunWall.width;
        sunWall.howToCrop = HowToCrop.BY_Y;
        //crop = cropWallByY;
      } else if (DirectionHandler.isNS(sunDirection)) {
        lowerBoundary = sunWall.x;
        upperBoundary = sunWall.x + sunWall.width;
        sunWall.howToCrop = HowToCrop.BY_X;
        //crop = cropWallByX;
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
    while (vertCropped.length > 0 && counter < 20) {
      counter++;
      const sunWall: Facet = vertCropped.shift() || new Facet(0, 0, -1, 0, Direction.TOP);
      if (sunWall.height === -1 && sunWall.direction === Direction.TOP) {
        break;
      }
      let lowerBoundary: number;
      let upperBoundary: number;
      let anchor: number;
      let shouldAnchorBeMore: boolean;
      //let crop: any;
      let isRoof: boolean = false;
      let depth: number;
      if (sunWall.direction === Direction.TOP) {
        isRoof = true;
        if (DirectionHandler.isWE(sunDirection)) {
          depth = sunWall.width;
          lowerBoundary = sunWall.y;
          upperBoundary = sunWall.y + sunWall.height;
          sunWall.howToCrop = HowToCrop.ROOFY_BY_X;
          //crop = cropRoofByX; //Not Quite
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
          //crop = cropRoofByY; //Not Quite
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
        //crop = cropByAltitude;
      } else if (DirectionHandler.isNS(sunDirection)) {
        lowerBoundary = sunWall.x;
        upperBoundary = sunWall.x + sunWall.width;
        anchor = sunWall.y;
        sunWall.howToCrop = HowToCrop.BY_ALTITUDE;
        //crop = cropByAltitude;
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
              //whichOneToShade = FourByFour.LOWER;
            } else {
              shadowCut = shadow.startingPoint - shadowLength;
              shadeLower = false;
              //whichOneToShade = FourByFour.UPPER;
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
