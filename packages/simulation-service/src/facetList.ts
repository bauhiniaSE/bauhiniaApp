import { Direction, DirectionHandler } from './direction';
import { Facet } from './facet';
import { Shadow } from './shadow';

export class FacetList {
  public facets: Facet[] = [];

  public illuminateAndCrop(sunAngle: number, sunDirection: Direction) {
    //SETUP
    let castingWalls: Facet[] = [];
    let toSunWalls: Facet[] = [];
    let roofs: Facet[] = [];
    let shadows: Shadow[] = [];
    let passives: Facet[] = [];

    let vertCropped: Facet[] = [];
    let result: Facet[] = [];

    this.facets.forEach((facet) => {
      switch (facet.direction) {
        case sunDirection:
          toSunWalls.push(facet);
          break;
        case DirectionHandler.getOpposite(sunDirection):
          castingWalls.push(facet);
          break;
        case Direction.TOP:
          roofs.push(facet);
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

    let cropWallByX = (wall: Facet, cutX: number, lowerShaded: boolean) => {
      let lowerHalf: Facet = wall.clone();
      lowerHalf.width = cutX - wall.x;

      let upperHalf: Facet = wall.clone();
      upperHalf.x = cutX;
      upperHalf.width = wall.x + wall.width - cutX;

      if (lowerShaded) {
        toSunWalls.push(lowerHalf);
        toSunWalls.push(upperHalf);
      } else {
        toSunWalls.push(upperHalf);
        toSunWalls.push(lowerHalf);
      }
    };

    let cropWallByY = (wall: Facet, cutY: number, lowerShaded: boolean) => {
      let lowerHalf: Facet = wall.clone();
      lowerHalf.width = cutY - wall.y;

      let upperHalf: Facet = wall.clone();
      upperHalf.y = cutY;
      upperHalf.width = wall.y + wall.width - cutY;

      if (lowerShaded) {
        toSunWalls.push(lowerHalf);
        toSunWalls.push(upperHalf);
      } else {
        toSunWalls.push(lowerHalf);
        toSunWalls.push(lowerHalf);
      }
    };

    let cropByAltitude = (wall: Facet, cutAltitude: number) => {
      let lowerHalf: Facet = wall.clone();
      lowerHalf.height = cutAltitude - wall.bottom;
      lowerHalf.shadowed = true;
      if (lowerHalf.height > 0.5) result.push(lowerHalf);
      else return;

      let upperHalf: Facet = wall.clone();
      upperHalf.height = wall.height + wall.bottom - cutAltitude;
      upperHalf.bottom = cutAltitude;
      vertCropped.push(upperHalf);
    };

    /*toSunWalls.forEach((sunWall) => {
      if (sunWall.direction == Direction.TOP) {
        if (DirectionHandler.isWE(sunDirection)) {
          sunWall.lowerBoundary = sunWall.y;
          sunWall.upperBoundary = sunWall.y + sunWall.height;
        } else if (DirectionHandler.isNS(sunDirection)) {
          sunWall.lowerBoundary = sunWall.x;
          sunWall.upperBoundary = sunWall.x + sunWall.width;
        }
      } else if (DirectionHandler.isWE(sunDirection)) {
        sunWall.lowerBoundary = sunWall.y;
        sunWall.upperBoundary = sunWall.y + sunWall.width;
        sunWall.crop = cropWallByY;
        sunWall.anchor = sunWall.x;
      } else if (DirectionHandler.isNS(sunDirection)) {
        sunWall.lowerBoundary = sunWall.x;
        sunWall.upperBoundary = sunWall.x + sunWall.width;
        sunWall.crop = cropWallByX;
        sunWall.anchor = sunWall.y;
      }
    });*/

    //VERTICAL CROP
    let counter: number = 0;
    while (toSunWalls.length > 0 && counter < 20) {
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
        } else if (DirectionHandler.isNS(sunDirection)) {
          lowerBoundary = sunWall.x;
          upperBoundary = sunWall.x + sunWall.width;
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
          crop(sunWall, shadow.upperBoundary, true);
          uncropped = false;
        } else if (upperBoundary > shadow.lowerBoundary && lowerBoundary < shadow.lowerBoundary && uncropped) {
          crop(sunWall, shadow.lowerBoundary, true);
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
      if (DirectionHandler.isWE(sunDirection)) {
        lowerBoundary = sunWall.y;
        upperBoundary = sunWall.y + sunWall.width;
        anchor = sunWall.x;
      } else if (DirectionHandler.isNS(sunDirection)) {
        lowerBoundary = sunWall.x;
        upperBoundary = sunWall.x + sunWall.width;
        anchor = sunWall.y;
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
          let shadowHeight: number = shadow.getHeightAt(distance);
          if (shadowHeight < sunWall.height + sunWall.bottom && shadowHeight > sunWall.bottom) {
            cropByAltitude(sunWall, shadowHeight);
            uncropped = false;
          } else if (shadowHeight > sunWall.height + sunWall.bottom) {
            uncropped = false;
            sunWall.shadowed = true;
            result.push(sunWall);
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

export class Overlapper {
  public Boundary: number;
  public inFirstFacet: boolean;

  constructor(Boundary: number, originalFacet: boolean) {
    this.Boundary = Boundary;
    this.inFirstFacet = originalFacet;
  }

  public static compare(a: Overlapper, b: Overlapper) {
    return a.Boundary - b.Boundary;
  }

  public static checkOverlay(
    firstLower: number,
    firstUpper: number,
    secondLower: number,
    secondUpper: number
  ): boolean {
    if (firstUpper == secondUpper || firstLower == secondLower) return true;
    let boundaries: Overlapper[] = [
      new Overlapper(firstLower, true),
      new Overlapper(firstUpper, true),
      new Overlapper(secondLower, false),
      new Overlapper(secondUpper, false),
    ];

    boundaries.sort(Overlapper.compare);
    return boundaries[0].inFirstFacet != boundaries[1].inFirstFacet;
  }
}
