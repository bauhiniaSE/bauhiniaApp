import { Direction, DirectionHandler } from './direction';
import { Facet } from './facet';
import { Shadow } from './shadow';

export class FacetList {
  public facets: Facet[] = [];

  public illuminateAndCrop(sunAngle: number, sunDirection: Direction) {
    //SETUP
    let castingWalls: Facet[] = [];
    let toSunWalls: Facet[] = [];
    let shadows: Shadow[] = [];
    let passives: Facet[] = [];

    let vertCropped: Facet[] = [];
    let result: Facet[] = [];

    let timeLimit: number = this.facets.length * 20;
    let careLimit: number = 0.005;

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

    let tangent: number = Math.tan((sunAngle * Math.PI) / 180);
    castingWalls.forEach((wall) => {
      if (DirectionHandler.isWE(sunDirection)) {
        shadows.push(new Shadow(wall.height, tangent, wall.y, wall.y + wall.width, wall.x));
      } else if (DirectionHandler.isNS(sunDirection)) {
        shadows.push(new Shadow(wall.height, tangent, wall.x, wall.x + wall.width, wall.y));
      }
    });

    let cropWallByX = (wall: Facet, cutX: number) => {
      let lowerHalf: Facet = wall.clone();
      lowerHalf.width = cutX - wall.x;

      let upperHalf: Facet = wall.clone();
      upperHalf.x = cutX;
      upperHalf.width = wall.x + wall.width - cutX;
      if (lowerHalf.width > careLimit) upperHalf.x += careLimit / 2;
      if (upperHalf.width > careLimit) lowerHalf.width -= careLimit / 2;
      toSunWalls.push(lowerHalf);
      toSunWalls.push(upperHalf);
    };

    let cropWallByY = (wall: Facet, cutY: number) => {
      let lowerHalf: Facet = wall.clone();
      lowerHalf.width = cutY - wall.y;

      let upperHalf: Facet = wall.clone();
      upperHalf.y = cutY;
      upperHalf.width = wall.y + wall.width - cutY;
      if (lowerHalf.width > careLimit) upperHalf.y += careLimit / 2;
      if (upperHalf.width > careLimit) lowerHalf.width -= careLimit / 2;
      toSunWalls.push(lowerHalf);
      toSunWalls.push(upperHalf);
    };

    let cropRoofByX = (roof: Facet, cutX: number, whereToShade?: FourByFour) => {
      let lowerHalf: Facet = roof.clone();
      lowerHalf.width = cutX - roof.x;

      let upperHalf: Facet = roof.clone();
      upperHalf.x = cutX;
      upperHalf.width = roof.x + roof.width - cutX;
      if (whereToShade == undefined) {
        if (lowerHalf.width > careLimit) upperHalf.x += careLimit / 2;
        if (upperHalf.width > careLimit) lowerHalf.width -= careLimit / 2;
        toSunWalls.push(lowerHalf);
        toSunWalls.push(upperHalf);
      }

      if (whereToShade == FourByFour.LOWER) {
        lowerHalf.shadowed = true;
        if (lowerHalf.width < careLimit) upperHalf.x += careLimit;
        if (upperHalf.width < careLimit) lowerHalf.width -= careLimit;
        vertCropped.push(upperHalf);
        result.push(lowerHalf);
      }

      if (whereToShade == FourByFour.UPPER) {
        upperHalf.shadowed = true;
        if (upperHalf.width < careLimit) lowerHalf.width -= careLimit / 2;
        if (lowerHalf.width < careLimit) upperHalf.x += careLimit / 2;
        vertCropped.push(lowerHalf);
        result.push(upperHalf);
      }
    };

    let cropRoofByY = (roof: Facet, cutY: number, whereToShade?: FourByFour) => {
      let lowerHalf: Facet = roof.clone();
      lowerHalf.height = cutY - roof.y;

      let upperHalf: Facet = roof.clone();
      upperHalf.y = cutY;
      upperHalf.height = roof.y + roof.height - cutY;

      if (whereToShade == undefined) {
        if (lowerHalf.height < careLimit) upperHalf.y += careLimit / 2;
        if (upperHalf.height < careLimit) lowerHalf.height -= careLimit / 2;
        toSunWalls.push(lowerHalf);
        toSunWalls.push(upperHalf);
      }

      if (whereToShade == FourByFour.LOWER) {
        lowerHalf.shadowed = true;
        if (upperHalf.height < careLimit) lowerHalf.height -= careLimit / 2;
        if (lowerHalf.height < careLimit) upperHalf.y += careLimit / 2;
        result.push(lowerHalf);
        vertCropped.push(upperHalf);
      }

      if (whereToShade == FourByFour.UPPER) {
        upperHalf.shadowed = true;
        if (upperHalf.height < careLimit) lowerHalf.height -= careLimit / 2;
        if (lowerHalf.height < careLimit) upperHalf.y += careLimit / 2;
        vertCropped.push(lowerHalf);
        result.push(upperHalf);
      }
    };

    let cropByAltitude = (wall: Facet, cutAltitude: number) => {
      let lowerHalf: Facet = wall.clone();
      lowerHalf.height = cutAltitude - wall.bottom;
      lowerHalf.shadowed = true;

      let upperHalf: Facet = wall.clone();
      upperHalf.height = wall.height + wall.bottom - cutAltitude;
      upperHalf.bottom = cutAltitude;

      if (lowerHalf.height > careLimit) upperHalf.bottom += careLimit / 2;
      if (upperHalf.height > careLimit) lowerHalf.height -= careLimit / 2;
      result.push(lowerHalf);
      vertCropped.push(upperHalf);
    };

    //VERTICAL CROP
    let counter: number = 0;
    while (toSunWalls.length > 0 && counter < timeLimit) {
      counter++;
      let sunWall: Facet = toSunWalls.shift() || new Facet(0, 0, -1, 0, Direction.TOP);
      if (sunWall.height == -1 && sunWall.direction == Direction.TOP) {
        break;
      }
      let lowerBoundary: number;
      let upperBoundary: number;
      let crop: any;
      if (sunWall.direction == Direction.TOP) {
        if (DirectionHandler.isWE(sunDirection)) {
          lowerBoundary = sunWall.y;
          upperBoundary = sunWall.y + sunWall.height;
          crop = cropRoofByY;
        } else if (DirectionHandler.isNS(sunDirection)) {
          lowerBoundary = sunWall.x;
          upperBoundary = sunWall.x + sunWall.width;
          crop = cropRoofByX;
        }
      } else if (DirectionHandler.isWE(sunDirection)) {
        lowerBoundary = sunWall.y;
        upperBoundary = sunWall.y + sunWall.width;
        crop = cropWallByY;
      } else if (DirectionHandler.isNS(sunDirection)) {
        lowerBoundary = sunWall.x;
        upperBoundary = sunWall.x + sunWall.width;
        crop = cropWallByX;
      }

      let uncropped: boolean = true;
      shadows.forEach((shadow) => {
        if (lowerBoundary < shadow.upperBoundary && upperBoundary > shadow.upperBoundary && uncropped) {
          crop(sunWall, shadow.upperBoundary);
          uncropped = false;
        } else if (upperBoundary > shadow.lowerBoundary && lowerBoundary < shadow.lowerBoundary && uncropped) {
          crop(sunWall, shadow.lowerBoundary);
          uncropped = false;
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
      let sunWall: Facet = vertCropped.shift() || new Facet(0, 0, -1, 0, Direction.TOP);
      if (sunWall.height == -1 && sunWall.direction == Direction.TOP) {
        break;
      }
      let lowerBoundary: number;
      let upperBoundary: number;
      let anchor: number;
      let shouldAnchorBeMore: boolean;
      let crop: any;
      let isRoof: boolean = false;
      let depth: number;
      if (sunWall.direction == Direction.TOP) {
        isRoof = true;
        if (DirectionHandler.isWE(sunDirection)) {
          depth = sunWall.width;
          lowerBoundary = sunWall.y;
          upperBoundary = sunWall.y + sunWall.height;
          crop = cropRoofByX; //Not Quite
          if (sunDirection == Direction.W) {
            anchor = sunWall.x;
          } else {
            anchor = sunWall.x + sunWall.width;
          }
        } else if (DirectionHandler.isNS(sunDirection)) {
          depth = sunWall.height;
          lowerBoundary = sunWall.x;
          upperBoundary = sunWall.x + sunWall.width;
          crop = cropRoofByY; //Not Quite
          if (sunDirection == Direction.N) {
            anchor = sunWall.y;
          } else {
            anchor = sunWall.y + sunWall.height;
          }
        }
      } else if (DirectionHandler.isWE(sunDirection)) {
        lowerBoundary = sunWall.y;
        upperBoundary = sunWall.y + sunWall.width;
        anchor = sunWall.x;
        crop = cropByAltitude;
      } else if (DirectionHandler.isNS(sunDirection)) {
        lowerBoundary = sunWall.x;
        upperBoundary = sunWall.x + sunWall.width;
        anchor = sunWall.y;
        crop = cropByAltitude;
      }
      if (DirectionHandler.isWS(sunDirection)) {
        shouldAnchorBeMore = true;
      } else if (DirectionHandler.isEN(sunDirection)) {
        shouldAnchorBeMore = false;
      }

      let uncropped: boolean = true;
      shadows.forEach((shadow) => {
        if (
          shouldAnchorBeMore == anchor > shadow.startingPoint &&
          upperBoundary <= shadow.upperBoundary &&
          lowerBoundary >= shadow.lowerBoundary &&
          uncropped
        ) {
          let distance: number = Math.abs(anchor - shadow.startingPoint);
          if (isRoof) {
            let shadowLength: number = shadow.getLengthAt(sunWall.bottom);
            let shadowDepth: number = shadowLength - distance;
            let shadowCut: number;
            let whichOneToShade: FourByFour;
            if (DirectionHandler.isWS(sunDirection)) {
              shadowCut = shadow.startingPoint + shadowLength;
              whichOneToShade = FourByFour.LOWER;
            } else {
              shadowCut = shadow.startingPoint - shadowLength;
              whichOneToShade = FourByFour.UPPER;
            }
            if (shadowCut > anchor == DirectionHandler.isWS(sunDirection) && shadowDepth < anchor + depth) {
              crop(sunWall, shadowCut, whichOneToShade);
              uncropped = false;
            } else if (shadowDepth > depth) {
              uncropped = false;
              sunWall.shadowed = true;
              result.push(sunWall);
            }
          } else {
            let shadowHeight: number = shadow.getHeightAt(distance);
            if (shadowHeight < sunWall.height + sunWall.bottom && shadowHeight > sunWall.bottom) {
              crop(sunWall, shadowHeight);
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

  private consolidateFacets() {
    let counter: number = 0;
    for (counter = 0; counter < this.facets.length; counter++) {
      if (this.facets[counter].duplicated || this.facets[counter].width <= 0 || this.facets[counter].height <= 0) {
        this.facets.splice(counter, 1);
        counter--;
        console.log('Consolidation');
      }
    }
  }

  private illuminateFacets(sunAngle: number, sunDirection: Direction): void {
    let sunPower: number = 1000 * 60 * 60 * 8;

    this.facets.forEach((facet) => {
      let incidenceSin: number = 0;
      if (!facet.shadowed) {
        if (facet.direction == Direction.TOP) {
          incidenceSin = Math.cos(((90 - sunAngle) * Math.PI) / 180);
        } else if (facet.direction == sunDirection) {
          incidenceSin = Math.cos((sunAngle * Math.PI) / 180);
        }
        facet.temperature += (sunPower * (1 - facet.albedo) * incidenceSin) / (facet.density * facet.specificHeat);
      }
    });
  }

  public addFacet(facet: Facet) {
    this.facets.push(facet);
  }

  public printAllFacets(parray?: Facet[]) {
    let array: Facet[] = parray || this.facets;
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
}

enum FourByFour {
  LOWER,
  UPPER,
  NONE,
  BOTH,
}
